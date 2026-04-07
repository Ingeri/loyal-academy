import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, CheckCircle, Lock, Video, FileText, HelpCircle } from 'lucide-react';

async function getEnrollment(enrollmentId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('*, courses(id, title, description, image_url)')
    .eq('id', enrollmentId)
    .eq('student_id', userId)
    .single();

  return data;
}

async function getCourseContent(courseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('course_content')
    .select('*')
    .eq('course_id', courseId)
    .order('order_position', { ascending: true });

  return data || [];
}

async function getProgress(enrollmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('progress')
    .select('content_id, is_completed')
    .eq('enrollment_id', enrollmentId);

  return data || [];
}

export default async function LearningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const enrollment = await getEnrollment(id, user.id);
  if (!enrollment) {
    notFound();
  }

  const [content, progress] = await Promise.all([
    getCourseContent(enrollment.courses.id),
    getProgress(id),
  ]);

  const completedIds = new Set(progress.filter((p) => p.is_completed).map((p) => p.content_id));
  const completedCount = completedIds.size;
  const completionPercentage = content.length > 0 ? Math.round((completedCount / content.length) * 100) : 0;

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'quiz':
        return <HelpCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="mb-8 pb-8 border-b border-border">
              {enrollment.courses.image_url && (
                <img
                  src={enrollment.courses.image_url}
                  alt={enrollment.courses.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="font-semibold text-foreground line-clamp-2">{enrollment.courses.title}</h2>
            </div>

            {/* Progress */}
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-sm font-medium text-foreground mb-2">Course Progress</p>
              <div className="mb-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {content.length} completed ({completionPercentage}%)
              </p>
            </div>

            {/* Course Content List */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Course Content</p>
              <div className="space-y-2">
                {content.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-muted-foreground flex-shrink-0 mt-1">
                        {completedIds.has(item.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          getContentIcon(item.content_type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{item.title}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">{item.content_type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {content.length > 0 ? (
            <div className="space-y-8">
              {content.map((item: any, index: number) => (
                <Card key={item.id} className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          {getContentIcon(item.content_type)}
                          <span className="text-sm font-medium text-muted-foreground capitalize">
                            {item.content_type}
                          </span>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">{item.title}</h2>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    {completedIds.has(item.id) && (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Content Display */}
                  {item.content_type === 'video' && item.video_url && (
                    <div className="bg-black rounded-lg overflow-hidden mb-6">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Video player: {item.video_url}</p>
                      </div>
                    </div>
                  )}

                  {item.content_type === 'text' && item.content_text && (
                    <div className="prose prose-sm max-w-none mb-6">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{item.content_text}</p>
                    </div>
                  )}

                  {item.content_type === 'quiz' && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                      <p className="text-blue-900 font-medium">Quiz: {item.title}</p>
                      <p className="text-blue-800 text-sm mt-2">{item.content_text || 'Quiz content would be displayed here'}</p>
                    </div>
                  )}

                  {item.duration_minutes && (
                    <p className="text-sm text-muted-foreground mb-6">
                      Estimated duration: {item.duration_minutes} minutes
                    </p>
                  )}

                  {/* Mark Complete Button */}
                  {!completedIds.has(item.id) && (
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </Card>
              ))}

              {completionPercentage === 100 && (
                <Card className="p-8 bg-green-50 border-green-200">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">Congratulations!</h3>
                    <p className="text-green-800 mb-6">
                      You&apos;ve completed this course. Your certificate is ready to download.
                    </p>
                    <Button className="gap-2">Download Certificate</Button>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Course content coming soon</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

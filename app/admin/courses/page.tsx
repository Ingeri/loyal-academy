import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';

async function checkAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}

async function getCourses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminCoursesPage() {
  await checkAdminAccess();
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b bg-card px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Courses</h1>
            <p className="mt-2 text-muted-foreground">Create and manage all courses</p>
          </div>
          <Link href="/admin/courses/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        </div>
      </section>

      {/* Courses List */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course: any) => (
                <Card key={course.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">${course.price}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        course.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-muted-foreground">{course.total_students || 0} students</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-6">No courses yet. Create your first course to get started.</p>
              <Link href="/admin/courses/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Course
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}

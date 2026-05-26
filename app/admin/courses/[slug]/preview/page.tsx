import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Verified,
  ClipboardCheck,
  Globe,
  Sparkles,
  User,
  BookOpen,
  FileText,
  MessageSquare,
  Star,
  Tag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type Props = { params: Promise<{ slug?: string }> };

export default async function AdminCoursePreviewPage({ params }: Props) {
  await checkAdminAccess();

  const resolved = await params;
  const slug = resolved?.slug;

  if (!slug) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Course not found</h1>
        <p className="mt-2 text-muted-foreground">
          Course slug is missing from the URL.
        </p>
        <Link href="/admin/courses">
          <Button className="mt-6">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      syllabus: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { id: 'asc' },
      },
      quizzes: true,
      faqs: true,
      learnerStories: true,
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      tags: true,
    },
  });

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Course not found</h1>
        <p className="mt-2 text-muted-foreground">
          There is no course with that slug.
        </p>
        <Link href="/admin/courses">
          <Button className="mt-6">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const quizzesByType = {
    EXERCISE: course.quizzes.filter((q: any) => q.type === 'EXERCISE'),
    QUIZ: course.quizzes.filter((q: any) => q.type === 'QUIZ'),
    TEST: course.quizzes.filter((q: any) => q.type === 'TEST'),
    EXAM: course.quizzes.filter((q: any) => q.type === 'EXAM'),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="mt-1 text-muted-foreground">
            Admin preview for this course. This view bypasses public publish
            restrictions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/courses">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Course Overview */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge variant={course.published ? "default" : "secondary"}>
                {course.published ? (
                  <>
                    <Eye className="inline h-4 w-4 mr-1" /> Published
                  </>
                ) : (
                  <>
                    <EyeOff className="inline h-4 w-4 mr-1" /> Draft
                  </>
                )}
              </Badge>
              <Badge variant="outline">
                {course.category?.name || "Uncategorized"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {course.level}
              </Badge>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {course.description}
            </p>
          </div>

          <div className="grid gap-2 min-w-[220px]">
            <Badge variant="secondary">Price: ${course.price.toString()}</Badge>
            {course.discount && (
              <Badge variant="outline">
                Discount: ${course.discount.toString()}
              </Badge>
            )}
            <Badge variant="outline">Type: {course.conductingType}</Badge>
            <Badge variant="outline">
              Certificate: {course.hasCertificate ? "Yes" : "No"}
            </Badge>
            <Badge variant="outline">
              Exam: {course.hasExam ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-muted/10 bg-muted/5 p-4">
            <h2 className="font-semibold">Course summary</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This preview is only visible to admins and can show draft content.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Verified className="h-4 w-4" />
              <span>
                {course.hasCertificate
                  ? "Certificate included"
                  : "No certificate"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardCheck className="h-4 w-4" />
              <span>{course.hasExam ? "Exam enabled" : "No exam"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Conducting type: {course.conductingType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Preview only - not visible to public unless published</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructor Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" /> Instructor
        </h2>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Name:</span>
            <span className="ml-2 font-medium">{course.instructor?.name || "Unknown"}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="ml-2 font-medium">{course.instructor?.email || "Unknown"}</span>
          </div>
        </div>
      </Card>

      {/* Modules and Lessons */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Modules and Lessons
        </h2>
        {course.syllabus.length > 0 ? (
          <div className="space-y-4">
            {course.syllabus.map((module, moduleIndex) => (
              <div key={module.id} className="border border-muted rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">Module {moduleIndex + 1}: {module.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                  </div>
                  <Badge variant="outline">{module.lessons.length} lessons</Badge>
                </div>
                {module.lessons.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Lesson {lesson.order + 1}:</span>
                        <span>{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No modules found for this course.</p>
        )}
      </Card>

      {/* Quizzes by Type */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" /> Quizzes and Assessments
        </h2>
        <div className="space-y-4">
          {Object.entries(quizzesByType).map(([type, quizzes]) => (
            quizzes.length > 0 && (
              <div key={type}>
                <h3 className="font-semibold mb-2 capitalize">{type.toLowerCase()}s ({quizzes.length})</h3>
                <div className="space-y-2">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <span className="font-medium">{quiz.title}</span>
                      <Badge variant="outline">Passing: {quiz.passingScore}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          {course.quizzes.length === 0 && (
            <p className="text-muted-foreground">No quizzes found for this course.</p>
          )}
        </div>
      </Card>

      {/* FAQs */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> FAQs
        </h2>
        {course.faqs.length > 0 ? (
          <div className="space-y-3">
            {course.faqs.map((faq) => (
              <div key={faq.id} className="border border-muted rounded-lg p-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No FAQs found for this course.</p>
        )}
      </Card>

      {/* Learner Stories */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5" /> Learner Stories
        </h2>
        {course.learnerStories.length > 0 ? (
          <div className="space-y-4">
            {course.learnerStories.map((story) => (
              <div key={story.id} className="border border-muted rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{story.name}</h3>
                  {story.role && <Badge variant="outline">{story.role}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{story.story}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No learner stories found for this course.</p>
        )}
      </Card>

      {/* Reviews */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5" /> Reviews
        </h2>
        {course.reviews.length > 0 ? (
          <div className="space-y-4">
            {course.reviews.map((review) => (
              <div key={review.id} className="border border-muted rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && <p className="text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews found for this course.</p>
        )}
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5" /> Tags
        </h2>
        {course.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No tags found for this course.</p>
        )}
      </Card>
    </div>
  );
}

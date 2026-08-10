import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/course-card'
import { ChevronRight, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Courses - LOYAL Leadership Institute',
  description: 'Browse LOYAL Leadership Institute courses.',
}

async function getCoursesFromDB() {
  try {
    return await prisma.course.findMany({
      where: { published: true },
      include: {
        category: true,
        tags: true,
        instructor: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCoursesFromDB()

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Breadcrumbs */}
      <section className="bg-[#fbfaf7] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition hover:text-primary"
          >
            Home
          </Link>

          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />

          <span className="font-semibold text-primary">Courses</span>
        </div>
      </section>

      {/* Hero Header */}
      <section
        className="relative overflow-hidden bg-cover bg-center px-4 py-28 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/hero-scourse.jfif')",
        }}
      >
        {/* Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08152f]/85 via-[#08152f]/60 to-[#08152f]/80" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#d4af37]">
            LOYAL LEADERSHIP INSTITUTE
          </p>

          <h1 className="font-serif text-5xl font-bold text-white md:text-7xl">
            Explore Our{' '}
            <span className="italic text-[#d4af37]">
              Courses
            </span>
          </h1>

          <div className="mx-auto mt-6 h-[2px] w-24 bg-[#d4af37]" />

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white/90">
            Practical leadership, communication, entrepreneurship, public
            speaking, emotional intelligence, and professional development
            programmes designed to prepare ethical and impactful leaders for the
            future.
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="bg-[#f8f5ee] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Available Programs
            </p>

            <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
              Available Courses
            </h2>

            <p className="mt-3 text-muted-foreground">
              {courses.length} course{courses.length === 1 ? '' : 's'} available
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    slug:
                      course.slug ||
                      course.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-'),
                    categorySlug:
                      course.category?.slug ||
                      (typeof course.category === 'string'
                        ? course.category
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                        : 'uncategorized'),
                    title: course.title,
                    description: course.description,
                    image_url: course.thumbnail || course.image_url,
                    price: course.price ? Number(course.price) : 49.99,
                    discounted_price: course.discount
                      ? Number(course.price) - Number(course.discount)
                      : undefined,
                    rating: course.avgRating || 0,
                    students: course.studentNumber || 0,
                    duration: course.duration || '1 Week',
                    level: course.level || 'Beginner',
                    category:
                      course.category?.name ||
                      course.category ||
                      'Uncategorized',
                    instructor:
                      course.instructor?.full_name || 'Expert Instructor',
                    has_certificate: course.hasCertificate ?? true,
                    conducting_type: course.conductingType || 'Online',
                    has_exam: course.hasExam || false,
                    tags: course.tags?.map((t: any) => t.name) || [],
                    reviews_count: course._count?.reviews || 0,
                    updated_at: course.updatedAt,
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="mb-4 text-muted-foreground">
                No courses are currently available.
              </p>

              <Link href="/">
                <Button>
                  Back Home <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}
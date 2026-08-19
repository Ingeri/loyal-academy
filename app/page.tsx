import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuotesMarquee } from "@/components/quotes-marquee";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  Briefcase,
  GraduationCap,
  Newspaper,
  Mail,
  Phone,
  MapPin,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { InstructorCard } from "@/components/instructor-card";
import { FeaturedCoursesCarousel } from "@/components/featured-courses-carousel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "LOYAL Leadership Institute",
  description:
    "Empowering minds and inspiring leadership through professional courses, career development, and leadership transformation.",
};

async function getFeaturedCourses() {
  return await prisma.course.findMany({
    where: {
      published: true,
      tags: {
        some: {
          name: "Featured",
        },
      },
    },
    take: 12,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      tags: {
        select: { name: true },
      },
      _count: {
        select: { reviews: true },
      },
    },
  });
}

async function getStats() {
  const coursesCount = await prisma.course.count({
    where: { published: true },
  });

  const activeStudents = await prisma.user.count({
    where: { role: "STUDENT", isActive: true },
  });

  const totalEnrollments = await prisma.enrollment.count();

  return {
    courses: coursesCount,
    students: activeStudents,
    enrollments: totalEnrollments,
  };
}

async function getFeaturedQuotes() {
  return await prisma.quote.findMany({
    where: {
      status: "APPROVED",
      featured: true,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

const mockInstructors = [
  {
    id: "1",
    name: "Counsel Bagabo Faustin",
    bio: "Founder and visionary leader committed to developing ethical, competent, and purpose-driven African leaders.",
    specialty: "Leadership Development",
    rating: 4.9,
    students: 12540,
    courses: 8,
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    bio: "Leadership and professional development trainer with experience in institutional growth and career transformation.",
    specialty: "Career Growth",
    rating: 4.8,
    students: 8320,
    courses: 6,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    bio: "Expert in emotional intelligence, personal development, and professional communication.",
    specialty: "Emotional Intelligence",
    rating: 4.9,
    students: 15600,
    courses: 12,
  },
  {
    id: "4",
    name: "Alex Kim",
    bio: "Trainer in entrepreneurship, innovation, creativity, and practical workplace excellence.",
    specialty: "Entrepreneurship",
    rating: 4.7,
    students: 9800,
    courses: 5,
  },
];

export default async function Home() {
  const courses = await getFeaturedCourses();
  const stats = await getStats();
  const featuredQuotes = await getFeaturedQuotes();

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt="LOYAL Leadership Institute Background"
          fill
          priority
          className="absolute inset-0 object-cover object-center"
        />

        <div className="absolute inset-0 bg-white/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="text-center md:text-left">
            <div className="mb-8 flex items-center justify-center gap-4 md:justify-start">
              <span className="h-px w-16 bg-accent" />
              <p className="font-serif text-6xl italic font-light tracking-wide text-accent">
                welcome to
              </p>
              <span className="h-px w-16 bg-accent" />
            </div>

            <h1 className="font-serif text-6xl font-bold leading-[0.95] tracking-wide text-primary md:text-7xl">
              LOYAL LEADERSHIP <br />
              INSTITUTE
            </h1>

            <p className="mt-3 text-center font-serif text-xl italic tracking-[0.25em] text-accent md:text-left">
              Empowering minds. Inspiring leadership.
            </p>

            <div className="my-6 flex items-center justify-center gap-4 md:justify-start">
              <span className="h-px w-44 bg-accent" />
              <span className="h-3 w-3 rotate-45 bg-accent" />
              <span className="h-px w-44 bg-accent" />
            </div>

            <p className="mx-auto max-w-xl text-lg leading-8 text-black/85 md:mx-0">
              Welcome to Loyal Leadership Institute (LLI) — a transformative
              learning hub committed to developing ethical leaders, employable
              professionals, and impactful institutions.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
              <Button asChild className="px-8 py-6 text-base font-semibold">
                <Link href="/courses">
                  Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="px-8 py-6 text-base font-semibold"
              >
                <Link href="/about">About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-8 z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                number: `${stats.courses}+`,
                label: "Expert Courses",
              },
              {
                icon: Users,
                number: `${stats.students}+`,
                label: "Active Students",
              },
              {
                icon: TrendingUp,
                number: `${stats.enrollments}+`,
                label: "Course Enrollments",
              },
            ].map((item) => (
              <Card
                key={item.label}
                className="bg-white/90 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {item.number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="bg-[#faf8f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              About Us
            </p>

            <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">
              Developing Leaders for{" "}
              <span className="italic text-accent">Impact</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              LOYAL Leadership Institute is a leadership and soft-skills
              development center committed to nurturing ethical, confident, and
              impactful leaders. We equip learners, professionals, and
              institutions with practical skills for personal growth, workplace
              excellence, and national transformation.
            </p>

            <div className="mt-8">
              <Button asChild className="rounded-xl px-8 py-6">
                <Link href="/about">
                  Read More About Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="grid gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Integrity",
                  text: "We believe leadership begins with character.",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  text: "We design practical programmes that create measurable growth.",
                },
                {
                  icon: Users,
                  title: "Impact",
                  text: "We prepare people to lead, serve, and transform communities.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-accent">
                    <item.icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-slate-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* TEAM */}
      <section
        className="relative overflow-hidden bg-cover bg-center px-4 py-20 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/Team-bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#08152f]/85 via-[#08152f]/65 to-[#08152f]/80" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#d4af37]">
              Our Leadership Team
            </p>

            <h2 className="font-serif text-5xl font-bold text-white md:text-6xl">
              Meet Our <span className="italic text-[#d4af37]">Team</span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-white/90">
              Passionate professionals dedicated to empowering leaders and
              shaping the future through excellence, integrity, and impact.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                initials: "BF",
                name: "Counsel Bagabo Faustin",
                role: "Founder & Executive Director",
              },
              {
                initials: "GM",
                name: "Grace Michael",
                role: "Program Director",
              },
              {
                initials: "JE",
                name: "John Emmanuel",
                role: "Training Lead",
              },
              {
                initials: "MI",
                name: "Maryam Ibrahim",
                role: "Operations Manager",
              },
            ].map((member) => (
              <Card
                key={member.name}
                className="rounded-3xl bg-white p-8 text-center shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary text-3xl font-black text-accent shadow-lg">
                  {member.initials}
                </div>

                <h3 className="font-serif text-2xl font-bold text-primary">
                  {member.name}
                </h3>

                <p className="mt-2 font-bold text-accent">{member.role}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="rounded-2xl px-8 py-7 text-lg">
              <Link href="/team">
                View All Members <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-muted/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Why Choose Us
            </p>

            <h2 className="text-3xl font-bold text-foreground">
              Why Choose{" "}
              <span className="italic text-accent">
                LOYAL Leadership Institute?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: "Comprehensive Curriculum",
                text: "Leadership, soft skills, career growth, and workplace excellence.",
              },
              {
                icon: Users,
                title: "Expert Instructors",
                text: "Learn from trainers, lecturers, and experienced professionals.",
              },
              {
                icon: Award,
                title: "Recognized Certificates",
                text: "Earn certificates that strengthen your professional profile.",
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                text: "Develop confidence, competence, and professional direction.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="p-6 transition hover:shadow-lg">
                <feature.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      {courses.length > 0 && (
        <section
          className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
          style={{
            backgroundImage: "url('/course-books.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#08152f]/85 via-[#08152f]/65 to-[#08152f]/80" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
              <div>
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#d4af37]">
                  Featured Courses
                </p>

                <h2 className="font-serif text-5xl font-bold text-white md:text-6xl">
                  Featured{" "}
                  <span className="italic text-[#d4af37]">Courses</span>
                </h2>

                <p className="mt-6 max-w-3xl text-xl leading-10 text-white/90">
                  Start learning from our most impactful leadership,
                  communication, entrepreneurship, and career development
                  programmes.
                </p>
              </div>

              <Link href="/courses" className="mt-8 lg:mt-0">
                <Button className="gap-2 rounded-xl px-7 py-6 text-base">
                  View All Courses <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <FeaturedCoursesCarousel
              courses={courses.map((course: any) => ({
                id: course.id,
                title: course.title,
                description: course.description,
                slug: course.slug,
                thumbnail: course.thumbnail,
                price: Number(course.price),
                discount: course.discount ? Number(course.discount) : undefined,
                category: course.category
                  ? {
                    name: course.category.name,
                    slug: course.category.slug,
                  }
                  : undefined,
                categorySlug: course.category?.slug || "general",
                level: course.level,
                hasCertificate: course.hasCertificate,
                conductingType: course.conductingType,
                hasExam: course.hasExam,
                avgRating: course.avgRating,
                reviews_count: course._count?.reviews || 0,
                studentNumber: course.studentNumber,
                duration: course.duration,
                tags: course.tags?.map((tag: any) => tag.name) || [],
              }))}
            />
          </div>
        </section>
      )}

      {/* OUTSOURCING */}
      <section className="bg-[#faf8f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              Outsourcing
            </p>

            <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">
              Hire Trained{" "}
              <span className="italic text-accent">Talent</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              Connect with skilled graduates and trained professionals from LLI
              for projects, research, communication, digital support, training,
              and institutional assignments.
            </p>

            <Button asChild className="mt-8 rounded-xl px-8 py-6">
              <Link href="/outsourcing">
                Explore Outsourcing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <Card className="rounded-3xl bg-white p-8 shadow-xl">
            <Briefcase className="mb-5 h-12 w-12 text-accent" />
            <h3 className="font-serif text-2xl font-bold text-primary">
              Project Support & Talent Matching
            </h3>
            <p className="mt-4 leading-7 text-slate-700">
              Submit your project, browse trained talent, and partner with our
              institute for professional service delivery.
            </p>
          </Card>
        </div>
      </section>

      {/* SCHOLARSHIPS */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <GraduationCap className="mx-auto mb-5 h-12 w-12 text-accent" />

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Scholarships
          </p>

          <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">
            Expanding Access to{" "}
            <span className="italic text-accent">Learning</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Our scholarship opportunities help committed learners access
            leadership, career development, and professional training
            programmes.
          </p>

          <Button asChild className="mt-8 rounded-xl px-8 py-6">
            <Link href="/scholarships">
              View Scholarships <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* BLOGS */}
      <section className="bg-[#faf8f3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                Blog
              </p>

              <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">
                Leadership{" "}
                <span className="italic text-accent">Insights</span>
              </h2>

              <p className="mt-4 max-w-2xl text-slate-700">
                Read practical reflections on leadership, career growth, soft
                skills, communication, and personal development.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-xl px-8 py-6">
              <Link href="/blog">
                View All Blogs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              "Why Soft Skills Matter in Career Growth",
              "How to Build Confidence as a Young Professional",
              "Leadership Begins With Personal Discipline",
            ].map((title) => (
              <Card key={title} className="rounded-3xl bg-white p-8 shadow-lg">
                <Newspaper className="mb-5 h-9 w-9 text-accent" />
                <h3 className="font-serif text-2xl font-bold text-primary">
                  {title}
                </h3>
                <p className="mt-4 leading-7 text-slate-700">
                  Practical insights to help learners, professionals, and
                  institutions grow with purpose.
                </p>
                <Link
                  href="/blog"
                  className="mt-6 inline-flex font-semibold text-accent"
                >
                  Read More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES */}
      {featuredQuotes.length > 0 && (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                Member Voices
              </p>

              <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">
                Quotes from Our{" "}
                <span className="italic text-accent">Community</span>
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
                Insights and reflections shared by members, instructors, and
                alumni of LOYAL Leadership Institute.
              </p>
            </div>

            <QuotesMarquee quotes={featuredQuotes} />

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button asChild className="rounded-xl px-8 py-6">
                <Link href="/quotes">
                  View All Quotes <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="rounded-xl px-8 py-6">
                <Link href="/quotes/submit">Share Your Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* INSTRUCTORS */}
      <section className="bg-muted/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Instructors
            </p>

            <h2 className="text-3xl font-bold text-foreground">
              Learn from the <span className="italic text-accent">Best</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="rounded-xl px-8 py-6">
              <Link href="/team">
                Meet All Instructors <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              Contact Us
            </p>

            <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">
              We Are Ready to{" "}
              <span className="italic text-accent">Support You</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              Reach out for courses, admissions, scholarships, outsourcing,
              partnerships, or general information about LOYAL Leadership
              Institute.
            </p>

            <Button asChild className="mt-8 rounded-xl px-8 py-6">
              <Link href="/contact">
                Open Contact Page <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <Card className="rounded-3xl bg-[#faf8f3] p-8 shadow-xl">
            <div className="space-y-5">
              <div className="flex gap-4">
                <Mail className="h-6 w-6 text-accent" />
                <span className="text-primary">
                  info@loyalleadershipinstitute.org
                </span>
              </div>

              <div className="flex gap-4">
                <Phone className="h-6 w-6 text-accent" />
                <span className="text-primary">+250 000 000 000</span>
              </div>

              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-accent" />
                <span className="text-primary">Kigali, Rwanda</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-24"
        style={{
          backgroundImage: "url('/learn-bg.png')",
        }}
      >
        
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
            Ready to Start{" "}
            <span className="italic text-[#f4c542]">Learning?</span>
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Join learners who are transforming their skills, mindset, career,
            and leadership capacity with LOYAL Leadership Institute.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 bg-accent font-semibold text-primary hover:bg-accent/90">
              <Link href="/auth/signup">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="gap-2 border-white bg-white/10 text-white hover:bg-white hover:text-primary">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
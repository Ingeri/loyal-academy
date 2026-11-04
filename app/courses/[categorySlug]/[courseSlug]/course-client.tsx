
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  Users,
  Award,
  Star,
  CheckCircle,
  Calendar,
  Zap,
  CheckCircle2,
  FileText,
  UserCheck,
  TrendingUp,
  PlayCircle,
  Trophy,
  History,
  ChevronDown,
  Briefcase,
  Target,
  Quote,
} from "lucide-react";

/* =========================================================
   MOCK COURSES
========================================================= */

export const mockCourses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description:
      "Learn HTML, CSS, and JavaScript from scratch. This comprehensive course will take you from beginner to intermediate level.",
    category: "Web Development",
    level: "Beginner",
    study_type: "Online",
    requirements: "No prior experience required.",
    certificate: "Certificate of completion",
    price: 49.99,
    discounted_price: 39.99,
    discount_percentage: 20,
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=400&fit=crop",
    rating: 4.0,
    students: 2540,
    duration: "8 weeks",
    instructor: "Sarah Johnson",
    instructor_bio:
      "Sarah is a senior web developer with 10+ years of experience.",
    overview: [
      "<p>Learn the foundations of modern web development and gain practical skills for building responsive websites.</p>",
    ],
    learning_outcomes: [
      "HTML & CSS Fundamentals",
      "JavaScript Basics",
      "Responsive Design",
      "DOM Manipulation",
    ],
    who_should_learn:
      "Perfect for beginners with no prior coding experience who want to start their web development journey.",
    career_opportunities:
      "Upon completion, you'll be ready for junior front-end developer positions or freelance web development work.",
    market_growth:
      "Web development has a projected growth of 13% through 2032, making it one of the fastest-growing tech fields.",
    syllabus: [
      {
        title: "Module 1: HTML Basics",
        lessons: 5,
        duration: "2 hours",
      },
      {
        title: "Module 2: CSS Styling",
        lessons: 6,
        duration: "2.5 hours",
      },
      {
        title: "Module 3: JavaScript Fundamentals",
        lessons: 8,
        duration: "4 hours",
      },
      {
        title: "Module 4: Building Your First Website",
        lessons: 4,
        duration: "2 hours",
      },
    ],
    faqs: [
      {
        question: "Do I need prior coding experience?",
        answer: "No, this course is designed for complete beginners.",
      },
      {
        question: "Can I download the course materials?",
        answer: "Yes, all course materials are available for download.",
      },
      {
        question: "Is there a certificate?",
        answer: "Yes, you'll receive a certificate upon completion.",
      },
    ],
    learner_stories: [
      {
        name: "John Doe",
        role: "Junior Developer",
        story:
          "This course gave me the foundation I needed to land my first dev job!",
      },
      {
        name: "Jane Smith",
        role: "Freelancer",
        story:
          "I completed this course and started my freelance business within 3 months.",
      },
    ],
    certifications: [
      "Web Development Certificate",
      "HTML5 Certified",
      "CSS3 Certified",
    ],
    key_aspects: [
      "Full Online Course",
      "CPD Approved",
      "Employer Approved",
      "Fully Endorsed Course",
      "No Entry Requirements",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description:
      "Master advanced React concepts including hooks, context API, performance optimization, and custom patterns used in production apps.",
    category: "Web Development",
    level: "Advanced",
    study_type: "Online",
    requirements: "React fundamentals required.",
    certificate: "Advanced React certificate",
    price: 79.99,
    discounted_price: 63.99,
    discount_percentage: 20,
    image:
      "https://images.pexels.com/photos/3583447/pexels-photo-3583447.jpeg?w=800&h=400&fit=crop",
    rating: 4.9,
    students: 1820,
    duration: "10 weeks",
    instructor: "Mike Chen",
    instructor_bio:
      "Mike is a React expert and has built multiple production applications.",
    overview: [
      "<p>Develop advanced React skills and learn production-ready architectural patterns.</p>",
    ],
    learning_outcomes: [
      "React Hooks",
      "Context API",
      "Performance Optimization",
      "State Management Patterns",
    ],
    who_should_learn:
      "Developers with solid React fundamentals who want to master advanced patterns and best practices.",
    career_opportunities:
      "Opens doors to senior front-end positions and technical lead roles at major tech companies.",
    market_growth:
      "React skills are in high demand, with an average salary increase of 25% for developers proficient in advanced patterns.",
    syllabus: [
      {
        title: "Module 1: Advanced Hooks",
        lessons: 7,
        duration: "3 hours",
      },
      {
        title: "Module 2: Context & Provider Patterns",
        lessons: 5,
        duration: "2 hours",
      },
      {
        title: "Module 3: Performance Optimization",
        lessons: 6,
        duration: "3 hours",
      },
      {
        title: "Module 4: Real-World Patterns",
        lessons: 8,
        duration: "4 hours",
      },
    ],
    faqs: [],
    learner_stories: [
      {
        name: "Alex Johnson",
        role: "Senior React Developer",
        story:
          "This course elevated my React skills to the next level!",
      },
      {
        name: "Maria Garcia",
        role: "Tech Lead",
        story:
          "The patterns I learned are exactly what our production team needed.",
      },
    ],
    certifications: ["Advanced React Certificate"],
    key_aspects: [
      "Full Online Course",
      "Employer Approved",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function renderRatingStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(
          0,
          Math.min(100, (rating - index) * 100),
        );

        return (
          <span
            key={index}
            className="relative inline-block"
          >
            <Star className="h-5 w-5 text-muted-foreground" />

            <span
              className="absolute inset-y-0 left-0 overflow-hidden text-yellow-400"
              style={{ width: `${fill}%` }}
            >
              <Star className="h-5 w-5" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

const TABS = [
  "overview",
  "syllabus",
  "certifications",
  "stories",
] as const;

const getAspectIcon = (text: string) => {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("certificate") ||
    lowerText.includes("endorsed")
  ) {
    return <Trophy className="h-4 w-4" />;
  }

  if (lowerText.includes("pace")) {
    return <History className="h-4 w-4" />;
  }

  if (lowerText.includes("approved")) {
    return <UserCheck className="h-4 w-4" />;
  }

  if (
    lowerText.includes("resume") ||
    lowerText.includes("boost")
  ) {
    return <TrendingUp className="h-4 w-4" />;
  }

  if (lowerText.includes("material")) {
    return <FileText className="h-4 w-4" />;
  }

  if (lowerText.includes("online")) {
    return <PlayCircle className="h-4 w-4" />;
  }

  return <Zap className="h-4 w-4" />;
};

/* =========================================================
   RICH TEXT STYLING
========================================================= */

const richTextClasses = `
  text-base
  leading-relaxed
  text-muted-foreground

  [&_p]:mb-4
  [&_p:last-child]:mb-0

  [&_h1]:mb-5
  [&_h1]:mt-6
  [&_h1]:text-3xl
  [&_h1]:font-black
  [&_h1]:text-foreground

  [&_h2]:mb-4
  [&_h2]:mt-6
  [&_h2]:text-2xl
  [&_h2]:font-bold
  [&_h2]:text-foreground

  [&_h3]:mb-3
  [&_h3]:mt-5
  [&_h3]:text-xl
  [&_h3]:font-bold
  [&_h3]:text-foreground

  [&_strong]:font-bold
  [&_strong]:text-foreground

  [&_em]:italic

  [&_ul]:my-5
  [&_ul]:ml-8
  [&_ul]:list-disc
  [&_ul]:space-y-2

  [&_ol]:my-5
  [&_ol]:ml-8
  [&_ol]:list-decimal
  [&_ol]:space-y-2

  [&_li]:pl-1

  [&_blockquote]:my-6
  [&_blockquote]:border-l-4
  [&_blockquote]:border-primary
  [&_blockquote]:bg-primary/5
  [&_blockquote]:px-5
  [&_blockquote]:py-3
  [&_blockquote]:font-medium
  [&_blockquote]:italic
  [&_blockquote]:text-foreground

  [&_a]:font-semibold
  [&_a]:text-primary
  [&_a]:underline
  [&_a]:underline-offset-4

  [&_img]:my-6
  [&_img]:h-auto
  [&_img]:max-w-full
  [&_img]:rounded-xl

  [&_table]:my-6
  [&_table]:w-full
  [&_table]:border-collapse

  [&_th]:border
  [&_th]:border-border
  [&_th]:bg-muted
  [&_th]:p-3
  [&_th]:text-left
  [&_th]:font-bold

  [&_td]:border
  [&_td]:border-border
  [&_td]:p-3
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function CourseClient({
  course,
  categorySlug,
  courseSlug,
  isDbCourse = false,
}: {
  course: any;
  categorySlug: string;
  courseSlug: string;
  isDbCourse?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("overview");

  const [isEnrolled, setIsEnrolled] =
    useState(false);

  const [
    isCheckingEnrollment,
    setIsCheckingEnrollment,
  ] = useState(true);

  const [enrollDebug, setEnrollDebug] = useState<{
    step: string;
    status:
      | "idle"
      | "loading"
      | "success"
      | "error";
    message: string;
    details?: any;
  }>({
    step: "idle",
    status: "idle",
    message: "",
  });

  /* =======================================================
     CHECK ENROLLMENT
  ======================================================= */

  useEffect(() => {
    setMounted(true);

    const checkEnrollment = async () => {
      if (!course?.id) {
        setIsCheckingEnrollment(false);
        return;
      }

      setEnrollDebug({
        step: "Checking enrollment status...",
        status: "loading",
        message: "Fetching your enrollments...",
      });

      try {
        const res = await fetch("/api/enrollments");

        if (res.ok) {
          const data = await res.json();

          const enrollments = Array.isArray(data)
            ? data
            : [];

          const enrolled = enrollments.some(
            (e: any) =>
              e.courseId === course.id ||
              e.course?.id === course.id,
          );

          setIsEnrolled(enrolled);

          setEnrollDebug({
            step: "Enrollment check complete",
            status: "success",
            message: enrolled
              ? "You are already enrolled in this course"
              : "You are not enrolled yet",
            details: {
              totalEnrollments: enrollments.length,
              isEnrolledInThisCourse: enrolled,
            },
          });
        } else {
          let errorData: any = {};

          try {
            errorData = await res.json();
          } catch {
            // Response may not be JSON.
          }

          setEnrollDebug({
            step:
              res.status === 401
                ? "Not authenticated"
                : "Error checking enrollment",
            status: "error",
            message:
              res.status === 401
                ? "Please sign in to check enrollment status"
                : errorData.error ||
                  `HTTP ${res.status}`,
            details: errorData,
          });
        }
      } catch (error) {
        setEnrollDebug({
          step: "Error",
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Network error",
        });
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    checkEnrollment();
  }, [course?.id]);

  /* =======================================================
     ACTIVE TAB WHILE SCROLLING
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      const sections =
        document.querySelectorAll("[data-section]");

      let currentSection = "overview";

      sections.forEach((section) => {
        const rect =
          section.getBoundingClientRect();

        if (rect.top <= 200) {
          currentSection =
            section.getAttribute("data-section") ||
            "overview";
        }
      });

      if (TABS.includes(currentSection as any)) {
        setActiveTab(
          currentSection as (typeof TABS)[number],
        );
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  /* =======================================================
     ENROLLMENT
  ======================================================= */

  const handleEnroll = async () => {
    if (isEnrolled) {
      toast.info(
        "Already enrolled! Redirecting to course...",
      );

      window.location.href =
        `/learn/${courseSlug}`;

      return;
    }

    setEnrollDebug({
      step: "Starting enrollment...",
      status: "loading",
      message: "Sending enrollment request...",
    });

    toast.loading(
      "Enrolling you in this course...",
      { id: "enroll-toast" },
    );

    try {
      const res = await fetch(
        "/api/enrollments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: course?.id,
          }),
        },
      );

      let data: any = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        setEnrollDebug({
          step: "Enrollment successful!",
          status: "success",
          message:
            `Enrolled in "${data.course?.title || course.title}"`,
          details: {
            enrollmentId: data.id,
            userId: data.userId,
            courseId: data.courseId,
            enrolledAt: data.createdAt,
          },
        });

        toast.success(
          "Successfully enrolled!",
          {
            id: "enroll-toast",
            duration: 4000,
          },
        );

        setIsEnrolled(true);

        setTimeout(() => {
          window.location.href =
            `/learn/${courseSlug}`;
        }, 1500);
      } else if (res.status === 401) {
        toast.error(
          "Please sign in to enroll",
          { id: "enroll-toast" },
        );

        setTimeout(() => {
          window.location.href =
            `/auth/login?redirect=/courses/${categorySlug}/${courseSlug}`;
        }, 1000);
      } else if (
        res.status === 400 &&
        data.error?.includes("Already enrolled")
      ) {
        setIsEnrolled(true);

        toast.info(
          "You're already enrolled! Redirecting...",
          { id: "enroll-toast" },
        );

        setTimeout(() => {
          window.location.href =
            `/learn/${courseSlug}`;
        }, 1500);
      } else {
        toast.error(
          data.error || "Failed to enroll",
          { id: "enroll-toast" },
        );
      }
    } catch (error) {
      setEnrollDebug({
        step: "Network/Error",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Network error",
      });

      toast.error(
        "Please check your connection and try again",
        { id: "enroll-toast" },
      );
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!mounted) {
    return null;
  }

  /* =======================================================
     COURSE NOT FOUND
  ======================================================= */

  if (!course) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="flex min-h-screen items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="mb-2 text-2xl font-bold">
              Course Not Found
            </h1>

            <p className="mb-4 text-muted-foreground">
              The course you&apos;re looking for
              doesn&apos;t exist.
            </p>

            <Button asChild>
              <Link href="/courses">
                Back to Courses
              </Link>
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-6xl px-2 py-4 sm:px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* MAIN CONTENT */}
          <div className="space-y-12 lg:col-span-2">

            {/* HERO */}
            <div className="relative min-h-112 w-full overflow-hidden rounded-2xl bg-linear-to-br from-primary/90 via-primary to-primary/80">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3182750/pexels-photo-3182750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20 mix-blend-overlay" />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              <div className="relative p-8 sm:p-12">
                <div className="mx-auto max-w-4xl space-y-8">

                  {/* BREADCRUMB */}
                  <div className="text-sm font-medium text-white/80">
                    <Link
                      href="/"
                      className="hover:text-white"
                    >
                      Home
                    </Link>

                    <span className="mx-2">›</span>
                    <span>{course.category}</span>
                    <span className="mx-2">›</span>

                    <span className="font-bold text-white">
                      {course.title}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h1 className="text-4xl font-black leading-tight text-white drop-shadow-md md:text-5xl">
                    {course.title}
                  </h1>

                  {/* RATING */}
                  <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-center sm:gap-16">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-yellow-400 px-2 py-1 text-sm font-semibold text-white">
                        {Number(
                          course.rating || 0,
                        ).toFixed(1)}
                      </span>

                      {renderRatingStars(
                        Number(course.rating || 0),
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Users className="h-5 w-5" />

                      {Number(
                        course.students || 0,
                      ).toLocaleString()}{" "}
                      students
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 gap-4 text-white/90 sm:grid-cols-2">
                    {[
                      {
                        label: "Duration",
                        value:
                          course.duration ||
                          "Self-paced",
                      },
                      {
                        label: "Type",
                        value:
                          course.study_type ||
                          "Online",
                      },
                      {
                        label: "Requirements",
                        value:
                          course.requirements ||
                          "No special requirements",
                      },
                      {
                        label: "Certificate",
                        value:
                          course.certificate ||
                          "Certificate of completion",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl bg-white/10 p-4"
                      >
                        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/70">
                          {item.label}
                        </p>

                        <p className="font-semibold text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="sticky top-0 z-40 border-b border-border bg-background">
              <div className="mx-auto max-w-4xl px-4 sm:px-8">
                <div className="flex gap-1 overflow-x-auto sm:gap-4">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);

                        document
                          .querySelector(
                            `[data-section="${tab}"]`,
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                          });
                      }}
                      className={`whitespace-nowrap border-b-2 px-4 py-4 font-medium transition-colors ${
                        activeTab === tab
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() +
                        tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =================================================
                OVERVIEW
            ================================================= */}

            <section
              data-section="overview"
              className="scroll-mt-32 pt-8"
            >
              <h2 className="relative mx-auto mb-12 block w-fit text-center text-3xl font-black text-foreground after:absolute after:-bottom-3 after:left-1/2 after:h-1.5 after:w-1/2 after:-translate-x-1/2 after:rounded-full after:bg-linear-to-r after:from-primary after:to-primary/20 after:content-['']">
                Course Overview
              </h2>

              {/* RICH TEXT OVERVIEW */}
              {Array.isArray(course.overview) &&
                course.overview.length > 0 && (
                  <div className="mb-8 space-y-6 rounded-2xl border border-border/50 bg-muted/30 p-8">
                    {course.overview.map(
                      (
                        content: string,
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className={`${richTextClasses} text-lg font-medium text-foreground/90`}
                          dangerouslySetInnerHTML={{
                            __html: content ?? "",
                          }}
                        />
                      ),
                    )}
                  </div>
                )}

              {/* WHO SHOULD LEARN */}
              <div className="mb-8 rounded-2xl border border-primary/10 bg-primary/5 p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Target className="h-6 w-6 text-primary" />
                  Who Should Learn This Course.
                </h3>

                <div className="space-y-4">
                  {Array.isArray(
                    course.who_should_learn,
                  ) ? (
                    course.who_should_learn.map(
                      (
                        item: string,
                        idx: number,
                      ) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                          <span className="font-medium leading-relaxed text-foreground/90">
                            {item}
                          </span>
                        </div>
                      ),
                    )
                  ) : course.who_should_learn ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                      <span className="font-medium leading-relaxed text-foreground/90">
                        {course.who_should_learn}
                      </span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Target learners will be available soon.
                    </p>
                  )}
                </div>
              </div>

              {/* WHY THIS COURSE MATTERS */}
              <div className="mb-8 rounded-2xl border bg-white p-8 shadow-sm dark:bg-muted/50">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Award className="h-6 w-6 text-primary" />
                  Why This Course Matters.
                </h3>

                {Array.isArray(
                  course.learning_outcomes,
                ) &&
                course.learning_outcomes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {course.learning_outcomes.map(
                      (
                        outcome: string,
                        idx: number,
                      ) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                          <span className="font-medium text-foreground/90">
                            {outcome}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="font-medium text-muted-foreground">
                    Why this course matters information will
                    be available soon.
                  </p>
                )}
              </div>

              {/* LEARNING OUTCOMES */}
              <div className="rounded-2xl border bg-muted p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Learning Outcomes.
                </h3>

                <div className="space-y-4">
                  {Array.isArray(
                    course.career_opportunities,
                  ) ? (
                    course.career_opportunities.map(
                      (
                        item: string,
                        idx: number,
                      ) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                          <span className="font-medium leading-relaxed text-foreground/90">
                            {item}
                          </span>
                        </div>
                      ),
                    )
                  ) : course.career_opportunities ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                      <span className="font-medium leading-relaxed text-foreground/90">
                        {course.career_opportunities}
                      </span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Learning outcomes will be available soon.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                SYLLABUS
            ================================================= */}

            <section
              data-section="syllabus"
              className="scroll-mt-32 pt-8"
            >
              <h2 className="relative mx-auto mb-12 block w-fit text-center text-3xl font-black text-foreground after:absolute after:-bottom-3 after:left-1/2 after:h-1.5 after:w-1/2 after:-translate-x-1/2 after:rounded-full after:bg-linear-to-r after:from-primary after:to-primary/20 after:content-['']">
                Syllabus
              </h2>

              <div className="space-y-4">
                {Array.isArray(course.syllabus) &&
                course.syllabus.length > 0 ? (
                  course.syllabus.map(
                    (module: any, idx: number) => {
                      const lessonCount =
                        typeof module.lessons === "number"
                          ? module.lessons
                          : Array.isArray(module.lessons)
                            ? module.lessons.length
                            : Array.isArray(module.lessonItems)
                              ? module.lessonItems.length
                              : 0;

                      return (
                        <details
                          key={module.id ?? idx}
                          className="group rounded-xl border bg-white shadow-sm dark:bg-muted/30 [&_summary::-webkit-details-marker]:hidden"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                {idx + 1}
                              </div>

                              <h4 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                                {module.title?.startsWith(
                                  "Module",
                                )
                                  ? module.title
                                  : `Module ${idx + 1}: ${
                                      module.title ||
                                      "Untitled"
                                    }`}
                              </h4>
                            </div>

                            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                          </summary>

                          <div className="mx-6 border-t border-border/50 px-6 pb-6">

                            {/* TEMPORARY HTML DIAGNOSTIC */}
                            {process.env.NODE_ENV ===
                              "development" &&
                              typeof module.description ===
                                "string" && (
                                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
                                  {JSON.stringify(
                                    module.description.slice(
                                      0,
                                      150,
                                    ),
                                  )}
                                </pre>
                              )}

                            {/* MODULE DESCRIPTION */}
                            {module.description ? (
                              <div
                                className={`mt-5 ${richTextClasses}`}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    module.description ?? "",
                                }}
                              />
                            ) : (
                              <p className="mt-4 font-medium leading-relaxed text-muted-foreground">
                                Detailed curriculum for this
                                module will be available upon
                                enrollment.
                              </p>
                            )}

                            {/* LESSON COUNT */}
                            <div className="mt-6 flex w-fit items-center gap-6 rounded-lg bg-muted p-3 text-sm font-bold">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />

                                {lessonCount}{" "}
                                {lessonCount === 1
                                  ? "lesson"
                                  : "lessons"}
                              </div>

                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />

                                {module.duration ||
                                  "Self-paced"}
                              </div>
                            </div>

                          </div>
                        </details>
                      );
                    },
                  )
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    Course syllabus will be available soon.
                  </Card>
                )}
              </div>
            </section>

            {/* =================================================
                CERTIFICATIONS
            ================================================= */}

            <section
              data-section="certifications"
              className="scroll-mt-32 pt-8"
            >
              <h2 className="relative mx-auto mb-12 block w-fit text-center text-3xl font-black text-foreground after:absolute after:-bottom-3 after:left-1/2 after:h-1.5 after:w-1/2 after:-translate-x-1/2 after:rounded-full after:bg-linear-to-r after:from-primary after:to-primary/20 after:content-['']">
                Certifications
              </h2>

              <div className="rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 to-orange-500/5 p-8 shadow-sm">
                <div className="mb-6 flex flex-col items-start gap-6 sm:flex-row">
                  <div className="shrink-0 rounded-2xl bg-amber-500/20 p-4">
                    <Trophy className="h-10 w-10 text-amber-600" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black">
                      Certification — 100% Included
                    </h3>

                    <p className="mt-2 text-lg font-medium text-muted-foreground">
                      Stand out to employers with
                      recognized credentials upon
                      completion.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:ml-20">
                  <div className="flex items-center gap-3 rounded-lg border border-amber-500/10 bg-white/50 p-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-amber-500" />

                    <span className="text-lg font-bold">
                      CPD Accredited PDF Certificate
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-amber-500/10 bg-white/50 p-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-amber-500" />

                    <span className="text-lg font-bold">
                      Endorsed QLS Certificate – PDF
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                LEARNER STORIES
            ================================================= */}

            <section
              data-section="stories"
              className="scroll-mt-32 pt-8"
            >
              <h2 className="relative mx-auto mb-12 block w-fit text-center text-3xl font-black text-foreground after:absolute after:-bottom-3 after:left-1/2 after:h-1.5 after:w-1/2 after:-translate-x-1/2 after:rounded-full after:bg-linear-to-r after:from-primary after:to-primary/20 after:content-['']">
                Learner Stories
              </h2>

              {Array.isArray(
                course.learner_stories,
              ) &&
              course.learner_stories.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {course.learner_stories.map(
                    (story: any, idx: number) => (
                      <Card
                        key={idx}
                        className="group relative overflow-hidden border-primary/10 bg-white p-8"
                      >
                        <Quote className="absolute right-4 top-4 -z-10 h-24 w-24 rotate-12 text-primary/5" />

                        <div className="flex h-full flex-col">
                          <p className="mb-8 grow text-lg font-medium italic leading-relaxed">
                            &quot;{story.story}&quot;
                          </p>

                          <div className="mt-auto flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                              {story.name?.charAt(0) ||
                                "L"}
                            </div>

                            <div>
                              <p className="text-lg font-bold">
                                {story.name}
                              </p>

                              <p className="text-sm font-bold text-primary">
                                {story.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  Learner stories will appear here soon.
                </Card>
              )}
            </section>

          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <div className="lg:col-span-1">
            <div className="sticky top-4 h-fit space-y-6">

              <Card className="space-y-6 p-8 shadow-sm">
                <h3 className="text-xl font-bold">
                  Full Course
                </h3>

                {/* PRICE */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-3xl font-bold text-primary">
                      $
                      {course.discounted_price ??
                        course.price ??
                        0}
                    </span>

                    {course.discounted_price != null &&
                      course.price != null &&
                      course.discounted_price !==
                        course.price && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.price}
                        </span>
                      )}

                    {course.discount_percentage > 0 && (
                      <span className="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                        {course.discount_percentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {renderRatingStars(
                      Number(course.rating || 0),
                    )}

                    <span className="text-sm font-semibold">
                      (
                      {Number(
                        course.rating || 0,
                      ).toFixed(1)}
                      )
                    </span>
                  </div>
                </div>

                {/* ENROLL */}
                {isDbCourse ? (
                  <Button
                    onClick={handleEnroll}
                    size="lg"
                    disabled={isCheckingEnrollment}
                    className="w-full text-base font-bold"
                  >
                    {isCheckingEnrollment
                      ? "Checking..."
                      : isEnrolled
                        ? "Continue Learning"
                        : "Join This Course"}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    disabled
                    className="w-full cursor-not-allowed text-base font-bold opacity-70"
                  >
                    Demo Course
                  </Button>
                )}

                {/* COURSE INCLUDES */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Course Includes:
                  </h4>

                  <div className="space-y-3 text-sm text-muted-foreground">

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Users className="h-4 w-4" />
                      </div>

                      <span>
                        {course.study_type ||
                          "Online"}{" "}
                        Access
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Clock className="h-4 w-4" />
                      </div>

                      <span>
                        {course.duration ||
                          "Self-paced"}{" "}
                        total duration
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>

                      <span>
                        Study at your own pace
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Award className="h-4 w-4" />
                      </div>

                      <span>
                        {course.certificate ||
                          "Certificate of completion"}
                      </span>
                    </div>

                  </div>
                </div>
              </Card>

              {/* KEY ASPECTS */}
              {Array.isArray(
                course.key_aspects,
              ) &&
                course.key_aspects.length > 0 && (
                  <Card>
                    <h3 className="rounded-t-xl bg-muted px-8 py-6 text-xl font-bold">
                      Key Aspects
                    </h3>

                    <div className="grid grid-cols-1 overflow-hidden border border-border">
                      {course.key_aspects.map(
                        (
                          aspect: string,
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 px-8 py-5 text-sm odd:bg-background even:bg-muted/50"
                          >
                            <div className="shrink-0 text-primary">
                              {getAspectIcon(
                                aspect,
                              )}
                            </div>

                            <span className="font-medium">
                              {aspect}
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    <div className="border-t border-border px-8 py-8">
                      {isDbCourse ? (
                        <Button
                          onClick={handleEnroll}
                          size="lg"
                          disabled={
                            isCheckingEnrollment
                          }
                          className="w-full"
                        >
                          {isCheckingEnrollment
                            ? "Checking..."
                            : isEnrolled
                              ? "Continue Learning"
                              : "Enroll in Course"}
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="w-full opacity-70"
                        >
                          Demo Course
                        </Button>
                      )}
                    </div>
                  </Card>
                )}

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

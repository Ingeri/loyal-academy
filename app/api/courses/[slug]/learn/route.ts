import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses/[slug]/learn
// Get course curriculum together with the logged-in user's progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // =========================================================
    // GET COURSE WITH FULL CURRICULUM
    // =========================================================
    const course = await prisma.course.findUnique({
      where: {
        slug,
      },

      include: {
        syllabus: {
          // Modules:
          // lowest order first, highest order last
          orderBy: [
            {
              order: "asc",
            },
            {
              createdAt: "asc",
            },
          ],

          include: {
            lessons: {
              // Lessons:
              // lowest order first, highest order last
              orderBy: [
                {
                  order: "asc",
                },
                {
                  createdAt: "asc",
                },
              ],

              include: {
                quizzes: {
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    passingScore: true,
                  },
                },
              },
            },

            Quiz: {
              select: {
                id: true,
                title: true,
                type: true,
                passingScore: true,
              },
            },
          },
        },
      },
    });

    // =========================================================
    // COURSE NOT FOUND
    // =========================================================
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 },
      );
    }

    // =========================================================
    // CHECK ENROLLMENT
    // =========================================================
    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      });

    if (!enrollment) {
      return NextResponse.json(
        {
          error: "Not enrolled in this course",
        },
        {
          status: 403,
        },
      );
    }

    // =========================================================
    // GET USER COURSE PROGRESS
    // =========================================================
    const progress =
      await prisma.courseProgress.findMany({
        where: {
          userId: user.id,
          courseId: course.id,
          isCompleted: true,
        },

        select: {
          lessonId: true,
          moduleId: true,
        },
      });

    // =========================================================
    // COMPLETED LESSONS
    // =========================================================
    const completedLessons = new Set(
      progress
        .map((item) => item.lessonId)
        .filter(
          (lessonId): lessonId is string =>
            lessonId !== null,
        ),
    );

    // =========================================================
    // CALCULATE TOTAL LESSONS
    // =========================================================
    const totalLessons = course.syllabus.reduce(
      (sum, module) =>
        sum + module.lessons.length,
      0,
    );

    const completedCount =
      completedLessons.size;

    const progressPercentage =
      totalLessons > 0
        ? Math.round(
            (completedCount / totalLessons) * 100,
          )
        : 0;

    // =========================================================
    // GET QUIZ SUBMISSIONS
    // =========================================================
    const quizSubmissions =
      await prisma.quizSubmission.findMany({
        where: {
          userId: user.id,
          courseId: course.id,
        },

        select: {
          quizId: true,
          score: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    // =========================================================
    // CALCULATE BEST QUIZ SCORES
    // =========================================================
    const quizScores: Record<
      string,
      {
        bestScore: number;
        attempts: number;
      }
    > = {};

    for (const submission of quizSubmissions) {
      if (!quizScores[submission.quizId]) {
        quizScores[submission.quizId] = {
          bestScore: submission.score,
          attempts: 0,
        };
      }

      quizScores[submission.quizId].bestScore =
        Math.max(
          quizScores[submission.quizId].bestScore,
          submission.score,
        );

      quizScores[submission.quizId].attempts++;
    }

    // =========================================================
    // CHECK CERTIFICATE
    // =========================================================
    const certificate =
      await prisma.certificate.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
        },
      });

    // =========================================================
    // GET COURSE-LEVEL EXAMS
    // =========================================================
    const courseExams =
      await prisma.quiz.findMany({
        where: {
          courseId: course.id,
          type: "EXAM",
          lessonId: null,
          moduleId: null,
        },

        select: {
          id: true,
          title: true,
          type: true,
          passingScore: true,
        },
      });

    // =========================================================
    // RETURN LEARNING DATA
    // =========================================================
    return NextResponse.json({
      course,

      enrollment,

      progress: {
        completedLessons:
          Array.from(completedLessons),

        totalLessons,

        completedCount,

        percentage: progressPercentage,
      },

      quizScores,

      certificate,

      courseExams,
    });
  } catch (error) {
    console.error(
      "Fetch course learn data error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to fetch course data",
      },
      {
        status: 500,
      },
    );
  }
}
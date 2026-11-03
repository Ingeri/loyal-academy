
import { prisma } from "@/lib/prisma";
import CourseClient, { mockCourses } from "./course-client";

/* =========================================================
   COURSE DETAILS PAGE
   LOYAL LEADERSHIP INSTITUTE
========================================================= */

type CourseDetailsPageProps = {
  params: Promise<{
    categorySlug: string;
    courseSlug: string;
  }>;
};

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { categorySlug, courseSlug } = await params;

  let course: any = null;
  let isDbCourse = false;

  try {
    /* =====================================================
       FETCH COURSE FROM DATABASE
    ===================================================== */

    const dbCourse = await prisma.course.findUnique({
      where: {
        slug: courseSlug,
      },

      include: {
        category: true,

        /* -----------------------------------------------
           MODULES AND THEIR ACTUAL LESSONS
        ----------------------------------------------- */

        syllabus: {
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
              orderBy: [
                {
                  order: "asc",
                },
                {
                  createdAt: "asc",
                },
              ],
            },
          },
        },

        /* -----------------------------------------------
           COURSE FAQS AND LEARNER STORIES
        ----------------------------------------------- */

        faqs: true,
        learnerStories: true,
      },
    });

    /* =====================================================
       TRANSFORM DATABASE COURSE
    ===================================================== */

    if (dbCourse) {
      isDbCourse = true;

      /* -----------------------------------------------
         PRICING
      ----------------------------------------------- */

      const originalPrice = Number(
        dbCourse.price ?? 0,
      );

      const discountAmount = Math.max(
        0,
        Number(dbCourse.discount ?? 0),
      );

      const finalPrice = Math.max(
        0,
        originalPrice - discountAmount,
      );

      const discountPercentage =
        originalPrice > 0 && discountAmount > 0
          ? Math.round(
              (Math.min(
                discountAmount,
                originalPrice,
              ) /
                originalPrice) *
                100,
            )
          : 0;

      /* -----------------------------------------------
         MODULES
      ----------------------------------------------- */

      const modules = dbCourse.syllabus.map(
        (module) => {
          const actualLessons = Array.isArray(
            module.lessons,
          )
            ? module.lessons
            : [];

          return {
            id: module.id,

            title: module.title,

            /*
             * Preserve the description exactly as
             * stored in the database.
             *
             * The CourseClient diagnostic will help
             * identify whether it contains HTML or
             * escaped HTML.
             */
            description: module.description ?? "",

            /*
             * Actual number of lessons belonging
             * to this module.
             */
            lessons: actualLessons.length,

            /*
             * Keep the lesson records available
             * for future syllabus enhancements.
             */
            lessonItems: actualLessons,

            duration: "Self-paced",
          };
        },
      );

      /* -----------------------------------------------
         OVERVIEW
      ----------------------------------------------- */

      const overview = Array.isArray(
        dbCourse.overview,
      )
        ? dbCourse.overview
        : dbCourse.overview
          ? [dbCourse.overview]
          : [];

      /* -----------------------------------------------
         LEARNING OUTCOMES
      ----------------------------------------------- */

      const learningOutcomes = Array.isArray(
        dbCourse.learningOutcomes,
      )
        ? dbCourse.learningOutcomes
        : [];

      /* -----------------------------------------------
         TARGET LEARNERS
      ----------------------------------------------- */

      const targetLearners = Array.isArray(
        dbCourse.careerFields,
      )
        ? dbCourse.careerFields
        : [];

      /* -----------------------------------------------
         CAREER OPPORTUNITIES
      ----------------------------------------------- */

      const careerOpportunities = Array.isArray(
        dbCourse.hiringSectors,
      )
        ? dbCourse.hiringSectors
        : [];

      /* =====================================================
         BUILD COURSE OBJECT FOR COURSECLIENT
      ===================================================== */

      course = {
        /* ---------------------------------------------
           IDENTIFICATION
        --------------------------------------------- */

        id: dbCourse.id,

        title: dbCourse.title,

        description: dbCourse.description ?? "",

        category:
          dbCourse.category?.name ||
          categorySlug,

        /* ---------------------------------------------
           COURSE DETAILS
        --------------------------------------------- */

        level:
          dbCourse.level || "Beginner",

        study_type:
          dbCourse.conductingType || "Online",

        requirements:
          "No prior experience required.",

        certificate: dbCourse.hasCertificate
          ? "Certificate of completion"
          : "No certificate",

        /* ---------------------------------------------
           PRICE
        --------------------------------------------- */

        price: originalPrice,

        discounted_price:
          discountAmount > 0
            ? finalPrice
            : undefined,

        discount_percentage:
          discountPercentage,

        /* ---------------------------------------------
           COURSE IMAGE
        --------------------------------------------- */

        image:
          dbCourse.thumbnail ||
          "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=400&fit=crop",

        /* ---------------------------------------------
           COURSE STATISTICS
        --------------------------------------------- */

        rating: Number(
          dbCourse.avgRating ?? 0,
        ),

        students: Number(
          dbCourse.studentNumber ?? 0,
        ),

        duration:
          dbCourse.duration || "Self-paced",

        /* ---------------------------------------------
           INSTRUCTOR
        --------------------------------------------- */

        instructor: "Expert Instructor",

        instructor_bio:
          "Learn from experienced professionals.",

        /* ---------------------------------------------
           COURSE OVERVIEW
        --------------------------------------------- */

        overview,

        /* ---------------------------------------------
           EXISTING PUBLIC PAGE FIELD MAPPING

           Preserve the mapping currently used by
           your CourseClient component.
        --------------------------------------------- */

        learning_outcomes: learningOutcomes,

        who_should_learn: targetLearners,

        career_opportunities:
          careerOpportunities,

        /* ---------------------------------------------
           ADDITIONAL INFORMATION
        --------------------------------------------- */

        market_growth:
          dbCourse.growthPercentage ?? 0,

        estimated_salary:
          dbCourse.estimatedSalary ?? "",

        /* ---------------------------------------------
           REAL DATABASE MODULES

           Never substitute fictional modules
           for an actual database course.
        --------------------------------------------- */

        syllabus: modules,

        /* ---------------------------------------------
           FAQS
        --------------------------------------------- */

        faqs:
          dbCourse.faqs?.length > 0
            ? dbCourse.faqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
              }))
            : [],

        /* ---------------------------------------------
           LEARNER STORIES
        --------------------------------------------- */

        learner_stories:
          dbCourse.learnerStories?.length > 0
            ? dbCourse.learnerStories.map(
                (story) => ({
                  name: story.name,
                  role: story.role,
                  story: story.story,
                }),
              )
            : [],

        /* ---------------------------------------------
           CERTIFICATIONS
        --------------------------------------------- */

        certifications:
          dbCourse.hasCertificate
            ? ["Certificate of Completion"]
            : [],

        /* ---------------------------------------------
           KEY ASPECTS
        --------------------------------------------- */

        key_aspects: [
          dbCourse.conductingType || "Online",
          "Self-Paced Learning",
        ],
      };
    }
  } catch (error) {
    console.error(
      "[CourseDetailsPage] Failed to load course:",
      error,
    );
  }

  /* =========================================================
     FALLBACK TO DEMO COURSES

     Demo courses are used only when a matching
     database course is not available.
  ========================================================= */

  if (!course) {
    const mockCourse = mockCourses.find(
      (mock) => {
        const generatedSlug = mock.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        return generatedSlug === courseSlug;
      },
    );

    if (mockCourse) {
      course = mockCourse;
      isDbCourse = false;
    }
  }

  /* =========================================================
     RENDER COURSE DETAILS
  ========================================================= */

  return (
    <CourseClient
      course={course}
      categorySlug={categorySlug}
      courseSlug={courseSlug}
      isDbCourse={isDbCourse}
    />
  );
}

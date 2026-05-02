import { PrismaClient, AssessmentType } from '@prisma/client';
import * as dotenv from 'dotenv';

// 1. Load the environment variables BEFORE initializing the client
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

function generateAssessmentQuestions(assessmentTitle: string) {
  return Array.from({ length: 5 }).map((_, i) => ({
    text: `Question ${i + 1} for ${assessmentTitle}: What is the primary concept discussed here?`,
    options: {
      create: Array.from({ length: 5 }).map((_, j) => ({
        text: `Option ${j + 1}: ${j === 0 ? "Correct Answer" : "Incorrect Answer"}`,
        isCorrect: j === 0, 
      })),
    },
  }));
}

async function main() {
  console.log("🚀 Starting Mega-Seed: Creating 30,000+ learning records...");

  // Verify the environment variable is loaded
  if (!process.env.DIRECT_URL) {
    throw new Error("DIRECT_URL is not defined in .env.local");
  }

  const courses = await prisma.course.findMany({
    include: { syllabus: true },
  });

  if (courses.length === 0) {
    console.log("⚠️ No courses found. Please ensure you have courses and modules before seeding.");
    return;
  }

  for (const course of courses) {
    console.log(`\n📘 Processing Course: ${course.title}`);

    // 1. Create 1 Exam per Course
    await prisma.quiz.upsert({
      where: { id: `${course.id}-final-exam` },
      update: {},
      create: {
        id: `${course.id}-final-exam`,
        title: `${course.title} Final Examination`,
        type: AssessmentType.EXAM,
        courseId: course.id,
        passingScore: 85,
        questions: { create: generateAssessmentQuestions(`${course.title} Exam`) },
      },
    });

    for (const module of course.syllabus) {
      console.log(`  📦 Module: ${module.title}`);

      // 2. Create 1 Quiz per Module
      await prisma.quiz.upsert({
        where: { id: `${module.id}-module-quiz` },
        update: {},
        create: {
          id: `${module.id}-module-quiz`,
          title: `${module.title} Comprehensive Quiz`,
          type: AssessmentType.QUIZ,
          courseId: course.id,
          passingScore: 80,
          questions: { create: generateAssessmentQuestions(`${module.title} Quiz`) },
        },
      });

      // 3. Create 7 Lessons per Module
      const lessonCount = 7;
      for (let i = 1; i <= lessonCount; i++) {
        const lessonSlug = `${course.slug}-${module.id}-lesson-${i}`;
        
        const lesson = await prisma.lesson.upsert({
          where: { slug: lessonSlug },
          update: {},
          create: {
            title: `Lesson ${i}: Deep Dive into ${module.title}`,
            slug: lessonSlug,
            order: i,
            moduleId: module.id,
            content: [
              { type: "heading", level: 1, text: `Learning Objective ${i}` },
              { type: "paragraph", text: "In this detailed lesson, we analyze the core mechanics of the subject matter." },
              { type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
            ],
          },
        });

        // 4. Create 3 Exercises per Lesson
        for (let j = 1; j <= 3; j++) {
          const exerciseId = `${lesson.id}-ex-${j}`;
          await prisma.quiz.upsert({
            where: { id: exerciseId },
            update: {},
            create: {
              id: exerciseId,
              title: `Exercise ${j}: Practical Application`,
              type: AssessmentType.EXERCISE,
              lessonId: lesson.id,
              courseId: course.id,
              passingScore: 70,
              questions: { create: generateAssessmentQuestions(`Lesson ${i} Ex ${j}`) },
            },
          });
        }
      }
    }
  }

  console.log("\n✅ SUCCESS: All thousands of records linked to your 48 modules.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
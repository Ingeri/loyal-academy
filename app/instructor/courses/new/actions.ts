"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// TODO: Replace with your real session lookup (you already have getSession()
// in @/lib/auth/session — wire it here the same way your other layouts do).
async function getCurrentInstructorId(): Promise<string> {
  throw new Error(
    "getCurrentInstructorId() is not wired up yet. Replace with your real auth/session lookup."
  );
}

async function getDefaultCategoryId(): Promise<string> {
  const category = await prisma.category.upsert({
    where: { slug: "general" },
    update: {},
    create: { name: "General", slug: "general" },
  });
  return category.id;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export type OptionInput = { text: string; isCorrect: boolean };
export type QuestionInput = { text: string; options: OptionInput[] };
export type SessionInput = { title: string; content: string };
export type DayInput = {
  title: string;
  description: string;
  sessions: SessionInput[];
  examTitle: string;
  passingScore: number;
  questions: QuestionInput[];
};

export type FullCoursePayload = {
  title: string;
  description: string;
  price: number;
  duration: string;
  conductingType: string;
  thumbnail: string;
  days: DayInput[];
};

export async function createFullCourse(payload: FullCoursePayload) {
  const instructorId = await getCurrentInstructorId();

  if (!payload.title || !payload.description) {
    throw new Error("Title and description are required.");
  }

  if (payload.days.length === 0) {
    throw new Error("Add at least one day to the course.");
  }

  const categoryId = await getDefaultCategoryId();
  const slug = `${slugify(payload.title)}-${Date.now().toString(36)}`;

  const course = await prisma.course.create({
    data: {
      title: payload.title,
      slug,
      description: payload.description,
      categoryId,
      instructorId,
      price: payload.price || 0,
      duration: payload.duration || null,
      conductingType: (payload.conductingType as any) || "Online",
      thumbnail: payload.thumbnail || null,
      hasExam: payload.days.some((d) => d.questions.length > 0),
      published: false, // pending admin approval
    },
  });

  for (let dayIndex = 0; dayIndex < payload.days.length; dayIndex++) {
    const day = payload.days[dayIndex];

    if (!day.title || day.sessions.length === 0) {
      throw new Error(`Day ${dayIndex + 1} needs a title and at least one session.`);
    }

    const module = await prisma.module.create({
      data: {
        title: day.title,
        description: day.description || "",
        order: dayIndex + 1,
        courseId: course.id,
      },
    });

    for (let sessionIndex = 0; sessionIndex < day.sessions.length; sessionIndex++) {
      const session = day.sessions[sessionIndex];

      if (!session.title || !session.content) {
        throw new Error(
          `Day ${dayIndex + 1}, Session ${sessionIndex + 1} needs a title and content.`
        );
      }

      await prisma.lesson.create({
        data: {
          title: session.title,
          slug: `${slug}-day${dayIndex + 1}-session${sessionIndex + 1}`,
          content: session.content,
          order: sessionIndex + 1,
          moduleId: module.id,
        },
      });
    }

    if (day.questions.length > 0) {
      const quiz = await prisma.quiz.create({
        data: {
          title: day.examTitle || `Day ${dayIndex + 1} Exam`,
          type: "EXAM",
          passingScore: day.passingScore || 70,
          courseId: course.id,
          moduleId: module.id,
        },
      });

      for (const q of day.questions) {
        if (!q.text || q.options.length < 2 || !q.options.some((o) => o.isCorrect)) {
          throw new Error(
            `Day ${dayIndex + 1} has a question missing text, options, or a marked correct answer.`
          );
        }

        const question = await prisma.question.create({
          data: { text: q.text, quizId: quiz.id },
        });

        await prisma.option.createMany({
          data: q.options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            questionId: question.id,
          })),
        });
      }
    }
  }

  redirect("/instructor/courses/submitted");
}
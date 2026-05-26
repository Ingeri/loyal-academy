'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';
import { Level } from '@prisma/client';

/**
 * Get courses with filters
 * @param categoryId - Filter by category ID
 * @param published - Filter by published status
 * @param level - Filter by course level
 * @param search - Search by title or description
 * @param instructorId - Filter by instructor ID
 */
export async function getCourses(
  categoryId?: string,
  published?: boolean,
  level?: Level,
  search?: string,
  instructorId?: string
) {
  await checkAdminAccess();

  const where: any = {};

  if (categoryId) {
    where.categoryId = await validateUUID(categoryId);
  }

  if (published !== undefined) {
    where.published = published;
  }

  if (level) {
    where.level = level;
  }

  if (instructorId) {
    where.instructorId = instructorId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return courses;
}

/**
 * Get course details with all relations
 */
export async function getCourseDetails(courseId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(courseId);

  const course = await prisma.course.findUnique({
    where: { id: validatedId },
    include: {
      category: true,
      syllabus: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { id: 'asc' },
      },
      tags: true,
      enrollments: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          createdAt: true,
          progress: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      faqs: true,
      learnerStories: true,
    },
  });

  return course;
}

/**
 * Update course details
 */
export async function updateCourse(courseId: string, data: any) {
  await checkAdminAccess();
  const validatedId = await validateUUID(courseId);

  const course = await prisma.course.update({
    where: { id: validatedId },
    data,
    include: {
      category: true,
    },
  });

  return course;
}

/**
 * Hard delete course (triggers cascading delete)
 */
export async function deleteCourse(courseId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(courseId);

  await prisma.course.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Course deleted successfully' };
}

/**
 * Approve/publish course
 */
export async function approveCourse(courseId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(courseId);

  const course = await prisma.course.update({
    where: { id: validatedId },
    data: { published: true },
  });

  return course;
}

/**
 * Manage course syllabus (add, reorder, fix modules and lessons)
 */
export async function manageCourseSyllabus(courseId: string, modulesData: any[]) {
  await checkAdminAccess();
  const validatedId = await validateUUID(courseId);

  // This is a complex operation that would handle:
  // - Adding new modules
  // - Updating existing modules
  // - Deleting removed modules
  // - Reordering modules
  // - Managing lessons within modules

  // For now, we'll implement a basic version that updates modules
  // In a full implementation, this would use a transaction to ensure consistency

  const course = await prisma.course.update({
    where: { id: validatedId },
    data: {
      syllabus: {
        deleteMany: {},
        create: modulesData.map((module, index) => ({
          title: module.title,
          description: module.description,
          lessons: {
            create: module.lessons?.map((lesson: any, lessonIndex: number) => ({
              title: lesson.title,
              slug: lesson.slug,
              content: lesson.content,
              order: lessonIndex,
            })) || [],
          },
        })),
      },
    },
    include: {
      syllabus: {
        include: {
          lessons: true,
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  return course;
}

/**
 * Delete course review (spam cleanup)
 */
export async function deleteCourseReview(reviewId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(reviewId);

  await prisma.review.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Review deleted successfully' };
}

/**
 * Get instructors who have created courses
 */
export async function getCourseInstructors() {
  await checkAdminAccess();

  const instructors = await prisma.user.findMany({
    where: {
      role: 'INSTRUCTOR',
      createdCourses: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: 'asc' },
  });

  return instructors;
}

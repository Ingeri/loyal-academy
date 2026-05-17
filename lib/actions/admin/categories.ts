'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';

/**
 * Get all course categories
 */
export async function getCourseCategories() {
  await checkAdminAccess();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          courses: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories;
}

/**
 * Create course category
 */
export async function createCourseCategory(data: { name: string; slug: string }) {
  await checkAdminAccess();

  const category = await prisma.category.create({
    data,
  });

  return category;
}

/**
 * Update course category
 */
export async function updateCourseCategory(id: string, data: { name: string; slug: string }) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const category = await prisma.category.update({
    where: { id: validatedId },
    data,
  });

  return category;
}

/**
 * Delete course category
 */
export async function deleteCourseCategory(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  await prisma.category.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Category deleted successfully' };
}

/**
 * Get all blog categories
 */
export async function getBlogCategories() {
  await checkAdminAccess();

  const categories = await prisma.blogCategory.findMany({
    include: {
      _count: {
        select: {
          blogs: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories;
}

/**
 * Create blog category
 */
export async function createBlogCategory(data: { name: string; slug: string }) {
  await checkAdminAccess();

  const category = await prisma.blogCategory.create({
    data,
  });

  return category;
}

/**
 * Update blog category
 */
export async function updateBlogCategory(id: string, data: { name: string; slug: string }) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const category = await prisma.blogCategory.update({
    where: { id: validatedId },
    data,
  });

  return category;
}

/**
 * Delete blog category
 */
export async function deleteBlogCategory(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  await prisma.blogCategory.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Blog category deleted successfully' };
}

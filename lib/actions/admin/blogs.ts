'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';

/**
 * Get blogs with filters
 * @param search - Search by title or slug
 * @param blogCategoryId - Filter by blog category ID
 * @param published - Filter by published status
 */
export async function getBlogs(search?: string, blogCategoryId?: string, published?: boolean) {
  await checkAdminAccess();

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (blogCategoryId) {
    where.blogCategoryId = await validateUUID(blogCategoryId);
  }

  if (published !== undefined) {
    where.published = published;
  }

  const blogs = await prisma.blog.findMany({
    where,
    include: {
      blogCategory: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          blogReviews: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return blogs;
}

/**
 * Get blog details with all relations
 */
export async function getBlogDetails(blogId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(blogId);

  const blog = await prisma.blog.findUnique({
    where: { id: validatedId },
    include: {
      blogCategory: true,
      blogReviews: {
        orderBy: { createdAt: 'desc' },
      },
      blogFaqs: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return blog;
}

/**
 * Update blog details
 */
export async function updateBlog(blogId: string, data: any) {
  await checkAdminAccess();
  const validatedId = await validateUUID(blogId);

  const blog = await prisma.blog.update({
    where: { id: validatedId },
    data,
    include: {
      blogCategory: true,
    },
  });

  return blog;
}

/**
 * Delete blog
 */
export async function deleteBlog(blogId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(blogId);

  await prisma.blog.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Blog deleted successfully' };
}

/**
 * Approve/publish blog
 */
export async function approveBlog(blogId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(blogId);

  const blog = await prisma.blog.update({
    where: { id: validatedId },
    data: { published: true },
  });

  return blog;
}

/**
 * Delete blog review (spam cleanup)
 */
export async function deleteBlogReview(reviewId: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(reviewId);

  await prisma.blogReview.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Blog review deleted successfully' };
}

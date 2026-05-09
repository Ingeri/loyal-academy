'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Used for the Main Blog List Page
 * Fetches all published blogs and all available categories for the filter bar.
 */
export async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { 
        published: true 
      },
      include: {
        blogCategory: true,
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    const categories = await prisma.blogCategory.findMany({
      orderBy: { 
        name: 'asc' 
      },
    });

    return { blogs, categories };
  } catch (error) {
    console.error("Error fetching blogs list:", error);
    return { blogs: [], categories: [] };
  }
}

/**
 * Used for the Blog Detail Page ([slug])
 * Fetches a single published blog by its unique slug, including FAQs and Reviews.
 */
export async function getBlogBySlug(slug: string) {
  // CRITICAL: Prevent Prisma crash if slug is undefined or empty
  if (!slug || typeof slug !== 'string') {
    console.error("getBlogBySlug error: No valid slug provided");
    return null;
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { 
        slug: slug,
        // Optional: Ensure only published blogs are accessible via URL
        published: true 
      },
      include: {
        blogCategory: true,
        // Fetches the FAQs imported via CSV
        blogFaqs: {
          orderBy: { 
            createdAt: 'asc' 
          }
        },
        // Fetches the Reviews imported via CSV
        blogReviews: {
          orderBy: { 
            createdAt: 'desc' 
          }
        }
      }
    });

    if (!blog) {
      console.warn(`Blog with slug "${slug}" not found in database.`);
      return null;
    }

    return blog;
  } catch (error) {
    console.error("Prisma Error in getBlogBySlug:", error);
    return null;
  }
}


//import { prisma } from '@/lib/prisma';

export async function submitBlogReview(formData: {
  blogId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
}) {
  try {
    // 1. Create the review
    await prisma.blogReview.create({
      data: {
        blogId: formData.blogId,
        rating: formData.rating,
        comment: formData.comment,
        reviewerName: formData.reviewerName,
        reviewerEmail: formData.reviewerEmail,
      },
    });

    // 2. Recalculate average rating for the blog
    const aggregations = await prisma.blogReview.aggregate({
      where: { blogId: formData.blogId },
      _avg: { rating: true },
    });

    await prisma.blog.update({
      where: { id: formData.blogId },
      data: { avgRating: aggregations._avg.rating || 0 },
    });

    // 3. Refresh the page data
    revalidatePath(`/blog`);
    return { success: true };
  } catch (error) {
    console.error("Review submission error:", error);
    return { success: false, error: "Failed to submit review" };
  }
}
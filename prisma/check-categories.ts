import * as dotenv from 'dotenv';
import { prisma } from '@/lib/prisma';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("🔍 Checking course-category assignments...\n");

  // Get all courses with their categories
  const courses = await prisma.course.findMany({
    include: {
      category: true,
    },
  });

  console.log(`Total courses: ${courses.length}\n`);

  // Check which courses have missing categories
  const coursesWithoutCategory = courses.filter(course => !course.category);
  console.log(`Courses without category: ${coursesWithoutCategory.length}`);

  if (coursesWithoutCategory.length > 0) {
    console.log("\nCourses without category:");
    coursesWithoutCategory.forEach(course => {
      console.log(`  - ${course.title} (ID: ${course.id})`);
    });
  }

  // Check which courses have categories but missing slug
  const coursesWithMissingSlug = courses.filter(course => course.category && !course.category.slug);
  console.log(`\nCourses with category but missing slug: ${coursesWithMissingSlug.length}`);

  if (coursesWithMissingSlug.length > 0) {
    console.log("\nCourses with category but missing slug:");
    coursesWithMissingSlug.forEach(course => {
      console.log(`  - ${course.title} (Category: ${course.category?.name})`);
    });
  }

  // Get all available categories
  const categories = await prisma.category.findMany();
  console.log(`\nAvailable categories: ${categories.length}`);
  categories.forEach(cat => {
    console.log(`  - ${cat.name} (slug: ${cat.slug})`);
  });

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });

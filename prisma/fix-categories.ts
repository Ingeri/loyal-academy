import * as dotenv from 'dotenv';
import { prisma } from '@/lib/prisma';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("🔧 Fixing course-category assignments...\n");

  // Get all courses with their categories
  const courses = await prisma.course.findMany({
    include: {
      category: true,
    },
  });

  // Get all available categories
  const categories = await prisma.category.findMany();

  if (categories.length === 0) {
    console.log("⚠️ No categories found in database. Creating default category...");
    const defaultCategory = await prisma.category.create({
      data: {
        name: "General",
        slug: "general",
      },
    });
    console.log(`✅ Created default category: ${defaultCategory.name} (slug: ${defaultCategory.slug})`);
    categories.push(defaultCategory);
  }

  // Find courses without categories
  const coursesWithoutCategory = courses.filter(course => !course.category);
  console.log(`Found ${coursesWithoutCategory.length} courses without category`);

  if (coursesWithoutCategory.length > 0) {
    // Use the first category as default (or "general" if it exists)
    const defaultCategory = categories.find(cat => cat.slug === "general") || categories[0];
    
    console.log(`\nAssigning default category "${defaultCategory.name}" (slug: ${defaultCategory.slug}) to courses...`);
    
    for (const course of coursesWithoutCategory) {
      await prisma.course.update({
        where: { id: course.id },
        data: { categoryId: defaultCategory.id },
      });
      console.log(`  ✓ Assigned to: ${course.title}`);
    }
    
    console.log(`\n✅ Successfully assigned categories to ${coursesWithoutCategory.length} courses`);
  } else {
    console.log("✅ All courses already have categories assigned");
  }

  // Verify the fix
  console.log("\n🔍 Verifying fix...");
  const updatedCourses = await prisma.course.findMany({
    include: {
      category: true,
    },
    take: 5,
  });

  console.log("Sample courses after fix:");
  updatedCourses.forEach(course => {
    console.log(`  - ${course.title} -> Category: ${course.category?.name} (slug: ${course.category?.slug})`);
  });

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });

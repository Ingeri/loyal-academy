import { prisma } from './lib/prisma';

async function main() {
  try {
    const data = await prisma.course.findMany({
      where: { published: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { prisma } from '../lib/prisma';

async function main() {
    const courses = await prisma.course.findMany({
        select: { id: true, slug: true, title: true },
        take: 5,
    });
    console.log('courses', courses);
    if (courses.length === 0) {
        console.log('No courses found');
        return;
    }
    const course = await prisma.course.findFirst({
        where: { slug: courses[0].slug },
        include: {
            syllabus: {
                include: {
                    lessons: {
                        include: {
                            quizzes: true,
                        },
                    },
                    Quiz: true,
                },
            },
        },
    });
    console.log(JSON.stringify(course, null, 2));
}

main()
    .catch((err) => {
        console.error(err);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

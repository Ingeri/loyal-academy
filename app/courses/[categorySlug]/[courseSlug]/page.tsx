import { prisma } from '@/lib/prisma';
import CourseClient, { mockCourses } from './course-client';

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ categorySlug: string; courseSlug: string }>;
}) {
  const { categorySlug, courseSlug } = await params;

  // 1. Try fetching from database
  let course = null;
  
  try {
    const dbCourse = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { 
        category: true,
        syllabus: true,
        faqs: true,
        learnerStories: true
      }
    });

    if (dbCourse) {
      course = {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        category: dbCourse.category?.name || categorySlug,
        level: dbCourse.level || 'Beginner',
        study_type: dbCourse.conductingType || 'Online',
        requirements: 'No prior experience required.',
        certificate: dbCourse.hasCertificate ? 'Certificate of completion' : 'No certificate',
        price: dbCourse.price ? Number(dbCourse.price) : 49.99,
        discounted_price: dbCourse.discount ? Number(dbCourse.price) - Number(dbCourse.discount) : undefined,
        discount_percentage: dbCourse.discount && Number(dbCourse.price) > 0 ? Math.round((Number(dbCourse.discount) / Number(dbCourse.price)) * 100) : 0,
        image: dbCourse.thumbnail || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=400&fit=crop',
        rating: dbCourse.avgRating || 4.5,
        students: dbCourse.studentNumber || 100,
        duration: dbCourse.duration || 'Self-paced',
        instructor: 'Expert Instructor',
        instructor_bio: 'A passionate expert in this field with years of industry experience.',
        overview: dbCourse.overview,
        learning_outcomes: dbCourse.learningOutcomes?.length > 0 ? dbCourse.learningOutcomes : ['Fundamental concepts', 'Practical applications', 'Advanced techniques'],
        who_should_learn: dbCourse.careerFields?.length > 0 ? dbCourse.careerFields : ['Anyone looking to advance their skills'],
        career_opportunities: dbCourse.hiringSectors?.length > 0 ? dbCourse.hiringSectors : ['Technology', 'Business', 'Finance'],
        market_growth: dbCourse.growthPercentage || 0,
        estimated_salary: dbCourse.estimatedSalary || 'Competitive',
        syllabus: dbCourse.syllabus?.length > 0 ? dbCourse.syllabus : [
          { title: 'Module 1: Introduction', lessons: 3, duration: '1.5 hours' },
          { title: 'Module 2: Core Concepts', lessons: 5, duration: '3 hours' },
          { title: 'Module 3: Practical Projects', lessons: 4, duration: '4 hours' }
        ],
        faqs: dbCourse.faqs?.length > 0 ? dbCourse.faqs : [
          { question: 'Do I need prior experience?', answer: 'This course is designed to accommodate beginners.' },
          { question: 'Will I get a certificate?', answer: 'Yes, upon full completion.' }
        ],
        learner_stories: dbCourse.learnerStories?.length > 0 ? dbCourse.learnerStories : [],
        certifications: dbCourse.hasCertificate ? ['Certificate of Completion'] : [],
        key_aspects: ['Fully Online', 'Self-Paced Learning', 'Lifetime Access']
      };
    }
  } catch (error) {
    console.error("Error fetching course from DB:", error);
  }

  // 2. Try falling back to mock courses if not found in DB
  if (!course) {
    const mockCourse = mockCourses.find((c) => {
      const generatedSlug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return generatedSlug === courseSlug;
    });

    if (mockCourse) {
      course = mockCourse;
    }
  }

  // 3. Render client component with course data (or null if not found)
  return <CourseClient course={course} />;
}

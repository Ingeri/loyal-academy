import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Users, Award, Star } from 'lucide-react';

const mockCourses = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript from scratch. This comprehensive course will take you from beginner to intermediate level.',
    category: 'Web Development',
    level: 'Beginner',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    rating: 4.8,
    students: 2540,
    duration: '8 weeks',
    instructor: 'Sarah Johnson',
    instructor_bio: 'Sarah is a senior web developer with 10+ years of experience.',
    learning_outcomes: ['HTML & CSS Fundamentals', 'JavaScript Basics', 'Responsive Design', 'DOM Manipulation'],
    curriculum: [
      { title: 'Module 1: HTML Basics', lessons: 5, duration: '2 hours' },
      { title: 'Module 2: CSS Styling', lessons: 6, duration: '2.5 hours' },
      { title: 'Module 3: JavaScript Fundamentals', lessons: 8, duration: '4 hours' },
      { title: 'Module 4: Building Your First Website', lessons: 4, duration: '2 hours' },
    ],
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts including hooks, context API, performance optimization, and custom patterns used in production apps.',
    category: 'Web Development',
    level: 'Advanced',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop',
    rating: 4.9,
    students: 1820,
    duration: '10 weeks',
    instructor: 'Mike Chen',
    instructor_bio: 'Mike is a React expert and has built multiple production applications.',
    learning_outcomes: ['React Hooks', 'Context API', 'Performance Optimization', 'State Management Patterns'],
    curriculum: [
      { title: 'Module 1: Advanced Hooks', lessons: 7, duration: '3 hours' },
      { title: 'Module 2: Context & Provider Patterns', lessons: 5, duration: '2 hours' },
      { title: 'Module 3: Performance Optimization', lessons: 6, duration: '3 hours' },
      { title: 'Module 4: Real-World Patterns', lessons: 8, duration: '4 hours' },
    ],
  },
  {
    id: '3',
    title: 'Data Science Essentials',
    description: 'Introduction to Python, pandas, and data visualization. Learn the fundamentals of data analysis.',
    category: 'Data Science',
    level: 'Beginner',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1518186285671-4d71bcdd2085?w=800&h=400&fit=crop',
    rating: 4.7,
    students: 3200,
    duration: '12 weeks',
    instructor: 'Dr. Emily Rodriguez',
    instructor_bio: 'Dr. Rodriguez has a PhD in Data Science and 15 years of research experience.',
    learning_outcomes: ['Python for Data Science', 'Pandas & NumPy', 'Data Visualization', 'Statistical Analysis'],
    curriculum: [
      { title: 'Module 1: Python Basics for Data Science', lessons: 6, duration: '3 hours' },
      { title: 'Module 2: Pandas & Data Manipulation', lessons: 7, duration: '3.5 hours' },
      { title: 'Module 3: Data Visualization', lessons: 5, duration: '2.5 hours' },
      { title: 'Module 4: Statistical Analysis', lessons: 6, duration: '3 hours' },
    ],
  },
  {
    id: '4',
    title: 'UX/UI Design Bootcamp',
    description: 'Learn design principles, Figma, and user research. A practical bootcamp for aspiring designers.',
    category: 'Design',
    level: 'Intermediate',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    rating: 4.6,
    students: 1540,
    duration: '10 weeks',
    instructor: 'Alex Kim',
    instructor_bio: 'Alex is a UX/UI designer at a top tech company with 8 years of experience.',
    learning_outcomes: ['Design Principles', 'Figma Mastery', 'User Research', 'Prototyping'],
    curriculum: [
      { title: 'Module 1: Design Fundamentals', lessons: 5, duration: '2.5 hours' },
      { title: 'Module 2: Figma Essentials', lessons: 8, duration: '4 hours' },
      { title: 'Module 3: User Research & Testing', lessons: 6, duration: '3 hours' },
      { title: 'Module 4: Building Your Portfolio', lessons: 4, duration: '2 hours' },
    ],
  },
  {
    id: '5',
    title: 'Cloud Architecture with AWS',
    description: 'Deploy and manage applications on AWS. Learn cloud architecture best practices.',
    category: 'Cloud',
    level: 'Intermediate',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e5e68f72?w=800&h=400&fit=crop',
    rating: 4.8,
    students: 2100,
    duration: '12 weeks',
    instructor: 'James Park',
    instructor_bio: 'James is an AWS Solutions Architect with certification and 12 years of cloud experience.',
    learning_outcomes: ['AWS Fundamentals', 'EC2 & VPC', 'Databases on AWS', 'Serverless Architecture'],
    curriculum: [
      { title: 'Module 1: AWS Core Services', lessons: 7, duration: '3.5 hours' },
      { title: 'Module 2: Networking & Security', lessons: 6, duration: '3 hours' },
      { title: 'Module 3: Databases & Storage', lessons: 5, duration: '2.5 hours' },
      { title: 'Module 4: Serverless & Cost Optimization', lessons: 6, duration: '3 hours' },
    ],
  },
  {
    id: '6',
    title: 'Machine Learning Fundamentals',
    description: 'Build your first ML models with scikit-learn. A practical introduction to machine learning.',
    category: 'Data Science',
    level: 'Intermediate',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504d0?w=800&h=400&fit=crop',
    rating: 4.9,
    students: 2800,
    duration: '14 weeks',
    instructor: 'Prof. David Lee',
    instructor_bio: 'Prof. Lee teaches machine learning at a leading university and has 15 publications.',
    learning_outcomes: ['ML Algorithms', 'scikit-learn', 'Feature Engineering', 'Model Evaluation'],
    curriculum: [
      { title: 'Module 1: ML Fundamentals', lessons: 6, duration: '3 hours' },
      { title: 'Module 2: Supervised Learning', lessons: 8, duration: '4 hours' },
      { title: 'Module 3: Unsupervised Learning', lessons: 6, duration: '3 hours' },
      { title: 'Module 4: Feature Engineering & Optimization', lessons: 7, duration: '3.5 hours' },
    ],
  },
];

function getCourse(id: string) {
  return mockCourses.find(c => c.id === id) || null;
}

function getCourseContent(courseId: string) {
  const course = mockCourses.find(c => c.id === courseId);
  return course?.curriculum?.map((module, idx) => ({
    id: `${courseId}-${idx}`,
    title: module.title,
    type: 'module',
    order_position: idx,
  })) || [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = getCourse(id);

  return {
    title: course ? `${course.title} - Loyal Academy` : 'Course - Loyal Academy',
    description: course?.description || 'View this course on Loyal Academy',
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = getCourse(id);

  if (!course) {
    notFound();
  }

  const content = getCourseContent(course.id);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Course Header */}
      <section className="bg-gradient-to-b from-primary/20 to-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {course.level}
                </span>
                {course.category && (
                  <span className="text-sm text-muted-foreground">{course.category}</span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {course.rating ? `${course.rating.toFixed(1)} (${course.students || 0} students)` : 'New'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.students || 0} students</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                )}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary mb-2">${course.price}</p>
                  <p className="text-sm text-muted-foreground">Lifetime access</p>
                </div>
                <Link href={`/enroll/${course.id}`} className="w-full">
                  <Button size="lg" className="w-full">
                    Enroll Now
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  30-day money-back guarantee
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Instructor */}
              <Card className="p-6 mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">About Your Instructor</h2>
                <div className="flex gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold flex-shrink-0">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{course.instructor}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor_bio}</p>
                  </div>
                </div>
              </Card>

              {/* Course Content */}
              {course.curriculum && course.curriculum.length > 0 && (
                <Card className="p-6 mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Course Content</h2>
                  <div className="space-y-3">
                    {course.curriculum.map((module: any, index: number) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-muted rounded">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{module.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="bg-background px-2 py-1 rounded">{module.lessons} lessons</span>
                            <span>{module.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Key Features */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">What You&apos;ll Learn</h2>
                <ul className="space-y-3">
                  {course.learning_outcomes && course.learning_outcomes.map((outcome: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-20">
                {/* Quick Info */}
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Course Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium text-foreground capitalize">{course.level}</span>
                    </div>
                    {course.duration && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">{course.duration}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium text-foreground">{content.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certificate</span>
                      <span className="font-medium text-foreground">Yes</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

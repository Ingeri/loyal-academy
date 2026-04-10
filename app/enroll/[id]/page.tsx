import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Star } from 'lucide-react';

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
      { id: 'lesson-1-1', title: 'Introduction to HTML', module: 'Module 1: HTML Basics', duration: '30 mins', type: 'video' },
      { id: 'lesson-1-2', title: 'HTML Structure & Tags', module: 'Module 1: HTML Basics', duration: '45 mins', type: 'video' },
      { id: 'lesson-1-3', title: 'Forms & Input Elements', module: 'Module 1: HTML Basics', duration: '40 mins', type: 'video' },
      { id: 'lesson-1-4', title: 'HTML Best Practices', module: 'Module 1: HTML Basics', duration: '25 mins', type: 'document' },
      { id: 'lesson-1-5', title: 'HTML Quiz', module: 'Module 1: HTML Basics', duration: '15 mins', type: 'quiz' },
      { id: 'lesson-2-1', title: 'CSS Selectors', module: 'Module 2: CSS Styling', duration: '35 mins', type: 'video' },
      { id: 'lesson-2-2', title: 'Styling Text & Colors', module: 'Module 2: CSS Styling', duration: '40 mins', type: 'video' },
      { id: 'lesson-2-3', title: 'Box Model & Layout', module: 'Module 2: CSS Styling', duration: '50 mins', type: 'video' },
      { id: 'lesson-2-4', title: 'Flexbox Basics', module: 'Module 2: CSS Styling', duration: '45 mins', type: 'video' },
      { id: 'lesson-2-5', title: 'CSS Grid Introduction', module: 'Module 2: CSS Styling', duration: '40 mins', type: 'video' },
      { id: 'lesson-2-6', title: 'CSS Quiz', module: 'Module 2: CSS Styling', duration: '20 mins', type: 'quiz' },
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
      { id: 'lesson-1-1', title: 'Introduction to Advanced Hooks', module: 'Module 1', duration: '45 mins', type: 'video' },
      { id: 'lesson-1-2', title: 'useReducer & State Management', module: 'Module 1', duration: '50 mins', type: 'video' },
      { id: 'lesson-1-3', title: 'Custom Hooks Pattern', module: 'Module 1', duration: '60 mins', type: 'video' },
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
      { id: 'lesson-1-1', title: 'Python Basics', module: 'Module 1', duration: '45 mins', type: 'video' },
      { id: 'lesson-1-2', title: 'NumPy & Arrays', module: 'Module 1', duration: '50 mins', type: 'video' },
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
      { id: 'lesson-1-1', title: 'Design Fundamentals', module: 'Module 1', duration: '40 mins', type: 'video' },
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
      { id: 'lesson-1-1', title: 'AWS Fundamentals', module: 'Module 1', duration: '45 mins', type: 'video' },
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
      { id: 'lesson-1-1', title: 'ML Basics', module: 'Module 1', duration: '45 mins', type: 'video' },
    ],
  },
];

function getCourse(id: string) {
  return mockCourses.find(c => c.id === id) || null;
}

export default async function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = getCourse(id);

  if (!course) {
    notFound();
  }



  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href={`/courses/${id}`} className="mb-6 inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">Complete Your Enrollment</h1>

                <div className="space-y-8">
                  {/* Order Summary */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                    <div className="bg-muted p-6 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-foreground">Course: {course.title}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-border">
                        <span className="text-foreground">Price</span>
                        <span className="font-semibold text-foreground">${course.price}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-primary">${course.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">What&apos;s Included</h2>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Lifetime access to all course materials</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Downloadable course resources</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">30-day money-back guarantee</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Community forum access</span>
                      </li>
                    </ul>
                  </div>

                  {/* Payment */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Payment Method</h2>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-900 mb-4">
                      This is a demo enrollment flow. In production, this would integrate with Stripe or Flutterwave for payment processing.
                    </div>
                    <Button size="lg" className="w-full" asChild>
                      <Link href={`/learn/${id}`}>Start Learning Now</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-semibold text-foreground mb-4">{course.title}</h3>
                <div className="space-y-4 py-4 border-y border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-medium text-foreground">Expert Instructor</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-medium text-foreground capitalize">{course.level}</p>
                  </div>
                  {course.duration_weeks && (
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{course.duration_weeks} weeks</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

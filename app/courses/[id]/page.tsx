"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  Users,
  Award,
  Star,
  CheckCircle,
  MessageSquare,
  HelpCircle,
  Calendar,
  Zap,
  CheckCircle2,
  FileText,
  UserCheck,
  TrendingUp,
  PlayCircle,
  Trophy,
  History,
} from "lucide-react";

const mockCourses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description:
      "Learn HTML, CSS, and JavaScript from scratch. This comprehensive course will take you from beginner to intermediate level.",
    category: "Web Development",
    level: "Beginner",
    study_type: "Online",
    requirements: "No prior experience required.",
    certificate: "Certificate of completion",
    price: 49.99,
    discounted_price: 39.99,
    discount_percentage: 20,
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=400&fit=crop",
    rating: 4.0,
    students: 2540,
    duration: "8 weeks",
    instructor: "Sarah Johnson",
    instructor_bio:
      "Sarah is a senior web developer with 10+ years of experience.",
    learning_outcomes: [
      "HTML & CSS Fundamentals",
      "JavaScript Basics",
      "Responsive Design",
      "DOM Manipulation",
    ],
    who_should_learn:
      "Perfect for beginners with no prior coding experience who want to start their web development journey.",
    career_opportunities:
      "Upon completion, you'll be ready for junior front-end developer positions or freelance web development work.",
    market_growth:
      "Web development has a projected growth of 13% through 2032, making it one of the fastest-growing tech fields.",
    syllabus: [
      { title: "Module 1: HTML Basics", lessons: 5, duration: "2 hours" },
      { title: "Module 2: CSS Styling", lessons: 6, duration: "2.5 hours" },
      {
        title: "Module 3: JavaScript Fundamentals",
        lessons: 8,
        duration: "4 hours",
      },
      {
        title: "Module 4: Building Your First Website",
        lessons: 4,
        duration: "2 hours",
      },
    ],
    faqs: [
      {
        question: "Do I need prior coding experience?",
        answer: "No, this course is designed for complete beginners.",
      },
      {
        question: "Can I download the course materials?",
        answer: "Yes, all course materials are available for download.",
      },
      {
        question: "Is there a certificate?",
        answer: "Yes, you'll receive a certificate upon completion.",
      },
    ],
    learner_stories: [
      {
        name: "John Doe",
        role: "Junior Developer",
        story:
          "This course gave me the foundation I needed to land my first dev job!",
      },
      {
        name: "Jane Smith",
        role: "Freelancer",
        story:
          "I completed this course and started my freelance business within 3 months.",
      },
    ],
    certifications: [
      "Web Development Certificate",
      "HTML5 Certified",
      "CSS3 Certified",
    ],
    key_aspects: [
      "Full Online Course",
      "CPD Approved",
      "Employer Approved",
      "Fully Endorsed Course",
      "No Entry Requirements",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description:
      "Master advanced React concepts including hooks, context API, performance optimization, and custom patterns used in production apps.",
    category: "Web Development",
    level: "Advanced",
    study_type: "Online",
    requirements: "React fundamentals required.",
    certificate: "Advanced React certificate",
    price: 79.99,
    discounted_price: 63.99,
    discount_percentage: 20,
    image:
      "https://images.pexels.com/photos/3583447/pexels-photo-3583447.jpeg?w=800&h=400&fit=crop",
    rating: 4.9,
    students: 1820,
    duration: "10 weeks",
    instructor: "Mike Chen",
    instructor_bio:
      "Mike is a React expert and has built multiple production applications.",
    learning_outcomes: [
      "React Hooks",
      "Context API",
      "Performance Optimization",
      "State Management Patterns",
    ],
    who_should_learn:
      "Developers with solid React fundamentals who want to master advanced patterns and best practices.",
    career_opportunities:
      "Opens doors to senior front-end positions and technical lead roles at major tech companies.",
    market_growth:
      "React skills are in high demand, with an average salary increase of 25% for developers proficient in advanced patterns.",
    syllabus: [
      { title: "Module 1: Advanced Hooks", lessons: 7, duration: "3 hours" },
      {
        title: "Module 2: Context & Provider Patterns",
        lessons: 5,
        duration: "2 hours",
      },
      {
        title: "Module 3: Performance Optimization",
        lessons: 6,
        duration: "3 hours",
      },
      {
        title: "Module 4: Real-World Patterns",
        lessons: 8,
        duration: "4 hours",
      },
    ],
    faqs: [
      {
        question: "Do I need to know React basics?",
        answer: "Yes, basic React knowledge is required.",
      },
      {
        question: "Are there any projects?",
        answer: "Yes, includes 3 real-world projects.",
      },
      {
        question: "Lifetime access?",
        answer: "Yes, you get lifetime access to all course materials.",
      },
    ],
    learner_stories: [
      {
        name: "Alex Johnson",
        role: "Senior React Developer",
        story: "This course elevated my React skills to the next level!",
      },
      {
        name: "Maria Garcia",
        role: "Tech Lead",
        story:
          "The patterns I learned are exactly what our production team needed.",
      },
    ],
    certifications: [
      "Advanced React Certificate",
      "React Patterns Certified",
      "Performance Expert Badge",
    ],
    key_aspects: [
      "Full Online Course",
      "CPD Approved",
      "Employer Approved",
      "Fully Endorsed Course",
      "No Entry Requirements",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
  {
    id: "3",
    title: "Data Science Essentials",
    description:
      "Introduction to Python, pandas, and data visualization. Learn the fundamentals of data analysis.",
    category: "Data Science",
    level: "Beginner",
    study_type: "Hybrid",
    requirements: "Basic computer skills.",
    certificate: "Data Science certificate",
    price: 59.99,
    discounted_price: 47.99,
    discount_percentage: 20,
    image:
      "https://images.pexels.com/photos/3182751/pexels-photo-3182751.jpeg?w=800&h=400&fit=crop",
    rating: 4.7,
    students: 3200,
    duration: "12 weeks",
    instructor: "Dr. Emily Rodriguez",
    instructor_bio:
      "Dr. Rodriguez has a PhD in Data Science and 8 years of industry experience.",
    learning_outcomes: [
      "Python Programming",
      "Data Analysis with Pandas",
      "Data Visualization",
      "Statistical Concepts",
    ],
    who_should_learn:
      "Anyone interested in data science, analytics, or business intelligence with basic computer skills.",
    career_opportunities:
      "Qualify for junior data analyst, data scientist, or business analyst positions.",
    market_growth:
      "Data science roles are growing 36% faster than average, with median salaries over $120,000.",
    syllabus: [
      { title: "Module 1: Python Basics", lessons: 8, duration: "3 hours" },
      {
        title: "Module 2: Pandas & Data Manipulation",
        lessons: 7,
        duration: "3 hours",
      },
      {
        title: "Module 3: Data Visualization",
        lessons: 6,
        duration: "2 hours",
      },
      {
        title: "Module 4: Statistical Analysis",
        lessons: 5,
        duration: "2 hours",
      },
    ],
    faqs: [
      {
        question: "Do I need math background?",
        answer: "Basic math understanding helps but we teach what you need.",
      },
      {
        question: "What tools will I learn?",
        answer: "Python, Pandas, Matplotlib, and Jupyter Notebooks.",
      },
      {
        question: "Job placement?",
        answer: "We offer job placement assistance for top performers.",
      },
    ],
    learner_stories: [
      {
        name: "Robert Lee",
        role: "Data Analyst",
        story: "Transitioned from finance to data science with this course!",
      },
      {
        name: "Sarah Wilson",
        role: "Business Analyst",
        story: "Now I can build dashboards and analyze data like a pro.",
      },
    ],
    certifications: [
      "Data Science Certificate",
      "Python Certified",
      "Analytics Professional Badge",
    ],
    key_aspects: [
      "Full Online Course",
      "CPD Approved",
      "Employer Approved",
      "Fully Endorsed Course",
      "No Entry Requirements",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
  {
    id: "4",
    title: "UX/UI Design Bootcamp",
    description:
      "Learn design principles, Figma, and user research. A practical bootcamp for aspiring designers.",
    category: "Design",
    level: "Intermediate",
    study_type: "In-person",
    requirements: "Basic design skills.",
    certificate: "UX/UI Design badge",
    price: 69.99,
    discounted_price: 55.99,
    discount_percentage: 20,
    image:
      "https://images.pexels.com/photos/3150150/pexels-photo-3150150.jpeg?w=800&h=400&fit=crop",
    rating: 4.6,
    students: 1540,
    duration: "10 weeks",
    instructor: "Alex Kim",
    instructor_bio:
      "Alex is a design director with 12 years of experience at leading tech companies.",
    learning_outcomes: [
      "Design Principles",
      "Figma Mastery",
      "User Research",
      "Prototyping & Testing",
    ],
    who_should_learn:
      "Aspiring designers, product managers, and anyone interested in creating beautiful user experiences.",
    career_opportunities:
      "Qualify for UX/UI designer, product designer, or design researcher roles.",
    market_growth:
      "UX/UI design demand is growing 17% annually with average salaries of $95,000-$130,000.",
    syllabus: [
      {
        title: "Module 1: Design Fundamentals",
        lessons: 6,
        duration: "2 hours",
      },
      { title: "Module 2: Figma Mastery", lessons: 8, duration: "3 hours" },
      { title: "Module 3: User Research", lessons: 5, duration: "2 hours" },
      {
        title: "Module 4: Portfolio Building",
        lessons: 4,
        duration: "2 hours",
      },
    ],
    faqs: [
      {
        question: "Do I need design experience?",
        answer: "No, this bootcamp welcomes beginners.",
      },
      {
        question: "Do you provide design tools?",
        answer: "Yes, Figma account and all assets provided.",
      },
      {
        question: "Portfolio building included?",
        answer: "Yes, we help you build a professional portfolio.",
      },
    ],
    learner_stories: [
      {
        name: "Emma Davis",
        role: "UX Designer",
        story: "Built my portfolio during the course and landed a dream job!",
      },
      {
        name: "James Wilson",
        role: "Product Designer",
        story: "The user research skills were game-changing for my career.",
      },
    ],
    certifications: [
      "UX/UI Design Certificate",
      "Figma Certified",
      "Research Methods Badge",
    ],
    key_aspects: [
      "Full Online Course",
      "CPD Approved",
      "Employer Approved",
      "Fully Endorsed Course",
      "No Entry Requirements",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
  {
    id: "5",
    title: "Cloud Architecture with AWS",
    description:
      "Deploy and manage applications on AWS. Learn cloud architecture best practices.",
    category: "Cloud",
    level: "Intermediate",
    study_type: "Online",
    requirements: "Some cloud or dev experience helpful.",
    certificate: "AWS architecture certificate",
    price: 89.99,
    discounted_price: 71.99,
    discount_percentage: 20,
    image:
      "https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?w=800&h=400&fit=crop",
    rating: 4.8,
    students: 2100,
    duration: "12 weeks",
    instructor: "James Park",
    instructor_bio:
      "James is an AWS Solutions Architect with 9 years of cloud experience.",
    learning_outcomes: [
      "AWS Core Services",
      "Cloud Architecture",
      "Scalability & Security",
      "Cost Optimization",
    ],
    who_should_learn:
      "DevOps engineers, backend developers, and architects wanting to master AWS.",
    career_opportunities:
      "AWS certified professionals earn 20-30% more than non-certified peers.",
    market_growth:
      "Cloud engineering roles are growing 35% annually with critical talent shortage.",
    syllabus: [
      { title: "Module 1: AWS Fundamentals", lessons: 8, duration: "3 hours" },
      { title: "Module 2: Core Services", lessons: 10, duration: "4 hours" },
      {
        title: "Module 3: Architecture Best Practices",
        lessons: 7,
        duration: "3 hours",
      },
      {
        title: "Module 4: Real-World Scenarios",
        lessons: 6,
        duration: "3 hours",
      },
    ],
    faqs: [
      {
        question: "Do I need cloud experience?",
        answer: "Some infrastructure knowledge helps but not required.",
      },
      {
        question: "Does this prepare for AWS certification?",
        answer: "Yes, prepares for Solutions Architect Associate.",
      },
      {
        question: "Free AWS credits?",
        answer: "Yes, $100 in free AWS credits included.",
      },
    ],
    learner_stories: [
      {
        name: "Michael Chang",
        role: "Solutions Architect",
        story: "This course was the key to my AWS certification and promotion!",
      },
      {
        name: "Lisa Anderson",
        role: "Cloud Engineer",
        story: "Built my first production deployment with confidence.",
      },
    ],
    certifications: [
      "AWS Cloud Certificate",
      "AWS Solutions Architect Ready",
      "Cloud Expert Badge",
    ],
    key_aspects: [
      "Full Online Course",
      "CPD Approved",
      "Employer Approved",
      "Fully Endorsed Course",
      "No Entry Requirements",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
  {
    id: "6",
    title: "Machine Learning Fundamentals",
    description:
      "Build your first ML models with scikit-learn. A practical introduction to machine learning.",
    category: "Data Science",
    level: "Intermediate",
    study_type: "Hybrid",
    requirements: "Familiarity with Python recommended.",
    discounted_price: 79.99,
    discount_percentage: 20,
    certificate: "Machine Learning fundamentals certificate",
    price: 99.99,
    image:
      "https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=800&h=400&fit=crop",
    rating: 4.9,
    students: 2800,
    duration: "14 weeks",
    instructor: "Prof. David Lee",
    instructor_bio:
      "Prof. Lee has a PhD in Machine Learning and published 20+ research papers.",
    learning_outcomes: [
      "ML Fundamentals",
      "Supervised Learning",
      "Unsupervised Learning",
      "Model Evaluation",
    ],
    who_should_learn:
      "Data scientists, engineers, and analysts ready to build ML models.",
    career_opportunities:
      "ML engineers earn 30-50% more than average software engineers.",
    market_growth:
      "ML job postings increased 74% in the last year, with massive demand.",
    syllabus: [
      { title: "Module 1: ML Basics", lessons: 6, duration: "2 hours" },
      {
        title: "Module 2: Supervised Learning",
        lessons: 9,
        duration: "4 hours",
      },
      {
        title: "Module 3: Unsupervised Learning",
        lessons: 7,
        duration: "3 hours",
      },
      { title: "Module 4: Production ML", lessons: 8, duration: "4 hours" },
    ],
    faqs: [
      {
        question: "Math prerequisites?",
        answer: "We cover the math you need in the course.",
      },
      {
        question: "Real-world projects?",
        answer: "Yes, 5 real-world ML projects included.",
      },
      {
        question: "Career support?",
        answer: "Yes, includes career mentoring and networking.",
      },
    ],
    learner_stories: [
      {
        name: "David Zhang",
        role: "ML Engineer",
        story: "Moved from data analyst to ML engineer thanks to this course.",
      },
      {
        name: "Sophie Martin",
        role: "AI Researcher",
        story: "The foundation here led to my PhD in ML.",
      },
    ],
    certifications: [
      "ML Certificate",
      "Scikit-learn Expert",
      "Data Science Master Badge",
    ],
    key_aspects: [
      "Full Online Course",
      "CPD Approved",
      "Employer Approved",
      "Fully Endorsed Course",
      "No Entry Requirements",
      "Boost Your Resume",
      "Own Pace Study",
      "Premium Course Material",
      "Completion Certificate",
    ],
  },
];

function getCourse(id: string) {
  return mockCourses.find((c) => c.id === id) || null;
}

function renderRatingStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(100, (rating - index) * 100));

        return (
          <span key={index} className="relative inline-block">
            <Star className="h-5 w-5 text-muted-foreground" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden text-yellow-400"
              style={{ width: `${fill}%` }}
            >
              <Star className="h-5 w-5" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

const TABS = [
  "overview",
  "syllabus",
  "certifications",
  "stories",
  "faq",
] as const;

// Helper function to pick an icon based on the text content
const getAspectIcon = (text: string) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("certificate") || lowerText.includes("endorsed"))
    return <Trophy className="h-4 w-4" />;
  if (lowerText.includes("pace")) return <History className="h-4 w-4" />;
  if (lowerText.includes("approved")) return <UserCheck className="h-4 w-4" />;
  if (lowerText.includes("resume") || lowerText.includes("boost"))
    return <TrendingUp className="h-4 w-4" />;
  if (lowerText.includes("material")) return <FileText className="h-4 w-4" />;
  if (lowerText.includes("online")) return <PlayCircle className="h-4 w-4" />;
  return <Zap className="h-4 w-4" />; // Default icon
};

export default function CoursePage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const id = (params?.id as string) || "";
  const course = getCourse(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let currentSection = "overview";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          currentSection = section.getAttribute("data-section") || "overview";
        }
      });

      if (TABS.includes(currentSection as any)) {
        setActiveTab(currentSection as (typeof TABS)[number]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    setEnrollmentError(null);
    
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      });

      if (res.ok) {
        alert(
          "Successfully enrolled! Head to your dashboard to start learning.",
        );
      } else {
        const errorData = await res.json();
        if (res.status === 401) {
          setEnrollmentError("Please sign in to enroll in this course.");
        } else if (res.status === 400) {
          setEnrollmentError(errorData.error || "Unable to enroll. Please try again.");
        } else {
          setEnrollmentError("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      setEnrollmentError("An error occurred. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Course Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              The course you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </Card>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Hero Section */}
            <div className="relative min-h-[28rem] w-full overflow-hidden rounded-2xl bg-muted">
              <div className="relative inset-0 bg-black/30" />
              <div className="relative w-full overflow-hidden bg-muted">
                <div className="bg-black/30 p-8 sm:p-12">
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-sm text-white/75">
                      <Link href="/" className="hover:text-white">
                        Home
                      </Link>
                      <span className="mx-2">›</span>
                      <span>{course.category}</span>
                      <span className="mx-2">›</span>
                      <span className="font-semibold text-white">
                        {course.title}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-5xl font-bold text-white">
                        {course.title}
                      </h1>
                      {/* <p className="max-w-3xl text-lg text-white/90">
                        {course.description}
                      </p> */}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-16 text-white">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold rounded bg-yellow-400 text-white px-2 py-1">
                          {course.rating.toFixed(1)}
                        </span>
                        {renderRatingStars(course.rating)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <Users className="h-5 w-5" />
                        {course.students.toLocaleString()} students
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/90">
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/70 mb-2">
                          Duration
                        </p>
                        <p className="font-semibold text-white">
                          {course.duration}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/70 mb-2">
                          Type
                        </p>
                        <p className="font-semibold text-white">
                          {course.study_type}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/70 mb-2">
                          Requirements
                        </p>
                        <p className="font-semibold text-white">
                          {course.requirements}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/70 mb-2">
                          Certificate
                        </p>
                        <p className="font-semibold text-white">
                          {course.certificate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Tab Navigation */}
            <div className="sticky top-0 bg-background border-b border-border z-40">
              <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <div className="flex overflow-x-auto gap-1 sm:gap-4">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        const section = document.querySelector(
                          `[data-section="${tab}"]`,
                        );
                        section?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`px-4 py-4 font-medium transition-colors whitespace-nowrap border-b-2 ${
                        activeTab === tab
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Outcomes Section */}
            <section data-section="overview" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                What You&apos;ll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.learning_outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Who Should Learn */}
            <section className="bg-muted rounded-lg p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Who Should Learn This Course?
              </h3>
              <p className="text-foreground">{course.who_should_learn}</p>
            </section>

            {/* Syllabus */}
            <section data-section="syllabus" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Syllabus
              </h2>
              <div className="space-y-4">
                {course.syllabus.map((module, idx) => (
                  <Card key={idx} className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">
                      {module.title}
                    </h4>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{module.lessons} lessons</span>
                      <span>{module.duration}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Career Opportunities */}
            <section className="bg-primary/10 rounded-lg p-8 border border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Career Opportunities
              </h3>
              <p className="text-foreground">{course.career_opportunities}</p>
            </section>

            {/* Market Growth */}
            <section className="bg-muted rounded-lg p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Future Market Growth
              </h3>
              <p className="text-foreground">{course.market_growth}</p>
            </section>

            {/* Certifications */}
            <section data-section="certifications" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Certifications
              </h2>
              <div className="space-y-3">
                {course.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Learner Stories */}
            <section data-section="stories" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Learner Stories
              </h2>
              <div className="space-y-6">
                {course.learner_stories.map((story, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start gap-4">
                      <MessageSquare className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-foreground mb-3 italic">
                          &quot;{story.story}&quot;
                        </p>
                        <div>
                          <p className="font-semibold text-foreground">
                            {story.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {story.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section data-section="faq" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {course.faqs.map((faq, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start gap-4">
                      <HelpCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6 h-fit">
              {/* First Card: Pricing & CTA */}
              <Card className="p-8 space-y-6 shadow-sm">
                <h3 className="text-xl font-bold text-foreground">
                  Full Course
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-primary">
                      ${course.discounted_price}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${course.price}
                    </span>
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">
                      {course.discount_percentage}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderRatingStars(course.rating)}
                    <span className="text-sm font-semibold">
                      ({course.rating.toFixed(1)})
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  size="lg"
                  className="w-full cursor-pointer hover:shadow-lg transition-all text-base font-bold"
                >
                  {isEnrolling ? "Enrolling..." : "Enroll in Course"}
                </Button>
                {enrollmentError && (
                  <p className="text-sm text-red-600 text-center">{enrollmentError}</p>
                )}

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Course Includes:
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Users className="h-4 w-4" />
                      </div>
                      <span>{course.study_type} Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span>{course.duration} total duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span>Study at your own pace</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Award className="h-4 w-4" />
                      </div>
                      <span>{course.certificate}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Second Card: Key Aspects */}
              <Card>
                <h3 className="text-xl px-8 py-6 font-bold text-foreground bg-muted rounded-t-xl">
                  Key Aspects
                </h3>
                <div className="grid grid-cols-1 overflow-hidden border border-border">
                  {course.key_aspects.map((aspect, idx) => (
                    <div
                      key={idx}
                      className={`
                         flex items-center gap-3 px-8 py-5 text-sm transition-colors
                         even:bg-muted/50 odd:bg-background hover:bg-primary/5
                       `}
                    >
                      <div className="text-primary shrink-0">
                        {getAspectIcon(aspect)}
                      </div>
                      <span className="font-medium text-foreground/90">
                        {aspect}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-16 px-8 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                      SPECIAL OFFER
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ${course.discounted_price}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${course.price}
                    </span>
                  </div>
                  <div className="flex justify-center gap-2 py-4">
                    {/* Payment methods - using text for simplicity */}
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      Visa
                    </span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      Mastercard
                    </span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      PayPal
                    </span>
                  </div>
                  <div className="flex items-center gap-2 py-4">
                    <Button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      size="lg"
                      className="w-full cursor-pointer hover:shadow-lg transition-all py-8"
                    >
                      {isEnrolling ? "Enrolling..." : "Enroll in Course"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, Award, Globe, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'About Us - Loyal Academy',
  description: 'Learn about Loyal Academy mission and values',
};

async function getStats() {
  const coursesCount = await prisma.course.count({ where: { published: true } });
  
  const enrollmentsAgg = await prisma.course.aggregate({
    _sum: { studentNumber: true }
  });
  const enrollmentsCount = enrollmentsAgg._sum.studentNumber || 0;
  
  return {
    courses: coursesCount,
    students: Math.floor(enrollmentsCount * 0.8) || 0,
    instructors: 50, // mock
    satisfaction: 95, // mock
  };
}

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Glassmorphism Style */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?w=1920&h=1080&fit=crop"
            alt="Students collaborating"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Story</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              About <span className="text-primary">Loyal Academy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering learners worldwide with quality education, expert instruction, and practical skills for the modern workforce.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                At Loyal Academy, we believe education is the foundation of personal and professional growth. Our mission is to make quality learning accessible to everyone, everywhere.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We partner with industry experts and educators to deliver courses that are not just comprehensive, but also engaging, practical, and immediately applicable to real-world challenges.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Accessible quality education for all</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Expert-led instruction from industry professionals</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Practical, career-focused learning paths</span>
                </li>
              </ul>
            </div>
            <Card className="p-8 bg-primary/10">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Values</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="font-semibold text-foreground mb-1">Excellence</h4>
                  <p className="text-sm text-muted-foreground">We are committed to delivering the highest quality content and learning experiences.</p>
                </li>
                <li>
                  <h4 className="font-semibold text-foreground mb-1">Accessibility</h4>
                  <p className="text-sm text-muted-foreground">Education should be available to everyone, regardless of background or location.</p>
                </li>
                <li>
                  <h4 className="font-semibold text-foreground mb-1">Innovation</h4>
                  <p className="text-sm text-muted-foreground">We continuously evolve our platform to provide the best learning experience.</p>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Card className="p-8 backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">{stats.courses}+</div>
                <p className="font-medium text-muted-foreground">Expert Courses</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">{stats.students}+</div>
                <p className="font-medium text-muted-foreground">Active Learners</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">{stats.instructors}+</div>
                <p className="font-medium text-muted-foreground">Expert Instructors</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">{stats.satisfaction}%</div>
                <p className="font-medium text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose Loyal Academy?</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Card className="p-6">
              <Globe className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Global Learning Community</h3>
              <p className="text-sm text-muted-foreground">Connect with learners and professionals from around the world.</p>
            </Card>
            <Card className="p-6">
              <Award className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Recognized Certifications</h3>
              <p className="text-sm text-muted-foreground">Earn certificates that are respected by employers worldwide.</p>
            </Card>
            <Card className="p-6">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Dedicated Support</h3>
              <p className="text-sm text-muted-foreground">Get help when you need it with our responsive support team.</p>
            </Card>
            <Card className="p-6">
              <CheckCircle className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Lifetime Access</h3>
              <p className="text-sm text-muted-foreground">Get lifetime access to course materials and future updates.</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

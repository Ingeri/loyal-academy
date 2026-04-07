import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, Award, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Us - Loyal Academy',
  description: 'Learn about Loyal Academy mission and values',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Loyal Academy</h1>
          <p className="text-lg text-muted-foreground">
            Empowering learners worldwide with quality education and expert instruction
          </p>
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
      <section className="bg-card border-y px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Expert Courses</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <p className="text-muted-foreground">Active Learners</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Expert Instructors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
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

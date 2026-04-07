import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

async function getCourse(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  return data;
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const course = await getCourse(id);
  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href={`/enroll/${id}`} className="mb-6 inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to enrollment
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

                {/* Stripe Placeholder */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
                  <p className="text-blue-900 font-medium mb-2">Payment Processing</p>
                  <p className="text-blue-800 text-sm">
                    This is a demo checkout page. In production, this would integrate with Stripe or Flutterwave for secure payment processing.
                  </p>
                  <p className="text-blue-800 text-sm mt-2">
                    To complete the integration, add your payment provider&apos;s API keys to your environment variables.
                  </p>
                </div>

                {/* Mock Checkout Form */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email || ''}
                      disabled
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="card" className="block text-sm font-medium text-foreground mb-2">
                      Card Number
                    </label>
                    <Input
                      id="card"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Use test card: 4242 4242 4242 4242</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date
                      </label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-foreground mb-2">
                        CVC
                      </label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Cardholder Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Full Name"
                    />
                  </div>

                  <Button size="lg" className="w-full" disabled>
                    Complete Payment - ${course.price.toFixed(2)}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h2 className="font-semibold text-foreground mb-6">Order Summary</h2>

                {course.image_url && (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{course.description}</p>

                <div className="space-y-3 py-6 border-y border-border">
                  <div className="flex justify-between">
                    <span className="text-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">${course.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Tax (0%)</span>
                    <span className="font-medium text-foreground">$0.00</span>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-primary">${course.price.toFixed(2)}</span>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  30-day money-back guarantee
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

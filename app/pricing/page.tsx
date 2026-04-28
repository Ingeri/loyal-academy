import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

const plans = [
  {
    name: 'Free',
    description: 'Get started with the basics',
    price: { monthly: 0, yearly: 0 },
    icon: Sparkles,
    features: [
      'Access to 5 free courses',
      'Basic progress tracking',
      'Community support',
      'Certificate of completion',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For serious learners',
    price: { monthly: 29, yearly: 290 },
    icon: Zap,
    features: [
      'Access to all 500+ courses',
      'Premium certificates',
      'Downloadable resources',
      'Priority support',
      'Offline mobile access',
      'Course recommendations',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: { monthly: 99, yearly: 990 },
    icon: Building2,
    features: [
      'Everything in Pro',
      'Team management dashboard',
      'Custom learning paths',
      'SSO & advanced security',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee. If you are not satisfied, contact us for a full refund.',
  },
  {
    question: 'Can I switch between monthly and yearly billing?',
    answer: 'Yes, you can switch your billing cycle at any time. Changes will take effect at your next billing date.',
  },
  {
    question: 'Is there a discount for students?',
    answer: 'Yes! Students with a valid .edu email address get 50% off any paid plan.',
  },
];

export const metadata = {
  title: 'Pricing - Loyal Academy',
  description: 'Choose the perfect plan for your learning journey',
};

export default function PricingPage() {
  return (
    <main className='min-h-screen bg-background'>
      <Navigation />

      {/* Hero */}
      <section className='px-4 py-20 sm:px-6 lg:px-8 text-center'>
        <div className='mx-auto max-w-3xl'>
          <h1 className='text-4xl font-bold text-foreground sm:text-5xl'>
            Simple, transparent pricing
          </h1>
          <p className='mt-4 text-xl text-muted-foreground'>
            Choose the perfect plan for your learning journey. All plans include a 30-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className='px-4 pb-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={'p-8 relative'}
                >
                  {plan.popular && (
                    <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                      <span className='bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full'>
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className='text-center mb-6'>
                    <div className='h-12 w-12 mx-auto rounded-xl flex items-center justify-center mb-4'>
                      <Icon className='h-6 w-6' />
                    </div>
                    <h3 className='text-2xl font-bold text-foreground'>{plan.name}</h3>
                    <p className='text-muted-foreground mt-1'>{plan.description}</p>
                  </div>

                  <div className='text-center mb-6'>
                    <span className='text-4xl font-bold text-foreground'></span>
                    <span className='text-muted-foreground'>/month</span>
                    {plan.price.yearly > 0 && (
                      <p className='text-sm text-muted-foreground mt-1'>
                        or /year (save 17%)
                      </p>
                    )}
                  </div>

                  <ul className='space-y-3 mb-8'>
                    {plan.features.map((feature) => (
                      <li key={feature} className='flex items-start gap-3'>
                        <Check className='h-5 w-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span className='text-sm text-muted-foreground'>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/checkout'}>
                    <Button
                      className='w-full'
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='bg-muted/50 px-4 py-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl'>
          <h2 className='text-3xl font-bold text-center text-foreground mb-12'>
            Frequently Asked Questions
          </h2>
          <div className='space-y-6'>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className='font-semibold text-foreground mb-2'>{faq.question}</h3>
                <p className='text-muted-foreground'>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='px-4 py-20 sm:px-6 lg:px-8 text-center'>
        <div className='mx-auto max-w-2xl'>
          <h2 className='text-3xl font-bold text-foreground mb-4'>
            Still have questions?
          </h2>
          <p className='text-muted-foreground mb-8'>
            Our team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <Link href='/contact'>
            <Button size='lg'>Contact Support</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}


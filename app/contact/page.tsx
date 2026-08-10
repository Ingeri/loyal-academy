'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: submitError } = await supabase
        .from('contact_messages')
        .insert([formData])

      if (submitError) throw submitError

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] pt-20">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center px-4 py-28 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/contact-hero-bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#07152d]/90 via-[#07152d]/75 to-[#07152d]/70" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white/10 px-5 py-2 backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#d4af37]" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
              Get in Touch
            </span>
          </div>

          <h1 className="font-serif text-5xl font-bold tracking-tight text-white md:text-7xl">
            Contact <span className="italic text-[#d4af37]">Us</span>
          </h1>

          <div className="mx-auto my-8 flex max-w-md items-center justify-center gap-4">
            <span className="h-px flex-1 bg-[#d4af37]" />
            <span className="h-3 w-3 rotate-45 bg-[#d4af37]" />
            <span className="h-px flex-1 bg-[#d4af37]" />
          </div>

          <p className="mx-auto max-w-3xl text-xl leading-9 text-white/90">
            We would be delighted to connect with you. Whether you are looking to partner with us, enroll in a program, hire talent, or learn more about our services, LLI is ready to support your leadership and development journey.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card className="rounded-3xl bg-white p-6 shadow-lg">
                  <Mail className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="mb-2 font-serif text-xl font-bold text-primary">
                    Email Us
                  </h3>
                  <a
                    href="mailto:info@loyalleadershipinstitute.org"
                    className="text-muted-foreground transition hover:text-accent"
                  >
                    info@loyalleadershipinstitute.org
                  </a>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We will respond within 24 hours.
                  </p>
                </Card>

                <Card className="rounded-3xl bg-white p-6 shadow-lg">
                  <Phone className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="mb-2 font-serif text-xl font-bold text-primary">
                    Call Us
                  </h3>
                  <a
                    href="tel:+250000000000"
                    className="text-muted-foreground transition hover:text-accent"
                  >
                    +250 000 000 000
                  </a>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Monday - Friday, 9:00 AM - 6:00 PM.
                  </p>
                </Card>

                <Card className="rounded-3xl bg-white p-6 shadow-lg">
                  <MapPin className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="mb-2 font-serif text-xl font-bold text-primary">
                    Visit Us
                  </h3>
                  <p className="text-muted-foreground">
                    Kigali, Rwanda
                    <br />
                    Coordinates: -1.96445, 30.11099
                  </p>
                </Card>

                <Card className="rounded-3xl bg-white p-6 shadow-lg">
                  <Clock className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="mb-2 font-serif text-xl font-bold text-primary">
                    Opening Hours
                  </h3>
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex justify-between gap-4">
                      <span>Mon - Fri:</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="rounded-3xl bg-white p-8 shadow-xl">
                <div className="mb-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                    Send a Message
                  </p>
                  <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
                    How can we help you?
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Fill in the form below and our team will get back to you as
                    soon as possible.
                  </p>
                </div>

                {submitted && (
                  <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-800">
                    Thank you! Your message has been sent successfully. We will
                    get back to you soon.
                  </div>
                )}

                {error && (
                  <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-800">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-primary"
                      >
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-primary"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-primary"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-primary"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <Card className="overflow-hidden rounded-3xl bg-white p-2 shadow-xl">
              <div className="relative h-[450px] w-full overflow-hidden rounded-2xl">
                <iframe
                  src="https://www.google.com/maps?q=-1.96445,30.11099&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="LOYAL Leadership Institute Location"
                  className="absolute inset-0"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
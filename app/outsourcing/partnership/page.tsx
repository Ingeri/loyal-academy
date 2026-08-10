import Link from 'next/link'
import {
    ArrowRight,
    Building2,
    Handshake,
    Mail,
    Phone,
    Users,
    Target,
    CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const metadata = {
    title: 'Partnership Inquiry - LOYAL Leadership Institute',
    description:
        'Submit a partnership inquiry to collaborate with LOYAL Leadership Institute.',
}

export default function PartnershipInquiryPage() {
    return (
        <main className="min-h-screen bg-[#faf8f3] pt-20">
            {/* HERO */}
            <section
                className="relative overflow-hidden bg-cover bg-center px-4 py-32 sm:px-6 lg:px-8 lg:py-40"
                style={{
                    backgroundImage: "url('/hero-out-bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative z-10 mx-auto max-w-5xl text-center">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#d4af37]">
                        Partnership Inquiry
                    </p>

                    <h1 className="font-serif text-5xl font-bold text-white md:text-7xl">
                        Build Strategic{' '}
                        <span className="italic text-[#d4af37]">Partnerships</span>
                    </h1>

                    <div className="mx-auto my-8 h-1 w-28 rounded-full bg-[#d4af37]" />

                    <p className="mx-auto max-w-3xl text-xl leading-9 text-white/90">
                        Join hands with LOYAL Leadership Institute to create meaningful
                        educational programmes, leadership initiatives, corporate training,
                        youth empowerment projects, and sustainable institutional impact.
                    </p>

                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <a href="#partnership-form">
                            <Button
                                size="lg"
                                className="rounded-xl bg-[#d4af37] px-8 py-6 text-base font-bold text-primary hover:bg-[#e7c454]"
                            >
                                Submit Inquiry
                            </Button>
                        </a>

                        <a href="#partnership-benefits">
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-xl border-white bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur hover:bg-white hover:text-primary"
                            >
                                Learn More
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* WHY PARTNER */}
            <section
                id="partnership-benefits"
                className="px-4 py-16 sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                            Why Partner With LLI
                        </p>

                        <h2 className="font-serif text-4xl font-bold text-primary">
                            Building Impact Through{' '}
                            <span className="italic text-accent">Collaboration</span>
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: Target,
                                title: 'Shared Impact',
                                text: 'Work with us to empower young people, professionals, schools, universities, and institutions.',
                            },
                            {
                                icon: Users,
                                title: 'Skilled Talent Network',
                                text: 'Access trained learners, graduates, mentors, facilitators, and leadership professionals.',
                            },
                            {
                                icon: Building2,
                                title: 'Institutional Growth',
                                text: 'Develop strategic programmes that strengthen organisations, teams, and communities.',
                            },
                        ].map((item) => (
                            <Card
                                key={item.title}
                                className="rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <item.icon className="mb-5 h-10 w-10 text-accent" />
                                <h3 className="mb-3 font-serif text-2xl font-bold text-primary">
                                    {item.title}
                                </h3>
                                <p className="leading-7 text-slate-700">{item.text}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section
                id="partnership-form"
                className="bg-white px-4 py-16 sm:px-6 lg:px-8"
            >
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                            Get Started
                        </p>

                        <h2 className="font-serif text-4xl font-bold text-primary">
                            Submit Your{' '}
                            <span className="italic text-accent">Inquiry</span>
                        </h2>

                        <p className="mt-5 leading-8 text-slate-700">
                            Tell us about your organisation, the type of partnership you are
                            seeking, and how we can work together.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-slate-700">
                                <Mail className="h-5 w-5 text-accent" />
                                info@loyalleadershipinstitute.org
                            </div>

                            <div className="flex items-center gap-3 text-slate-700">
                                <Phone className="h-5 w-5 text-accent" />
                                +250 000 000 000
                            </div>
                        </div>
                    </div>

                    <Card className="rounded-3xl bg-[#faf8f3] p-8 shadow-xl lg:col-span-2">
                        <form className="space-y-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-primary">
                                        Full Name
                                    </label>
                                    <Input placeholder="Your full name" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-primary">
                                        Email Address
                                    </label>
                                    <Input type="email" placeholder="your@email.com" />
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-primary">
                                        Organisation
                                    </label>
                                    <Input placeholder="Company / Institution name" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-primary">
                                        Phone Number
                                    </label>
                                    <Input placeholder="+250..." />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-primary">
                                    Partnership Type
                                </label>
                                <select className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm">
                                    <option>Training Partnership</option>
                                    <option>Content Creation Partnership</option>
                                    <option>Corporate Training</option>
                                    <option>University / School Partnership</option>
                                    <option>NGO / Development Partnership</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-primary">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Tell us about the partnership you are proposing..."
                                    className="min-h-[170px] w-full rounded-md border border-input bg-background px-3 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>

                            <Button className="w-full rounded-xl py-6 text-base font-bold">
                                Submit Partnership Inquiry
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    </Card>
                </div>
            </section>

            {/* PROCESS */}
            <section className="px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl text-center">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                        What Happens Next
                    </p>

                    <h2 className="font-serif text-4xl font-bold text-primary">
                        Simple Partnership{' '}
                        <span className="italic text-accent">Process</span>
                    </h2>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {[
                            'We review your inquiry and understand your goals.',
                            'Our team contacts you for a strategic discussion.',
                            'We design a partnership plan and begin implementation.',
                        ].map((text, index) => (
                            <Card key={text} className="rounded-3xl bg-white p-8 shadow-lg">
                                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-accent">
                                    {index + 1}
                                </div>
                                <p className="leading-7 text-slate-700">{text}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {/* CTA */}
            <section
                className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: "url('/learn-bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative z-10 mx-auto max-w-5xl text-center">
                    <CheckCircle className="mx-auto mb-6 h-14 w-14 text-[#d4af37]" />

                    <h2 className="font-serif text-5xl font-bold text-white">
                        Let's Build Something{" "}
                        <span className="italic text-[#d4af37]">
                            Meaningful
                        </span>{" "}
                        Together
                    </h2>

                    <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-white/90">
                        We welcome universities, companies, government institutions,
                        development partners, NGOs and organizations that share our vision
                        of developing ethical leaders and transforming communities through
                        education and professional excellence.
                    </p>

                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            className="rounded-xl bg-[#d4af37] px-8 py-6 text-base font-bold text-primary hover:bg-[#e7c454]"
                        >
                            <Link href="/contact">
                                Contact Us
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl border-white bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur hover:bg-white hover:text-primary"
                        >
                            <Link href="/about">
                                Learn More
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
import Image from 'next/image'
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  GraduationCap,
  Globe,
  Handshake,
  Heart,
  Lightbulb,
  Linkedin,
  Plus,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  Users,
} from 'lucide-react'

const sectionLabel =
  'mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent'

const heroStats = [
  { icon: GraduationCap, number: '10,000+', label: 'Learners Inspired' },
  { icon: BookOpen, number: '250+', label: 'Courses Delivered' },
  { icon: Users, number: '95%', label: 'Satisfaction Rate' },
  { icon: Handshake, number: '20+', label: 'Institutional Partners' },
  { icon: Globe, number: '15+', label: 'Countries Reached' },
]

const coreValues = [
  { icon: ShieldCheck, title: 'Integrity', text: 'We are honest, transparent, and principled in everything we do.' },
  { icon: Star, title: 'Excellence', text: 'We deliver high quality learning and exceptional experiences.' },
  { icon: Lightbulb, title: 'Innovation', text: 'We embrace new ideas and creative solutions to real world challenges.' },
  { icon: Users, title: 'Leadership', text: 'We develop leaders who inspire and empower others.' },
  { icon: Heart, title: 'Service', text: 'We are committed to serving our learners and communities.' },
  { icon: BookOpen, title: 'Lifelong Learning', text: 'We cultivate a culture of continuous growth and self-improvement.' },
  { icon: Handshake, title: 'Collaboration', text: 'We believe in the power of teamwork and meaningful partnerships.' },
  { icon: Trophy, title: 'Accountability', text: 'We take responsibility and are committed to delivering results.' },
]

const whyChoose = [
  { icon: Rocket, title: 'Leadership First', text: 'Leadership development is at the heart of every program we offer.' },
  { icon: Briefcase, title: 'Practical Learning', text: 'Real world projects, case studies and hands-on experiences.' },
  { icon: Award, title: 'Expert Trainers', text: 'Learn from experienced professionals and industry leaders.' },
  { icon: Trophy, title: 'Career Transformation', text: 'We equip you with skills that open doors and create opportunities.' },
  { icon: Heart, title: 'Personal Development', text: 'Build confidence, discipline, communication, and emotional intelligence.' },
  { icon: Users, title: 'Lifelong Community', text: 'Join a network of leaders committed to growth and impact.' },
]

const impactStats = [
  ['10,000+', 'Learners Inspired'],
  ['250+', 'Training Sessions'],
  ['30+', 'Professional Courses'],
  ['95%', 'Completion Rate'],
  ['20+', 'Institutional Partners'],
  ['15+', 'Countries Represented'],
]

const journeySteps = [
  ['1', 'Register', 'Choose your program and enroll easily.'],
  ['2', 'Learn', 'Gain practical knowledge from experts.'],
  ['3', 'Practice', 'Apply skills through real exercises.'],
  ['4', 'Graduate', 'Complete your program with confidence.'],
  ['5', 'Get Certified', 'Receive a recognized certificate that adds value.'],
  ['6', 'Grow', 'Advance your career and create lasting impact.'],
]

const teamMembers = [
  { photo: '/team/bagabo-faustin.jpg', name: 'Coun. Bagabo Faustin', role: 'Founder & Executive Director' },
  { photo: '/team/grace-michael.jpg', name: 'Grace Michael', role: 'Program Director' },
  { photo: '/team/john-emmanuel.jpg', name: 'John Emmanuel', role: 'Training Lead' },
  { photo: '/team/maryam-ibrahim.jpg', name: 'Maryam Ibrahim', role: 'Operations Manager' },
]

const partnerLogos = [
  '/partners/partner-1.png',
  '/partners/partner-2.png',
  '/partners/partner-3.png',
  '/partners/partner-4.png',
  '/partners/partner-5.png',
]

const learningPhotos = [
  '/about/learning-1.jpg',
  '/about/learning-2.jpg',
  '/about/learning-3.jpg',
  '/about/learning-4.jpg',
  '/about/learning-5.jpg',
  '/about/learning-6.jpg',
]

const faqs = [
  ['How do I enroll in a course?', 'Visit our Courses page, choose a program, and follow the enrollment steps to get started.'],
  ['Are the certificates recognized?', 'Yes, every completed program comes with a certificate that strengthens your professional profile.'],
  ['Do you offer scholarships?', 'Yes, we offer scholarship opportunities for committed learners. Visit our Scholarships page to apply.'],
  ['Can organizations request customized training?', 'Yes, we work with institutions and companies to design tailored training programs.'],
  ['Are online courses available?', 'Yes, our programs are delivered online, in-person, or in a hybrid format depending on the course.'],
  ['How long are the programs?', 'Most of our programs run for one week, with some extended courses available for deeper training.'],
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ed]">
      {/* HERO */}
      <section className="bg-primary px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              About Loyal Leadership Institute
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
              Developing Ethical Leaders. Transforming Lives. Building the{' '}
              <span className="text-accent">Future.</span>
            </h1>
            <p className="mt-6 max-w-xl leading-7 text-white/80">
              We equip learners, professionals, entrepreneurs, and institutions with
              world-class leadership, professional and life skills for personal
              growth and societal impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-primary">
                Explore Courses
              </button>
              <button className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white">
                Contact Us
              </button>
            </div>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-200 md:h-80">
            <Image
              src="/about/hero-team.jpg"
              alt="LOYAL Leadership Institute team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* HERO STATS STRIP */}
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {heroStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40">
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-lg font-black text-primary">{stat.number}</p>
                <p className="text-xs text-slate-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="relative min-h-[320px] w-full overflow-hidden rounded-2xl bg-slate-200">
            <Image
              src="/about/building.jpg"
              alt="LOYAL Leadership Institute building"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className={sectionLabel}>Our Story</p>
            <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
              A Vision Born from a <span className="italic text-accent">Purpose</span>
            </h2>
            <p className="mt-5 leading-7 text-slate-700">
              Loyal Leadership Institute was founded on a simple belief: that
              knowledge without character, skills without purpose, and ambition
              without direction cannot transform society.
            </p>
            <p className="mt-4 leading-7 text-slate-700">
              We saw brilliant young people and professionals with potential but
              lacking the right leadership, soft skills, and opportunities to grow.
              So we created a place where learning becomes transformation and leaders
              are built for life.
            </p>
            <button className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">
              Read Our Full Story
            </button>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#fbfaf7] p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xs font-black uppercase text-primary">Our Mission</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  To develop ethical leaders through world-class learning, practical
                  training, mentorship, and lifelong professional development.
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfaf7] p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xs font-black uppercase text-primary">Our Vision</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  To become Africa's leading leadership and professional development
                  institute, empowering individuals and institutions to create
                  lasting impact.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-4 rounded-2xl bg-[#fbfaf7] p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-primary">Our Purpose</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  To shape a generation of leaders who lead with integrity,
                  communicate with impact, solve real problems, and build a better
                  world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-[#fbfaf7] px-6 py-16">
        <p className={`${sectionLabel} text-center`}>Our Core Values</p>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-8">
          {coreValues.map((value) => (
            <div key={value.title} className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-accent">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black text-primary">{value.title}</h3>
              <p className="mt-1 text-[11px] leading-4 text-slate-600">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-primary px-6 py-16">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-accent">
          Why Choose Loyal Leadership Institute?
        </p>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {whyChoose.map((item) => (
            <div key={item.title} className="text-center">
              <item.icon className="mx-auto mb-3 h-7 w-7 text-accent" />
              <h3 className="text-xs font-black text-white">{item.title}</h3>
              <p className="mt-1 text-[11px] leading-4 text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT + JOURNEY + SUCCESS STORIES */}
      <section className="bg-[#fbfaf7] px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_2fr_1fr]">
          <div>
            <p className={sectionLabel}>Our Impact</p>
            <ul className="space-y-2">
              {impactStats.map(([num, label]) => (
                <li key={label} className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-accent">{num}</span>
                  <span className="text-sm text-primary">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`${sectionLabel} text-center`}>Our Learning Journey</p>
            <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
              {journeySteps.map(([num, title, text]) => (
                <div key={title} className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-accent">
                    {num}
                  </div>
                  <h3 className="text-xs font-black text-primary">{title}</h3>
                  <p className="mt-1 text-[10px] leading-4 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className={sectionLabel}>Success Stories</p>
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm italic leading-6 text-slate-700">
                &ldquo;Before joining LLI, I lacked confidence in public speaking.
                Today I lead teams, facilitate workshops and inspire others.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-accent">
                  AU
                </div>
                <div>
                  <p className="text-sm font-black text-primary">Aline Uwimana</p>
                  <p className="text-xs text-slate-500">HR Officer &middot; Kigali, Rwanda</p>
                </div>
              </div>
              <div className="mt-3 flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent" />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button className="rounded-full border border-accent p-2" aria-label="Previous story">
                  <ChevronLeft className="h-4 w-4 text-accent" />
                </button>
                <button className="rounded-full border border-accent p-2" aria-label="Next story">
                  <ChevronRight className="h-4 w-4 text-accent" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-white px-6 py-16">
        <p className={`${sectionLabel} text-center`}>Meet Our Leadership Team</p>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="rounded-2xl bg-[#fbfaf7] p-4 text-center shadow-sm">
              <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl bg-slate-200">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-black text-primary">{member.name}</h3>
              <p className="text-xs text-accent">{member.role}</p>
              <Linkedin className="mx-auto mt-2 h-4 w-4 text-slate-400" />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">
            View All Team Members
          </button>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-[#fbfaf7] px-6 py-16">
        <p className={`${sectionLabel} text-center`}>Our Partners</p>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-5">
          {partnerLogos.map((logo, i) => (
            <div
              key={logo}
              className="relative h-20 w-full overflow-hidden rounded-xl bg-slate-200 p-3"
            >
              <Image
                src={logo}
                alt={`Partner ${i + 1}`}
                fill
                className="object-contain p-3"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">
            See All Partners
          </button>
        </div>
      </section>

      {/* LEARNING ENVIRONMENT */}
      <section className="bg-white px-6 py-16">
        <p className={`${sectionLabel} text-center`}>Our Learning Environment</p>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {learningPhotos.map((photo, i) => (
            <div
              key={photo}
              className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-200"
            >
              <Image
                src={photo}
                alt={`Learning environment ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">
            View More Photos
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#fbfaf7] px-6 py-16">
        <p className={`${sectionLabel} text-center`}>Frequently Asked Questions</p>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <details
              key={question}
              className="group rounded-xl bg-white p-4 shadow-sm [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-primary">
                {question}
                <Plus className="h-4 w-4 shrink-0 text-accent transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Ready to Transform Your Future?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Join thousands of learners who are developing their leadership,
            advancing their careers, and creating impact.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-primary">
              Explore Courses
            </button>
            <button className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
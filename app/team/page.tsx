
import Link from 'next/link'
import {
  ArrowRight,
  Users,
  Mail,
  Linkedin,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type TeamMember = {
  name: string
  role: string
  image: string
  description: string
}

const bagaboDescription =
  'Me Faustin BAGABO is a legal professional, author, leadership development mentor, and Lecturer at the University of Rwanda, School of Law. He is the Founder and Managing Partner of Loyal Attorneys and the Founder and CEO of Loyal Leadership Institute (LLI). He is also the author of The Foundation Years: 15 Decisions That Shape Your Destiny. A dedicated advocate of Human Distinction, he is committed to developing principled and visionary leaders, advancing professional excellence, and empowering individuals to unlock their full potential, make purposeful life decisions, and create meaningful, lasting impact in society.'

const mugenziDescription =
  'Mr. Javan MUGENZI is the Director of Operations at Loyal Leadership Institute (LLI), a peacebuilding and development professional, and an author. His work focuses on leadership development, youth empowerment, and social transformation. He is the author of From War to Hope: A Refugee’s Journey and Beyond the Camp: Refusing to Let Circumstance Define You, reflecting his commitment to resilience, personal growth, and inspiring positive change.'

  const mucyoDescription =
  'Mr. Ben MUCYO serves as the IT Manager at Loyal Leadership Institute (LLI), where he oversees the institution’s technology systems, digital platforms, and IT operations. He supports the development and maintenance of the institute’s online learning platform, ensures the reliability and security of digital services, and promotes the effective use of technology in education and institutional management. Through his commitment to innovation, digital transformation, and continuous improvement, he contributes to delivering accessible, efficient, and high-quality learning experiences.'
const advisoryBoard: TeamMember[] = [
  {
    name: 'Me. Bagabo Faustin',
    role: 'Founder and CEO',
    image: '/Bagabo.jpeg',
    description: bagaboDescription,
  },
  {
    name: 'Mr. Javan MUGENZI',
    role: 'Director of Operations',
    image: '/Mugenzi.jpeg',
    description: mugenziDescription,
  },
  {
    name: 'Mr. Ben MUCYO',
    role: 'IT Manager',
    image: '/Mucyo.jpeg',
    description: mucyoDescription,
  },
]

const executiveCommittee: TeamMember[] = [
  {
    name: 'Me. Bagabo Faustin',
    role: 'Founder and CEO',
    image: '/Bagabo.jpeg',
    description: bagaboDescription,
  },
  {
    name: 'Mr. Javan MUGENZI',
    role: 'Director of Operations',
    image: '/Mugenzi.jpeg',
    description: mugenziDescription,
  },
  {
    name: 'Mr. Ben MUCYO',
    role: 'IT Manager',
    image: '/Mucyo.jpeg',
    description: mucyoDescription },
]

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* MEMBER PHOTO */}
      <div className="relative flex h-80 items-center justify-center overflow-hidden border-b-4 border-accent/80 bg-[#f5f0e8] sm:h-96">
        <img
          src={member.image}
          alt={`Portrait of ${member.name}`}
          loading="lazy"
          className="block h-full w-full object-contain object-center"
        />
      </div>

      {/* MEMBER INFORMATION */}
      <div className="flex flex-1 flex-col p-7">

        <h3 className="text-center font-serif text-xl font-bold text-primary">
          {member.name}
        </h3>

        <p className="mt-2 text-center text-sm font-bold text-accent">
          {member.role}
        </p>

        <div className="mx-auto my-4 flex items-center gap-2">
          <span className="h-px w-10 bg-accent" />
          <span className="h-2 w-2 rotate-45 bg-accent" />
          <span className="h-px w-10 bg-accent" />
        </div>

        {member.description && (
          <p className="text-justify text-sm leading-7 text-muted-foreground">
            {member.description}
          </p>
        )}

        <div className="mt-auto flex justify-center gap-3 pt-6">
          <span
            aria-label="LinkedIn profile not configured"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f5ee] text-primary/50"
          >
            <Linkedin className="h-4 w-4" />
          </span>

          <span
            aria-label="Email address not configured"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f5ee] text-primary/50"
          >
            <Mail className="h-4 w-4" />
          </span>

          <span
            aria-label="Member profile not configured"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f5ee] text-primary/50"
          >
            <UserRound className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  )
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#faf8f3] pt-24">

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-cover bg-center px-6 py-28"
        style={{
          backgroundImage: "url('/team-page-bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#07152d]/85 via-[#07152d]/70 to-[#07152d]/85" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#d4af37]">
            LOYAL LEADERSHIP INSTITUTE
          </p>

          <h1 className="font-serif text-5xl font-bold text-white md:text-7xl">
            Meet Our{' '}
            <span className="italic text-[#d4af37]">
              Leadership Team
            </span>
          </h1>

          <div className="mx-auto my-8 h-0.5 w-28 bg-[#d4af37]" />

          <p className="mx-auto max-w-3xl text-xl leading-9 text-white/90">
            At LLI, our strength comes from a dedicated team of
            professionals, educators, mentors, and experienced
            leaders who are committed to empowering individuals
            and organizations. Guided by a visionary board, we
            combine expertise, strong leadership, and a passion
            for excellence to deliver impactful learning
            experiences and drive lasting growth.
          </p>
        </div>
      </section>

      {/* ADVISORY BOARD */}
      <section id="advisory-board" className="px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white/95 p-8 shadow-sm">

          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-accent">
              Advisory Board
            </p>

            <h2 className="font-serif text-3xl font-bold text-primary md:text-5xl">
              Strategic Guidance and Governance
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Experienced advisors providing governance, strategy,
              academic quality, partnerships, and long-term
              institutional direction.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {advisoryBoard.map((member) => (
              <MemberCard
                key={member.name}
                member={member}
              />
            ))}
          </div>

        </div>
      </section>

      {/* EXECUTIVE COMMITTEE */}
      <section id="executive-committee" className="px-6 pb-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white/95 p-8 shadow-sm">

          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-accent">
              Executive Committee
            </p>

            <h2 className="font-serif text-3xl font-bold text-primary md:text-5xl">
              The Leaders Behind the Mission
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              The executive team responsible for strategy,
              programmes, operations, technology, partnerships,
              communication, and daily institutional excellence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {executiveCommittee.map((member) => (
              <MemberCard
                key={member.name}
                member={member}
              />
            ))}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-primary px-8 py-8 text-center text-white shadow-xl md:flex-row md:text-left">

          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 shrink-0 text-accent" />

            <p className="text-lg font-semibold">
              Together, we are building a generation of ethical,
              confident, and visionary leaders.
            </p>
          </div>

          <Button
            asChild
            className="bg-accent text-primary hover:bg-accent/90"
          >
            <Link href="/about">
              Learn More About Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

        </div>
      </section>

    </main>
  )
}

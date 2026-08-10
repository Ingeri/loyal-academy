import Link from 'next/link'
import {
  ArrowRight,
  Users,
  Mail,
  Linkedin,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const advisoryBoard = [
  {
    name: 'Prof. Claire Elise',
    role: 'Board Chairperson',
    image: '/placeholder-user.jpg',
    description:
      'Provides strategic oversight, advises on institutional governance, supports policy development, strengthens leadership capacity, and guides the long-term vision of the institute.',
  },
  {
    name: 'Michael Ochieng',
    role: 'Vice Chairperson',
    image: '/placeholder-user.jpg',
    description:
      'Supports institutional planning, advises on strategic partnerships, promotes professional excellence, and contributes to sustainable organisational growth and governance.',
  },
  {
    name: 'Dr. Theresa Amara',
    role: 'Academic Advisor',
    image: '/placeholder-user.jpg',
    description:
      'Provides expertise in academic quality, research, curriculum development, professional training, and educational innovation to strengthen institutional excellence.',
  },
  {
    name: 'Dr. Jean Paul Ntwali',
    role: 'Governance Advisor',
    image: '/placeholder-user.jpg',
    description:
      'Advises on institutional governance, ethical leadership, accountability systems, and strategic policies that support long-term institutional credibility.',
  },
  {
    name: 'Amina Uwase',
    role: 'Youth Development Advisor',
    image: '/placeholder-user.jpg',
    description:
      'Supports youth empowerment strategies, mentorship programmes, leadership camps, and initiatives that prepare young people for career and social impact.',
  },
  {
    name: 'Emmanuel Mugisha',
    role: 'Corporate Partnerships Advisor',
    image: '/placeholder-user.jpg',
    description:
      'Guides partnership development with companies, institutions, NGOs, and public agencies to expand training opportunities and institutional collaboration.',
  },
  {
    name: 'Dr. Linda Twesigye',
    role: 'Research & Innovation Advisor',
    image: '/placeholder-user.jpg',
    description:
      'Advises on research, innovation, evidence-based training methods, policy briefs, and knowledge products that strengthen leadership education.',
  },
  {
    name: 'Patrick Karekezi',
    role: 'Finance & Sustainability Advisor',
    image: '/placeholder-user.jpg',
    description:
      'Provides guidance on financial sustainability, resource mobilisation, institutional growth, budgeting, and responsible management of strategic resources.',
  },
  {
    name: 'Grace Nyirahabimana',
    role: 'Community Impact Advisor',
    image: '/placeholder-user.jpg',
    description:
      'Supports community outreach, social impact programmes, responsible citizenship initiatives, and partnerships that connect leadership training to national development.',
  },
]

const executiveCommittee = [
  {
    name: 'Counsel Bagabo Faustin',
    role: 'Founder & Executive Director',
    image: '/placeholder-user.jpg',
    description:
      'Provides strategic leadership for the institute, oversees institutional growth, develops strategic partnerships, and ensures every programme reflects the vision and values of LLI.',
  },
  {
    name: 'Sarah Mutesi',
    role: 'Chief Academic Officer',
    image: '/placeholder-user.jpg',
    description:
      'Leads curriculum development, maintains academic quality, supervises trainers, designs learning programmes, and ensures every course meets professional standards.',
  },
  {
    name: 'David Kamanzi',
    role: 'Head of Technology',
    image: '/placeholder-user.jpg',
    description:
      'Oversees digital platforms, manages the learning management system, supports online education, implements technology solutions, and drives innovation across the institute.',
  },
  {
    name: 'Claudine Mukamana',
    role: 'Director of Programmes',
    image: '/placeholder-user.jpg',
    description:
      'Coordinates leadership programmes, manages training calendars, supports facilitators, and ensures that all learning experiences deliver measurable impact.',
  },
  {
    name: 'Jean Bosco Habimana',
    role: 'Training Coordinator',
    image: '/placeholder-user.jpg',
    description:
      'Organises workshops, supports trainers, prepares learning materials, coordinates participants, and ensures effective implementation of training activities.',
  },
  {
    name: 'Diane Ishimwe',
    role: 'Student Success Manager',
    image: '/placeholder-user.jpg',
    description:
      'Supports learners, monitors progress, coordinates mentorship, manages feedback, and helps participants translate training into practical career growth.',
  },
  {
    name: 'Eric Niyonzima',
    role: 'Partnerships Manager',
    image: '/placeholder-user.jpg',
    description:
      'Builds institutional partnerships, manages partner relations, supports outreach, and connects the institute with strategic organisations and stakeholders.',
  },
  {
    name: 'Alice Umutoni',
    role: 'Communications Manager',
    image: '/placeholder-user.jpg',
    description:
      'Leads public communication, digital content, brand visibility, social media engagement, and storytelling for the institute’s leadership mission.',
  },
  {
    name: 'Samuel Rukundo',
    role: 'Finance & Administration Officer',
    image: '/placeholder-user.jpg',
    description:
      'Manages administrative systems, supports budgeting, coordinates payments, maintains records, and ensures smooth daily operations of the institute.',
  },
]

function MemberCard({ member }: { member: any }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
      <div className="relative h-72 overflow-hidden bg-[#f5f0e8]">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 border-b-4 border-accent/80" />
      </div>

      <div className="flex flex-1 flex-col p-7 text-center">
        <h3 className="font-serif text-xl font-bold text-primary">
          {member.name}
        </h3>

        <p className="mt-2 text-sm font-bold text-accent">{member.role}</p>

        <div className="mx-auto my-4 flex items-center gap-2">
          <span className="h-px w-10 bg-accent" />
          <span className="h-2 w-2 rotate-45 bg-accent" />
          <span className="h-px w-10 bg-accent" />
        </div>

        <p className="min-h-[112px] text-sm leading-7 text-muted-foreground">
          {member.description}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f5ee] text-primary transition hover:bg-accent hover:text-primary"
          >
            <Linkedin className="h-4 w-4" />
          </Link>

          <Link
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f5ee] text-primary transition hover:bg-accent hover:text-primary"
          >
            <Mail className="h-4 w-4" />
          </Link>

          <Link
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f5ee] text-primary transition hover:bg-accent hover:text-primary"
          >
            <UserRound className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#07152d]/85 via-[#07152d]/70 to-[#07152d]/85" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#d4af37]">
            LOYAL LEADERSHIP INSTITUTE
          </p>

          <h1 className="font-serif text-5xl font-bold text-white md:text-7xl">
            Meet Our{' '}
            <span className="italic text-[#d4af37]">Leadership Team</span>
          </h1>

          <div className="mx-auto my-8 h-[2px] w-28 bg-[#d4af37]" />

          <p className="mx-auto max-w-3xl text-xl leading-9 text-white/90">
           At LLI, our strength comes from a dedicated team of professionals, educators, mentors, and experienced leaders who are committed to empowering individuals and organizations. Guided by a visionary board, we combine expertise, strong leadership, and a passion for excellence to deliver impactful learning experiences and drive lasting growth.
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
              Experienced advisors providing governance, strategy, academic
              quality, partnerships, and long-term institutional direction.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {advisoryBoard.map((member) => (
              <MemberCard key={member.name} member={member} />
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
              The executive team responsible for strategy, programmes,
              operations, technology, partnerships, communication, and daily
              institutional excellence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {executiveCommittee.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-primary px-8 py-8 text-center text-white shadow-xl md:flex-row md:text-left">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 shrink-0 text-accent" />
            <p className="text-lg font-semibold">
              Together, we are building a generation of ethical, confident, and
              visionary leaders.
            </p>
          </div>

          <Button asChild className="bg-accent text-primary hover:bg-accent/90">
            <Link href="/about">
              Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
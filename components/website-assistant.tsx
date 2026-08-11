'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bot,
  MessageCircleMore,
  SendHorizonal,
  Sparkles,
  User,
  BookOpen,
  GraduationCap,
  Handshake,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type ChatMessage = {
  id: number
  role: 'assistant' | 'user'
  content: string
  links?: {
    label: string
    href: string
  }[]
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hello, welcome to LOYAL Leadership Institute. I can help you with courses, scholarships, outsourcing, partnerships, enrollment, payments, or contact information.',
    links: [
      { label: 'View Courses', href: '/courses' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
]

function getAssistantReply(message: string): ChatMessage {
  const normalized = message.toLowerCase()

  if (
    normalized.includes('course') ||
    normalized.includes('program') ||
    normalized.includes('training')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'Our courses focus on leadership, public speaking, career growth, communication, emotional intelligence, entrepreneurship, and professional development. You can view all available courses here.',
      links: [{ label: 'Open Courses', href: '/courses' }],
    }
  }

  if (
    normalized.includes('scholar') ||
    normalized.includes('financial support') ||
    normalized.includes('sponsorship')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'Scholarships support learners who need financial assistance. You can visit the scholarships page to learn about eligibility, requirements, and application steps.',
      links: [{ label: 'Open Scholarships', href: '/scholarships' }],
    }
  }

  if (
    normalized.includes('outsourcing') ||
    normalized.includes('talent') ||
    normalized.includes('project') ||
    normalized.includes('hire')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'Our outsourcing service connects institutions, companies, and organizations with trained graduates and professional talent from LOYAL Leadership Institute.',
      links: [{ label: 'Open Outsourcing', href: '/outsourcing' }],
    }
  }

  if (
    normalized.includes('partner') ||
    normalized.includes('partnership') ||
    normalized.includes('collaborate') ||
    normalized.includes('ngo') ||
    normalized.includes('company')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'We welcome partnerships with schools, universities, NGOs, companies, and institutions interested in leadership, training, youth empowerment, and professional development.',
      links: [
        { label: 'Submit Partnership Inquiry', href: '/outsourcing/partnership' },
      ],
    }
  }

  if (
    normalized.includes('contact') ||
    normalized.includes('email') ||
    normalized.includes('phone') ||
    normalized.includes('location') ||
    normalized.includes('where')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'You can contact LOYAL Leadership Institute through our contact page. You will find our email, phone number, location, and message form there.',
      links: [{ label: 'Open Contact Page', href: '/contact' }],
    }
  }

  if (
    normalized.includes('about') ||
    normalized.includes('who are you') ||
    normalized.includes('institute') ||
    normalized.includes('mission') ||
    normalized.includes('vision')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'LOYAL Leadership Institute develops ethical, confident, and impactful leaders through practical courses, professional training, career development, and institutional partnerships.',
      links: [{ label: 'Learn About LLI', href: '/about' }],
    }
  }

  if (
    normalized.includes('team') ||
    normalized.includes('advisory') ||
    normalized.includes('executive')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'Our team includes the Advisory Board and Executive Committee who guide the vision, governance, programmes, and daily operations of the institute.',
      links: [{ label: 'Meet Our Team', href: '/team' }],
    }
  }

  if (
    normalized.includes('pay') ||
    normalized.includes('payment') ||
    normalized.includes('price') ||
    normalized.includes('cost') ||
    normalized.includes('fee')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'Course prices may vary depending on the programme. Payments are processed through a payment provider and received through the institute’s configured business bank or mobile money account.',
      links: [{ label: 'View Courses', href: '/courses' }],
    }
  }

  if (
    normalized.includes('enroll') ||
    normalized.includes('register') ||
    normalized.includes('join')
  ) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        'To enroll, visit the courses page, choose your preferred course, and follow the enrollment steps. If you need guidance, contact our team.',
      links: [
        { label: 'Enroll in a Course', href: '/courses' },
        { label: 'Ask for Help', href: '/contact' },
      ],
    }
  }

  return {
    id: Date.now() + 1,
    role: 'assistant',
    content:
      'I can help you with courses, enrollment, scholarships, partnerships, outsourcing, payments, team information, and contact details. Please choose one option below or type your question clearly.',
    links: [
      { label: 'Courses', href: '/courses' },
      { label: 'Scholarships', href: '/scholarships' },
      { label: 'Partnerships', href: '/outsourcing/partnership' },
      { label: 'Contact', href: '/contact' },
    ],
  }
}

const quickActions = [
  {
    label: 'Courses',
    icon: BookOpen,
    question: 'Tell me about your courses',
  },
  {
    label: 'Scholarships',
    icon: GraduationCap,
    question: 'How can I apply for scholarships?',
  },
  {
    label: 'Partnerships',
    icon: Handshake,
    question: 'How can we partner with LOYAL Leadership Institute?',
  },
  {
    label: 'Contact',
    icon: Phone,
    question: 'How can I contact LOYAL Leadership Institute?',
  },
]

export function WebsiteAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
    }

    const assistantMessage = getAssistantReply(trimmed)

    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput('')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary shadow-2xl transition hover:scale-105"
            aria-label="Open website assistant"
          >
            <MessageCircleMore className="h-6 w-6 text-accent" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex h-screen w-[94vw] max-w-md overflow-y-auto flex-col border-l border-accent/20 bg-[#faf8f3]"
        >
          <SheetHeader className="space-y-3 border-b pb-5">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">
                LOYAL Assistant
              </span>
            </div>

            <SheetTitle className="text-left font-serif text-2xl font-bold text-primary">
              How can I help you?
            </SheetTitle>

            <SheetDescription className="text-left text-sm leading-6 text-muted-foreground">
              Ask about courses, scholarships, partnerships, outsourcing,
              enrollment, payments, or contact information.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 grid grid-cols-2 gap-2 px-4">
            {quickActions.map((item) => (
              <button
                key={item.label}
                onClick={() => sendMessage(item.question)}
                className="rounded-xl bg-white p-3 text-left text-sm font-semibold text-primary shadow-sm transition hover:bg-accent hover:text-primary"
              >
                <item.icon className="mb-2 h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex-1 space-y-4 rounded-2xl bg-white/80 p-4 shadow-inner">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-accent">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === 'assistant'
                      ? 'bg-[#f8f5ee] text-slate-800'
                      : 'bg-primary text-white'
                  }`}
                >
                  <p>{message.content}</p>

                  {message.links && message.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <Button
                            size="sm"
                            className="rounded-full bg-accent text-primary hover:bg-accent/90"
                            onClick={() => setOpen(false)}
                          >
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2 border-t p-4">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="Type your question..."
              className="flex-1 bg-white"
            />

            <Button
              onClick={() => sendMessage(input)}
              size="icon"
              aria-label="Send message"
              className="bg-primary text-accent hover:bg-primary/90"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, LayoutDashboard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type NavUser = {
  name: string | null
  role: string
} | null

const DASHBOARD_PATH_BY_ROLE: Record<string, string> = {
  ADMIN: '/admin',
  INSTRUCTOR: '/instructor',
  STUDENT: '/student',
  DONOR: '/donor',
}

export function Navigation({ user }: { user?: NavUser }) {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false)
      } else {
        setShowNav(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const linkClass =
    'text-[16px] font-medium text-primary transition-all duration-300 hover:text-accent'

  const dashboardPath = user ? DASHBOARD_PATH_BY_ROLE[user.role] ?? '/' : '/'

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-accent/20 bg-background/95 backdrop-blur transition-transform duration-300 ${
        showNav ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/lli-logo.png"
            alt="LOYAL Leadership Institute Logo"
            width={76}
            height={76}
            priority
            className="h-14 w-14 object-contain"
          />

          <div className="hidden flex-col leading-none lg:flex">
            <span className="font-serif text-2xl font-bold tracking-wide text-primary">
              LOYAL
            </span>

            <span className="text-[12px] font-semibold tracking-[0.18em] text-accent">
              LEADERSHIP INSTITUTE
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          <Link href="/" className={linkClass}>
            Home
          </Link>

          <Link href="/courses" className={linkClass}>
            Courses
          </Link>

          {/* TEAM */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`${linkClass} flex items-center gap-1 outline-none`}
              >
                Team
                <ChevronDown className="h-4 w-4 transition-transform duration-300" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="center"
              sideOffset={10}
              className="w-72 rounded-xl border border-accent/20 bg-white p-2 shadow-2xl"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/team"
                  className="block w-full whitespace-nowrap rounded-lg px-4 py-3 text-[15px] font-medium hover:bg-accent/10 hover:text-accent"
                >
                  Team Overview
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/team#advisory-board"
                  className="block w-full whitespace-nowrap rounded-lg px-4 py-3 text-[15px] font-medium hover:bg-accent/10 hover:text-accent"
                >
                  Advisory Board
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/team#executive-committee"
                  className="block w-full whitespace-nowrap rounded-lg px-4 py-3 text-[15px] font-medium hover:bg-accent/10 hover:text-accent"
                >
                  Executive Committee
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className={linkClass}>
            About
          </Link>

          <Link href="/outsourcing" className={linkClass}>
            Outsourcing
          </Link>

          <Link href="/scholarships" className={linkClass}>
            Scholarships
          </Link>

          <Link href="/blog" className={linkClass}>
            Blog
          </Link>

          <Link href="/contact" className={linkClass}>
            Contact
          </Link>
        </div>

        {/* Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl border border-accent/30 px-4 py-2 text-[15px] font-medium text-primary transition-colors hover:bg-accent/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-accent">
                    {(user.name?.[0] ?? "U").toUpperCase()}
                  </div>
                  {user.name ?? "My Account"}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-56 rounded-xl border border-accent/20 bg-white p-2 shadow-2xl"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href={dashboardPath}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-[15px] font-medium hover:bg-accent/10 hover:text-accent"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/logout"
                    className="block w-full rounded-lg px-4 py-3 text-[15px] font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-[15px] font-medium">
                <Link href="/auth/login">Log In</Link>
              </Button>

              <Button
                asChild
                className="rounded-xl px-6 py-5 text-[15px] font-semibold"
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
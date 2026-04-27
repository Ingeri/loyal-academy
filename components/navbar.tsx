"use client"

import Link from "next/link"
import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { allCourses } from "@/lib/courses"
import { ChevronDown } from "lucide-react"

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Fetch unique categories and their slugs from your data
  // We use a Map to ensure we only get one entry per category name
  const categories = Array.from(
    new Map(allCourses.map(course => [course.category, course.categorySlug])).entries()
  ).map(([name, slug]) => ({ name, slug }));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-amber-400">
              ROYAL ACADEMY
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          
          {/* Dynamic Categories Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-4">
              Categories <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link 
                  href="/courses" 
                  className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 border-b border-slate-100 dark:border-slate-800 mb-1"
                >
                  All Courses
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/courses/${cat.slug}`}
                    className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/faculty" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Faculty
          </Link>
          <Link href="/admissions" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Admissions
          </Link>
          <Link href="/about" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            About
          </Link>
        </nav>

        {/* Actions (Toggle & Login) */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link 
            href="/login" 
            className="hidden sm:inline-block px-4 py-2 text-sm font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition-all"
          >
            Portal Login
          </Link>
        </div>
      </div>
    </header>
  )
}
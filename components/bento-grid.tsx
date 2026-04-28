'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Monitor,
  Briefcase,
  Scale,
  Palette,
  Database,
  Cloud,
  Code,
  BarChart3,
  GraduationCap,
  Cpu,
  Globe,
  Shield,
} from 'lucide-react';

interface BentoItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  size: 'small' | 'medium' | 'large';
  courseCount?: number;
}

const categories: BentoItem[] = [
  {
    title: 'Computer Science',
    description: 'Programming, algorithms, and software engineering',
    href: '/courses?category=Computer+Science',
    icon: <Code className="h-6 w-6" />,
    color: 'from-blue-500/20 to-blue-600/10',
    size: 'large',
    courseCount: 24,
  },
  {
    title: 'Business',
    description: 'Management, marketing, and entrepreneurship',
    href: '/courses?category=Business',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'from-amber-500/20 to-amber-600/10',
    size: 'medium',
    courseCount: 18,
  },
  {
    title: 'Law',
    description: 'Legal studies and professional law courses',
    href: '/courses?category=Law',
    icon: <Scale className="h-6 w-6" />,
    color: 'from-indigo-500/20 to-indigo-600/10',
    size: 'medium',
    courseCount: 12,
  },
  {
    title: 'Design',
    description: 'UX/UI, graphic design, and creative arts',
    href: '/courses?category=Design',
    icon: <Palette className="h-6 w-6" />,
    color: 'from-pink-500/20 to-pink-600/10',
    size: 'medium',
    courseCount: 15,
  },
  {
    title: 'Data Science',
    description: 'Analytics, ML, and big data technologies',
    href: '/courses?category=Data+Science',
    icon: <Database className="h-6 w-6" />,
    color: 'from-emerald-500/20 to-emerald-600/10',
    size: 'large',
    courseCount: 21,
  },
  {
    title: 'Cloud Computing',
    description: 'AWS, Azure, and cloud architecture',
    href: '/courses?category=Cloud',
    icon: <Cloud className="h-6 w-6" />,
    color: 'from-sky-500/20 to-sky-600/10',
    size: 'small',
    courseCount: 14,
  },
  {
    title: 'Web Development',
    description: 'Frontend, backend, and full-stack development',
    href: '/courses?category=Web+Development',
    icon: <Monitor className="h-6 w-6" />,
    color: 'from-violet-500/20 to-violet-600/10',
    size: 'small',
    courseCount: 32,
  },
  {
    title: 'Analytics',
    description: 'Business intelligence and data visualization',
    href: '/courses?category=Analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'from-teal-500/20 to-teal-600/10',
    size: 'small',
    courseCount: 9,
  },
  {
    title: 'Academics',
    description: 'Higher education and research courses',
    href: '/courses?category=Academics',
    icon: <GraduationCap className="h-6 w-6" />,
    color: 'from-rose-500/20 to-rose-600/10',
    size: 'small',
    courseCount: 16,
  },
  {
    title: 'AI & ML',
    description: 'Artificial intelligence and machine learning',
    href: '/courses?category=AI+%26+ML',
    icon: <Cpu className="h-6 w-6" />,
    color: 'from-cyan-500/20 to-cyan-600/10',
    size: 'medium',
    courseCount: 19,
  },
  {
    title: 'Languages',
    description: 'Learn new languages and communication',
    href: '/courses?category=Languages',
    icon: <Globe className="h-6 w-6" />,
    color: 'from-orange-500/20 to-orange-600/10',
    size: 'small',
    courseCount: 11,
  },
  {
    title: 'Cybersecurity',
    description: 'Security, compliance, and risk management',
    href: '/courses?category=Cybersecurity',
    icon: <Shield className="h-6 w-6" />,
    color: 'from-red-500/20 to-red-600/10',
    size: 'small',
    courseCount: 8,
  },
];

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 md:col-span-1 row-span-1',
  large: 'col-span-1 md:col-span-2 row-span-1',
};

interface BentoGridProps {
  className?: string;
}

export function BentoGrid({ className }: BentoGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {categories.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            'group relative overflow-hidden rounded-2xl border bg-card p-6',
            'hover:shadow-lg hover:shadow-primary/5',
            'transition-all duration-300 ease-out',
            'hover:-translate-y-1',
            sizeClasses[item.size]
          )}
        >
          {/* Background Gradient */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              item.color
            )}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div
              className={cn(
                'inline-flex items-center justify-center rounded-xl p-3 mb-4',
                'bg-gradient-to-br',
                item.color,
                'group-hover:scale-110 transition-transform duration-300'
              )}
            >
              <div className="text-foreground">{item.icon}</div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {item.description}
            </p>

            {/* Course Count */}
            {item.courseCount && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{item.courseCount}</span> courses
              </p>
            )}
          </div>

          {/* Hover Arrow */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function BentoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border bg-card p-6 h-40 animate-pulse"
        >
          <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
          <div className="h-4 w-3/4 bg-muted rounded mb-2" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

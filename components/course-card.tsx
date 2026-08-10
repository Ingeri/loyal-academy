'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Clock,
  Users,
  Award,
  Video,
  FileText,
  Tag,
  Activity,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    image_url?: string
    price: number
    discounted_price?: number
    rating?: number
    students?: number
    duration?: string
    level?: string
    category?: string
    categorySlug: string
    slug: string
    has_certificate?: boolean
    is_free?: boolean
    instructor?: string
    conducting_type?: string
    has_exam?: boolean
    tags?: string[]
    reviews_count?: number
    updated_at?: Date
  }
  className?: string
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

const tagColors = [
  'bg-blue-500/10 text-blue-700',
  'bg-purple-500/10 text-purple-700',
  'bg-amber-500/10 text-amber-700',
  'bg-emerald-500/10 text-emerald-700',
  'bg-rose-500/10 text-rose-700',
]

function renderRatingStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(100, (rating - index) * 100))

        return (
          <span key={index} className="relative inline-block">
            <Star className="h-4 w-4 text-muted-foreground/30" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </span>
          </span>
        )
      })}
    </div>
  )
}

export function CourseCard({ course, className }: CourseCardProps) {
  const hasDiscount =
    course.discounted_price !== undefined && course.discounted_price < course.price

  const discountPercent = hasDiscount
    ? Math.round(((course.price - (course.discounted_price || 0)) / course.price) * 100)
    : 0

  return (
    <Link href={`/courses/${course.categorySlug}/${course.slug}`} className="block h-full">
      <Card
        className={cn(
          'group h-full cursor-pointer overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl',
          'transition-all duration-500 ease-out',
          'hover:-translate-y-3 hover:shadow-black/40',
          className
        )}
      >
        <div className="relative h-52 overflow-hidden">
          {course.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-accent/10">
              <Award className="h-12 w-12 text-primary/40" />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {course.is_free && (
              <Badge className="border-0 bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Free
              </Badge>
            )}

            {hasDiscount && (
              <Badge className="border-0 bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                {discountPercent}% OFF
              </Badge>
            )}

            {course.has_certificate && (
              <Badge className="border-0 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-md">
                <Award className="mr-1 h-3.5 w-3.5" /> Certificate
              </Badge>
            )}
          </div>

          {course.level && (
            <div className="absolute bottom-4 right-4">
              <Badge
                className={cn(
                  'border-0 px-3 py-1 text-xs font-black uppercase shadow-lg',
                  levelColors[course.level.toLowerCase()] ||
                  'bg-gray-100 text-gray-700'
                )}
              >
                {course.level}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          {course.category && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {course.category}
            </p>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            {course.updated_at && (
              <Badge className="bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                <Activity className="mr-1 h-3.5 w-3.5" /> Updated Course
              </Badge>
            )}

            {course.tags?.slice(0, 4).map((tag, i) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  'px-2 py-1 text-xs font-medium',
                  tagColors[i % tagColors.length]
                )}
              >
                <Tag className="mr-1 h-3.5 w-3.5" /> {tag}
              </Badge>
            ))}
          </div>

          <h3 className="mb-3 font-serif text-2xl font-bold leading-tight text-primary transition-colors group-hover:text-accent">
            {course.title}
          </h3>

          <p className="mb-5 line-clamp-2 text-sm leading-7 text-muted-foreground">
            {course.description}
          </p>

          {course.instructor && (
            <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-accent" />
              <span>
                by{' '}
                <span className="font-semibold text-primary">
                  {course.instructor}
                </span>
              </span>
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-medium text-muted-foreground">
            {course.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>{course.duration}</span>
              </div>
            )}

            {course.students && course.students > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
            )}

            {course.conducting_type && (
              <div className="flex items-center gap-1.5">
                <Video className="h-4 w-4 text-primary" />
                <span>{course.conducting_type}</span>
              </div>
            )}

            {course.has_exam && (
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <span>Includes Exam</span>
              </div>
            )}
          </div>

          <div className="mb-5 flex items-center gap-2">
            {renderRatingStars(course.rating || 0)}
            <span className="text-sm font-semibold text-primary">
              {(course.rating || 0).toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({course.reviews_count || 0} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-end gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-black leading-none text-primary">
                    ${course.discounted_price?.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground line-through decoration-red-500/60 decoration-2">
                    ${course.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-black leading-none text-primary">
                  {course.is_free ? 'Free' : `$${course.price.toFixed(2)}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
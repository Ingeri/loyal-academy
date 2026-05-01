'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, Award, Video, FileText, Tag, Activity, GraduationCap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    price: number;
    discounted_price?: number;
    rating?: number;
    students?: number;
    duration?: string;
    level?: string;
    category?: string;
    categorySlug: string;
    slug: string;
    has_certificate?: boolean;
    is_free?: boolean;
    instructor?: string;
    conducting_type?: string;
    has_exam?: boolean;
    tags?: string[];
    reviews_count?: number;
    updated_at?: Date;
  };
  className?: string;
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/80 dark:text-green-300 dark:border-green-800',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/80 dark:text-yellow-300 dark:border-yellow-800',
  advanced: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/80 dark:text-red-300 dark:border-red-800',
};

const tagColors = [
  'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
  'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400',
  'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
];

function renderRatingStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(100, (rating - index) * 100));
        return (
          <span key={index} className="relative inline-block">
            <Star className="h-4 w-4 text-muted-foreground/30" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden text-yellow-400"
              style={{ width: `${fill}%` }}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function CourseCard({ course, className }: CourseCardProps) {
  const hasDiscount = course.discounted_price && course.discounted_price < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - (course.discounted_price || 0)) / course.price) * 100)
    : 0;

  return (
    <Link href={`/courses/${course.categorySlug}/${course.slug}`}>
      <Card
        className={cn(
          'h-full overflow-hidden cursor-pointer group',
          'hover:shadow-xl hover:shadow-primary/5',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-1',
          className
        )}
      >
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {course.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Award className="h-12 w-12 text-primary/30" />
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-row flex-wrap gap-2 pr-3">
            {course.is_free && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 text-xs px-2.5 py-0.5 flex items-center gap-1 shadow-md font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Free
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 text-xs px-2.5 py-0.5 font-bold shadow-md tracking-wide">
                {discountPercent}% OFF
              </Badge>
            )}
            {course.has_certificate && (
              <Badge variant="outline" className="bg-white dark:bg-black text-foreground text-xs px-2.5 py-0.5 flex items-center gap-1 shadow-md font-medium border-0">
                <Award className="h-3.5 w-3.5 text-primary" /> Certificate
              </Badge>
            )}
          </div>

          {/* Level Badge - Bottom Right */}
          {course.level && (
            <div className="absolute bottom-3 right-3">
              <Badge
                className={cn(
                  'text-xs px-3 py-1 capitalize shadow-lg font-bold border',
                  levelColors[course.level.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'
                )}
              >
                {course.level}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {course.category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              {course.category}
            </p>
          )}

          {/* Tags & Updated Badge */}
          <div className="flex flex-wrap gap-2 mb-3">
            {course.updated_at && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 font-medium">
                <Activity className="h-3.5 w-3.5" /> Updated Course
              </Badge>
            )}
            {course.tags?.map((tag, i) => {
              const colorClass = tagColors[i % tagColors.length];
              return (
                <Badge key={tag} variant="outline" className={cn("text-xs px-2 py-0.5 flex items-center gap-1.5 font-medium", colorClass)}>
                  <Tag className="h-3.5 w-3.5 opacity-70" /> {tag}
                </Badge>
              );
            })}
          </div>

          {/* Title */}
          <h3 className="text-[1.15rem] font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors font-sans leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-sans leading-relaxed">
            {course.description}
          </p>

          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>by <span className="text-foreground font-semibold">{course.instructor}</span></span>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-4 text-sm text-muted-foreground mb-5 font-medium">
            {course.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            )}
            {course.students && course.students > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
            )}
            {course.conducting_type && (
              <div className="flex items-center gap-1.5">
                <Video className="h-4 w-4" />
                <span>{course.conducting_type}</span>
              </div>
            )}
            {course.has_exam && (
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>Includes Exam</span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {renderRatingStars(course.rating || 0)}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                {(course.rating || 0).toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({course.reviews_count || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-end gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-black text-primary tracking-tight font-sans leading-none">
                    ${course.discounted_price?.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground line-through decoration-red-500/60 decoration-2 mb-1">
                    ${course.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-black text-primary tracking-tight font-sans leading-none">
                  {course.is_free ? 'Free' : `$${course.price.toFixed(2)}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

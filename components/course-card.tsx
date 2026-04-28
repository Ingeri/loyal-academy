'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, Award } from 'lucide-react';
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
    has_certificate?: boolean;
    is_free?: boolean;
    instructor?: string;
  };
  className?: string;
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-600 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function CourseCard({ course, className }: CourseCardProps) {
  const hasDiscount = course.discounted_price && course.discounted_price < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - (course.discounted_price || 0)) / course.price) * 100)
    : 0;

  return (
    <Link href={`/courses/${course.id}`}>
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
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {course.is_free && (
              <Badge className="bg-green-500 text-white border-0">Free</Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-red-500 text-white border-0">-{discountPercent}%</Badge>
            )}
            {course.has_certificate && (
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                <Award className="h-3 w-3 mr-1" />
                Certificate
              </Badge>
            )}
          </div>

          {/* Level Badge - Bottom Right */}
          {course.level && (
            <div className="absolute bottom-3 right-3">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs capitalize backdrop-blur-sm bg-white/90',
                  levelColors[course.level.toLowerCase()] || 'bg-gray-500/10 text-gray-600'
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

          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* Instructor */}
          {course.instructor && (
            <p className="text-xs text-muted-foreground mb-3">
              by <span className="text-foreground">{course.instructor}</span>
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{course.duration}</span>
              </div>
            )}
            {course.students && course.students > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
            )}
          </div>

          {/* Rating */}
          {course.rating && course.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{course.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    ${course.discounted_price?.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${course.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">
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

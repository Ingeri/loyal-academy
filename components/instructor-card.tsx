'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstructorCardProps {
  instructor: {
    id: string;
    name: string;
    avatar_url?: string;
    bio: string;
    specialty: string;
    rating: number;
    students: number;
    courses: number;
  };
  className?: string;
}

export function InstructorCard({ instructor, className }: InstructorCardProps) {
  return (
    <Card
      className={cn(
        'h-full overflow-hidden group',
        'hover:shadow-xl hover:shadow-primary/5',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1',
        className
      )}
    >
      <div className="p-6 text-center">
        {/* Avatar */}
        <div className="relative mx-auto mb-4">
          {instructor.avatar_url ? (
            <img
              src={instructor.avatar_url}
              alt={instructor.name}
              className="h-24 w-24 rounded-full object-cover mx-auto ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center mx-auto ring-4 ring-primary/10">
              <span className="text-2xl font-bold text-white">
                {instructor.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
          {instructor.name}
        </h3>

        {/* Specialty */}
        <Badge variant="secondary" className="mb-3">
          {instructor.specialty}
        </Badge>

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {instructor.bio}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{instructor.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{instructor.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{instructor.courses} courses</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const mockInstructors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    bio: 'Senior web developer with 10+ years of experience in frontend technologies and modern frameworks.',
    specialty: 'Web Development',
    rating: 4.9,
    students: 12540,
    courses: 8,
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    bio: 'React expert and software architect who has built multiple production applications at scale.',
    specialty: 'React & Frontend',
    rating: 4.8,
    students: 8320,
    courses: 6,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    bio: 'PhD in Data Science with 8 years of industry experience in analytics and machine learning.',
    specialty: 'Data Science',
    rating: 4.9,
    students: 15600,
    courses: 12,
  },
  {
    id: '4',
    name: 'Alex Kim',
    bio: 'Design director with 12 years of experience at leading tech companies and startups.',
    specialty: 'UX/UI Design',
    rating: 4.7,
    students: 9800,
    courses: 5,
  },
];

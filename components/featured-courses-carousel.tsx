"use client";

import { CourseCard } from "@/components/course-card";

interface Course {
  id: string;
  title: string;
  description?: string;
  slug: string;
  thumbnail?: string;
  price: number;
  discount?: number;
  category?: { name: string; slug: string };
  level: string;
  hasCertificate: boolean;
  conductingType: string;
  hasExam: boolean;
  avgRating: number;
  studentNumber: number;
  duration?: string;
  reviews_count?: number;
  tags?: string[];
}

interface FeaturedCoursesCarouselProps {
  courses: Course[];
}

export function FeaturedCoursesCarousel({
  courses,
}: FeaturedCoursesCarouselProps) {
  const visibleCourses = courses.slice(0, 3);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleCourses.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            id: course.id,
            title: course.title,
            description: course.description || "",
            slug: course.slug,
            image_url: course.thumbnail || undefined,
            price: course.price,
            discounted_price: course.discount
              ? course.price - course.discount
              : undefined,
            category: course.category?.name,
            categorySlug: course.category?.slug || "general",
            is_free: course.price === 0,
            instructor: "Expert Instructor",
            students: course.studentNumber,
            level: course.level,
            has_certificate: course.hasCertificate,
            conducting_type: course.conductingType,
            has_exam: course.hasExam,
            rating: course.avgRating,
            reviews_count: course.reviews_count || 0,
            duration: course.duration || "Self-paced",
            tags: course.tags || [],
          }}
        />
      ))}
    </div>
  );
}

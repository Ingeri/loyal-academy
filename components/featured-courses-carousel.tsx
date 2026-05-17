"use client";

import { useState } from "react";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description?: string;
  slug: string;
  thumbnail?: string;
  price: number;
  discount?: number;
  category?: { name: string; slug: string };
  categorySlug?: string;
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
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 3;
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const startIndex = currentPage * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const visibleCourses = courses.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="relative">
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
              categorySlug: course.categorySlug || course.category?.slug || "general",
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="h-10 w-10 rounded-full"
            aria-label="Previous courses"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === currentPage
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-10 w-10 rounded-full"
            aria-label="Next courses"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

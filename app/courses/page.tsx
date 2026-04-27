"use client";

import React, { useState, useEffect } from "react"; // Ensure these are imported
import { Search } from "lucide-react";
import { allCourses } from "@/lib/courses";
import CourseCard from "@/components/courses/CourseCard";
import FilterSidebar from "@/components/courses/FilterSidebar";

export default function CoursesPage() {
  // Fix for setMounted error: Ensure it is inside the component and typed
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard search state (we'll use this later)
  const [searchQuery, setSearchQuery] = useState("");

  // If not mounted, return a matching background to prevent the "flicker"
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-slate-950" />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 xl:w-1/5">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
              {/* Search Input */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:ring-2 focus:ring-amber-500 focus:outline-none transition text-foreground"
                />
              </div>

              {/* Fix for <select> error: Added name and id to satisfy TS/React */}
              <div className="w-full md:w-auto">
                <select
                  id="course-sort"
                  name="sort"
                  defaultValue="popular"
                  title="Sort courses"
                  className="h-12 w-full md:w-48 pl-4 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 outline-none text-foreground cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="new">Newest First</option>
                </select>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {allCourses
                .filter((course) =>
                  course.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                )
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>

            {/* Empty State if no search results */}
            {allCourses.filter((course) =>
              course.title.toLowerCase().includes(searchQuery.toLowerCase()),
            ).length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500">
                  No courses found matching {searchQuery}.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

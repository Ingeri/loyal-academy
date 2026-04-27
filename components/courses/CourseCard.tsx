// components/courses/CourseCard.tsx
import React from "react";
import Image from "next/image";
import { Clock, Users, Star } from "lucide-react";
import { Course } from "@/lib/courses";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition duration-300 flex flex-col">
      {/* Course Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Special Badge (e.g., Best Seller) */}
        {course.badge && (
          <div
            className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${course.badgeColor}`}
          >
            {course.badge}
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900/80 backdrop-blur-sm">
          {course.price}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Category & Level Tags */}
        <div className="flex gap-2 mb-4">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Description */}
        <h3 className="font-serif text-2xl font-bold text-slate-950 dark:text-white mb-3 group-hover:text-amber-600 transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
          {course.description}
        </p>

        {/* Stats & Rating */}
        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-500 mb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            {course.duration}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-500" />
            {course.students}
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {course.rating.toFixed(1)}
            </span>
            <span className="text-slate-400 dark:text-slate-600">
              ({course.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Instructor & CTA Button (At the bottom) */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
              <Image
                src={course.instructorAvatar}
                alt={course.instructorName}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {course.instructorName}
            </span>
          </div>
          <Link href={`/courses/${course.categorySlug}/${course.id}`} className="block">
            <button
              className={`w-full px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                course.isFree
                  ? "border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                  : "bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-amber-900/10"
              }`}
            >
              {course.isFree ? "Start Free Course" : "Enroll Now"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

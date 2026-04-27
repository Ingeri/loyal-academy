// components/courses/FilterSidebar.tsx
import React from "react";

const filterGroups = [
  {
    title: "Category",
    items: ["All Categories", "Programming", "Design", "Business", "Marketing"],
  },
  {
    title: "Level",
    items: ["All Levels", "Beginner", "Intermediate", "Advanced"],
  },
  {
    title: "Duration",
    items: ["Under 5 hours", "5-20 hours", "20+ hours"],
  },
  {
    title: "Price",
    items: ["Free", "Paid"],
  },
];

export default function FilterSidebar() {
  return (
    <div className="sticky top-24 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <h2 className="font-serif text-2xl font-bold mb-1 text-slate-900 dark:text-amber-400">
        Filter Courses
      </h2>
      <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800 mb-8 mt-2" />

      {filterGroups.map((group) => (
        <div key={group.title} className="mb-10 last:mb-0">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-widest text-xs">
            {group.title}
          </h4>
          <div className="space-y-4">
            {group.items.map((item, index) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer text-slate-700 dark:text-slate-300">
                <input 
                  type="checkbox" 
                  defaultChecked={index === 0 && (group.title === "Category" || group.title === "Level")}
                  className="h-5 w-5 rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500 bg-white dark:bg-slate-950"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
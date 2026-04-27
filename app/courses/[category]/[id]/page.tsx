"use client";

import React, { useState } from "react";
import { allCourses, type Course } from "@/lib/courses";
import { notFound } from "next/navigation";
import { 
  Clock, BookOpen, ShieldCheck, Star, Users, 
  ChevronRight, Laptop, Award, Building2, Check, 
  ChevronDown, ChevronUp, TrendingUp, Briefcase 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CourseDetailsPage({ 
  params 
}: { 
  params: any // Use any for params to handle the async nature in Next.js 15
}) {
  const { category, id } = React.use(params as any); // Unwrap params

  const course = allCourses.find(
    (c: Course) => c.categorySlug === category.toLowerCase() && c.id === id
  );

  if (!course) notFound();

  const [activeTab, setActiveTab] = useState("Overview");
  const [openModule, setOpenModule] = useState<number | null>(0);

  return (
    <div className="bg-[#fcfaff] dark:bg-slate-950 min-h-screen transition-colors pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="bg-[#51436d] text-white pt-12 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-xs flex items-center gap-2 mb-8 text-amber-400 font-bold uppercase tracking-widest">
            <Link href="/">Home</Link> <ChevronRight size={12} />
            <Link href="/courses">{course.category}</Link> <ChevronRight size={12} />
            <span className="text-white opacity-70">{course.title}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 max-w-4xl leading-tight">
            {course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-md font-black">
              {course.rating} <Star size={16} fill="currentColor" />
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Users size={20} className="p-1 bg-white/20 rounded-full" />
              <span className="font-semibold">{course.students} Students</span>
            </div>
          </div>

          {/* Stats Cards Inside Hero */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-2 md:p-4 inline-flex flex-wrap shadow-2xl border border-white/10">
            <HeroStat label="Duration" value={course.duration} />
            <HeroStat label="Study" value="Online" />
            <HeroStat label="Requirements" value={course.requirements || "None"} />
            <HeroStat label="Certificate" value="On Completion" />
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT & SIDEBAR */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Content Area */}
          <div className="lg:col-span-8">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-t-xl">
              {['Overview', 'Syllabus', 'Certifications', 'Learner Stories', 'FAQs'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold rounded-lg transition-all ${
                    activeTab === tab 
                    ? 'bg-white dark:bg-slate-900 text-[#51436d] dark:text-amber-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-b-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {activeTab === 'Overview' && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-serif font-bold mb-6 text-slate-900 dark:text-white">{course.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-4">{course.description}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{course.descriptionExtra}</p>
                  </div>

                  {/* Learning Outcomes Grid */}
                  <div>
                    <h3 className="text-center font-bold text-slate-900 dark:text-white flex items-center justify-center gap-4 mb-8">
                      <span className="h-px w-12 bg-slate-300"></span> LEARNING OUTCOMES <span className="h-px w-12 bg-slate-300"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {course.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="text-orange-600 mt-1 shrink-0" size={18} strokeWidth={3} />
                          <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Who Should Learn */}
                  <div>
                     <h3 className="text-center font-bold text-slate-900 dark:text-white flex items-center justify-center gap-4 mb-8">
                      <span className="h-px w-12 bg-slate-300"></span> WHO SHOULD LEARN THIS COURSE <span className="h-px w-12 bg-slate-300"></span>
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                      {course.audience.map((item, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-full whitespace-nowrap text-sm font-semibold border border-slate-200 dark:border-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Syllabus' && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-center mb-10">SYLLABUS</h2>
                  {course.modules.map((mod, i) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setOpenModule(openModule === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col items-start text-left">
                          <span className="bg-[#51436d] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-tighter">Module {i + 1}</span>
                          <span className="text-xl font-bold text-slate-800 dark:text-white">{mod.title}</span>
                          <span className="text-sm text-slate-500 mt-1">{mod.description.substring(0, 50)}...</span>
                        </div>
                        {openModule === i ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                      </button>
                      {openModule === i && (
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{mod.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Future Market Growth Section */}
            <div className="mt-12 bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
               <h3 className="text-center font-bold text-slate-900 dark:text-white flex items-center justify-center gap-4 mb-8 uppercase tracking-widest">
                <span className="h-px w-12 bg-slate-300"></span> Future Market Growth <span className="h-px w-12 bg-slate-300"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50/50 dark:bg-slate-800/50 p-8 rounded-xl text-center border border-red-100 dark:border-slate-700">
                  <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 px-6 py-2 rounded-full font-bold text-2xl mb-4">
                    {course.marketGrowth.value}
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{course.marketGrowth.label}</p>
                </div>
                <div className="bg-red-50/50 dark:bg-slate-800/50 p-8 rounded-xl text-center border border-red-100 dark:border-slate-700">
                  <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 px-6 py-2 rounded-full font-bold text-2xl mb-4">
                    {course.marketGrowth.growth} Growth
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{course.marketGrowth.growthLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Price & CTA Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 -mt-32 relative z-30">
              <p className="text-slate-500 text-sm font-medium mb-4">Full Course</p>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold text-slate-950 dark:text-white">{course.price}</span>
                  {course.originalPrice && (
                    <span className="text-slate-400 line-through text-2xl mb-1">{course.originalPrice}</span>
                  )}
                </div>
                {course.discountPercent && (
                  <span className="bg-amber-400 text-slate-900 text-xs font-black px-2 py-1 rounded">
                    {course.discountPercent}% OFF
                  </span>
                )}
              </div>
              
              <button className="w-full py-4 bg-[#b35fa2] hover:bg-[#9a4d8a] text-white font-bold rounded-lg text-xl transition-all shadow-lg hover:shadow-purple-500/20 mb-8 active:scale-95">
                Join this Course
              </button>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Course Includes:</h4>
                <SidebarFeature icon={<Laptop size={18}/>} text="Online Study Mode" />
                <SidebarFeature icon={<Clock size={18}/>} text={`${course.duration} Content`} />
                <SidebarFeature icon={<Users size={18}/>} text="Study at your own Pace" />
                <SidebarFeature icon={<Award size={18}/>} text="Completion Certificate" />
              </div>
            </div>

            {/* Key Aspects Table-Style Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="bg-[#51436d] p-5 text-white font-bold text-center uppercase tracking-widest text-sm">
                Key Aspects of Course
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {course.keyAspects.map((aspect, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <span className="text-orange-600 text-xl">{aspect.emoji}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{aspect.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-8 py-3 border-r border-slate-100 dark:border-slate-800 last:border-0 text-center">
      <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">{label}</p>
      <p className="text-slate-800 dark:text-white font-bold text-lg">{value}</p>
    </div>
  );
}

function SidebarFeature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
      <span className="text-[#51436d] dark:text-amber-500">{icon}</span>
      {text}
    </div>
  );
}
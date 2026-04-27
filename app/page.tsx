import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 border-b border-slate-200 dark:border-slate-900">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-slate-900 dark:text-amber-400 mb-6">
            Royal Academy
          </h1>
          <p className="max-w-[700px] mx-auto text-slate-600 dark:text-slate-400 md:text-xl mb-10 leading-relaxed">
            Where tradition meets innovation. Explore our world-class curriculum 
            designed for the leaders of tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses" 
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-amber-900/20"
            >
              Explore Courses
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 border-2 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold rounded-full transition-all"
            >
              Our Heritage
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Pillars Section */}
      <section className="w-full py-20 container px-4 mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard 
            title="Elite Faculty" 
            desc="Learn from industry veterans and academic masters who are leaders in their fields." 
          />
          <FeatureCard 
            title="Modern Tech" 
            desc="Experience a seamless learning environment built on the cutting edge of Next.js 15." 
          />
          <FeatureCard 
            title="Global Community" 
            desc="Join an exclusive network of scholars and alumni spanning across six continents." 
          />
        </div>
      </section>

      {/* 3. Featured Disciplines (The "Royal" Grid) */}
      <section className="w-full py-20 bg-slate-100 dark:bg-slate-900/50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-amber-400">
                Featured Disciplines
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Curated pathways to mastery</p>
            </div>
            <Link href="/courses" className="text-amber-600 font-bold hover:underline underline-offset-4">
              View All Departments &rarr;
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CourseCard title="Digital Sorcery" category="Development" price="$199" />
            <CourseCard title="The Art of Design" category="Design" price="$149" />
            <CourseCard title="Quantum Economics" category="Finance" price="$299" />
            <CourseCard title="Modern Philosophy" category="Humanities" price="Free" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- Sub-Components --- */

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-1 w-12 bg-amber-500 mb-6 rounded-full" />
      <h3 className="text-2xl font-serif font-bold mb-3 text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function CourseCard({ title, category, price }: { title: string; category: string; price: string }) {
  return (
    <div className="group relative p-[1px] rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-amber-400 hover:to-amber-600 transition-all duration-500">
      <div className="bg-white dark:bg-slate-950 p-8 rounded-[15px] h-full flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 mb-2">
          {category}
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-8">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4">
          <span className="font-mono font-bold text-slate-900 dark:text-slate-300">{price}</span>
          <button className="text-sm font-bold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Enroll &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
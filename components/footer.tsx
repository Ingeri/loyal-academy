import Link from "next/link";
import { Globe, Cpu, Users, Mail } from "lucide-react"; // Common icons that always work

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <span className="font-serif text-2xl font-bold text-slate-900 dark:text-amber-400">
              ROYAL ACADEMY
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
              Ex Sapientia, Potentia.
            </p>
          </div>

          {/* Academy Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Academy</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/courses" className="hover:text-amber-600">Courses</Link></li>
              <li><Link href="/faculty" className="hover:text-amber-600">Faculty</Link></li>
            </ul>
          </div>

          {/* Socials - Using reliable icons */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4">
               <Globe size={20} className="text-slate-400 hover:text-amber-500 cursor-pointer" />
               <Users size={20} className="text-slate-400 hover:text-amber-500 cursor-pointer" />
               <Mail size={20} className="text-slate-400 hover:text-amber-500 cursor-pointer" />
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Gazette</h4>
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full p-2 text-sm rounded border dark:bg-slate-900 dark:border-slate-800" 
            />
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-900 mt-12 pt-8 text-center text-xs text-slate-500">
          © {currentYear} Royal Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
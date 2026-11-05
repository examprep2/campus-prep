import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { SUPPORTED_BRANCHES } from '../data/landingData';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer id="about" className="border-t border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#151923] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3157D5] dark:bg-[#6B8CFF] flex items-center justify-center text-white dark:text-slate-950 shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-[#172033] dark:text-[#F1F5F9]">Campus-Prep</span>
            </Link>
            <p className="text-xs sm:text-sm text-[#687386] dark:text-[#A0AEC0] leading-relaxed max-w-sm">
              An open, decentralized university study-material sharing platform for Mumbai
              University engineering students across all 8 semesters.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-[#16845B] dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Moderated academic review pipeline</span>
            </div>
          </div>

          {/* Col 2: Supported Branches */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-[#172033] dark:text-[#F1F5F9] uppercase tracking-wider font-mono text-[11px]">
              Supported Branches
            </h4>
            <ul className="space-y-2 text-[#687386] dark:text-[#A0AEC0]">
              {SUPPORTED_BRANCHES.map((b) => (
                <li key={b.id}>
                  <Link to="/materials" className="hover:text-[#3157D5] dark:hover:text-[#6B8CFF] transition-colors">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-[#172033] dark:text-[#F1F5F9] uppercase tracking-wider font-mono text-[11px]">
              Platform Links
            </h4>
            <ul className="space-y-2 text-[#687386] dark:text-[#A0AEC0]">
              <li>
                <Link to="/materials" className="hover:text-[#3157D5] dark:hover:text-[#6B8CFF] transition-colors">
                  Study Materials Vault
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-[#3157D5] dark:hover:text-[#6B8CFF] transition-colors">
                  Upload Notes
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#3157D5] dark:hover:text-[#6B8CFF] transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[#3157D5] dark:hover:text-[#6B8CFF] transition-colors">
                  Register as Student
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#3157D5] dark:hover:text-[#6B8CFF] transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[#E6E9F0] dark:border-[#30394A] space-y-4">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
            <strong className="font-semibold text-slate-600 dark:text-slate-400">Academic Disclaimer: </strong>
            Campus-Prep is an independent educational platform created for Mumbai University
            engineering students. Course syllabi, subject codes, and curriculum revisions are the
            property of Mumbai University and respective autonomous institutions. Materials are
            shared under academic fair use.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>© {CURRENT_YEAR} Campus-Prep. Built with precision for engineering students.</span>
            <span className="font-mono text-[11px]">Mumbai University Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

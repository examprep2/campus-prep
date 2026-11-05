import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function HeroSection() {
  return (
    <section id="hero" className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 text-center max-w-5xl mx-auto space-y-8">
      {/* University Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs font-semibold text-[#3157D5] dark:text-[#6B8CFF] shadow-2xs transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3157D5] dark:bg-[#6B8CFF]" />
        <span>Mumbai University Engineering Curriculum • Rev-2019 C-Scheme</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#172033] dark:text-[#F1F5F9] font-display leading-[1.18]">
          University study materials, past question papers & syllabus notes.
        </h1>
        <p className="text-base sm:text-lg text-[#687386] dark:text-[#A0AEC0] leading-relaxed max-w-2xl mx-auto">
          Campus-Prep is an open, curriculum-indexed academic platform for Mumbai University
          engineering students to find verified notes, past papers, and share revision resources.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link to="/materials" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" icon={BookOpen} className="w-full sm:w-auto shadow-sm">
            Explore Materials Library
          </Button>
        </Link>
        <Link to="/signup" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" iconRight={ArrowRight} className="w-full sm:w-auto">
            Get Started Free
          </Button>
        </Link>
      </div>

      {/* Product Preview / UI Showcase */}
      <div className="pt-8">
        <div className="rounded-2xl border border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#1B2230] shadow-md overflow-hidden text-left max-w-4xl mx-auto transition-colors">
          {/* Mock Browser/App Header Bar */}
          <div className="px-4 py-3 border-b border-[#E6E9F0] dark:border-[#30394A] bg-slate-50 dark:bg-[#151923] flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 font-mono text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                campus-prep.edu/materials?branch=COMPS&sem=7
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#3157D5] dark:text-[#6B8CFF] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
              <span>Semester 7 • Computer Engineering</span>
            </div>
          </div>

          {/* Mock Document Rows */}
          <div className="p-4 sm:p-6 space-y-3 bg-[#F7F8FC]/50 dark:bg-[#0F1117]/50">
            {/* Row 1 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#3157D5] dark:text-[#6B8CFF] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#3157D5] dark:text-[#6B8CFF] bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded">
                      CSC701
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Distributed Computing</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] truncate">
                    Complete Distributed Consensus (Paxos & Raft) Module 1-4 Handouts
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-[#16845B] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Approved</span>
                </span>
                <span className="text-xs font-semibold text-[#3157D5] dark:text-[#6B8CFF] px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-[#222B3A] cursor-pointer">
                  View PDF
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[#C58A27] dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#C58A27] dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded">
                      CSC702
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Cryptography & Security</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] truncate">
                    Mumbai University End-Sem Question Paper (May 2024 Exam)
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-[#16845B] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Approved</span>
                </span>
                <span className="text-xs font-semibold text-[#3157D5] dark:text-[#6B8CFF] px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-[#222B3A] cursor-pointer">
                  View PDF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Sparkles, School } from 'lucide-react';
import { DEPARTMENTS } from '../data/landingData';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({
  departments = DEPARTMENTS,
  onSelectBranch,
}) {
  return (
    <footer className="border-t border-violet-500/20 bg-[#0d0918]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Curriculum Banner Pre-footer */}
        <div
          id="curriculum-info"
          className="p-6 rounded-2xl border bg-[#140d26]/60 border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <School className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm sm:text-base">
                Need syllabus breakdown for Mumbai (MU) or Pune University (SPPU)?
              </h4>
              <p className="text-xs text-[#94a3b8]">
                All material is tagged with credit scheme codes, module weightages, and 80-mark distribution schemes.
              </p>
            </div>
          </div>
          <a
            href="#curriculum-info"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-slate-700/80 text-indigo-300 hover:text-white transition-colors whitespace-nowrap"
          >
            View Syllabus Schemas →
          </a>
        </div>

        {/* 4 Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Academic Streams */}
          <div className="space-y-3">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Academic Streams
            </h5>
            <ul className="space-y-2 text-xs text-[#94a3b8]">
              {departments.slice(0, 5).map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onSelectBranch?.(d.id)}
                    className="hover:text-indigo-300 transition-colors text-left cursor-pointer"
                  >
                    {d.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => onSelectBranch?.('MECH')}
                  className="hover:text-indigo-300 transition-colors text-left cursor-pointer"
                >
                  Mechanical & Auto
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: University Schemas */}
          <div className="space-y-3">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              University Schemas
            </h5>
            <ul className="space-y-2 text-xs text-[#94a3b8]">
              <li>
                <a href="#curriculum-info" className="hover:text-indigo-300 transition-colors">
                  Mumbai University (Rev-2019 'C')
                </a>
              </li>
              <li>
                <a href="#curriculum-info" className="hover:text-indigo-300 transition-colors">
                  SPPU Pune (2019 & 2024 Pattern)
                </a>
              </li>
              <li>
                <a href="#curriculum-info" className="hover:text-indigo-300 transition-colors">
                  Autonomous Engineering Colleges
                </a>
              </li>
              <li>
                <a href="#curriculum-info" className="hover:text-indigo-300 transition-colors">
                  SGPA to Percentage Converter
                </a>
              </li>
              <li>
                <a href="#curriculum-info" className="hover:text-indigo-300 transition-colors">
                  KT Rules & Revaluation Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & AI */}
          <div className="space-y-3">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Platform & AI
            </h5>
            <ul className="space-y-2 text-xs text-[#94a3b8]">
              <li>
                <a
                  href="#features-section"
                  className="hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Synapse AI Revision Engine
                </a>
              </li>
              <li>
                <a href="#contributors-section" className="hover:text-indigo-300 transition-colors">
                  Contributor Karma Rules
                </a>
              </li>
              <li>
                <a href="#features-section" className="hover:text-indigo-300 transition-colors">
                  Moderator Verification Guidelines
                </a>
              </li>
              <li>
                <a href="#features-section" className="hover:text-indigo-300 transition-colors">
                  API & Developer Webhooks
                </a>
              </li>
              <li>
                <a href="#features-section" className="hover:text-indigo-300 transition-colors">
                  Bug Bounty & Security
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Support */}
          <div className="space-y-3">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Community
            </h5>
            <ul className="space-y-2 text-xs text-[#94a3b8]">
              <li>
                <a href="#contributors-section" className="hover:text-indigo-300 transition-colors">
                  Discord Study Lounges
                </a>
              </li>
              <li>
                <a href="#contributors-section" className="hover:text-indigo-300 transition-colors">
                  Telegram Exam Alert Bot
                </a>
              </li>
              <li>
                <a href="#contributors-section" className="hover:text-indigo-300 transition-colors">
                  Campus Ambassador Program
                </a>
              </li>
              <li>
                <a href="#contributors-section" className="hover:text-indigo-300 transition-colors">
                  GitHub Open Source Repos
                </a>
              </li>
              <li>
                <a href="#contributors-section" className="hover:text-indigo-300 transition-colors">
                  Student Grievance Cell
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 font-sans leading-relaxed">
          <span className="text-slate-300 font-semibold">Engineering Disclaimer: </span>
          Campus Prep is an open academic repository engineered by engineering students for students.
          All course syllabi, university trademarks (MU, SPPU, DBATU), and exam schemes belong to their
          respective institutions. Materials uploaded are crowd-shared under fair academic use and
          peer-reviewed for quality.
        </div>

        {/* Bottom Copyright & Version Notice */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#94a3b8]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              CP
            </div>
            <span>© {CURRENT_YEAR} Campus Prep Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px]">Systems Operational (24ms)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-slate-800 text-[11px] text-slate-400">
              v3.4.0-PROD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


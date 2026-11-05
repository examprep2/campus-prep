import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, BookOpen, ShieldCheck, Share2 } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#0F1117] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Top Back & Brand & ThemeToggle */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687386] hover:text-[#172033] dark:text-[#A0AEC0] dark:hover:text-[#F1F5F9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3157D5] dark:bg-[#6B8CFF] flex items-center justify-center text-white dark:text-slate-950 shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-[#172033] dark:text-[#F1F5F9]">Campus-Prep</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Card Header */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] font-display">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-[#687386] dark:text-[#A0AEC0]">{subtitle}</p>}
        </div>

        {/* Form Container Card */}
        <div className="bg-white dark:bg-[#1B2230] rounded-2xl border border-[#E6E9F0] dark:border-[#30394A] shadow-sm p-6 sm:p-8">
          {children}
        </div>

        {/* Reassurance Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#687386] dark:text-[#A0AEC0]">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#3157D5] dark:text-[#6B8CFF]" />
            <span>MU Curated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16845B] dark:text-emerald-400" />
            <span>Verified Uploads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Peer Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
}


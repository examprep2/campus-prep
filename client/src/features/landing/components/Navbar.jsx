import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Search,
  Bell,
  Upload,
  X,
  Menu,
} from 'lucide-react';

export default function Navbar({
  activeBranch = 'COMPS',
  selectedSem = 'Semester 7',
  searchQuery = '',
  onSearchChange,
  onUploadClick,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b transition-all duration-200"
      style={{
        backgroundColor: 'rgba(13, 9, 24, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(139, 92, 246, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo & Engineering Portal Tag */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  Campus<span className="text-violet-400">Prep</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50/10 text-indigo-400 border border-indigo-500/30 font-mono text-[11px] tracking-wider uppercase">
                  ENGG PORTAL
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeBranch} • {selectedSem}
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <a
            href="#vault-section"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
          >
            Vault
          </a>
          <a
            href="#features-section"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI Synthesizer
          </a>
          <a
            href="#contributors-section"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            Contributors
          </a>
          <a
            href="#curriculum-info"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            Syllabus Schemes
          </a>
        </nav>

        {/* Search, Notifications & Profile Action Controls */}
        <div className="flex items-center gap-3">
          {/* Global Controlled Search Bar */}
          <div className="relative hidden sm:block w-48 md:w-64 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search subjects, codes, PYQs..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-900/80 border border-violet-500/25 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all font-sans"
            />
            <kbd className="hidden lg:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-slate-700/60 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors border border-transparent hover:border-violet-500/20"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[#0d0918]" />
          </button>

          {/* Upload Notes Action CTA */}
          <button
            type="button"
            onClick={onUploadClick}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Note
          </button>

          {/* User Profile Avatar with Online Beacon */}
          <div className="relative flex items-center pl-1">
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-violet-500/40 bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center text-xs font-semibold text-white overflow-hidden ring-2 ring-indigo-500/20 hover:scale-105 transition-transform"
            >
              <span>AK</span>
            </button>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0d0918] rounded-full" />
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-violet-500/20"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 border-t border-violet-500/20 bg-[#0d0918]/95 backdrop-blur-xl space-y-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notes, codes..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900/90 border border-violet-500/30 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-sans"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <a
              href="#vault-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Resource Vault
            </a>
            <a
              href="#features-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Synapse AI Revision
            </a>
            <a
              href="#contributors-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              Hall of Contributors
            </a>
            <a
              href="#curriculum-info"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              MU & SPPU Syllabus Mappings
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


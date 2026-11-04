import { useState, useEffect, useRef } from 'react';
import { GraduationCap, Search, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Auth & Onboarding', href: '#auth-section' },
  { label: 'Material Vault', href: '#vault-section' },
  { label: 'AI Assistant', href: '#assistant-section' },
  { label: 'Admin Center', href: '#admin-section' },
];

export default function Navbar({
  searchQuery = '',
  onSearchChange,
  onLoginClick,
  onSignupClick,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Cmd/Ctrl + K focuses the search box
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b font-display"
      style={{
        backgroundColor: 'rgba(13, 9, 24, 0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(139, 92, 246, 0.18)',
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        {/* Logo + portal tag */}
        <a href="#" className="flex shrink-0 items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-[#1a1233] transition-transform duration-200 group-hover:scale-105">
            {/* <GraduationCap className="h-5 w-5 text-violet-400" /> */}
            <img alt="Campus Prep Logo" src="https://lh3.googleusercontent.com/aida/AEtjO1XtCXuAUuKeEVwItUaDBaIuvpIH2E9Jd64t1zwM27vZ5lIb8gtZhryPgETpH7MZPXkKXFt_wfgBa49nJ9HBN1ZM091kQ6PZulxAIvqmejxGbqkt3Qj1SQrHZVDpVUasjAFdd5eW_hyHO9iBXKvsM09qimD1nXk-B8-vTsbhO_4OMMPrMc2urIYLafVyJjMLrwA2O_SYBGCmFOz27IifZq96WM-BEfLs1P5-OzsFC6QTZg"></img>
          </div>
          <span className="text-[22px] font-bold tracking-tight text-white">
            Campus Prep
          </span>
          <span className="hidden rounded-sm bg-indigo-100 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-600 sm:inline-block">
            ENGG PORTAL
          </span>
        </a>

        {/* Desktop nav links (centered) */}
        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[15px] font-extralight text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Search + auth buttons */}
        <div className="flex items-center gap-3 ">
          <div className="relative hidden w-64 md:block xl:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search notes, syllabus, PYQs."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-md border border-violet-500/30 bg-[#110b20] py-2 pl-10 pr-14 text-sm text-slate-200 placeholder-slate-300 transition-all focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/40"
            />
            <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-600 lg:inline-flex">
              ⌘K
            </kbd>
          </div>

          {/* Login / Sign up */}
          <button
            type="button"
            onClick={onLoginClick}
            className="hidden rounded-lg border border-violet-500/40 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-violet-400 hover:bg-white/5 hover:text-white sm:inline-flex"
          >
            Login
          </button>
          <button
            type="button"
            onClick={onSignupClick}
            className="hidden rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 sm:inline-flex"
          >
            Sign up
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="rounded-lg border border-violet-500/20 p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="space-y-3 border-t border-violet-500/20 bg-[#0d0918]/95 px-4 pb-5 pt-3 backdrop-blur-xl lg:hidden">
          <div className="relative w-full md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search notes, syllabus, PYQs."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-md border border-violet-500/30 bg-[#110b20] py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-300 focus:border-indigo-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick?.();
              }}
              className="rounded-lg border border-violet-500/40 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSignupClick?.();
              }}
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Menu, X, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';

export default function Navbar({ searchQuery = '', onSearchChange, onSearchSubmit }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

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

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      } else {
        navigate(`/materials?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E6E9F0]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo and Platform Name */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#3157D5] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-tight text-[#172033]">
              Campus-Prep
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-50 text-[#3157D5] border border-blue-100">
              Mumbai Univ
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#687386]">
          <a href="#hero" className="hover:text-[#172033] transition-colors">
            Home
          </a>
          <a href="#features" className="hover:text-[#172033] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#172033] transition-colors">
            How It Works
          </a>
          <a href="#branches" className="hover:text-[#172033] transition-colors">
            Branches
          </a>
          <a href="#about" className="hover:text-[#172033] transition-colors">
            About
          </a>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-56 lg:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full rounded-lg border border-[#E6E9F0] bg-slate-50 py-1.5 pl-8 pr-10 text-xs text-[#172033] placeholder:text-slate-400 focus:bg-white focus:border-[#3157D5] focus:outline-none focus:ring-2 focus:ring-[#3157D5]/20 transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden font-mono text-[9px] text-slate-400 border border-slate-200 bg-white px-1 py-0.2 rounded lg:inline-block">
              ⌘K
            </kbd>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="outline" size="sm" icon={User}>
                  {user?.role === 'admin' ? 'Admin Center' : 'Dashboard'}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" iconRight={ArrowRight}>
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="p-1.5 rounded-lg border border-[#E6E9F0] text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E6E9F0] bg-white px-4 py-4 space-y-3 lg:hidden animate-in slide-in-from-top-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full rounded-lg border border-[#E6E9F0] bg-slate-50 py-2 pl-9 pr-4 text-xs text-[#172033]"
            />
          </div>

          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#branches"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              Supported Branches
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              About Campus-Prep
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="primary" size="md" className="w-full">
                  Go to {user?.role === 'admin' ? 'Admin Center' : 'Student Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopNavbar({ onOpenMobile, unreadCount = 0 }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E6E9F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb / Academic Info Tag */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#687386]">
          <span className="font-semibold text-[#172033]">
            {user?.branch?.name || 'Engineering'}
          </span>
          <span>•</span>
          <span>Year {user?.year || 1}</span>
          <span>•</span>
          <span>Semester {user?.semester || 1}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link
          to="/materials"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E9F0] text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#3157D5]" />
          <span>Browse Library</span>
        </Link>

        {/* Notifications Icon with Counter */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#3157D5] text-[10px] font-bold text-white leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E6E9F0]">
          <div className="w-8 h-8 rounded-full bg-[#3157D5]/10 text-[#3157D5] font-semibold text-xs flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-[#172033] block leading-tight">
              {user?.name}
            </span>
            <span className="text-[10px] text-[#687386] block">
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}


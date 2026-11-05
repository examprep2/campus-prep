import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  FolderArchive,
  Bell,
  Shield,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudentSidebar({ unreadCount = 0, onCloseMobile }) {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Study Materials', path: '/materials', icon: BookOpen },
    { label: 'Upload Notes', path: '/upload', icon: Upload },
    { label: 'My Uploads', path: '/my-uploads', icon: FolderArchive },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  return (
    <aside className="w-64 h-full bg-white dark:bg-[#151923] border-r border-[#E6E9F0] dark:border-[#30394A] flex flex-col justify-between select-none transition-colors">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#E6E9F0] dark:border-[#30394A] gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3157D5] dark:bg-[#6B8CFF] flex items-center justify-center text-white dark:text-slate-950 shadow-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#172033] dark:text-[#F1F5F9] block leading-none">
              Campus-Prep
            </span>
            <span className="text-xs text-[#687386] dark:text-[#A0AEC0] font-normal mt-0.5 block">
              Student workspace
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <div className="text-xs font-medium text-slate-400 dark:text-slate-500 px-3 mb-1.5">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EEF2FF] dark:bg-[#222B3A] text-[#3157D5] dark:text-[#6B8CFF] font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#222B3A]/60 hover:text-slate-900 dark:hover:text-[#F1F5F9]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-1.5 py-0.2 text-[11px] font-mono font-semibold rounded-full bg-[#3157D5] dark:bg-[#6B8CFF] text-white dark:text-slate-950">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}

          {/* Admin center shortcut if user has admin privileges */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#30394A]">
              <div className="text-xs font-medium text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                Administration
              </div>
              <NavLink
                to="/admin"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#222B3A]/60 hover:text-slate-900 dark:hover:text-[#F1F5F9]'
                  }`
                }
              >
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Admin Console</span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* User profile & Logout footer */}
      <div className="p-4 border-t border-[#E6E9F0] dark:border-[#30394A] bg-slate-50/50 dark:bg-[#151923]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#222B3A] text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-300 dark:border-[#30394A]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#687386] dark:text-[#A0AEC0] truncate">
                {user?.branch?.code || 'MU Engg'} • Sem {user?.semester || 1}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

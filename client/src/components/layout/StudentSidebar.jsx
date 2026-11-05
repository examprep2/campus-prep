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
    <aside className="w-64 h-full bg-white border-r border-[#E6E9F0] flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#E6E9F0] gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3157D5] flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#172033] block leading-none">
              Campus-Prep
            </span>
            <span className="text-[10px] text-[#687386] font-medium tracking-wider uppercase mt-1 block">
              Student Workspace
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#3157D5] font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#3157D5] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}

          {/* Admin center shortcut if user has admin privileges */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Administration
              </div>
              <NavLink
                to="/admin"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Shield className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Admin Console</span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* User profile & Logout footer */}
      <div className="p-4 border-t border-[#E6E9F0] bg-slate-50/50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#3157D5]/10 text-[#3157D5] font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#172033] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#687386] truncate">
                {user?.branch?.code || 'MU Engg'} • Sem {user?.semester || 1}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}


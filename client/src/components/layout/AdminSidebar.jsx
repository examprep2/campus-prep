import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileCheck2,
  Users,
  Network,
  BookMarked,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ pendingCount = 0, onCloseMobile }) {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard, end: true },
    {
      label: 'Material Queue',
      path: '/admin/materials',
      icon: FileCheck2,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Branch Taxonomy', path: '/admin/branches', icon: Network },
    { label: 'Subject Catalog', path: '/admin/subjects', icon: BookMarked },
  ];

  return (
    <aside className="w-64 h-full bg-[#172033] text-slate-200 border-r border-slate-800 flex flex-col justify-between select-none">
      <div>
        {/* Admin Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-white block leading-none">
              Admin Console
            </span>
            <span className="text-[10px] text-indigo-300 font-mono tracking-wider uppercase mt-1 block">
              Moderation & Ops
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500 text-slate-900">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}

          {/* Switch to Student Mode */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Student View
            </div>
            <Link
              to="/dashboard"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Student Portal</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Admin footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}


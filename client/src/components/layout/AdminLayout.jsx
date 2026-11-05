import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, ShieldAlert } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { materialApi } from '../../api/materialApi';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { user } = useAuth();

  // Fetch pending review count
  useEffect(() => {
    let isMounted = true;
    const fetchPending = async () => {
      try {
        const res = await materialApi.getPendingMaterials();
        if (isMounted && res?.success && Array.isArray(res.data?.materials)) {
          setPendingCount(res.data.materials.length);
        }
      } catch {
        // silent fail on queue count
      }
    };
    fetchPending();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F7F8FC] dark:bg-[#0F1117] transition-colors">
      {/* Desktop Admin Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <AdminSidebar pendingCount={pendingCount} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-xs h-full bg-[#151923] z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <AdminSidebar
              pendingCount={pendingCount}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-[#151923] border-b border-[#E6E9F0] dark:border-[#30394A] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#222B3A] transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 uppercase">
                Admin Zone
              </span>
              <span className="text-xs text-[#687386] dark:text-[#A0AEC0] hidden sm:inline">
                Mumbai University Study Materials Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <Link
                to="/admin/materials"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{pendingCount} Pending Approval</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            <div className="flex items-center gap-2 pl-3 border-l border-[#E6E9F0] dark:border-[#30394A]">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-semibold text-xs flex items-center justify-center border border-purple-200 dark:border-purple-800/40">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9] block leading-tight">
                  {user?.name}
                </span>
                <span className="text-[10px] text-purple-700 dark:text-purple-400 font-mono block">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import TopNavbar from './TopNavbar';
import { notificationApi } from '../../api/notificationApi';

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count for topbar and sidebar badge
  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await notificationApi.getMyNotifications({ unread: true, limit: 1 });
        if (isMounted && res?.success) {
          setUnreadCount(res.data?.unreadCount || 0);
        }
      } catch {
        // silent fail on notification count
      }
    };
    fetchUnread();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F7F8FC]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <StudentSidebar unreadCount={unreadCount} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-xs h-full bg-white z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <StudentSidebar
              unreadCount={unreadCount}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          unreadCount={unreadCount}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


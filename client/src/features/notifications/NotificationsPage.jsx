import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { notificationApi } from '../../api/notificationApi';
import { useToast } from '../../context/ToastContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function NotificationsPage() {
  const { success, error: toastError } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterUnread, setFilterUnread] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationApi.getMyNotifications({
        unread: filterUnread,
        page,
        limit: 15,
      });

      if (res?.success) {
        setNotifications(res.data?.notifications || []);
        setUnreadCount(res.data?.unreadCount || 0);
        setTotalPages(res.data?.totalPages || 1);
        setTotal(res.data?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filterUnread, page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkOne = async (id) => {
    try {
      const res = await notificationApi.markRead(id);
      if (res?.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      const res = await notificationApi.markAllRead();
      if (res?.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        success('All notifications marked as read.');
      }
    } catch (err) {
      toastError('Failed to mark all as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'upload_approved':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16845B] border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'upload_rejected':
        return (
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#D64B4B] border border-rose-100 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'admin_message':
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3157D5] border border-blue-100 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Notification Center"
        description="Stay updated with moderation statuses, academic announcements, and administrative reviews."
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              isLoading={markingAll}
              icon={CheckCheck}
            >
              Mark All as Read
            </Button>
          ) : null
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E9F0] pb-3 text-xs font-medium">
        <button
          type="button"
          onClick={() => {
            setFilterUnread(false);
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            !filterUnread
              ? 'bg-[#3157D5] text-white font-semibold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Activity
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterUnread(true);
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterUnread
              ? 'bg-[#3157D5] text-white font-semibold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Unread Only</span>
          {unreadCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterUnread ? 'bg-white text-[#3157D5]' : 'bg-blue-100 text-[#3157D5]'
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <SkeletonLoader type="row" count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchNotifications} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filterUnread ? 'No unread notifications' : 'No notifications yet'}
          description="When an uploaded document is verified or an announcement is published, you will see it here."
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-2xs divide-y divide-[#E6E9F0] overflow-hidden">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  !item.isRead ? 'bg-blue-50/20' : 'hover:bg-slate-50/50'
                }`}
              >
                {renderIcon(item.type)}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
                      <span>{item.title}</span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#3157D5] inline-block" />
                      )}
                    </h3>
                    <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#687386] leading-relaxed">
                    {item.message}
                  </p>

                  {!item.isRead && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => handleMarkOne(item._id)}
                        className="text-[11px] font-semibold text-[#3157D5] hover:underline cursor-pointer"
                      >
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={15}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}


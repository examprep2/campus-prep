import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { adminApi } from '../../api/adminApi';
import { branchApi } from '../../api/branchApi';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/axios';
import {
  Users,
  Ban,
  CheckCircle,
  Trash2,
  Mail,
  Send,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [branch, setBranch] = useState('');
  const [blocked, setBlocked] = useState('');
  const [page, setPage] = useState(1);

  // Selected user dialog states
  const [actionUser, setActionUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Confirmation dialogs
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Message modal
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageData, setMessageData] = useState({ title: '', message: '' });

  // Fetch branches for filter
  useEffect(() => {
    let isMounted = true;
    const fetchBranches = async () => {
      try {
        const res = await branchApi.getBranches();
        if (isMounted && res?.success && Array.isArray(res.data?.branches)) {
          setBranches(res.data.branches);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
      }
    };
    fetchBranches();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getUsers({
        search,
        role,
        branch,
        blocked,
        page,
        limit: 15,
      });

      if (res?.success) {
        setUsers(res.data?.users || []);
        setPagination({
          page: res.data?.page || 1,
          totalPages: res.data?.totalPages || 1,
          total: res.data?.total || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users directory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, role, branch, blocked, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Block
  const handleBlockConfirm = async () => {
    if (!actionUser) return;
    try {
      setActionLoading(true);
      const res = await adminApi.blockUser(actionUser._id);
      if (res?.success) {
        success(`User ${actionUser.name} has been blocked.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === actionUser._id ? { ...u, isBlocked: true } : u))
        );
        setBlockDialogOpen(false);
        setActionUser(null);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to block user.'));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Unblock
  const handleUnblockConfirm = async () => {
    if (!actionUser) return;
    try {
      setActionLoading(true);
      const res = await adminApi.unblockUser(actionUser._id);
      if (res?.success) {
        success(`User ${actionUser.name} has been unblocked.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === actionUser._id ? { ...u, isBlocked: false } : u))
        );
        setUnblockDialogOpen(false);
        setActionUser(null);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to unblock user.'));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!actionUser) return;
    try {
      setActionLoading(true);
      const res = await adminApi.deleteUser(actionUser._id);
      if (res?.success) {
        success(`User ${actionUser.name} permanently deleted.`);
        setUsers((prev) => prev.filter((u) => u._id !== actionUser._id));
        setDeleteDialogOpen(false);
        setActionUser(null);
      }
    } catch (err) {
      // 409 means user has uploaded materials
      const msg = getErrorMessage(
        err,
        'Cannot delete user who has uploaded materials. Please block the account instead.'
      );
      toastError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!actionUser || !messageData.title.trim() || !messageData.message.trim()) {
      toastError('Title and message are required.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await adminApi.sendAdminMessage(actionUser._id, {
        title: messageData.title.trim(),
        message: messageData.message.trim(),
      });
      if (res?.success) {
        success(`Message sent to ${actionUser.name}'s notification center.`);
        setMessageModalOpen(false);
        setMessageData({ title: '', message: '' });
        setActionUser(null);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to send message.'));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Search, inspect, and moderate student registrations, send notifications, and handle administrative security access."
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E6E9F0] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by student name or email..."
            className="sm:col-span-2 lg:col-span-1"
          />

          <Select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            placeholder="All Roles"
            options={[
              { value: '', label: 'All Roles' },
              { value: 'student', label: 'Students' },
              { value: 'admin', label: 'Admins' },
            ]}
          />

          <Select
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              setPage(1);
            }}
            placeholder="All Branches"
            options={[
              { value: '', label: 'All Branches' },
              ...branches.map((b) => ({ value: b._id, label: `${b.name} (${b.code})` })),
            ]}
          />

          <Select
            value={blocked}
            onChange={(e) => {
              setBlocked(e.target.value);
              setPage(1);
            }}
            placeholder="All Account Statuses"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'false', label: 'Active Users' },
              { value: 'true', label: 'Blocked Users' },
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <SkeletonLoader type="table" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users match this filter"
          description="Try broadening your search keywords or resetting status filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setRole('');
            setBranch('');
            setBlocked('');
            setPage(1);
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6E9F0] bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Academic Branch</th>
                    <th className="p-4">Year & Sem</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E9F0] text-xs">
                  {users.map((u) => {
                    const isSelf = String(currentUser?._id) === String(u._id);
                    return (
                      <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 block truncate">
                                {u.name} {isSelf && '(You)'}
                              </span>
                              <span className="text-slate-500 text-[11px] block truncate">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-slate-700">
                          {u.branch ? (
                            <span>
                              {u.branch.name} ({u.branch.code})
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="p-4 text-slate-700">
                          {u.year && u.semester ? (
                            <span>
                              Year {u.year} • Sem {u.semester}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="p-4">
                          <Badge variant={u.role === 'admin' ? 'purple' : 'neutral'} size="sm">
                            {u.role === 'admin' ? 'Admin' : 'Student'}
                          </Badge>
                        </td>

                        <td className="p-4">
                          {u.isBlocked ? (
                            <StatusBadge status="blocked" />
                          ) : u.isVerified ? (
                            <StatusBadge status="active" />
                          ) : (
                            <Badge variant="warning" size="sm">
                              Unverified
                            </Badge>
                          )}
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          {!isSelf && u.role === 'student' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActionUser(u);
                                  setMessageModalOpen(true);
                                }}
                                title="Send in-app notification"
                                className="px-2"
                              >
                                <Mail className="w-3.5 h-3.5 text-slate-600" />
                              </Button>

                              {u.isBlocked ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setActionUser(u);
                                    setUnblockDialogOpen(true);
                                  }}
                                  title="Unblock user"
                                  className="text-emerald-700 hover:text-emerald-800 px-2"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setActionUser(u);
                                    setBlockDialogOpen(true);
                                  }}
                                  title="Block user"
                                  className="text-[#D64B4B] hover:text-rose-700 px-2"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActionUser(u);
                                  setDeleteDialogOpen(true);
                                }}
                                title="Delete user"
                                className="text-slate-400 hover:text-[#D64B4B] px-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={15}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Block Confirmation */}
      <ConfirmationDialog
        isOpen={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        onConfirm={handleBlockConfirm}
        title="Block Student Account"
        message={`Are you sure you want to block ${actionUser?.name}? They will be immediately prevented from logging into Campus-Prep.`}
        confirmText="Block Account"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* Unblock Confirmation */}
      <ConfirmationDialog
        isOpen={unblockDialogOpen}
        onClose={() => setUnblockDialogOpen(false)}
        onConfirm={handleUnblockConfirm}
        title="Unblock Student Account"
        message={`Restore access for ${actionUser?.name}? They will be able to log in and access materials again.`}
        confirmText="Unblock Account"
        variant="primary"
        isLoading={actionLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Permanently Delete Student"
        message={`Delete ${actionUser?.name}? This action cannot be undone. Note: if this user has uploaded materials, the system will require blocking instead to maintain document history.`}
        confirmText="Delete User"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* Send Message Modal */}
      <Modal
        isOpen={messageModalOpen}
        onClose={() => !actionLoading && setMessageModalOpen(false)}
        title="Send Administrative Message"
        description={`Send a direct in-app message to ${actionUser?.name} (${actionUser?.email}).`}
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Input
            label="Message Title"
            placeholder="e.g. Verification follow-up or Subject update"
            value={messageData.title}
            onChange={(e) => setMessageData({ ...messageData, title: e.target.value })}
            maxLength={100}
            required
            autoFocus
          />

          <div className="space-y-1.5 text-left">
            <label htmlFor="admin-msg" className="block text-xs font-semibold text-[#172033]">
              Message Content <span className="text-[#D64B4B]">*</span>
            </label>
            <textarea
              id="admin-msg"
              rows={4}
              maxLength={500}
              placeholder="Type your message for this student..."
              value={messageData.message}
              onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              className="w-full rounded-lg border border-[#E6E9F0] bg-white p-3 text-sm text-[#172033] placeholder:text-slate-400 focus:border-[#3157D5] focus:outline-none focus:ring-2 focus:ring-[#3157D5]/20 transition-colors"
              required
            />
            <div className="text-right text-[11px] text-slate-400">
              {messageData.message.length}/500
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E9F0]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessageModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={actionLoading}
              icon={Send}
            >
              Send Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

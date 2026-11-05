import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { branchApi } from '../../api/branchApi';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../api/axios';
import { Network, Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminBranchesPage() {
  const { success, error: toastError } = useToast();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', isActive: true });
  const [errors, setErrors] = useState({});

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await branchApi.getAllBranches();
      if (res?.success && Array.isArray(res.data?.branches)) {
        setBranches(res.data.branches);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const openCreateModal = () => {
    setEditingBranch(null);
    setFormData({ name: '', code: '', isActive: true });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      isActive: branch.isActive !== false,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Branch name is required';
    if (!formData.code.trim()) {
      errs.code = 'Branch code is required';
    } else if (formData.code.trim().length < 2) {
      errs.code = 'Branch code should be at least 2 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (editingBranch) {
        const res = await branchApi.updateBranch(editingBranch._id, {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          isActive: formData.isActive,
        });
        if (res?.success) {
          success(`Branch "${res.data.branch.name}" updated successfully.`);
          setBranches((prev) =>
            prev.map((b) => (b._id === editingBranch._id ? res.data.branch : b))
          );
          setModalOpen(false);
        }
      } else {
        const res = await branchApi.createBranch({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
        });
        if (res?.success) {
          success(`Branch "${res.data.branch.name}" added successfully.`);
          setBranches((prev) => [...prev, res.data.branch]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to save branch.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering Branch Taxonomy"
        description="Configure Mumbai University degree branches, departmental abbreviations, and active catalog visibility."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            Add Branch
          </Button>
        }
      />

      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBranches} />
      ) : branches.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No engineering branches configured"
          description="Add your first department (e.g. Computer Engineering, COMPS) to begin registering subjects."
          actionLabel="Add First Branch"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E9F0] bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Branch Name</th>
                  <th className="p-4">Department Code</th>
                  <th className="p-4">Visibility Status</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9F0] text-xs">
                {branches.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{b.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#3157D5] border border-blue-100 font-mono font-semibold">
                        {b.code}
                      </span>
                    </td>
                    <td className="p-4">
                      {b.isActive !== false ? (
                        <StatusBadge status="active" />
                      ) : (
                        <StatusBadge status="inactive" />
                      )}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(b.updatedAt || b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(b)}
                        icon={Edit2}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Branch Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => !submitting && setModalOpen(false)}
        title={editingBranch ? 'Edit Department Branch' : 'Create Engineering Branch'}
        description="Provide the official name and short department abbreviation."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Branch Full Name"
            placeholder="e.g. Computer Engineering"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            autoFocus
          />

          <Input
            label="Department Code"
            placeholder="e.g. COMPS"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
            error={errors.code}
            hint="Unique code, capitalized automatically (e.g. COMPS, AIML, IT)"
            required
          />

          {editingBranch && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="branch-active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[#3157D5] border-slate-300 focus:ring-[#3157D5]"
              />
              <label htmlFor="branch-active" className="text-xs font-medium text-slate-700">
                Active & visible for student signups and filtering
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E9F0]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              {editingBranch ? 'Save Changes' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


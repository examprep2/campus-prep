import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { subjectApi } from '../../api/subjectApi';
import { branchApi } from '../../api/branchApi';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../api/axios';
import { BookMarked, Plus, Edit2, Layers, Filter } from 'lucide-react';

export default function AdminSubjectsPage() {
  const { success, error: toastError } = useToast();

  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSem, setFilterSem] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    year: '1',
    semester: '1',
    branches: [],
    scheme: '2019',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [subRes, branchRes] = await Promise.all([
        subjectApi.getSubjects({
          branch: filterBranch || undefined,
          year: filterYear || undefined,
          semester: filterSem || undefined,
          includeInactive: true,
        }),
        branchApi.getBranches(),
      ]);

      if (subRes?.success && Array.isArray(subRes.data?.subjects)) {
        setSubjects(subRes.data.subjects);
      }
      if (branchRes?.success && Array.isArray(branchRes.data?.branches)) {
        setBranches(branchRes.data.branches);
      }
    } catch (err) {
      console.error('Error fetching subjects catalog:', err);
      setError('Failed to load subjects catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filterBranch, filterYear, filterSem]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      year: '1',
      semester: '1',
      branches: branches.length > 0 ? [branches[0]._id] : [],
      scheme: '2019',
      isActive: true,
    });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSubject(sub);
    const branchIds = sub.branches?.map((b) => (typeof b === 'object' ? b._id : b)) || [];
    setFormData({
      name: sub.name,
      code: sub.code,
      year: String(sub.year),
      semester: String(sub.semester),
      branches: branchIds,
      scheme: sub.scheme || '2019',
      isActive: sub.isActive !== false,
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleBranchToggle = (branchId) => {
    setFormData((prev) => {
      const exists = prev.branches.includes(branchId);
      const updated = exists
        ? prev.branches.filter((id) => id !== branchId)
        : [...prev.branches, branchId];
      return { ...prev, branches: updated };
    });
    if (errors.branches) {
      setErrors((prev) => ({ ...prev, branches: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Subject title is required';
    if (!formData.code.trim()) errs.code = 'Subject code is required';
    if (!formData.branches || formData.branches.length === 0) {
      errs.branches = 'Select at least one engineering branch';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        year: Number(formData.year),
        semester: Number(formData.semester),
        branches: formData.branches,
        scheme: formData.scheme.trim(),
        isActive: formData.isActive,
      };

      if (editingSubject) {
        const res = await subjectApi.updateSubject(editingSubject._id, payload);
        if (res?.success) {
          success(`Subject "${res.data.subject.name}" updated successfully.`);
          setModalOpen(false);
          fetchData();
        }
      } else {
        const res = await subjectApi.createSubject(payload);
        if (res?.success) {
          success(`Subject "${res.data.subject.name}" created successfully.`);
          setModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to save subject.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Subjects Catalog"
        description="Index syllabus courses mapped across engineering branches, academic years, semesters, and curriculum revisions."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            Add Subject
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E6E9F0] shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            placeholder="All Branches"
            options={[
              { value: '', label: 'All Branches' },
              ...branches.map((b) => ({ value: b._id, label: `${b.name} (${b.code})` })),
            ]}
          />

          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            placeholder="All Academic Years"
            options={[
              { value: '', label: 'All Academic Years' },
              { value: '1', label: 'Year 1 (FE)' },
              { value: '2', label: 'Year 2 (SE)' },
              { value: '3', label: 'Year 3 (TE)' },
              { value: '4', label: 'Year 4 (BE)' },
            ]}
          />

          <Select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value)}
            placeholder="All Semesters"
            options={[
              { value: '', label: 'All Semesters' },
              ...Array.from({ length: 8 }, (_, i) => ({
                value: String(i + 1),
                label: `Semester ${i + 1}`,
              })),
            ]}
          />
        </div>
      </div>

      {/* Subjects Table */}
      {loading ? (
        <SkeletonLoader type="table" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No subjects match this criteria"
          description="Create your first subject for this semester or reset filter options."
          actionLabel="Add Subject"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E9F0] bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Subject Name & Code</th>
                  <th className="p-4">Academic Term</th>
                  <th className="p-4">Mapped Branches</th>
                  <th className="p-4">Scheme</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9F0] text-xs">
                {subjects.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-semibold text-slate-900 block">{sub.name}</span>
                        <span className="text-[11px] font-mono font-semibold text-[#3157D5]">
                          {sub.code}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-700">
                      Year {sub.year} • Semester {sub.semester}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {sub.branches && sub.branches.length > 0 ? (
                          sub.branches.map((b) => {
                            const code = typeof b === 'object' ? b.code : b;
                            return (
                              <span
                                key={typeof b === 'object' ? b._id : b}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-medium"
                              >
                                {code}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-mono text-[11px]">
                      {sub.scheme || 'Rev-2019'}
                    </td>

                    <td className="p-4">
                      {sub.isActive !== false ? (
                        <StatusBadge status="active" />
                      ) : (
                        <StatusBadge status="inactive" />
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(sub)}
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

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => !submitting && setModalOpen(false)}
        title={editingSubject ? 'Edit Curriculum Subject' : 'Add New Subject'}
        description="Associate syllabus subject codes with engineering branches, academic terms, and exam schemes."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject Name"
            placeholder="e.g. Cryptography and System Security"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Subject Code"
              placeholder="e.g. CSC702"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              error={errors.code}
              required
            />
            <Input
              label="Curriculum Scheme"
              placeholder="e.g. 2019"
              value={formData.scheme}
              onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
              hint="e.g. 2019, 2024, or Autonomous"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Academic Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              options={[
                { value: '1', label: 'Year 1 (FE)' },
                { value: '2', label: 'Year 2 (SE)' },
                { value: '3', label: 'Year 3 (TE)' },
                { value: '4', label: 'Year 4 (BE)' },
              ]}
              required
            />
            <Select
              label="Semester"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              options={Array.from({ length: 8 }, (_, i) => ({
                value: String(i + 1),
                label: `Semester ${i + 1}`,
              }))}
              required
            />
          </div>

          {/* Mapped Branches Multi-select Checkboxes */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-[#172033]">
              Applicable Engineering Branches <span className="text-[#D64B4B]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-[#E6E9F0] bg-slate-50/50 max-h-40 overflow-y-auto">
              {branches.map((b) => {
                const isSelected = formData.branches.includes(b._id);
                return (
                  <label
                    key={b._id}
                    className={`flex items-center gap-2 p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#3157D5] bg-blue-50/60 font-semibold text-[#3157D5]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBranchToggle(b._id)}
                      className="rounded text-[#3157D5] border-slate-300 focus:ring-[#3157D5]"
                    />
                    <span className="truncate">{b.code} - {b.name}</span>
                  </label>
                );
              })}
            </div>
            {errors.branches && (
              <p className="text-xs text-[#D64B4B] font-medium">{errors.branches}</p>
            )}
          </div>

          {editingSubject && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="sub-active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[#3157D5] border-slate-300 focus:ring-[#3157D5]"
              />
              <label htmlFor="sub-active" className="text-xs font-medium text-slate-700">
                Active & visible in student dashboard
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
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


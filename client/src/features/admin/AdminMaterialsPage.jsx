import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import FileTypeIcon from '../../components/ui/FileTypeIcon';
import { materialApi } from '../../api/materialApi';
import { subjectApi } from '../../api/subjectApi';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../api/axios';
import {
  FileCheck2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Plus,
  Link as LinkIcon,
} from 'lucide-react';

export default function AdminMaterialsPage() {
  const { success, error: toastError } = useToast();

  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Approve confirmation dialog
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  // Add material with URL modal (Admin only)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    type: 'notes',
    subject: '',
    fileUrl: '',
    examYear: '',
  });
  const [createErrors, setCreateErrors] = useState({});

  const fetchPendingQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [matRes, subRes] = await Promise.all([
        materialApi.getPendingMaterials(),
        subjectApi.getSubjects({ includeInactive: true }),
      ]);

      if (matRes?.success && Array.isArray(matRes.data?.materials)) {
        setPendingMaterials(matRes.data.materials);
      }
      if (subRes?.success && Array.isArray(subRes.data?.subjects)) {
        setSubjects(subRes.data.subjects);
        if (subRes.data.subjects.length > 0 && !createFormData.subject) {
          setCreateFormData((prev) => ({ ...prev, subject: subRes.data.subjects[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching pending materials queue:', err);
      setError('Failed to load moderation queue. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingQueue();
  }, [fetchPendingQueue]);

  // Handle Approve
  const handleApprove = async () => {
    if (!selectedMaterial) return;
    try {
      setActionLoading(true);
      const res = await materialApi.approveMaterial(selectedMaterial._id);
      if (res?.success) {
        success(`"${selectedMaterial.title}" approved and published to library.`);
        setPendingMaterials((prev) => prev.filter((m) => m._id !== selectedMaterial._id));
        setApproveDialogOpen(false);
        setSelectedMaterial(null);
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to approve material.');
      toastError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async (e) => {
    e.preventDefault();
    if (!selectedMaterial || !rejectReason.trim()) {
      toastError('Please provide a reason for rejection.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await materialApi.rejectMaterial(selectedMaterial._id, rejectReason.trim());
      if (res?.success) {
        success(`Material rejected. Student notified with feedback.`);
        setPendingMaterials((prev) => prev.filter((m) => m._id !== selectedMaterial._id));
        setRejectModalOpen(false);
        setSelectedMaterial(null);
        setRejectReason('');
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to reject material.');
      toastError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Create Material (Admin Direct Link)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!createFormData.title.trim()) errs.title = 'Title is required';
    if (!createFormData.subject) errs.subject = 'Subject is required';
    if (!createFormData.fileUrl.trim()) {
      errs.fileUrl = 'File URL is required';
    } else if (!createFormData.fileUrl.startsWith('https://')) {
      errs.fileUrl = 'File link must start with https://';
    }
    setCreateErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setActionLoading(true);
      const payload = {
        title: createFormData.title.trim(),
        description: createFormData.description.trim(),
        type: createFormData.type,
        subject: createFormData.subject,
        fileUrl: createFormData.fileUrl.trim(),
        examYear: createFormData.examYear ? Number(createFormData.examYear) : undefined,
      };

      const res = await materialApi.createMaterial(payload);
      if (res?.success) {
        success('Material created and published directly.');
        setCreateModalOpen(false);
        setCreateFormData({
          title: '',
          description: '',
          type: 'notes',
          subject: subjects[0]?._id || '',
          fileUrl: '',
          examYear: '',
        });
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to add material.');
      toastError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Material Moderation Queue"
        description="Verify uploaded study files for syllabus accuracy and academic suitability before publishing to the live library."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={Plus}
          >
            Add Direct Link
          </Button>
        }
      />

      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPendingQueue} />
      ) : pendingMaterials.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="Moderation queue is completely clean"
          description="There are no pending materials requiring review right now. All student uploads have been verified."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#687386]">
            <span>
              Showing <strong className="text-[#172033]">{pendingMaterials.length}</strong> items
              awaiting moderation (oldest first)
            </span>
          </div>

          <div className="bg-white dark:bg-[#1B2230] rounded-2xl border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs divide-y divide-[#E6E9F0] dark:divide-[#30394A] overflow-hidden transition-colors">
            {pendingMaterials.map((item) => (
              <div
                key={item._id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-[#222B3A]/40 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <FileTypeIcon type={item.type} size="md" className="shrink-0 mt-0.5" />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-[#3157D5] dark:text-[#6B8CFF] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                        {item.subject?.code}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                        {item.subject?.name}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                        {item.type}
                      </span>
                      {item.examYear && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          • Exam Year {item.examYear}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-[#172033] dark:text-[#F1F5F9] leading-snug">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#687386] dark:text-[#A0AEC0] pt-0.5">
                      <span>
                        Uploaded by:{' '}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {item.uploadedBy?.name || 'Student'}
                        </strong>{' '}
                        ({item.uploadedBy?.email})
                      </span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center border-t lg:border-t-0 border-[#E6E9F0] dark:border-[#30394A] pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E9F0] dark:border-[#30394A] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#222B3A] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Inspect PDF</span>
                  </a>

                  <Button
                    variant="dangerOutline"
                    size="sm"
                    onClick={() => {
                      setSelectedMaterial(item);
                      setRejectReason('');
                      setRejectModalOpen(true);
                    }}
                    icon={XCircle}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedMaterial(item);
                      setApproveDialogOpen(true);
                    }}
                    icon={CheckCircle2}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleApprove}
        title="Approve Study Material"
        message={`Are you sure you want to approve "${selectedMaterial?.title}"? It will become publicly searchable and downloadable in the student library.`}
        confirmText="Confirm & Publish"
        variant="primary"
        isLoading={actionLoading}
      />

      {/* Reject Modal with Reason */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => !actionLoading && setRejectModalOpen(false)}
        title="Reject Uploaded Material"
        description="Provide clear constructive feedback so the student understands why their file was rejected."
      >
        <form onSubmit={handleReject} className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151923] border border-slate-200 dark:border-[#30394A] text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-semibold block text-[#172033] dark:text-[#F1F5F9]">
              Document: {selectedMaterial?.title}
            </span>
            <span>Contributor: {selectedMaterial?.uploadedBy?.name}</span>
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="rejection-reason" className="block text-xs font-semibold text-[#172033] dark:text-[#F1F5F9]">
              Reason for Rejection <span className="text-[#D64B4B] dark:text-rose-400">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows={3}
              maxLength={300}
              placeholder="e.g. Unclear handwritten scan, pages missing from module 3, or mismatched syllabus code."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-lg border border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#151923] p-3 text-sm text-[#172033] dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-[#D64B4B] focus:outline-none focus:ring-2 focus:ring-[#D64B4B]/20 transition-colors"
              required
              autoFocus
            />
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>Required (max 300 characters)</span>
              <span>{rejectReason.length}/300</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E9F0] dark:border-[#30394A]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={actionLoading}
              disabled={!rejectReason.trim()}
            >
              Reject Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Admin Add Direct Link Material Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => !actionLoading && setCreateModalOpen(false)}
        title="Add Material via HTTPS URL"
        description="Publish already-hosted documents or official university links directly into the student repository."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Official Mumbai University Question Paper May 2024"
            value={createFormData.title}
            onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
            error={createErrors.title}
            required
          />

          <Input
            label="File URL (HTTPS)"
            type="url"
            placeholder="https://..."
            value={createFormData.fileUrl}
            onChange={(e) => setCreateFormData({ ...createFormData, fileUrl: e.target.value })}
            error={createErrors.fileUrl}
            icon={LinkIcon}
            hint="Direct link starting with https://"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Subject"
              value={createFormData.subject}
              onChange={(e) => setCreateFormData({ ...createFormData, subject: e.target.value })}
              options={subjects.map((s) => ({ value: s._id, label: `${s.code} - ${s.name}` }))}
              error={createErrors.subject}
              required
            />
            <Select
              label="Type"
              value={createFormData.type}
              onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })}
              options={[
                { value: 'notes', label: 'Notes' },
                { value: 'book', label: 'Book' },
                { value: 'qp', label: 'Question Paper' },
                { value: 'syllabus', label: 'Syllabus' },
              ]}
              required
            />
          </div>

          <Input
            label="Exam Year (Optional)"
            type="number"
            placeholder="2024"
            value={createFormData.examYear}
            onChange={(e) => setCreateFormData({ ...createFormData, examYear: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E9F0] dark:border-[#30394A]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={actionLoading}>
              Publish Material
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import FileTypeIcon from '../../components/ui/FileTypeIcon';
import { materialApi } from '../../api/materialApi';
import {
  Upload,
  FolderArchive,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function MyUploadsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyUploads = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await materialApi.getMyMaterials();
      if (res?.success && Array.isArray(res.data?.materials)) {
        setMaterials(res.data.materials);
      }
    } catch (err) {
      console.error('Error fetching my uploads:', err);
      setError('Failed to load your uploads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyUploads();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Uploads"
        description="Monitor verification progress, review feedback, and access documents you have shared with the university portal."
        actions={
          <Link to="/upload">
            <Button variant="primary" size="sm" icon={Upload}>
              Upload New Notes
            </Button>
          </Link>
        }
      />

      {loading ? (
        <SkeletonLoader type="table" count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMyUploads} />
      ) : materials.length === 0 ? (
        <EmptyState
          icon={FolderArchive}
          title="You haven't uploaded any materials yet"
          description="Contribute handwritten class notes, solved university papers, or reference formulas to help fellow engineering students."
          actionLabel="Upload Your First Document"
          onAction={() => window.location.assign('/upload')}
        />
      ) : (
        <div className="space-y-4">
          {/* Responsive Cards / Table */}
          <div className="bg-white rounded-2xl border border-[#E6E9F0] shadow-2xs divide-y divide-[#E6E9F0] overflow-hidden">
            {materials.map((item) => (
              <div key={item._id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <FileTypeIcon type={item.type} size="md" className="shrink-0 mt-0.5" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold text-[#3157D5] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {item.subject?.code || 'GEN'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {item.subject?.name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                          {item.type}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold text-[#172033] leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#687386]">
                        Uploaded on {new Date(item.createdAt).toLocaleDateString()}
                        {item.examYear ? ` • Exam Year ${item.examYear}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                    <StatusBadge status={item.status} />

                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3157D5] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View File</span>
                    </a>
                  </div>
                </div>

                {/* If rejected, show reason callout */}
                {item.status === 'rejected' && item.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-[#D64B4B] flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Moderator Feedback:</span>
                      <p className="text-rose-800 mt-0.5 leading-relaxed">
                        {item.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

                {item.status === 'pending' && (
                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-[11px] text-[#C58A27] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Awaiting administrative approval. You will receive a notification once verified.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


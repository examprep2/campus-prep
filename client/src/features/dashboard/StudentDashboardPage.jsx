import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { subjectApi } from '../../api/subjectApi';
import { materialApi } from '../../api/materialApi';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import FileTypeIcon from '../../components/ui/FileTypeIcon';
import {
  BookOpen,
  Upload,
  FileQuestion,
  ExternalLink,
  GraduationCap,
  ArrowRight,
  FolderArchive,
  Layers,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectError, setSubjectError] = useState(null);

  const [recentMaterials, setRecentMaterials] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Fetch subjects for student's branch, year, semester
  const fetchDashboardData = React.useCallback(async () => {
    if (!user) return;

    try {
      setLoadingSubjects(true);
      setSubjectError(null);

      const branchId = user.branch?._id || user.branch;
      const res = await subjectApi.getSubjects({
        branch: branchId,
        year: user.year,
        semester: user.semester,
      });

      if (res?.success && Array.isArray(res.data?.subjects)) {
        setSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error('Error fetching dashboard subjects:', err);
      setSubjectError('Failed to load semester subjects. Please try again.');
    } finally {
      setLoadingSubjects(false);
    }

    try {
      setLoadingRecent(true);
      const matRes = await materialApi.getMaterials({ limit: 4 });
      if (matRes?.success && Array.isArray(matRes.data?.materials)) {
        setRecentMaterials(matRes.data.materials);
      }
    } catch (err) {
      console.error('Error fetching recent materials:', err);
    } finally {
      setLoadingRecent(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const branchName = user?.branch?.name || 'Engineering';
  const branchCode = user?.branch?.code || 'COMPS';
  const semesterNum = user?.semester || 1;
  const yearNum = user?.year || 1;

  return (
    <div className="space-y-6">
      {/* 1. Academic Workspace Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#687386] dark:text-[#A0AEC0]">
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#222B3A] px-2 py-0.5 rounded border border-slate-200 dark:border-[#30394A]">
              {branchCode}
            </span>
            <span>•</span>
            <span>Year {yearNum}</span>
            <span>•</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Semester {semesterNum}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] font-display">
            {branchName}
          </h1>

          <p className="text-xs sm:text-sm text-[#687386] dark:text-[#A0AEC0] max-w-xl">
            Mumbai University syllabus courses and crowdsourced academic study material for this semester.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/upload">
            <Button variant="primary" size="sm" icon={Upload}>
              Upload Notes
            </Button>
          </Link>
          <Link to="/materials">
            <Button variant="outline" size="sm" icon={BookOpen}>
              Full Vault
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Academic Utility Strip (Replaces redundant 4 icon cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Enrolled Courses count */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs flex items-center justify-between transition-colors">
          <div className="space-y-0.5">
            <span className="text-xs text-[#687386] dark:text-[#A0AEC0] font-medium block">Active Courses</span>
            <span className="text-xl font-bold text-[#172033] dark:text-[#F1F5F9] font-display tabular-nums">
              {loadingSubjects ? '—' : `${subjects.length} Subjects`}
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Curriculum-mapped for Sem {semesterNum}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-[#222B3A] border border-slate-200 dark:border-[#30394A] text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* Question Papers direct shortcut */}
        <Link
          to="/materials?type=qp"
          className="p-4 rounded-xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-[#3157D5]/40 dark:hover:border-[#6B8CFF]/40 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <span className="text-xs text-[#687386] dark:text-[#A0AEC0] font-medium block">Question Paper Bank</span>
            <span className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] group-hover:text-[#3157D5] dark:group-hover:text-[#6B8CFF] transition-colors block">
              Previous Exam PYQs
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Past Mumbai University solved papers</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-[#222B3A] border border-slate-200 dark:border-[#30394A] text-slate-600 dark:text-slate-300 group-hover:text-[#3157D5] dark:group-hover:text-[#6B8CFF] group-hover:border-[#3157D5]/30 flex items-center justify-center shrink-0 transition-colors">
            <FileQuestion className="w-4 h-4" />
          </div>
        </Link>

        {/* My Submissions status */}
        <Link
          to="/my-uploads"
          className="p-4 rounded-xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-[#3157D5]/40 dark:hover:border-[#6B8CFF]/40 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <span className="text-xs text-[#687386] dark:text-[#A0AEC0] font-medium block">My Submissions</span>
            <span className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] group-hover:text-[#3157D5] dark:group-hover:text-[#6B8CFF] transition-colors block">
              Manage Uploads
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Track moderation approval status</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-[#222B3A] border border-slate-200 dark:border-[#30394A] text-slate-600 dark:text-slate-300 group-hover:text-[#3157D5] dark:group-hover:text-[#6B8CFF] group-hover:border-[#3157D5]/30 flex items-center justify-center shrink-0 transition-colors">
            <FolderArchive className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* 3. Semester Course Catalog (Academic Course Cards) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#172033] dark:text-[#F1F5F9] font-display">
              Semester {semesterNum} Courses
            </h2>
            <p className="text-xs text-[#687386] dark:text-[#A0AEC0]">
              Select a course to view syllabus lecture notes, question banks, and books
            </p>
          </div>
          <Link
            to="/materials"
            className="text-xs font-medium text-[#3157D5] dark:text-[#6B8CFF] hover:underline flex items-center gap-1"
          >
            <span>All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingSubjects ? (
          <SkeletonLoader type="card" count={3} />
        ) : subjectError ? (
          <ErrorState
            title="Unable to load courses"
            message={subjectError}
            onRetry={fetchDashboardData}
          />
        ) : subjects.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No courses registered for this semester yet"
            description="The administrator has not added syllabus courses for this semester. You can still explore all materials in the library."
            actionLabel="Open Materials Library"
            onAction={() => navigate('/materials')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub._id}
                className="p-5 rounded-xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Course Code & Scheme */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-slate-100 dark:bg-[#222B3A] text-[#172033] dark:text-[#F1F5F9] border border-slate-200 dark:border-[#30394A]">
                      {sub.code}
                    </span>
                    {sub.scheme && (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {sub.scheme} Scheme
                      </span>
                    )}
                  </div>

                  {/* Course Name */}
                  <div>
                    <h3
                      className="font-semibold text-sm text-[#172033] dark:text-[#F1F5F9] leading-snug cursor-pointer hover:text-[#3157D5] dark:hover:text-[#6B8CFF] transition-colors"
                      onClick={() => navigate(`/materials?subject=${sub._id}`)}
                      title={sub.name}
                    >
                      {sub.name}
                    </h3>
                    <p className="text-xs text-[#687386] dark:text-[#A0AEC0] mt-1">
                      Year {sub.year} • Semester {sub.semester}
                    </p>
                  </div>
                </div>

                {/* Direct category shortcuts for this subject */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#30394A] flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/materials?subject=${sub._id}&type=notes`}
                      className="text-slate-600 dark:text-slate-400 hover:text-[#3157D5] dark:hover:text-[#6B8CFF] hover:underline"
                    >
                      Notes
                    </Link>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <Link
                      to={`/materials?subject=${sub._id}&type=qp`}
                      className="text-slate-600 dark:text-slate-400 hover:text-[#3157D5] dark:hover:text-[#6B8CFF] hover:underline"
                    >
                      PYQs
                    </Link>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <Link
                      to={`/materials?subject=${sub._id}&type=book`}
                      className="text-slate-600 dark:text-slate-400 hover:text-[#3157D5] dark:hover:text-[#6B8CFF] hover:underline"
                    >
                      Books
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/materials?subject=${sub._id}`)}
                    className="text-[#3157D5] dark:text-[#6B8CFF] hover:underline font-medium cursor-pointer"
                  >
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Recent Curriculum Materials */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#172033] dark:text-[#F1F5F9] font-display">
              Recent Curriculum Materials
            </h2>
            <p className="text-xs text-[#687386] dark:text-[#A0AEC0]">
              Verified study documents and question papers recently published
            </p>
          </div>
          <Link
            to="/materials"
            className="text-xs font-medium text-[#3157D5] dark:text-[#6B8CFF] hover:underline flex items-center gap-1"
          >
            <span>See All Files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingRecent ? (
          <SkeletonLoader type="row" count={3} />
        ) : recentMaterials.length === 0 ? (
          <div className="p-6 rounded-xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] text-center text-xs text-[#687386] dark:text-[#A0AEC0]">
            No verified materials available yet. Be the first to upload lecture notes or question papers.
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1B2230] rounded-xl border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs divide-y divide-[#E6E9F0] dark:divide-[#30394A] overflow-hidden">
            {recentMaterials.map((item) => (
              <div
                key={item._id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-[#222B3A]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileTypeIcon type={item.type} size="sm" className="shrink-0" />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#222B3A] px-1.5 py-0.2 rounded border border-slate-200 dark:border-[#30394A]">
                        {item.subject?.code || 'GEN'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subject?.name}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 hidden sm:inline">
                        {item.type}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#687386] dark:text-[#A0AEC0]">
                      By {item.uploadedBy?.name || 'Student'} • {new Date(item.createdAt).toLocaleDateString()}
                      {item.examYear ? ` • Exam Year ${item.examYear}` : ''}
                    </p>
                  </div>
                </div>

                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E9F0] dark:border-[#30394A] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#3157D5] dark:hover:text-[#6B8CFF] hover:border-[#3157D5]/40 dark:hover:border-[#6B8CFF]/40 transition-colors"
                  title="Open file"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open PDF</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

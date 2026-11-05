import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { subjectApi } from '../../api/subjectApi';
import { materialApi } from '../../api/materialApi';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import FileTypeIcon from '../../components/ui/FileTypeIcon';
import {
  BookOpen,
  Upload,
  FolderArchive,
  Bell,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
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
  const fetchDashboardData = async () => {
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
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section & Academic Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6E9F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-[#3157D5] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mumbai University Engineering Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] font-display">
            {getGreeting()}, {user?.name || 'Student'}
          </h1>
          <p className="text-sm text-[#687386] max-w-xl">
            Here are your curriculum-mapped subjects and latest university study materials for
            this semester.
          </p>
        </div>

        {/* Academic Details Pill Box */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-xl bg-[#F7F8FC] border border-[#E6E9F0] shrink-0 text-xs text-[#172033]">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E9F0] font-medium shadow-2xs">
            <span className="text-[#687386] block text-[10px] uppercase font-semibold">Branch</span>
            <span className="font-semibold text-slate-800">
              {user?.branch?.code || 'COMPS'}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E9F0] font-medium shadow-2xs">
            <span className="text-[#687386] block text-[10px] uppercase font-semibold">Year</span>
            <span className="font-semibold text-slate-800">Year {user?.year || 1}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E9F0] font-medium shadow-2xs">
            <span className="text-[#687386] block text-[10px] uppercase font-semibold">Semester</span>
            <span className="font-semibold text-slate-800">Sem {user?.semester || 1}</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          to="/materials"
          className="p-4 sm:p-5 rounded-xl bg-white border border-[#E6E9F0] shadow-2xs hover:border-[#3157D5]/40 hover:shadow-xs transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3157D5] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#172033] group-hover:text-[#3157D5] transition-colors">
            Browse Materials
          </h3>
          <p className="text-xs text-[#687386] mt-1">Explore verified notes & question papers</p>
        </Link>

        <Link
          to="/upload"
          className="p-4 sm:p-5 rounded-xl bg-white border border-[#E6E9F0] shadow-2xs hover:border-[#3157D5]/40 hover:shadow-xs transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#16845B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#172033] group-hover:text-[#3157D5] transition-colors">
            Upload Notes
          </h3>
          <p className="text-xs text-[#687386] mt-1">Share helpful PDF documents with peers</p>
        </Link>

        <Link
          to="/my-uploads"
          className="p-4 sm:p-5 rounded-xl bg-white border border-[#E6E9F0] shadow-2xs hover:border-[#3157D5]/40 hover:shadow-xs transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FolderArchive className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#172033] group-hover:text-[#3157D5] transition-colors">
            My Uploads
          </h3>
          <p className="text-xs text-[#687386] mt-1">Track verification and approval status</p>
        </Link>

        <Link
          to="/notifications"
          className="p-4 sm:p-5 rounded-xl bg-white border border-[#E6E9F0] shadow-2xs hover:border-[#3157D5]/40 hover:shadow-xs transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#C58A27] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#172033] group-hover:text-[#3157D5] transition-colors">
            Notifications
          </h3>
          <p className="text-xs text-[#687386] mt-1">Updates on approvals & university notices</p>
        </Link>
      </div>

      {/* 3. Subjects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#172033] font-display">
              Semester {user?.semester || 1} Subjects
            </h2>
            <p className="text-xs text-[#687386]">
              Subjects configured for {user?.branch?.name || 'your engineering stream'}
            </p>
          </div>
          <Link
            to="/materials"
            className="text-xs font-semibold text-[#3157D5] hover:underline flex items-center gap-1"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingSubjects ? (
          <SkeletonLoader type="card" count={3} />
        ) : subjectError ? (
          <ErrorState
            title="Unable to load subjects"
            message={subjectError}
            onRetry={fetchDashboardData}
          />
        ) : subjects.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No subjects registered for this semester yet"
            description="The administrator has not added syllabus subjects for your semester yet. You can still browse all materials in the library."
            actionLabel="Go to Materials Library"
            onAction={() => navigate('/materials')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub._id}
                onClick={() => navigate(`/materials?subject=${sub._id}`)}
                className="p-5 rounded-xl bg-white border border-[#E6E9F0] shadow-2xs hover:border-[#3157D5] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" size="sm">
                      {sub.code}
                    </Badge>
                    {sub.scheme && (
                      <span className="text-[11px] font-mono text-[#687386] bg-slate-100 px-2 py-0.5 rounded">
                        {sub.scheme} Scheme
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#172033] group-hover:text-[#3157D5] transition-colors leading-snug">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-[#687386] mt-1">
                      Year {sub.year} • Semester {sub.semester}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-[#3157D5]">
                  <span>Explore Resources</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Recent Study Materials */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#172033] font-display">
              Recently Added Materials
            </h2>
            <p className="text-xs text-[#687386]">
              Verified study documents and question papers recently published
            </p>
          </div>
          <Link
            to="/materials"
            className="text-xs font-semibold text-[#3157D5] hover:underline flex items-center gap-1"
          >
            <span>See Full Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingRecent ? (
          <SkeletonLoader type="row" count={3} />
        ) : recentMaterials.length === 0 ? (
          <div className="p-6 rounded-xl bg-white border border-[#E6E9F0] text-center text-xs text-[#687386]">
            No verified materials available yet. Be the first to upload lecture notes or question
            papers!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentMaterials.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-xl bg-white border border-[#E6E9F0] shadow-2xs hover:border-slate-300 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <FileTypeIcon type={item.type} size="md" className="shrink-0 mt-0.5" />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-[#3157D5] bg-blue-50 px-1.5 py-0.5 rounded">
                        {item.subject?.code || 'GEN'}
                      </span>
                      <span className="text-xs text-[#687386] truncate">
                        {item.subject?.name}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#172033] truncate">{item.title}</h4>
                    <p className="text-[11px] text-[#687386]">
                      Uploaded by {item.uploadedBy?.name || 'Student'} •{' '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-[#3157D5] hover:bg-slate-50 transition-colors"
                  title="Open file"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { materialApi } from '../../api/materialApi';
import { adminApi } from '../../api/adminApi';
import { branchApi } from '../../api/branchApi';
import { subjectApi } from '../../api/subjectApi';
import {
  FileCheck2,
  Users,
  Network,
  BookMarked,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    pendingMaterials: 0,
    totalUsers: 0,
    totalBranches: 0,
    totalSubjects: 0,
  });

  const [pendingQueue, setPendingQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAdminOverview = async () => {
      try {
        setLoading(true);

        const [pendingRes, usersRes, branchRes, subjectRes] = await Promise.allSettled([
          materialApi.getPendingMaterials(),
          adminApi.getUsers({ limit: 1 }),
          branchApi.getAllBranches(),
          subjectApi.getSubjects({ includeInactive: true }),
        ]);

        if (!isMounted) return;

        const pendingList =
          pendingRes.status === 'fulfilled' && pendingRes.value?.success
            ? pendingRes.value.data?.materials || []
            : [];
        const usersTotal =
          usersRes.status === 'fulfilled' && usersRes.value?.success
            ? usersRes.value.data?.total || 0
            : 0;
        const branchesTotal =
          branchRes.status === 'fulfilled' && branchRes.value?.success
            ? branchRes.value.data?.branches?.length || 0
            : 0;
        const subjectsTotal =
          subjectRes.status === 'fulfilled' && subjectRes.value?.success
            ? subjectRes.value.data?.subjects?.length || 0
            : 0;

        setStats({
          pendingMaterials: pendingList.length,
          totalUsers: usersTotal,
          totalBranches: branchesTotal,
          totalSubjects: subjectsTotal,
        });

        setPendingQueue(pendingList.slice(0, 5));
      } catch (err) {
        console.error('Error fetching admin dashboard overview:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdminOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Admin Control Center"
        description="Monitor system activity, moderate crowdsourced uploads, and maintain Mumbai University curriculum configurations."
        badge={
          <Badge variant="purple" size="sm">
            Super Administrator
          </Badge>
        }
      />

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Queue */}
        <Link
          to="/admin/materials"
          className="p-5 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-amber-300 dark:hover:border-amber-600/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Queue
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#C58A27] dark:text-amber-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#172033] dark:text-[#F1F5F9] font-display">
              {loading ? '-' : stats.pendingMaterials}
            </span>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-medium">
              Requires moderation sign-off
            </p>
          </div>
        </Link>

        {/* Total Users */}
        <Link
          to="/admin/users"
          className="p-5 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-[#3157D5]/40 dark:hover:border-[#6B8CFF]/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Registered Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#3157D5] dark:text-[#6B8CFF] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#172033] dark:text-[#F1F5F9] font-display">
              {loading ? '-' : stats.totalUsers}
            </span>
            <p className="text-xs text-[#687386] dark:text-[#A0AEC0] mt-1">Students & moderators</p>
          </div>
        </Link>

        {/* Branches */}
        <Link
          to="/admin/branches"
          className="p-5 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-purple-300 dark:hover:border-purple-600/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Branches Mapped
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#172033] dark:text-[#F1F5F9] font-display">
              {loading ? '-' : stats.totalBranches}
            </span>
            <p className="text-xs text-[#687386] dark:text-[#A0AEC0] mt-1">Active MU Engineering streams</p>
          </div>
        </Link>

        {/* Subjects */}
        <Link
          to="/admin/subjects"
          className="p-5 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-600/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Subjects Catalog
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#16845B] dark:text-emerald-400 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#172033] dark:text-[#F1F5F9] font-display">
              {loading ? '-' : stats.totalSubjects}
            </span>
            <p className="text-xs text-[#687386] dark:text-[#A0AEC0] mt-1">Curriculum courses indexed</p>
          </div>
        </Link>
      </div>

      {/* Moderation Queue Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#172033] dark:text-[#F1F5F9] font-display">
              Material Moderation Queue
            </h2>
            <p className="text-xs text-[#687386] dark:text-[#A0AEC0]">
              Submissions awaiting administrative verification before publication
            </p>
          </div>
          <Link
            to="/admin/materials"
            className="text-xs font-semibold text-[#3157D5] dark:text-[#6B8CFF] hover:underline flex items-center gap-1"
          >
            <span>Open Full Queue ({stats.pendingMaterials})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader type="table" count={3} />
        ) : pendingQueue.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#16845B] dark:text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Moderation Queue Clear</h3>
            <p className="text-xs text-[#687386] dark:text-[#A0AEC0]">
              All student study materials have been reviewed and actioned.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1B2230] rounded-2xl border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs divide-y divide-[#E6E9F0] dark:divide-[#30394A] overflow-hidden transition-colors">
            {pendingQueue.map((item) => (
              <div
                key={item._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-[#222B3A]/50 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#3157D5] dark:text-[#6B8CFF] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                      {item.subject?.code}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {item.subject?.name}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      {item.type}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] truncate">{item.title}</h4>

                  <p className="text-xs text-[#687386] dark:text-[#A0AEC0]">
                    Uploaded by {item.uploadedBy?.name || 'Student'} ({item.uploadedBy?.email}) •{' '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-[#E6E9F0] dark:border-[#30394A] text-slate-600 dark:text-slate-300 hover:text-[#3157D5] dark:hover:text-[#6B8CFF] hover:bg-slate-50 dark:hover:bg-[#222B3A] transition-colors"
                    title="Inspect PDF"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link to="/admin/materials">
                    <Button variant="outline" size="sm">
                      Review in Queue
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

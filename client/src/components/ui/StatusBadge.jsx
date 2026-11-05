import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertOctagon } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const norm = (status || '').toLowerCase();

  switch (norm) {
    case 'approved':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F6F0] dark:bg-[rgba(52,211,153,0.14)] text-[#16845B] dark:text-[#34D399] border border-[#16845B]/20 dark:border-[#34D399]/30 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved</span>
        </span>
      );
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF6E7] dark:bg-[rgba(251,191,36,0.14)] text-[#C58A27] dark:text-[#FBBF24] border border-[#C58A27]/20 dark:border-[#FBBF24]/30 ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Review</span>
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDECEC] dark:bg-[rgba(248,113,113,0.14)] text-[#D64B4B] dark:text-[#F87171] border border-[#D64B4B]/20 dark:border-[#F87171]/30 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rejected</span>
        </span>
      );
    case 'blocked':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDECEC] dark:bg-[rgba(248,113,113,0.14)] text-[#D64B4B] dark:text-[#F87171] border border-[#D64B4B]/20 dark:border-[#F87171]/30 ${className}`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Blocked</span>
        </span>
      );
    case 'active':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F6F0] dark:bg-[rgba(52,211,153,0.14)] text-[#16845B] dark:text-[#34D399] border border-[#16845B]/20 dark:border-[#34D399]/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#16845B] dark:bg-[#34D399]" />
          <span>Active</span>
        </span>
      );
    case 'inactive':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#222B3A] text-slate-500 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#30394A] ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
          <span>Inactive</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#222B3A] text-slate-600 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#30394A] ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
}

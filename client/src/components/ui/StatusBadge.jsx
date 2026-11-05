import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertOctagon } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const norm = (status || '').toLowerCase();

  switch (norm) {
    case 'approved':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F6F0] text-[#16845B] border border-[#16845B]/20 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved</span>
        </span>
      );
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF6E7] text-[#C58A27] border border-[#C58A27]/20 ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Review</span>
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDECEC] text-[#D64B4B] border border-[#D64B4B]/20 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rejected</span>
        </span>
      );
    case 'blocked':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDECEC] text-[#D64B4B] border border-[#D64B4B]/20 ${className}`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Blocked</span>
        </span>
      );
    case 'active':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F6F0] text-[#16845B] border border-[#16845B]/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#16845B]" />
          <span>Active</span>
        </span>
      );
    case 'inactive':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>Inactive</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
}


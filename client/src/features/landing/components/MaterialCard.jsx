import React from 'react';
import {
  Binary,
  FileQuestion,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Star,
  Download,
  Eye,
} from 'lucide-react';

export default function MaterialCard({
  item,
  downloads,
  onDownload,
  onQuickView,
}) {
  const currentDownloads = downloads ?? item.downloads;

  const renderItemIcon = (type) => {
    switch (type) {
      case 'binary':
        return <Binary className="w-5 h-5 text-indigo-400" />;
      case 'quiz':
        return <FileQuestion className="w-5 h-5 text-violet-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div
      className="group rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:border-violet-500/40 hover:bg-[#20153c]/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      style={{
        background: 'rgba(28, 19, 52, 0.6)',
        borderColor: 'rgba(139, 92, 246, 0.2)',
      }}
    >
      {/* Left: Subject Icon & Document Metadata */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Icon Badge */}
        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center mt-0.5 group-hover:scale-105 transition-transform">
          {renderItemIcon(item.iconType)}
        </div>

        {/* Title, Subject & Author */}
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] font-semibold">
              {item.subjectCode}
            </span>
            <span className="text-xs text-[#94a3b8] font-medium hidden sm:inline">
              {item.subject}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>

            {/* Verification Badges as specified in DESIGN.md */}
            {item.badge === 'Approved by Admin' ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Approved by Admin
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-mono text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-400" />
                Faculty Verified
              </span>
            )}
          </div>

          {/* Primary Document Title */}
          <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-200 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h4>

          {/* Author & College Tagline */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
            <span className="text-slate-300 font-medium">{item.author}</span>
            <span className="text-slate-600">•</span>
            <span>{item.authorRole}</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[11px] text-violet-300/80">
              {item.college}
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              Updated {item.updatedAt}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Metrics & Action Buttons */}
      <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-violet-500/15">
        {/* Metrics: Rating, Downloads, Size */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-[#94a3b8]">
          {/* Star Rating */}
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white font-semibold">{item.rating}</span>
            <span className="text-slate-500 text-[10px]">({item.reviewsCount})</span>
          </div>

          {/* Downloads Counter */}
          <div className="flex items-center gap-1 text-slate-300">
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentDownloads.toLocaleString()}</span>
          </div>

          {/* File specs */}
          <div className="hidden sm:flex flex-col text-[11px] text-slate-400 text-right">
            <span>{item.fileSize}</span>
            <span className="text-[10px] text-slate-500">{item.pages} pgs</span>
          </div>
        </div>

        {/* Actions: Quick View & Download CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onQuickView?.(item)}
            title="Quick View Document"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDownload?.(item)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-102 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}


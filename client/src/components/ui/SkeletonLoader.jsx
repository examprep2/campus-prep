import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3, className = '' }) {
  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#1B2230] space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-slate-200 dark:bg-[#222B3A] rounded" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-[#222B3A] rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-[#222B3A] rounded" />
              <div className="h-3 w-1/2 bg-slate-100 dark:bg-[#151923] rounded" />
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-[#30394A] flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-100 dark:bg-[#151923] rounded" />
              <div className="h-8 w-20 bg-slate-200 dark:bg-[#222B3A] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#1B2230] flex items-center justify-between gap-4 animate-pulse"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-[#222B3A] shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-[#222B3A] rounded" />
                <div className="h-3 w-1/4 bg-slate-100 dark:bg-[#151923] rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-[#222B3A] rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`border border-[#E6E9F0] dark:border-[#30394A] rounded-xl bg-white dark:bg-[#1B2230] overflow-hidden ${className}`}>
        <div className="p-4 bg-slate-50 dark:bg-[#151923] border-b border-[#E6E9F0] dark:border-[#30394A] flex gap-4">
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-[#222B3A] rounded animate-pulse" />
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-[#222B3A] rounded animate-pulse" />
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-[#222B3A] rounded animate-pulse" />
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-[#222B3A] rounded animate-pulse" />
        </div>
        <div className="divide-y divide-[#E6E9F0] dark:divide-[#30394A]">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
              <div className="h-4 w-1/4 bg-slate-100 dark:bg-[#222B3A]/60 rounded" />
              <div className="h-4 w-1/4 bg-slate-100 dark:bg-[#222B3A]/60 rounded" />
              <div className="h-4 w-1/4 bg-slate-100 dark:bg-[#222B3A]/60 rounded" />
              <div className="h-4 w-1/4 bg-slate-100 dark:bg-[#222B3A]/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      <div className="h-4 w-full bg-slate-200 dark:bg-[#222B3A] rounded" />
      <div className="h-4 w-5/6 bg-slate-100 dark:bg-[#151923] rounded" />
      <div className="h-4 w-4/6 bg-slate-100 dark:bg-[#151923] rounded" />
    </div>
  );
}


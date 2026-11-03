import React from 'react';
import { Flame, Filter, Search, ChevronRight } from 'lucide-react';
import MaterialCard from './MaterialCard';

export default function LiveVaultPreview({
  activeBranch = 'COMPS',
  selectedSem = 'Semester 7',
  onSelectSem,
  searchQuery = '',
  onClearSearch,
  materials = [],
  downloadCountTracker = {},
  onDownload,
  onQuickView,
}) {
  return (
    <section id="vault-section" className="space-y-5">
      {/* Primary Container Card */}
      <div
        className="rounded-3xl border overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(18, 12, 34, 0.85)',
          borderColor: 'rgba(139, 92, 246, 0.25)',
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 20px 40px',
        }}
      >
        {/* Vault Header Bar */}
        <div className="p-6 sm:p-7 border-b border-violet-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#140d28]/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                Live Vault Preview
              </div>
              <span className="text-xs text-slate-400">
                Showing {materials.length} high-yield resources
              </span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
              Trending in <span className="text-indigo-400">{activeBranch}</span> •{' '}
              <span className="text-slate-300">{selectedSem}</span>
            </h3>
          </div>

          {/* Semester & Scheme Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-white/5 border border-slate-800 rounded-xl p-1">
              {['Semester 7', 'Semester 8', 'All Sems'].map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => onSelectSem?.(sem)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    selectedSem === sem
                      ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 border border-violet-500/20 rounded-xl text-xs text-slate-300 font-mono">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Rev-2019 'C'</span>
            </div>
          </div>
        </div>

        {/* Stacked Material Rows Container */}
        <div className="p-4 sm:p-6 space-y-3">
          {materials.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-medium">
                No resources matched your search "{searchQuery}" in {activeBranch}.
              </p>
              <button
                type="button"
                onClick={onClearSearch}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            materials.map((item) => (
              <MaterialCard
                key={item.id}
                item={item}
                downloads={downloadCountTracker[item.id]}
                onDownload={onDownload}
                onQuickView={onQuickView}
              />
            ))
          )}
        </div>

        {/* Vault Footer Expansion Link */}
        <div className="p-4 sm:p-5 border-t border-violet-500/20 bg-[#140d28]/60 text-center">
          <a
            href="#all-materials"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
          >
            <span>Browse All 1,420+ {activeBranch} Verified Documents</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}


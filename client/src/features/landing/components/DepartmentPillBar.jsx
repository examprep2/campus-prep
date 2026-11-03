import React from 'react';
import { Layers } from 'lucide-react';
import { DEPARTMENTS } from '../data/landingData';

export default function DepartmentPillBar({
  departments = DEPARTMENTS,
  activeBranch = 'COMPS',
  onSelectBranch,
}) {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-violet-500/20 pb-3">
        <div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Select Engineering Discipline
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Curated repositories dynamically adapted for your branch syllabus scheme
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-violet-400 font-semibold">{departments.length} Branches</span>
          <span>•</span>
          <span>All 8 Semesters Available</span>
        </div>
      </div>

      {/* Horizontal Scrollable Pill Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
        {departments.map((dept) => {
          const isActive = activeBranch === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => onSelectBranch?.(dept.id)}
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(124, 58, 237, 0.4) 100%)',
                      borderColor: 'rgb(139, 92, 246)',
                      color: 'rgb(196, 181, 253)',
                    }
                  : undefined
              }
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'border shadow-md shadow-indigo-500/20 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-indigo-400 shadow-sm shadow-indigo-400' : 'bg-slate-600'
                }`}
              />
              <span>{dept.short}</span>
              <span className="hidden sm:inline text-[11px] opacity-70 font-normal">
                — {dept.label}
              </span>
              {dept.docCount && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                  {dept.docCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}


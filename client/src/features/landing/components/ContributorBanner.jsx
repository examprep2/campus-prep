import React from 'react';
import { Award, Upload } from 'lucide-react';
import { TOP_CONTRIBUTORS } from '../data/landingData';

export default function ContributorBanner({
  contributors = TOP_CONTRIBUTORS,
  onBecomeContributor,
}) {
  return (
    <section id="contributors-section">
      <div
        className="rounded-3xl border p-8 sm:p-12 relative overflow-hidden"
        style={{
          background: 'rgba(20, 13, 38, 0.85)',
          borderColor: 'rgba(139, 92, 246, 0.25)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Background Ambient Spotlight */}
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 w-[400px] h-[300px] bg-gradient-to-tl from-indigo-600/20 via-violet-600/15 to-transparent blur-[90px] rounded-full"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Copy & Avatars */}
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              ACADEMIC KARMA SYSTEM
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Built by Students, Verified by Faculty.
            </h3>

            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
              Join our decentralized peer network of toppers and academic mentors. Share
              your handwritten notes, university solutions, and formula sheets to earn verified
              contributor badges and recruiter visibility.
            </p>

            {/* Overlapping Avatar Stack */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden p-1">
                {contributors.map((contributor, i) => (
                  <img
                    key={i}
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="inline-block w-10 h-10 rounded-full ring-2 ring-[#140d26] object-cover"
                  />
                ))}
              </div>

              <div className="text-left text-xs font-sans">
                <span className="text-white font-semibold block">
                  +2,840 Active Campus Contributors
                </span>
                <span className="text-[#94a3b8]">Across 42 Engineering Colleges in MH</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contributor Callout Card */}
          <div className="w-full lg:w-auto flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              type="button"
              onClick={onBecomeContributor}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-102 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Become a Contributor</span>
            </button>

            <div className="p-3.5 rounded-xl bg-white/5 border border-slate-800 text-center text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-semibold">Tier 1 Perks:</span> Free AI Revision Engine access & Certificate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


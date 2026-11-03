import React from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { PRECISION_FEATURES } from '../data/landingData';

export default function FeatureGrid({ features = PRECISION_FEATURES }) {
  const getFeatureIcon = (iconType) => {
    switch (iconType) {
      case 'shield':
        return ShieldCheck;
      case 'brain':
        return BrainCircuit;
      default:
        return SlidersHorizontal;
    }
  };

  return (
    <section id="features-section" className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          ENGINEERED FOR TOPPERS
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Precision Engineering Suite
        </h2>
        <p className="text-sm sm:text-base text-[#cbd5e1]">
          Every tool and schema is architected to eliminate academic friction, maximize study
          efficiency, and deliver exam clarity.
        </p>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const IconComponent = getFeatureIcon(feature.iconType);
          return (
            <div
              key={feature.id}
              className="group rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 flex flex-col justify-between"
              style={{
                background: 'rgba(20, 13, 38, 0.85)',
                borderColor: 'rgba(139, 92, 246, 0.25)',
              }}
            >
              <div className="space-y-4">
                {/* Top Tag & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-slate-700/80 font-mono text-[11px] text-indigo-300 font-semibold">
                    {feature.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-white group-hover:text-indigo-200 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {feature.description}
                </p>

                {/* Bullet Perks */}
                <div className="space-y-2 pt-2 border-t border-violet-500/15">
                  {feature.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="#learn-more"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Explore Technical Docs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


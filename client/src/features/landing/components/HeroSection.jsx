import React from 'react';
import {
  Zap,
  ArrowRight,
  Upload,
  BookOpen,
  School,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { HERO_STATS } from '../data/landingData';

export default function HeroSection({
  onExploreClick,
  onUploadClick,
  stats = HERO_STATS,
}) {
  const renderStatIcon = (type) => {
    switch (type) {
      case 'school':
        return <School className="w-5 h-5 text-violet-400" />;
      case 'users':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'check':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getStatIconWrapper = (type) => {
    switch (type) {
      case 'school':
        return 'bg-violet-500/15 border-violet-500/30';
      case 'users':
        return 'bg-purple-500/15 border-purple-500/30';
      case 'check':
        return 'bg-emerald-500/15 border-emerald-500/30';
      default:
        return 'bg-indigo-500/15 border-indigo-500/30';
    }
  };

  return (
    <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
      {/* Curriculum Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-violet-500/30 text-xs text-indigo-300 backdrop-blur-md shadow-inner shadow-violet-500/10">
        <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
        <span className="font-medium tracking-wide">
          Built for Mumbai & Pune University Curriculums
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-500/20 rounded text-indigo-200 border border-indigo-500/40">
          Rev-2019 / 2024
        </span>
      </div>

      {/* Headline with Indigo-Violet Gradient Highlight */}
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
        Centralized Engineering Notes,{' '}
        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          Solved PYQs & AI Revision
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-[#cbd5e1] max-w-2xl mx-auto font-normal leading-relaxed">
        Instant access to verified semester lecture notes, university-solved question banks,
        and autonomous AI revision mindmaps tailored precisely to your engineering stream.
      </p>

      {/* Dual CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
        <a
          href="#vault-section"
          onClick={onExploreClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          <span>Explore Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <button
          type="button"
          onClick={onUploadClick}
          style={{
            backgroundColor: 'rgba(25, 17, 45, 0.85)',
            borderColor: 'rgba(168, 85, 247, 0.35)',
            color: 'rgb(226, 232, 240)',
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border hover:border-purple-400/60 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md cursor-pointer"
        >
          <Upload className="w-4 h-4 text-purple-300" />
          <span>Upload Notes</span>
        </button>
      </div>

      {/* 4-Column Social Proof Stat Grid */}
      <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-4 sm:p-5 rounded-2xl border text-left transition-transform hover:-translate-y-0.5"
            style={{
              background: 'rgba(20, 13, 38, 0.85)',
              borderColor: 'rgba(139, 92, 246, 0.25)',
            }}
          >
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${getStatIconWrapper(
                stat.iconType
              )}`}
            >
              {renderStatIcon(stat.iconType)}
            </div>
            <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
            <div className="text-xs text-[#94a3b8] font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


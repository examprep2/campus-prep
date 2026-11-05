import React from 'react';
import {
  FolderOpen,
  FileText,
  Book,
  Layers,
  Users,
  Sparkles,
} from 'lucide-react';
import { CORE_FEATURES } from '../data/landingData';

export default function FeatureGrid() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'file-text':
        return <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'book':
        return <Book className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-[#3157D5] dark:text-[#6B8CFF]" />;
      case 'users':
        return <Users className="w-5 h-5 text-[#16845B] dark:text-emerald-400" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <FolderOpen className="w-5 h-5 text-[#3157D5] dark:text-[#6B8CFF]" />;
    }
  };

  const getIconBg = (iconName) => {
    switch (iconName) {
      case 'file-text':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40';
      case 'book':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40';
      case 'layers':
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40';
      case 'users':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40';
      case 'sparkles':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40';
      default:
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40';
    }
  };

  return (
    <section id="features" className="py-12 border-t border-[#E6E9F0] dark:border-[#30394A] space-y-10 transition-colors">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] font-display">
          Engineered for Academic Focus
        </h2>
        <p className="text-sm text-[#687386] dark:text-[#A0AEC0]">
          Every module is built to eliminate clutter and provide curriculum-exact study materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CORE_FEATURES.map((feat) => (
          <div
            key={feat.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${getIconBg(
                    feat.icon
                  )}`}
                >
                  {getIcon(feat.icon)}
                </div>
                {feat.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                    {feat.badge}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-base text-[#172033] dark:text-[#F1F5F9]">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-[#687386] dark:text-[#A0AEC0] leading-relaxed">
                {feat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

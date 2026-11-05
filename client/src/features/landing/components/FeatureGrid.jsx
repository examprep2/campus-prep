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
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'book':
        return <Book className="w-5 h-5 text-purple-600" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-[#3157D5]" />;
      case 'users':
        return <Users className="w-5 h-5 text-[#16845B]" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      default:
        return <FolderOpen className="w-5 h-5 text-[#3157D5]" />;
    }
  };

  const getIconBg = (iconName) => {
    switch (iconName) {
      case 'file-text':
        return 'bg-amber-50 border-amber-100';
      case 'book':
        return 'bg-purple-50 border-purple-100';
      case 'layers':
        return 'bg-blue-50 border-blue-100';
      case 'users':
        return 'bg-emerald-50 border-emerald-100';
      case 'sparkles':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <section id="features" className="py-12 border-t border-[#E6E9F0] space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] font-display">
          Engineered for Academic Focus
        </h2>
        <p className="text-sm text-[#687386]">
          Every module is built to eliminate clutter and provide curriculum-exact study materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CORE_FEATURES.map((feat) => (
          <div
            key={feat.id}
            className="p-6 rounded-2xl bg-white border border-[#E6E9F0] shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    {feat.badge}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-base text-[#172033]">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-[#687386] leading-relaxed">
                {feat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

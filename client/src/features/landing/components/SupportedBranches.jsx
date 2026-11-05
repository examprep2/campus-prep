import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Network, Laptop, Activity, Cog, Car } from 'lucide-react';
import { SUPPORTED_BRANCHES } from '../data/landingData';

export default function SupportedBranches() {
  const getBranchIcon = (code) => {
    switch (code) {
      case 'COMPS':
        return <Laptop className="w-5 h-5 text-[#3157D5] dark:text-[#6B8CFF]" />;
      case 'AI/ML':
        return <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'IT':
        return <Network className="w-5 h-5 text-blue-600 dark:text-[#6B8CFF]" />;
      case 'Electronics':
        return <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Mechanical':
        return <Cog className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Automobile':
        return <Car className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Cpu className="w-5 h-5 text-[#3157D5] dark:text-[#6B8CFF]" />;
    }
  };

  return (
    <section id="branches" className="py-12 border-t border-[#E6E9F0] dark:border-[#30394A] space-y-10 transition-colors">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] font-display">
          Supported Engineering Branches
        </h2>
        <p className="text-sm text-[#687386] dark:text-[#A0AEC0]">
          Configured specifically for Mumbai University semester curriculum structures from First Year to Final Year.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SUPPORTED_BRANCHES.map((b) => (
          <div
            key={b.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-[#3157D5]/40 dark:hover:border-[#6B8CFF]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#222B3A] border border-slate-100 dark:border-[#30394A] flex items-center justify-center">
                  {getBranchIcon(b.code)}
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#3157D5] dark:text-[#6B8CFF] border border-blue-100 dark:border-blue-900/40">
                  {b.code}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-base text-[#172033] dark:text-[#F1F5F9] group-hover:text-[#3157D5] dark:group-hover:text-[#6B8CFF] transition-colors">
                  {b.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#687386] dark:text-[#A0AEC0] mt-1.5 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#30394A] flex items-center justify-between text-xs font-semibold text-[#3157D5] dark:text-[#6B8CFF]">
              <Link to={`/materials`} className="hover:underline flex items-center gap-1">
                <span>Browse {b.code} Materials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


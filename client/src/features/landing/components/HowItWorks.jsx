import React from 'react';
import { HOW_IT_WORKS } from '../data/landingData';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 border-t border-[#E6E9F0] space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] font-display">
          How Campus-Prep Works
        </h2>
        <p className="text-sm text-[#687386]">
          A clean, four-step workflow designed specifically for Mumbai University engineering students.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {HOW_IT_WORKS.map((step) => (
          <div
            key={step.step}
            className="p-6 rounded-2xl bg-white border border-[#E6E9F0] shadow-2xs space-y-3 relative overflow-hidden"
          >
            <span className="font-mono font-bold text-2xl text-[#3157D5] block">
              {step.step}
            </span>
            <h3 className="font-semibold text-base text-[#172033]">{step.title}</h3>
            <p className="text-xs sm:text-sm text-[#687386] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function FinalCTA() {
  return (
    <section className="py-12 border-t border-[#E6E9F0] dark:border-[#30394A] transition-colors">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#172033] dark:bg-[#1B2230] border border-transparent dark:border-[#30394A] text-white text-center space-y-6 relative overflow-hidden shadow-lg transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/5 flex items-center justify-center mx-auto text-white">
          <GraduationCap className="w-6 h-6" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Ready to streamline your semester preparation?
          </h2>
          <p className="text-sm text-slate-300 dark:text-[#A0AEC0] leading-relaxed">
            Join students across Mumbai University departments accessing verified handwritten
            notes and previous question papers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/signup">
            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              className="bg-[#3157D5] dark:bg-[#6B8CFF] dark:text-slate-950 hover:bg-[#2648B8] dark:hover:bg-[#829DFF] shadow-md font-semibold"
            >
              Create Student Account
            </Button>
          </Link>
          <Link to="/materials">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 dark:bg-white/5 hover:bg-white/15 dark:hover:bg-white/10 text-white border-white/20 dark:border-white/10 hover:border-white/30"
            >
              Browse Library First
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

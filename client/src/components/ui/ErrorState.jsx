import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while fetching information.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-[#D64B4B] dark:text-rose-400 mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#172033] dark:text-[#F1F5F9]">{title}</h3>
      <p className="text-sm text-[#687386] dark:text-[#A0AEC0] max-w-sm mt-1 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onRetry} icon={RotateCcw}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}


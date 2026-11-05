import React from 'react';
import { FileText, Book, HelpCircle, Layers, File } from 'lucide-react';

export default function FileTypeIcon({ type = 'notes', size = 'md', className = '' }) {
  const norm = (type || '').toLowerCase();

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-md p-1.5',
    md: 'w-10 h-10 rounded-lg p-2.5',
    lg: 'w-12 h-12 rounded-xl p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  switch (norm) {
    case 'notes':
      return (
        <div
          className={`flex items-center justify-center bg-blue-50 text-[#3157D5] border border-blue-100 dark:bg-blue-950/40 dark:text-[#6B8CFF] dark:border-blue-900/60 ${sizeClasses[size] || sizeClasses.md} ${className}`}
        >
          <FileText className={iconSizes[size] || iconSizes.md} />
        </div>
      );
    case 'book':
      return (
        <div
          className={`flex items-center justify-center bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/60 ${sizeClasses[size] || sizeClasses.md} ${className}`}
        >
          <Book className={iconSizes[size] || iconSizes.md} />
        </div>
      );
    case 'qp':
      return (
        <div
          className={`flex items-center justify-center bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60 ${sizeClasses[size] || sizeClasses.md} ${className}`}
        >
          <HelpCircle className={iconSizes[size] || iconSizes.md} />
        </div>
      );
    case 'syllabus':
      return (
        <div
          className={`flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60 ${sizeClasses[size] || sizeClasses.md} ${className}`}
        >
          <Layers className={iconSizes[size] || iconSizes.md} />
        </div>
      );
    default:
      return (
        <div
          className={`flex items-center justify-center bg-slate-50 text-slate-600 border border-slate-200 dark:bg-[#222B3A] dark:text-slate-300 dark:border-[#30394A] ${sizeClasses[size] || sizeClasses.md} ${className}`}
        >
          <File className={iconSizes[size] || iconSizes.md} />
        </div>
      );
  }
}


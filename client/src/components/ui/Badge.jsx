import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon: Icon,
}) {
  const variants = {
    neutral:
      'bg-slate-100 dark:bg-[#222B3A] text-slate-700 dark:text-[#A0AEC0] border-slate-200 dark:border-[#30394A]',
    primary:
      'bg-[#EEF2FF] dark:bg-[rgba(107,140,255,0.15)] text-[#3157D5] dark:text-[#6B8CFF] border-[#3157D5]/20 dark:border-[#6B8CFF]/30',
    success:
      'bg-[#E8F6F0] dark:bg-[rgba(52,211,153,0.14)] text-[#16845B] dark:text-[#34D399] border-[#16845B]/20 dark:border-[#34D399]/30',
    warning:
      'bg-[#FEF6E7] dark:bg-[rgba(251,191,36,0.14)] text-[#C58A27] dark:text-[#FBBF24] border-[#C58A27]/20 dark:border-[#FBBF24]/30',
    danger:
      'bg-[#FDECEC] dark:bg-[rgba(248,113,113,0.14)] text-[#D64B4B] dark:text-[#F87171] border-[#D64B4B]/20 dark:border-[#F87171]/30',
    purple:
      'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
    sky:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/40',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border font-sans ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-[#0F1117] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-[#3157D5] hover:bg-[#2648B8] dark:bg-[#6B8CFF] dark:hover:bg-[#829DFF] text-white dark:text-[#0F1117] font-medium dark:font-semibold focus:ring-[#3157D5]/40 dark:focus:ring-[#6B8CFF]/40 shadow-xs active:bg-[#1E3B9F] dark:active:bg-[#5277F7]',
    secondary:
      'bg-slate-100 hover:bg-slate-200 dark:bg-[#222B3A] dark:hover:bg-[#2A3547] text-slate-800 dark:text-[#F1F5F9] focus:ring-slate-300 dark:focus:ring-slate-700 active:bg-slate-300 dark:active:bg-[#1B2230]',
    outline:
      'bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#222B3A] hover:border-slate-300 dark:hover:border-slate-500 focus:ring-slate-200 dark:focus:ring-slate-700 shadow-xs',
    danger:
      'bg-[#D64B4B] hover:bg-[#B93838] dark:bg-[#F87171] dark:hover:bg-[#EF4444] text-white dark:text-[#0F1117] font-medium dark:font-semibold focus:ring-[#D64B4B]/40 dark:focus:ring-[#F87171]/40 shadow-xs',
    dangerOutline:
      'bg-white dark:bg-[#1B2230] border border-rose-200 dark:border-rose-900/60 text-[#D64B4B] dark:text-[#F87171] hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800 focus:ring-rose-200 dark:focus:ring-rose-900',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-[#222B3A] text-slate-600 dark:text-[#A0AEC0] hover:text-slate-900 dark:hover:text-[#F1F5F9] focus:ring-slate-200 dark:focus:ring-slate-700',
    link:
      'bg-transparent text-[#3157D5] dark:text-[#6B8CFF] hover:underline p-0 h-auto font-normal focus:ring-0',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" className="border-current border-t-transparent" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
      {!isLoading && IconRight ? <IconRight className="w-4 h-4 shrink-0" /> : null}
    </button>
  );
}

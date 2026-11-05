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
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-[#3157D5] hover:bg-[#2648B8] text-white focus:ring-[#3157D5]/40 shadow-xs active:bg-[#1E3B9F]',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300 active:bg-slate-300',
    outline:
      'bg-white border border-[#E6E9F0] text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-200 shadow-xs active:bg-slate-100',
    danger:
      'bg-[#D64B4B] hover:bg-[#B93838] text-white focus:ring-[#D64B4B]/40 shadow-xs active:bg-[#9F2828]',
    dangerOutline:
      'bg-white border border-rose-200 text-[#D64B4B] hover:bg-rose-50 hover:border-rose-300 focus:ring-rose-200',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-200',
    link:
      'bg-transparent text-[#3157D5] hover:underline p-0 h-auto font-normal focus:ring-0',
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


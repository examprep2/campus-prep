import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon: Icon,
}) {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-[#EEF2FF] text-[#3157D5] border-[#3157D5]/20',
    success: 'bg-[#E8F6F0] text-[#16845B] border-[#16845B]/20',
    warning: 'bg-[#FEF6E7] text-[#C58A27] border-[#C58A27]/20',
    danger: 'bg-[#FDECEC] text-[#D64B4B] border-[#D64B4B]/20',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
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


import React from 'react';

export default function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E6E9F0] dark:border-[#30394A] ${className}`}
    >
      <div className="space-y-1">
        {breadcrumbs && (
          <div className="flex items-center gap-1.5 text-xs text-[#687386] dark:text-[#A0AEC0] mb-1 font-medium">
            {breadcrumbs}
          </div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] font-display">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && <p className="text-sm text-[#687386] dark:text-[#A0AEC0] leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}


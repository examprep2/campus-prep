import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      error,
      hint,
      id,
      name,
      value,
      onChange,
      options = [],
      placeholder = 'Select an option',
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#172033] dark:text-[#F1F5F9]">
            {label} {required && <span className="text-[#D64B4B] dark:text-[#F87171]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full appearance-none rounded-lg border bg-white dark:bg-[#1B2230] px-3 py-2 pr-9 text-sm text-[#172033] dark:text-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:disabled:bg-[#151923] disabled:text-slate-400 dark:disabled:text-[#758195] disabled:cursor-not-allowed ${
              error
                ? 'border-[#D64B4B] dark:border-[#F87171] focus:border-[#D64B4B] dark:focus:border-[#F87171] focus:ring-[#D64B4B]/20 dark:focus:ring-[#F87171]/25'
                : 'border-[#E6E9F0] dark:border-[#30394A] hover:border-slate-300 dark:hover:border-slate-500 focus:border-[#3157D5] dark:focus:border-[#6B8CFF] focus:ring-[#3157D5]/20 dark:focus:ring-[#6B8CFF]/25'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="dark:bg-[#1B2230] dark:text-[#758195]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={optValue} value={optValue} className="dark:bg-[#1B2230] dark:text-[#F1F5F9]">
                  {optLabel}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-[#758195]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-[#D64B4B] dark:text-[#F87171] font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#687386] dark:text-[#A0AEC0]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

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
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#172033]">
            {label} {required && <span className="text-[#D64B4B]">*</span>}
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
            className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-[#172033] transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              error
                ? 'border-[#D64B4B] focus:border-[#D64B4B] focus:ring-[#D64B4B]/20'
                : 'border-[#E6E9F0] hover:border-slate-300 focus:border-[#3157D5] focus:ring-[#3157D5]/20'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={optValue} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-[#D64B4B] font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#687386]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;


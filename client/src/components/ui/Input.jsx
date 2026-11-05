import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      id,
      name,
      type = 'text',
      placeholder,
      value,
      onChange,
      required = false,
      disabled = false,
      icon: Icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#172033]">
            {label} {required && <span className="text-[#D64B4B]">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              Icon ? 'pl-9' : ''
            } ${
              error
                ? 'border-[#D64B4B] focus:border-[#D64B4B] focus:ring-[#D64B4B]/20'
                : 'border-[#E6E9F0] hover:border-slate-300 focus:border-[#3157D5] focus:ring-[#3157D5]/20'
            } ${className}`}
            {...props}
          />
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

Input.displayName = 'Input';
export default Input;


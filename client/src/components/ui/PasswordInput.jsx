import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = forwardRef(
  (
    {
      label,
      error,
      hint,
      id,
      name,
      placeholder = '••••••••',
      value,
      onChange,
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#172033] dark:text-[#F1F5F9]">
            {label} {required && <span className="text-[#D64B4B] dark:text-[#F87171]">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-[#758195]">
            <Lock className="w-4 h-4" />
          </div>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full rounded-lg border bg-white dark:bg-[#1B2230] pl-9 pr-10 py-2 text-sm text-[#172033] dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#758195] transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:disabled:bg-[#151923] disabled:text-slate-400 dark:disabled:text-[#758195] disabled:cursor-not-allowed ${
              error
                ? 'border-[#D64B4B] dark:border-[#F87171] focus:border-[#D64B4B] dark:focus:border-[#F87171] focus:ring-[#D64B4B]/20 dark:focus:ring-[#F87171]/25'
                : 'border-[#E6E9F0] dark:border-[#30394A] hover:border-slate-300 dark:hover:border-slate-500 focus:border-[#3157D5] dark:focus:border-[#6B8CFF] focus:ring-[#3157D5]/20 dark:focus:ring-[#6B8CFF]/25'
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-[#758195] dark:hover:text-[#F1F5F9] transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
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

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;

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
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#172033]">
            {label} {required && <span className="text-[#D64B4B]">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
            className={`w-full rounded-lg border bg-white pl-9 pr-10 py-2 text-sm text-[#172033] placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              error
                ? 'border-[#D64B4B] focus:border-[#D64B4B] focus:ring-[#D64B4B]/20'
                : 'border-[#E6E9F0] hover:border-slate-300 focus:border-[#3157D5] focus:ring-[#3157D5]/20'
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
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

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;


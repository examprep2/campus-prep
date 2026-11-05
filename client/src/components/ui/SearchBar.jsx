import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search materials, subjects...',
  className = '',
  autoFocus = false,
  showShortcut = false,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showShortcut) return;
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcut]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-[#758195]">
        <Search className="w-4 h-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#1B2230] pl-9 pr-14 py-2 text-sm text-[#172033] dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#758195] transition-colors hover:border-slate-300 dark:hover:border-slate-500 focus:border-[#3157D5] dark:focus:border-[#6B8CFF] focus:outline-none focus:ring-2 focus:ring-[#3157D5]/20 dark:focus:ring-[#6B8CFF]/25 shadow-2xs"
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange?.('');
              onClear?.();
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-[#F1F5F9] p-1 rounded-md cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : showShortcut ? (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-[#222B3A] border border-slate-200 dark:border-[#30394A] rounded">
            ⌘K
          </kbd>
        ) : null}
      </div>
    </div>
  );
}

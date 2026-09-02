import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(({ label, error, options = [], placeholder, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink-soft dark:text-slate-300 mb-1.5">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full bg-white border border-forest-500/20 rounded-xl px-4 py-2.5 text-sm text-ink outline-none transition-all duration-200 appearance-none cursor-pointer',
          'focus:border-forest-500/60 focus:ring-2 focus:ring-forest-500/15',
          'dark:bg-white/5 dark:border-white/10 dark:text-white',
          'dark:focus:border-gold-400/50 dark:focus:ring-gold-400/20 dark:focus:bg-white/10',
          error && 'border-red-400/60',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-white text-ink dark:bg-slate-900 dark:text-white">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option
            key={opt.value || opt}
            value={opt.value || opt}
            className="bg-white text-ink dark:bg-slate-900 dark:text-white"
          >
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;

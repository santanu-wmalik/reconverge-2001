import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(({ label, error, options = [], placeholder, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 appearance-none cursor-pointer',
          'focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 focus:bg-white/10',
          error && 'border-red-400/50',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-slate-900">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt} className="bg-slate-900">
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;

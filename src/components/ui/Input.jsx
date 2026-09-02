import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ label, error, icon, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink-soft dark:text-slate-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-slate-400">{icon}</span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white border border-forest-500/20 rounded-xl px-4 py-2.5 text-sm text-ink placeholder-ink-muted outline-none transition-all duration-200',
            'focus:border-forest-500/60 focus:ring-2 focus:ring-forest-500/15',
            'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500',
            'dark:focus:border-gold-400/50 dark:focus:ring-gold-400/20 dark:focus:bg-white/10',
            icon && 'pl-10',
            error && 'border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

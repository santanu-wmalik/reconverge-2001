import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Light (public) defaults; `dark:` variants reproduce the original navy/gold
// portal look so admin + portal screens render unchanged inside their dark
// shells.
const variants = {
  primary:
    'bg-gold-500 hover:bg-gold-600 text-ink shadow-md shadow-gold-500/30 ' +
    'dark:text-primary-900 dark:shadow-lg dark:shadow-gold-500/20',
  secondary:
    'bg-forest-600 hover:bg-forest-500 text-white shadow-md shadow-forest-600/25 ' +
    'dark:bg-primary-600 dark:hover:bg-primary-500 dark:shadow-primary-600/20',
  outline:
    'border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8 ' +
    'dark:border-gold-400/50 dark:text-gold-400 dark:hover:bg-gold-400/10',
  ghost:
    'text-ink-soft hover:bg-forest-600/8 hover:text-ink ' +
    'dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
  danger:
    'bg-red-500/10 hover:bg-red-500/20 text-red-700 border border-red-400/40 ' +
    'dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-300 dark:border-red-400/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className,
  ...props
}) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={cn(
        'font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
}

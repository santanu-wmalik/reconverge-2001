import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-gold-500 hover:bg-gold-600 text-primary-900 shadow-lg shadow-gold-500/20',
  secondary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20',
  outline: 'border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10',
  ghost: 'text-slate-300 hover:bg-white/10 hover:text-white',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30',
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

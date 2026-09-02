import { cn } from '../../utils/cn';

const variants = {
  default:
    'bg-forest-600/10 text-forest-700 border-forest-500/25 ' +
    'dark:bg-primary-600/30 dark:text-primary-200 dark:border-primary-400/20',
  gold:
    'bg-gold-500/15 text-gold-700 border-gold-500/40 ' +
    'dark:bg-gold-500/20 dark:text-gold-300 dark:border-gold-400/20',
  success:
    'bg-green-500/12 text-green-800 border-green-500/30 ' +
    'dark:bg-green-500/20 dark:text-green-300 dark:border-green-400/20',
  danger:
    'bg-red-500/12 text-red-800 border-red-500/30 ' +
    'dark:bg-red-500/20 dark:text-red-300 dark:border-red-400/20',
  warning:
    'bg-yellow-500/15 text-yellow-800 border-yellow-500/35 ' +
    'dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-400/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'md', dot, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', `bg-current`)} />}
      {children}
    </span>
  );
}

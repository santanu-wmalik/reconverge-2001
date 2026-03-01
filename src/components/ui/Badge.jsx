import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-primary-600/30 text-primary-200 border-primary-400/20',
  gold: 'bg-gold-500/20 text-gold-300 border-gold-400/20',
  success: 'bg-green-500/20 text-green-300 border-green-400/20',
  danger: 'bg-red-500/20 text-red-300 border-red-400/20',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/20',
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

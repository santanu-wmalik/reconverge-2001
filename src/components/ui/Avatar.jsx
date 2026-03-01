import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

export default function Avatar({ src, name, size = 'md', className }) {
  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-gold-500 to-primary-600 flex items-center justify-center font-bold text-white overflow-hidden flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name || 'User')}</span>
      )}
    </div>
  );
}

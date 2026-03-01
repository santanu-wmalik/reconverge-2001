import { cn } from '../../utils/cn';

export default function GradientText({ children, className, as: Tag = 'span' }) {
  return (
    <Tag className={cn('bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-gold-600', className)}>
      {children}
    </Tag>
  );
}

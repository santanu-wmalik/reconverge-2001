import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function GlassCard({
  children,
  className,
  hover = true,
  padding = 'p-6',
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      whileHover={hover ? { y: -4, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

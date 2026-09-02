import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Paper card on the public (light) theme; original translucent glass in
// dark shells (portal/admin) via `dark:` variants.
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
      whileHover={hover ? { y: -4, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white/85 backdrop-blur-lg rounded-2xl border border-forest-500/15 shadow-[0_10px_30px_rgba(31,31,31,0.06)]',
        'dark:bg-white/5 dark:border-white/10 dark:shadow-xl',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

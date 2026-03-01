import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animationVariants';

export default function ScrollReveal({
  children,
  variants = fadeInUp,
  className = '',
  delay = 0,
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

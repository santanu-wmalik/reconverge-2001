import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function FlipCard({ front, back, className }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn('perspective-1000 cursor-pointer', className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative preserve-3d w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 backface-hidden">{front}</div>
        <div className="absolute inset-0 backface-hidden rotate-y-180">{back}</div>
      </motion.div>
    </div>
  );
}

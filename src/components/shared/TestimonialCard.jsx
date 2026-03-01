import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass p-6 flex flex-col h-full"
    >
      <div className="text-4xl text-gold-400/40 font-heading leading-none mb-3">"</div>
      <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-4">
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <Avatar src={testimonial.avatar} name={testimonial.name} size="md" />
        <div>
          <p className="text-white font-semibold text-sm">{testimonial.name}</p>
          <p className="text-slate-400 text-xs">{testimonial.currentRole}</p>
          <p className="text-gold-400 text-xs">Batch of {testimonial.batch}</p>
        </div>
      </div>
    </motion.div>
  );
}

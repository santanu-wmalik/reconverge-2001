import { motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass px-4 py-3 min-w-[70px] md:min-w-[90px]"
      >
        <span className="text-2xl md:text-4xl font-bold gradient-text font-heading">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs md:text-sm text-slate-400 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ targetDate }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="text-center">
        <span className="text-2xl md:text-3xl font-heading font-bold gradient-text">
          The Event is Live!
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <TimeUnit value={days} label="Days" />
      <span className="text-2xl text-gold-400 font-bold mt-[-20px]">:</span>
      <TimeUnit value={hours} label="Hours" />
      <span className="text-2xl text-gold-400 font-bold mt-[-20px]">:</span>
      <TimeUnit value={minutes} label="Min" />
      <span className="text-2xl text-gold-400 font-bold mt-[-20px]">:</span>
      <TimeUnit value={seconds} label="Sec" />
    </div>
  );
}

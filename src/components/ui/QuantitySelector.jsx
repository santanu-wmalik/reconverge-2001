import { cn } from '../../utils/cn';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, className }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
      >
        -
      </button>
      <span className="w-8 text-center text-sm font-medium text-white">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

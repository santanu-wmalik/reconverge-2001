import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export default function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '', className = '' }) {
  const { count, ref } = useAnimatedCounter(end, duration);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

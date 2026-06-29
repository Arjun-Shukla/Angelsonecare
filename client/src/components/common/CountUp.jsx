import { useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView.js';

export default function CountUp({
  target,
  suffix   = '',
  prefix   = '',
  duration = 1800,
  className = '',
}) {
  const [count, setCount] = useState(0);
  const [ref, inView]     = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    let startTime = null;

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [inView]);

  const formatted = count >= 1000
    ? count.toLocaleString('en-IN')
    : String(count);

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

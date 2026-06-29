import { useEffect, useCallback, useState } from 'react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useInView(options = {}) {
  const [element, setElement] = useState(null);
  const [inView, setInView] = useState(prefersReducedMotion);

  // Callback ref — called by React when the DOM node mounts/unmounts,
  // which triggers the useEffect below (unlike useRef, state changes cause re-renders)
  const ref = useCallback(node => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]); // re-runs when the DOM node is assigned

  return [ref, inView];
}

'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * IntersectionObserver hook for lazy loading and scroll-triggered effects.
 *
 * @param options - IntersectionObserver options (threshold, rootMargin, etc.)
 * @returns [ref, isIntersecting] — ref to attach to the target element, and boolean visibility state.
 *
 * @example
 * ```tsx
 * const [ref, isVisible] = useIntersection({ rootMargin: '200px' });
 * return <div ref={ref}>{isVisible && <ExpensiveComponent />}</div>;
 * ```
 */
export function useIntersection<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0,
      rootMargin: '100px',
      ...options,
    });

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isIntersecting];
}

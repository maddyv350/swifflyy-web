import { useEffect, useRef, useState } from 'react';

/**
 * Counts a numeric value up from 0 → `target` once the element scrolls into
 * view. `enabled=false` jumps straight to the target (reduced motion).
 * Returns a ref to attach and the current display value.
 */
export function useCountUp(target: number, enabled: boolean, durationMs = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(enabled ? 0 : target);
  const done = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(target * eased);
          if (t < 1) requestAnimationFrame(tick);
          else setValue(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, enabled, durationMs]);

  return { ref, value };
}

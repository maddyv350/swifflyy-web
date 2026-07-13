import { useEffect, useRef } from 'react';

/** A thin coral progress bar pinned to the very top, tracking scroll depth. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? h.scrollTop / max : 0;
        if (bar.current) bar.current.style.transform = `scaleX(${pct})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[120] h-[3px]" aria-hidden>
      <div ref={bar} className="h-full origin-left scale-x-0 bg-coral-500" />
    </div>
  );
}

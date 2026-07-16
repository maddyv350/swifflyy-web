import { useEffect, useRef } from 'react';

/**
 * The pen drawing a line across the top of the page. Scroll depth strokes a
 * slightly wobbly coral path on (via strokeDashoffset — paint only, no layout
 * animation) with a tiny nib dot riding its head.
 *
 * `pathLength={100}` normalises the dash math so progress maps 0–100 with no
 * getTotalLength() (i.e. no layout reads). The nib rides the right edge of a
 * full-width runner translated by percent, so it tracks the head exactly at
 * any viewport width using transforms only.
 */
export function ScrollProgress() {
  const path = useRef<SVGPathElement>(null);
  const runner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
        if (path.current) path.current.style.strokeDashoffset = String(100 - pct * 100);
        if (runner.current) {
          runner.current.style.transform = `translateX(${(pct - 1) * 100}%)`;
          // At rest the nib would poke half-clipped out of the corner — a stray mark.
          runner.current.style.opacity = pct > 0.004 ? '1' : '0';
        }
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[7px]" aria-hidden>
      <svg
        className="h-full w-full text-coral-500"
        viewBox="0 0 1200 8"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={path}
          d="M0 4.2 C 40 2.8, 78 5.6, 120 4.4 S 195 3.2, 240 4.6 S 320 5.4, 360 4 S 438 2.9, 480 4.3 S 560 5.5, 600 4.1 S 676 3, 720 4.5 S 800 5.3, 840 4 S 918 3.1, 960 4.4 S 1040 5.4, 1080 4.1 S 1160 3.3, 1200 4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset="100"
        />
      </svg>
      {/* Full-width runner; its right edge is the pen head, the nib sits on it. */}
      <div ref={runner} className="absolute inset-0 -translate-x-full">
        <span className="absolute right-0 top-1/2 block h-[7px] w-[7px] -translate-y-1/2 translate-x-1/2 rounded-full bg-coral-600" />
      </div>
    </div>
  );
}

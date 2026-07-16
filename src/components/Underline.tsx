import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UnderlineProps {
  className?: string;
  /** Opt in: the squiggle draws itself on when scrolled into view. */
  draw?: boolean;
  /** NOT prefers-reduced-motion — required alongside `draw` to animate. */
  animate?: boolean;
}

/**
 * A hand-drawn squiggle underline sized to sit under an inline word. Wrap the
 * word in a `relative inline-block` and drop this inside it.
 *
 * Static by default (unchanged behaviour). With `draw` AND `animate` both
 * true it draws itself on scroll-in — the hidden state is set in JS only
 * (gsap.set inside the effect), so reduced-motion and prerendered pages
 * always show the finished stroke.
 */
export function Underline({ className = '', draw = false, animate = false }: UnderlineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !draw || !animate) return;

    let length = 0;
    try {
      length = path.getTotalLength();
    } catch {
      return;
    }
    if (!Number.isFinite(length) || length <= 0) return;

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: length + 1, strokeDashoffset: length + 1 });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: path, start: 'top 88%' },
      });
    }, path);

    return () => ctx.revert();
  }, [draw, animate]);

  return (
    <svg
      className={`pointer-events-none absolute -bottom-2 -left-1 h-3.5 w-[calc(100%+8px)] ${className}`}
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        ref={pathRef}
        d="M4 7 C 44 2, 100 13, 150 5 S 195 9, 196 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

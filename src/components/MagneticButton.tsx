import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Disable the magnetic pull (reduced motion / touch). */
  enabled?: boolean;
  ariaLabel?: string;
}

/** Padding (px) the squiggle ring sits outside the button's edge. */
const RING_PAD = 7;

/**
 * A wobbly hand-drawn loop sized to the button's real pixel box (so the
 * stroke stays uniform and `getTotalLength()` is trustworthy). Four jittered
 * quarter-arcs that deliberately don't quite close — napkin rules.
 */
function ringPathD(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - 3;
  const ry = h / 2 - 3;
  const k = 0.5523; // circle-approximation kappa
  const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  return [
    `M ${pt(cx + rx, cy - 2)}`,
    `C ${pt(cx + rx + 1.5, cy + ry * k)} ${pt(cx + rx * k, cy + ry + 1.5)} ${pt(cx - 2, cy + ry)}`,
    `C ${pt(cx - rx * k, cy + ry - 1)} ${pt(cx - rx - 1, cy + ry * k)} ${pt(cx - rx + 1, cy + 1.5)}`,
    `C ${pt(cx - rx + 0.5, cy - ry * k)} ${pt(cx - rx * k, cy - ry - 1.5)} ${pt(cx + 3, cy - ry + 0.5)}`,
    `C ${pt(cx + rx * k, cy - ry - 1)} ${pt(cx + rx + 2, cy - ry * k)} ${pt(cx + rx - 3, cy - 6)}`,
  ].join(' ');
}

/**
 * An anchor that subtly leans toward the cursor while hovered. Two layers of
 * depth: the button follows the pointer while the inner label counter-moves
 * (~0.35x opposite), and a faint hand-drawn ring sketches itself around the
 * button on hover/focus. Falls back to a plain link when disabled — the ring
 * is a decorative hover affordance, hidden until JS draws it (same pattern as
 * the InkCursor ring), so prerendered/no-JS pages never show it half-baked.
 */
export function MagneticButton({
  href,
  children,
  className = '',
  enabled = true,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ringSvgRef = useRef<SVGSVGElement>(null);
  const ringPathRef = useRef<SVGPathElement>(null);
  const ringSize = useRef({ w: 0, h: 0, len: 0 });

  // If the pull is disabled mid-interaction (reduced-motion flips on), snap
  // everything back to rest so nothing is left translated or half-drawn.
  useEffect(() => {
    if (enabled) return;
    const targets: HTMLElement[] = [];
    if (ref.current) targets.push(ref.current);
    if (labelRef.current) targets.push(labelRef.current);
    if (targets.length > 0) {
      gsap.killTweensOf(targets);
      gsap.set(targets, { x: 0, y: 0 });
    }
    if (ringSvgRef.current) {
      gsap.killTweensOf(ringSvgRef.current);
      gsap.set(ringSvgRef.current, { opacity: 0 });
    }
  }, [enabled]);

  // Kill any in-flight tweens when the component unmounts.
  useEffect(() => {
    const targets = [ref.current, labelRef.current, ringSvgRef.current, ringPathRef.current];
    return () => {
      gsap.killTweensOf(targets.filter((t) => t !== null));
    };
  }, []);

  /** (Re)build the ring path for the button's current size; returns its length. */
  const syncRing = (): number => {
    const a = ref.current;
    const svg = ringSvgRef.current;
    const path = ringPathRef.current;
    if (!a || !svg || !path) return 0;
    const w = a.offsetWidth + RING_PAD * 2;
    const h = a.offsetHeight + RING_PAD * 2;
    if (w !== ringSize.current.w || h !== ringSize.current.h) {
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      path.setAttribute('d', ringPathD(w, h));
      let len = 0;
      try {
        len = path.getTotalLength();
      } catch {
        len = 0;
      }
      ringSize.current = { w, h, len: Number.isFinite(len) && len > 0 ? len : 0 };
    }
    return ringSize.current.len;
  };

  const drawRing = () => {
    const svg = ringSvgRef.current;
    const path = ringPathRef.current;
    const len = syncRing();
    if (!svg || !path || len === 0) return;
    gsap.killTweensOf([svg, path]);
    gsap.set(path, { strokeDasharray: len + 1, strokeDashoffset: len + 1 });
    gsap.set(svg, { opacity: 1 });
    gsap.to(path, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' });
  };

  const hideRing = () => {
    const svg = ringSvgRef.current;
    if (!svg) return;
    gsap.to(svg, { opacity: 0, duration: 0.25, ease: 'power1.out', overwrite: 'auto' });
  };

  const onEnter = () => {
    if (!enabled || !window.matchMedia('(pointer: fine)').matches) return;
    drawRing();
  };

  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!enabled || !ref.current || !labelRef.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.38;
    gsap.to(ref.current, { x: dx, y: dy, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    // The label counter-translates for a plate-over-plate depth feel.
    gsap.to(labelRef.current, {
      x: -dx * 0.35,
      y: -dy * 0.35,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const reset = () => {
    const targets: HTMLElement[] = [];
    if (ref.current) targets.push(ref.current);
    if (labelRef.current) targets.push(labelRef.current);
    if (targets.length > 0) {
      gsap.to(targets, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
    }
    hideRing();
  };

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      data-cursor="tap"
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onFocus={() => {
        if (enabled) drawRing();
      }}
      onBlur={hideRing}
      className={className}
    >
      {/* faint pen ring, sketched on hover/focus (viewBox + d set from the
          measured button box on first draw) */}
      <svg
        ref={ringSvgRef}
        aria-hidden
        fill="none"
        className="pointer-events-none absolute -inset-[7px] opacity-0"
      >
        <path
          ref={ringPathRef}
          stroke="rgb(var(--coral-500))"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <span
        ref={labelRef}
        className="pointer-events-none relative inline-flex items-center gap-2.5 will-change-transform"
      >
        {children}
      </span>
    </a>
  );
}

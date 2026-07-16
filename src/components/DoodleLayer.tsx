import type { ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDrawOn } from '../hooks/useDrawOn';

gsap.registerPlugin(ScrollTrigger);

export interface DoodleLayerItem {
  /** What to render — typically a doodle from `./doodles`, already colored/sized. */
  node: ReactNode;
  /** CSS `left` within the section (e.g. `'6%'`, `'40px'`). */
  x: string;
  /** CSS `top` within the section. */
  y: string;
  /**
   * Parallax rate, roughly 0–1.5. 0 = pinned to the page, 1 = drifts up ~1.4×
   * its own height while the section scrolls through. Default 0.5.
   */
  depth?: number;
  /** Static sticker rotation in degrees. */
  rotate?: number;
}

interface DoodleLayerProps {
  items: DoodleLayerItem[];
  /** NOT prefers-reduced-motion. false = static, fully visible doodles. */
  animate: boolean;
  /** Extra classes on the layer (e.g. `'hidden md:block'` to drop it on mobile). */
  className?: string;
  /** When true (and `animate`), strokes draw themselves on scroll-in. */
  draw?: boolean;
}

/** Deterministic pseudo-random in [0, 1) — stable across re-renders/rebuilds. */
const seeded = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * A decorative scatter of doodles that drifts as the page scrolls — margin
 * scribbles that float at their own depths, plus a barely-there idle sway.
 *
 * Render it inside a `relative` section. The layer is `absolute inset-0`,
 * `aria-hidden` and `pointer-events-none`; one scrubbed ScrollTrigger drives
 * every item's parallax. With `animate=false` the doodles are simply static
 * and visible (hidden states only ever exist in JS).
 */
export function DoodleLayer({ items, animate, className = '', draw = false }: DoodleLayerProps) {
  const root = useDrawOn<HTMLDivElement>({ enabled: animate && draw, duration: 0.9, stagger: 0.1 });

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !animate) return;
    const nodes = el.querySelectorAll<HTMLElement>('[data-doodle-item]');
    if (nodes.length === 0) return;

    const ctx = gsap.context(() => {
      // One scrubbed timeline carries every item's drift (single ScrollTrigger).
      // Its onToggle doubles as the visibility gate for the idle sway tweens,
      // so the ticker isn't kept hot by doodles nobody can see.
      const sways: gsap.core.Tween[] = [];
      let active = false;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onToggle: (self) => {
            active = self.isActive;
            for (const sway of sways) {
              if (active) sway.play();
              else sway.pause();
            }
          },
        },
      });
      nodes.forEach((node, i) => {
        const depth = Number(node.dataset.depth ?? '0.5') || 0;
        if (depth > 0) tl.to(node, { yPercent: -140 * depth, ease: 'none' }, 0);
        // A very slow idle float, de-synced per item so nothing moves in
        // lockstep (the negative delay pre-advances each tween's phase).
        const sway = gsap.to(node, {
          y: `+=${(6 + seeded(i) * 6).toFixed(1)}`,
          rotation: `+=${(seeded(i + 7) * 5 - 2.5).toFixed(1)}`,
          duration: 4.5 + seeded(i + 3) * 3.5,
          delay: -seeded(i + 11) * 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
        if (!active) sway.pause();
        sways.push(sway);
      });
    }, el);

    return () => ctx.revert();
  }, [animate, items.length, root]);

  return (
    <div ref={root} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {items.map((item, i) => (
        <span
          key={i}
          data-doodle-item
          data-depth={item.depth ?? 0.5}
          className="absolute block will-change-transform"
          style={{ left: item.x, top: item.y, transform: `rotate(${item.rotate ?? 0}deg)` }}
        >
          {item.node}
        </span>
      ))}
    </div>
  );
}

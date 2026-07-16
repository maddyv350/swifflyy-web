import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface DrawOnOptions {
  /** When false, strokes are simply left visible — no animation, no hiding. */
  enabled?: boolean;
  /** Scrub the drawing to scroll instead of playing it once on scroll-in. */
  scrub?: boolean;
  /** ScrollTrigger start (default `'top 80%'`). */
  start?: string;
  /** Per-stroke draw duration in seconds (non-scrub mode; default 1.1). */
  duration?: number;
  /** Stagger between strokes in seconds (default 0.14). */
  stagger?: number;
}

/**
 * "The pen draws the strokes on." Attach the returned ref to any container;
 * every `path/line/circle/ellipse/polyline` descendant carrying `data-draw`
 * (the foundation doodle set does) is measured with `getTotalLength()` and its
 * `stroke-dashoffset` animated to 0 as the container scrolls into view.
 *
 * The hidden (undrawn) state is set in JS only — via `gsap.set` inside the
 * effect — so reduced-motion users and the pre-rendered HTML always show the
 * complete strokes. Elements that can't be measured (no `getTotalLength`,
 * zero/non-finite length, throwing while detached) are skipped and simply
 * stay visible.
 */
export function useDrawOn<T extends HTMLElement = HTMLDivElement>({
  enabled = true,
  scrub = false,
  start = 'top 80%',
  duration = 1.1,
  stagger = 0.14,
}: DrawOnOptions = {}) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;

    const strokes = root.querySelectorAll<SVGElement>(
      'path[data-draw], line[data-draw], circle[data-draw], ellipse[data-draw], polyline[data-draw]',
    );

    const drawable: SVGGeometryElement[] = [];
    const lengths: number[] = [];
    strokes.forEach((el) => {
      const geo = el as SVGGeometryElement;
      if (typeof geo.getTotalLength !== 'function') return;
      let len = 0;
      try {
        len = geo.getTotalLength();
      } catch {
        return; // detached / unrenderable — leave it visible
      }
      if (!Number.isFinite(len) || len <= 0) return;
      drawable.push(geo);
      lengths.push(len);
    });
    if (drawable.length === 0) return;

    const ctx = gsap.context(() => {
      drawable.forEach((el, i) => {
        // +1 swallows the sub-pixel nub some browsers leave at the stroke start.
        gsap.set(el, { strokeDasharray: lengths[i] + 1, strokeDashoffset: lengths[i] + 1 });
      });
      gsap.to(drawable, {
        strokeDashoffset: 0,
        ease: scrub ? 'none' : 'power2.inOut',
        duration,
        stagger,
        scrollTrigger: scrub
          ? { trigger: root, start, end: '+=45%', scrub: 0.6 }
          : { trigger: root, start },
      });
    }, root);

    return () => ctx.revert();
  }, [enabled, scrub, start, duration, stagger]);

  return ref;
}

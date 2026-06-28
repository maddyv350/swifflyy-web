import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  /** Stagger between items (seconds). */
  stagger?: number;
  /** Distance items rise from (px). */
  y?: number;
  /** When false, items are shown instantly with no animation. */
  enabled?: boolean;
}

/**
 * Staggered fade-up for any `[data-reveal]` descendants of the returned ref,
 * fired as the container scrolls into view (GSAP + ScrollTrigger).
 *
 * Pure GSAP — nothing is hidden via CSS, so reduced-motion / disabled simply
 * leaves content visible (no "stuck invisible" risk). `useLayoutEffect` sets the
 * hidden state before paint to avoid a flash.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  stagger = 0.12,
  y = 28,
  enabled = true,
}: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const items = root.querySelectorAll<HTMLElement>('[data-reveal]');
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: root, start: 'top 80%' },
      });
    }, root);

    return () => ctx.revert();
  }, [stagger, y, enabled]);

  return ref;
}

/**
 * A tiny module-level scroll-velocity bus.
 *
 * `useSmoothScroll` feeds it from Lenis' scroll events (px/s, signed —
 * positive = scrolling down). When smooth scrolling is disabled (reduced
 * motion) nothing feeds the bus and it reports 0, so every consumer's
 * "react to scroll speed" effect silently rests.
 *
 * Consumers:
 *   const v = getScrollVelocity();            // poll (e.g. inside gsap.ticker)
 *   const off = onScrollVelocity((v) => ...); // subscribe; call off() to stop
 */

type VelocityListener = (velocity: number) => void;

/** Consider the reading stale (report 0) if nothing was published recently. */
const STALE_MS = 160;

let velocity = 0;
let stamp = -STALE_MS;
const listeners = new Set<VelocityListener>();

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/** Current scroll velocity in px/s, signed (+ down, − up). 0 when idle/disabled. */
export function getScrollVelocity(): number {
  return now() - stamp > STALE_MS ? 0 : velocity;
}

/**
 * Subscribe to velocity updates (fired from Lenis' scroll events, plus a final
 * `0` once scrolling settles). Returns an unsubscribe function.
 */
export function onScrollVelocity(cb: VelocityListener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** @internal Fed by useSmoothScroll — do not call from components. */
export function publishScrollVelocity(v: number): void {
  velocity = v;
  stamp = now();
  listeners.forEach((cb) => cb(v));
}

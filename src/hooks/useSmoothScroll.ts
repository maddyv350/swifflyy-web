import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getScrollVelocity, publishScrollVelocity } from '../lib/scrollBus';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling wired to GSAP's ticker so Lenis and ScrollTrigger
 * share one clock (reveals stay in sync with the smooth scroll). No-op (native
 * scroll) when `enabled` is false — i.e. for reduced-motion users; ScrollTrigger
 * then runs off native scroll instead.
 *
 * Also feeds the module-level scroll-velocity bus (`src/lib/scrollBus.ts`):
 * signed px/s while Lenis is animating, decaying to an explicit 0 once the
 * scroll settles. When disabled, the bus stays at 0.
 */
export function useSmoothScroll(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      publishScrollVelocity(0);
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Route in-page anchor clicks through lenis.scrollTo. Without this a
      // click during the ~1s inertia window is swallowed: the browser's
      // native fragment jump is overwritten on the next frame by the
      // in-flight animation writing the stale pre-click position back.
      anchors: true,
    });

    // Velocity is derived from scroll deltas + wall-clock time (robust across
    // Lenis versions, which report per-frame deltas rather than px/s), with a
    // light low-pass so consumers get an inky, smooth signal.
    let prevScroll = lenis.scroll;
    let prevTime = performance.now();
    let smoothed = 0;

    const onLenisScroll = () => {
      ScrollTrigger.update();
      const time = performance.now();
      const dt = time - prevTime;
      if (dt > 0) {
        const raw = ((lenis.scroll - prevScroll) / dt) * 1000; // px/s, signed
        smoothed += (raw - smoothed) * 0.35;
        publishScrollVelocity(Math.abs(smoothed) < 1 ? 0 : smoothed);
      }
      prevScroll = lenis.scroll;
      prevTime = time;
    };
    lenis.on('scroll', onLenisScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
      // Once Lenis stops emitting scroll events the bus reading goes stale;
      // publish a final 0 so subscribers hear the scroll settle.
      if (smoothed !== 0 && getScrollVelocity() === 0) {
        smoothed = 0;
        publishScrollVelocity(0);
      }
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const id = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(id);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      publishScrollVelocity(0);
    };
  }, [enabled]);
}

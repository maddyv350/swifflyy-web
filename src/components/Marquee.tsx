import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { marquee } from '../config/site';
import { getScrollVelocity } from '../lib/scrollBus';
import { DoodleHeart, DoodlePin, DoodleStar } from './doodles';
import type { DoodleProps } from './doodles';

/** Doodle separators cycled between phrases — the ribbon's bullet points. */
const SEPARATORS: ReadonlyArray<(p: DoodleProps) => JSX.Element> = [
  DoodleStar,
  DoodleHeart,
  DoodlePin,
];

/** Cruise speed: one track width per 36s (mirrors the CSS fallback keyframe). */
const BASE_PERCENT_PER_SEC = 100 / 36;
/** Scroll-velocity boost on track speed (1x cruise → 3.5x under a hard flick). */
const MAX_SPEED_MULT = 3.5;
/** Signed ink-drag skew, degrees (+ scrolling down, − scrolling up). */
const MAX_SKEW_DEG = 4;

interface MarqueeProps {
  /**
   * NOT prefers-reduced-motion. When false/omitted the band falls back to the
   * plain CSS marquee animation (which the global reduced-motion rules halt),
   * so content is always fully visible.
   */
  animate?: boolean;
}

/**
 * A tilted plum ribbon of one-liners scrolling across the page. With `animate`
 * the track is driven from gsap's ticker and reacts to scroll velocity: it
 * speeds up under fast scrolling (easing back to cruise) and the whole band
 * leans into the direction of travel like dragged ink. Hover eases it to a
 * stop (same affordance as the old CSS pause, but softer), and a small
 * pause/play stamp makes stopping it keyboard- and touch-operable too
 * (WCAG 2.2.2) — the CSS fallback pauses on :hover and :focus-within.
 */
export function Marquee({ animate = false }: MarqueeProps) {
  const root = useRef<HTMLElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  const togglePaused = () => {
    setPaused((p) => {
      pausedRef.current = !p;
      return !p;
    });
  };

  useEffect(() => {
    const section = root.current;
    const bandEl = band.current;
    if (!animate || !section || !bandEl) return;

    const tracks = gsap.utils.toArray<HTMLElement>('.marquee-track', bandEl);
    if (tracks.length === 0) return;

    // All state lives in locals — the ticker only writes transforms.
    let offset = 0; // % of one track width, wraps at 100
    let mult = 1; // current speed multiplier (eased)
    let skew = 0; // current skew, deg (eased)
    let hovered = false;
    let inView = true;
    let setX: Array<(value: number) => void> = [];

    const setSkew = gsap.quickSetter(bandEl, 'skewX', 'deg') as (value: number) => void;

    const ctx = gsap.context(() => {
      // Take over from the CSS keyframe animation without a visible jump:
      // carry its current shift into the JS offset, then switch it off.
      const width = tracks[0].offsetWidth;
      const shifted = Number(gsap.getProperty(tracks[0], 'x'));
      if (width > 0 && Number.isFinite(shifted)) {
        offset = gsap.utils.wrap(0, 100, (-shifted / width) * 100);
      }
      // (x: 0 discards the parsed px translation so it isn't double-counted.)
      gsap.set(tracks, { animation: 'none', x: 0, xPercent: -offset });
      setX = tracks.map(
        (t) => gsap.quickSetter(t, 'xPercent') as (value: number) => void,
      );
    }, bandEl);

    const tick = (_time: number, deltaTime: number) => {
      if (!inView) return;
      const dt = deltaTime / 1000;
      const v = getScrollVelocity();

      // Speed: cruise 1x, boosted by |velocity|, eased both ways (also how
      // hover / the pause toggle "pause" — the target simply becomes 0 and
      // the band coasts to a stop).
      const targetMult =
        hovered || pausedRef.current ? 0 : Math.min(MAX_SPEED_MULT, 1 + Math.abs(v) / 900);
      mult += (targetMult - mult) * (1 - Math.exp(-6 * dt));

      // Skew: signed lean with scroll direction, springing back to upright.
      const targetSkew = gsap.utils.clamp(-MAX_SKEW_DEG, MAX_SKEW_DEG, v / 280);
      skew += (targetSkew - skew) * (1 - Math.exp(-10 * dt));

      offset = (offset + BASE_PERCENT_PER_SEC * mult * dt) % 100;
      const x = -offset;
      for (const set of setX) set(x);
      setSkew(Math.abs(skew) < 0.02 ? 0 : skew);
    };
    gsap.ticker.add(tick);

    // Ease-to-stop on hover (pointer devices only).
    const canHover = window.matchMedia('(hover: hover)').matches;
    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };
    if (canHover) {
      bandEl.addEventListener('pointerenter', onEnter, { passive: true });
      bandEl.addEventListener('pointerleave', onLeave, { passive: true });
    }

    // Don't burn frames while the ribbon is offscreen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inView = e.isIntersecting;
      },
      { rootMargin: '160px 0px' },
    );
    io.observe(section);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      if (canHover) {
        bandEl.removeEventListener('pointerenter', onEnter);
        bandEl.removeEventListener('pointerleave', onLeave);
      }
      ctx.revert();
      // The skew quickSetter writes outside the context — drop its inline
      // transform so a mid-scroll disable can't freeze the band leaning.
      gsap.set(bandEl, { clearProps: 'transform' });
    };
  }, [animate]);

  const Track = ({ hidden }: { hidden?: boolean }) => (
    <div className="marquee-track" aria-hidden={hidden}>
      {marquee.map((m, i) => {
        const Doodle = SEPARATORS[i % SEPARATORS.length];
        return (
          <span
            key={m}
            className="flex items-center gap-6 pr-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-cream-50"
          >
            {m}
            <Doodle
              size={17}
              className={`shrink-0 text-coral-400 ${i % 2 === 0 ? '-rotate-6' : 'rotate-12'}`}
            />
          </span>
        );
      })}
    </div>
  );

  return (
    <section
      ref={root}
      aria-label="Swifflyy in seven lines"
      className="relative z-10 -my-2 overflow-hidden py-8"
    >
      {/* Static rotation on the wrapper; gsap owns the band's skew transform. */}
      <div className="-mx-4 -rotate-[1.2deg]">
        <div ref={band} className="marquee relative bg-plum-950 py-4">
          <Track />
          <Track hidden />
          <Track hidden />
          {/* Pause/play stamp: hover isn't operable by keyboard or touch, so
              the band carries its own control. Always rendered — with JS it
              eases the ticker to a stop; without it, focusing it pauses the
              CSS fallback via .marquee:focus-within. */}
          <button
            type="button"
            data-cursor="tap"
            onClick={togglePaused}
            aria-pressed={paused}
            aria-label={paused ? 'Resume the ticker' : 'Pause the ticker'}
            className="absolute right-10 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-cream-50/40 bg-plum-950/90 text-cream-50 transition-colors duration-200 ease-out hover:border-cream-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400"
          >
            {paused ? (
              /* hand-drawn play — a wobbly triangle */
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="ml-0.5"
              >
                <path d="M8.2 4.8 C 8 9.6, 8 14.4, 8.3 19.2 C 12.1 16.9, 15.8 14.5, 19.3 12.1 C 15.7 9.6, 12 7.2, 8.2 4.8 Z" />
              </svg>
            ) : (
              /* hand-drawn pause — two wobbly strokes */
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M8.3 4.6 C 7.9 9.5, 7.9 14.5, 8.2 19.4" />
                <path d="M15.8 4.5 C 15.5 9.6, 15.6 14.4, 15.9 19.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

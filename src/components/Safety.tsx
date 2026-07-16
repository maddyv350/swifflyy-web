import type { ReactNode } from 'react';
import { safety } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { useDrawOn } from '../hooks/useDrawOn';

interface SketchIconProps {
  size?: number;
  className?: string;
}

/**
 * Shared wobbly-stroke shell for this section's hand-drawn icons — same
 * language as the foundation doodle set (currentColor, strokeWidth 2.75,
 * round caps, deliberately imperfect paths). Every stroke carries `data-draw`
 * so the pen draws them on inside the grid's `useDrawOn` container; without
 * it they render complete (reduced-motion / prerender safe).
 */
function SketchSvg({ size = 28, className, children }: SketchIconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** "Real faces only" — a wonky smiling selfie face with a flicked check beside it. */
const SketchFaceSmile = (p: SketchIconProps) => (
  <SketchSvg {...p}>
    <path
      data-draw
      d="M20.7 6.6 C 29.5 6, 36.9 12.9, 37.2 21.5 C 37.5 30.2, 30.4 37.6, 21.5 37.9 C 12.7 38.2, 5.5 31.1, 5.3 22.3 C 5.1 13.8, 12.2 6.9, 20 6.7"
    />
    <path data-draw d="M15.2 17.2 C 15.4 18.3, 15.3 19.3, 15.1 20.3" />
    <path data-draw d="M26.5 17 C 26.7 18.2, 26.6 19.2, 26.4 20.1" />
    <path data-draw d="M13.6 25.3 C 16.1 29.2, 21.3 31, 25.3 29.3 C 26.9 28.5, 28.2 27.3, 28.9 25.8" />
    <path data-draw d="M32 34.8 C 33.8 36.4, 35.4 38.2, 36.9 40.2 C 39.7 35.5, 42.7 31.2, 46 27.4" />
  </SketchSvg>
);

/** "Your pin, your rules" — a wobbly pin whose shoulder gives way to a little clock. */
const SketchPinClock = (p: SketchIconProps) => (
  <SketchSvg {...p}>
    <path
      data-draw
      d="M17.8 41.3 C 17.2 40.6, 6.5 30.2, 6.1 21.5 C 5.8 14.8, 11.3 9.4, 17.8 9.6 C 22.3 9.7, 26.1 12.2, 28.1 15.9"
    />
    <circle data-draw cx="17.6" cy="20.9" r="3.7" />
    <path
      data-draw
      d="M34 19 C 39.4 19.4, 43.5 24, 43.1 29.4 C 42.7 34.7, 38.1 38.8, 32.8 38.3 C 27.5 37.8, 23.5 33.2, 24 27.9 C 24.5 22.9, 28.8 19, 33.4 19"
    />
    <path data-draw d="M33.6 23.9 C 33.6 25.6, 33.5 27.2, 33.4 28.8 C 34.9 29.8, 36.3 30.9, 37.6 32" />
  </SketchSvg>
);

/** "Fake GPS gets bounced" — a GPS reticle scratched out with a hand X. */
const SketchGpsCross = (p: SketchIconProps) => (
  <SketchSvg {...p}>
    <path
      data-draw
      d="M23.6 9.2 C 31.8 8.7, 38.8 15.2, 39.1 23.3 C 39.4 31.5, 32.7 38.5, 24.4 38.8 C 16.1 39.1, 9.2 32.4, 9 24.2 C 8.8 16.2, 15.7 9.5, 23.2 9.3"
    />
    <path data-draw d="M24 3.3 C 24.1 4.8, 24.1 6.2, 24 7.6" />
    <path data-draw d="M24.1 40.5 C 24.1 41.9, 24 43.3, 23.9 44.7" />
    <path data-draw d="M3.3 23.8 C 4.8 23.8, 6.2 23.9, 7.6 24" />
    <path data-draw d="M40.5 24 C 41.9 24, 43.3 24.1, 44.7 24.2" />
    <path data-draw d="M17.3 17.6 C 21.8 22, 26.3 26.6, 30.6 31.2" />
    <path data-draw d="M30.8 17.4 C 26.3 21.9, 21.8 26.5, 17.5 31.1" />
  </SketchSvg>
);

/** "One tap to end it" — a finger mid-tap between two tap arcs. */
const SketchHandTap = (p: SketchIconProps) => (
  <SketchSvg {...p}>
    <path
      data-draw
      d="M19.3 27.6 C 18.8 21.4, 18.6 15.1, 19.1 8.9 C 19.3 6.5, 22.7 6.4, 23.1 8.8 C 24 14.3, 24.2 19.9, 24.1 25.4"
    />
    <path
      data-draw
      d="M24.1 25.4 C 27.7 24.3, 31.4 24.8, 33.7 27.6 C 36.5 31.1, 36.2 36.2, 33.5 41.3 C 28.5 42.5, 23.3 42.6, 18.4 41.5 C 14.8 38.6, 13.3 34.2, 14 29.5 C 15.6 28.3, 17.4 27.8, 19.3 27.6"
    />
    <path data-draw d="M11.8 10.9 C 10.1 13, 9.3 15.5, 9.5 18.1" />
    <path data-draw d="M30.4 10.5 C 32.2 12.5, 33.1 15, 33 17.7" />
  </SketchSvg>
);

const ICONS = {
  verified: SketchFaceSmile,
  pin: SketchPinClock,
  spoof: SketchGpsCross,
  control: SketchHandTap,
} as const;

/**
 * Safety & trust — a framed deep-plum panel. This section matters
 * disproportionately (especially for women in the Indian market), so it gets
 * its own grounded, serious moment. Each point's hand-drawn icon is inked on
 * stroke by stroke as the grid scrolls in — the pen moving card to card.
 */
export function Safety({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate, stagger: 0.1 });
  // One container-level draw: ~20 strokes across the 4 icons, staggered so the
  // pen appears to travel across the grid. animate=false leaves them complete.
  const gridRef = useDrawOn<HTMLDivElement>({
    enabled: animate,
    start: 'top 75%',
    duration: 0.8,
    stagger: 0.07,
  });

  return (
    <section id="safety" className="section-pad relative z-10">
      <div className="wrap">
        <div className="grain relative overflow-hidden rounded-[36px] bg-plum-950 px-6 py-16 sm:px-12 md:py-20 lg:px-16">
          {/* warm glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[30%] left-1/2 h-[480px] w-[720px] -translate-x-1/2 opacity-45 blur-[100px]"
            style={{
              background: 'radial-gradient(closest-side, rgb(var(--coral-500) / 0.55), transparent 70%)',
            }}
          />

          <div ref={ref} className="relative">
            <div data-reveal className="mx-auto max-w-[640px] text-center">
              <span className="eyebrow-on-dark">{safety.eyebrow}</span>
              <h2 className="title-on-dark">{safety.title}</h2>
              <p className="lede mx-auto text-center !text-plum-200">{safety.sub}</p>
            </div>

            <div ref={gridRef} className="mt-12 grid gap-5 sm:grid-cols-2">
              {safety.points.map((p) => {
                const Icon = ICONS[p.k];
                return (
                  <article
                    key={p.k}
                    data-reveal
                    className="group rounded-3xl border border-cream-50/10 bg-cream-50/[0.04] p-7 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-coral-400/40 hover:shadow-[4px_5px_0_rgb(var(--coral-500)/0.45)] sm:p-8"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cream-50/10 bg-cream-50/[0.06] text-coral-300 transition-[color,transform] duration-300 ease-spring group-hover:-rotate-6 group-hover:text-coral-200">
                      <Icon size={28} />
                    </span>
                    <h3 className="font-display mt-5 text-[22px] font-semibold tracking-[-0.01em] text-cream-50">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-[15.5px] leading-[1.65] text-plum-200">{p.body}</p>
                  </article>
                );
              })}
            </div>

            <p
              data-reveal
              className="mt-10 rotate-[-1deg] text-center font-hand text-[22px] text-coral-300"
            >
              built for the person who reads this section first ✦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useId, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cities } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { useDrawOn } from '../hooks/useDrawOn';
import { burstConfetti } from '../lib/confetti';
import { PinIcon, PinSolid, ArrowRightIcon } from './icons';
import { DoodlePin, DoodleSparkle, DoodleStar } from './doodles';

gsap.registerPlugin(ScrollTrigger);

/* ── The map corner of the napkin ──────────────────────────────
   An abstract hand-drawn constellation (deliberately NOT geography —
   "not to scale, obviously"). India is the big coral pin at the centre;
   wobbly dashed routes draw themselves outward to the six launch cities,
   which sit loosely where they'd fall on a map: north up, south down. */

const VB = { w: 760, h: 400 } as const;
const HUB = { x: 368, y: 192 } as const;

interface Spot {
  /** Pin position in viewBox coordinates. */
  x: number;
  y: number;
  /** Wobbly dashed route from the hub out to this pin. */
  route: string;
}

/** One spot per entry in `cities.launch`, laid out like a constellation. */
const SPOTS: readonly Spot[] = [
  { x: 118, y: 64, route: 'M 358 181 C 318 166, 296 144, 258 132 C 220 120, 170 96, 126 71' },
  /* stops short of the pin so the dashes don't run through the label below it */
  { x: 336, y: 40, route: 'M 368 174 C 366 150, 358 126, 348 106 C 345 100, 342 96, 340 92' },
  { x: 612, y: 92, route: 'M 384 181 C 428 160, 468 146, 518 126 C 550 114, 584 100, 608 94' },
  { x: 86, y: 300, route: 'M 354 201 C 310 222, 274 232, 232 254 C 196 272, 142 286, 94 297' },
  { x: 272, y: 352, route: 'M 360 210 C 350 248, 336 280, 312 314 C 304 326, 290 338, 278 348' },
  { x: 656, y: 320, route: 'M 382 203 C 436 226, 480 244, 532 272 C 570 292, 614 308, 650 317' },
];

/** Short wobbly connectors for the mobile column, alternated for variety. */
const CONNECTORS = [
  'M7 2 C 5.6 8, 8.4 13, 6.6 19 C 5.8 24, 7.6 28, 7 32',
  'M7 2 C 8.6 7, 5.4 14, 7.4 20 C 8.2 25, 6.2 29, 7 32',
] as const;

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(2)}%`;

/**
 * Waitlist momentum, kept honest: no invented counters — just where we're
 * landing first and where the list can take us next, sketched as the map
 * corner of the napkin.
 */
export function Cities({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate });
  const constellationRef = useDrawOn<HTMLDivElement>({
    enabled: animate,
    start: 'top 72%',
    duration: 0.7,
    stagger: 0.08,
  });
  const maskBase = `cities-route-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  /* The hub pin thumps in just as the routes start fanning out. */
  useLayoutEffect(() => {
    const el = constellationRef.current;
    if (!el || !animate) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-hub-pin]', {
        scale: 0,
        rotation: -12,
        transformOrigin: '50% 82%',
        duration: 0.7,
        ease: 'back.out(2.4)',
        scrollTrigger: { trigger: el, start: 'top 72%' },
      });
    }, el);
    return () => ctx.revert();
  }, [animate, constellationRef]);

  const onHubClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    burstConfetti(e.currentTarget);
  };

  return (
    <section id="cities" className="section-pad relative z-10 overflow-hidden">
      <div ref={ref} className="wrap text-center">
        <span data-reveal className="eyebrow">
          {cities.eyebrow}
        </span>
        <h2 data-reveal className="title mx-auto max-w-[700px]">
          {cities.title} <em className="italic text-coral-600">{cities.titleEm}</em>
        </h2>
        <p data-reveal className="lede mx-auto text-center">
          {cities.sub}
        </p>

        {/* ── Desktop: the hand-drawn constellation ─────────────── */}
        <div data-reveal className="relative mx-auto mt-10 hidden w-full max-w-[820px] md:block">
          <div ref={constellationRef} className="relative">
            {/* dashed routes, revealed through mask twins so the dashes survive the draw */}
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              className="block h-auto w-full"
              fill="none"
              aria-hidden
            >
              <defs>
                {SPOTS.map((s, i) => (
                  <mask
                    key={i}
                    id={`${maskBase}-${i}`}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width={VB.w}
                    height={VB.h}
                  >
                    <path
                      data-draw
                      d={s.route}
                      stroke="#fff"
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </mask>
                ))}
              </defs>
              {SPOTS.map((s, i) => (
                <path
                  key={i}
                  d={s.route}
                  stroke="rgb(var(--ink) / 0.38)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="7 9"
                  fill="none"
                  mask={`url(#${maskBase}-${i})`}
                />
              ))}
            </svg>

            {/* India — the big coral pin the routes fan out from. Tap it: confetti. */}
            <button
              type="button"
              onClick={onHubClick}
              data-cursor="tap"
              aria-label={`${cities.hub} — where Swifflyy is launching`}
              className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: pct(HUB.x, VB.w), top: pct(HUB.y, VB.h) }}
            >
              <span data-hub-pin className="relative flex h-11 w-11 items-center justify-center will-change-transform">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-full top-1/2 ml-2 w-max -translate-y-1/2 -rotate-3 font-hand text-[21px] leading-none text-coral-600"
                >
                  launching ✦
                </span>
                <span
                  aria-hidden
                  className="absolute inset-1 rounded-full bg-coral-500/30 motion-safe:animate-radar-ping"
                />
                <PinSolid
                  size={32}
                  className="relative text-coral-500 transition-transform duration-200 ease-spring group-hover:scale-110"
                />
              </span>
              <span className="mt-1.5 text-[14.5px] font-bold text-ink">{cities.hub}</span>
            </button>

            {/* the launch cities — small ink pins with sticker tooltips */}
            {cities.launch.map((name, i) => {
              const spot = SPOTS[i % SPOTS.length];
              return (
                <a
                  key={name}
                  href="#waitlist"
                  data-cursor="tap"
                  aria-label={`${name} — join the waitlist`}
                  className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center no-underline"
                  style={{ left: pct(spot.x, VB.w), top: pct(spot.y, VB.h) }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 w-max -translate-x-1/2 translate-y-1.5 -rotate-2 rounded-lg border-[1.5px] border-ink bg-cream-25 px-2.5 py-1 font-hand text-[16.5px] leading-none text-ink opacity-0 shadow-stamp-sm transition-[opacity,transform] duration-200 ease-spring group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  >
                    join the list
                    <ArrowRightIcon size={11} className="ml-1 inline-block align-[-1px] text-coral-600" />
                  </span>
                  <DoodlePin
                    size={27}
                    className="text-ink transition-transform duration-200 ease-spring group-hover:-translate-y-1 group-hover:-rotate-6"
                  />
                  <span className="mt-0.5 text-[13.5px] font-semibold text-ink-2 transition-colors duration-200 group-hover:text-coral-700">
                    {name}
                  </span>
                </a>
              );
            })}

            {/* margin scribbles — they draw in after the routes */}
            <span aria-hidden className="pointer-events-none absolute left-[30%] top-[8%]">
              <DoodleSparkle size={18} className="text-coral-400" />
            </span>
            <span aria-hidden className="pointer-events-none absolute left-[58%] top-[78%] rotate-12">
              <DoodleStar size={16} className="text-ink/30" />
            </span>
            <span aria-hidden className="pointer-events-none absolute left-[10%] top-[44%] -rotate-6">
              <DoodleSparkle size={13} className="text-ink/25" />
            </span>
            <span aria-hidden className="pointer-events-none absolute left-[76%] top-[48%] rotate-3">
              <DoodleSparkle size={15} className="text-coral-300" />
            </span>

            {/* a crooked little compass, because every napkin map has one */}
            <span aria-hidden className="pointer-events-none absolute right-[1%] top-[3%] rotate-6">
              <svg
                width="44"
                height="52"
                viewBox="0 0 44 52"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ink/45"
              >
                <path data-draw d="M22 13.5 C 30.9 13.2, 37.6 19.8, 37.4 28.3 C 37.2 36.9, 30.2 43.6, 21.6 43.3 C 13.3 43, 6.8 36.2, 7.1 27.7 C 7.4 19.6, 14 13.8, 21.7 13.6" />
                <path data-draw d="M22.2 36.5 C 21.8 31.4, 22 26.2, 22.4 20.9" />
                <path data-draw d="M17.4 24.6 C 19 23.3, 20.7 22, 22.4 20.9 C 23.6 22.4, 24.7 24, 25.6 25.7" />
              </svg>
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 font-hand text-[15px] leading-none text-ink/50">
                N
              </span>
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-[2%] -rotate-2 font-hand text-[17px] text-ink-3"
            >
              not to scale, obviously ✦
            </span>
          </div>
        </div>

        {/* ── Mobile: the same story, told as a column ───────────── */}
        <div data-reveal className="mt-12 flex flex-col items-center md:hidden">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -top-8 left-1/2 w-max -translate-x-1/2 -rotate-3 font-hand text-[19px] text-coral-600"
            >
              launching ✦
            </span>
            <button
              type="button"
              onClick={onHubClick}
              data-cursor="tap"
              className="relative flex items-center gap-2 rounded-full bg-coral-600 py-3 pl-5 pr-6 text-[16px] font-bold text-cream-25 shadow-lift"
            >
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute h-4 w-4 rounded-full bg-cream-25/40 motion-safe:animate-radar-ping"
                />
                <PinIcon size={15} />
              </span>
              {cities.hub}
            </button>
          </div>

          {cities.launch.map((name, i) => (
            <div key={name} className="flex flex-col items-center">
              <svg
                aria-hidden
                width="14"
                height="34"
                viewBox="0 0 14 34"
                fill="none"
                className="text-ink/30"
              >
                <path
                  d={CONNECTORS[i % CONNECTORS.length]}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="3 6"
                />
              </svg>
              <a
                href="#waitlist"
                aria-label={`${name} — join the waitlist`}
                className="group flex items-center gap-2 rounded-full border-[1.5px] border-dashed border-ink/25 py-2.5 pl-5 pr-4 text-[15px] font-semibold text-ink-2 no-underline transition-colors duration-200 hover:border-coral-500 hover:text-coral-700"
              >
                {name}
                <ArrowRightIcon
                  size={13}
                  className="text-coral-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                />
              </a>
            </div>
          ))}

          <p aria-hidden className="mt-4 -rotate-2 font-hand text-[17px] text-ink-3">
            tap a city to join its list
          </p>
        </div>

        <div data-reveal className="mt-11">
          <a href="#waitlist" data-cursor="tap" className="btn-ink group">
            {cities.cta}
            <ArrowRightIcon size={15} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

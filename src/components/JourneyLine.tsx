import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { DoodleProps } from './doodles';
import { DoodleCoffee, DoodleHeart, DoodlePin, DoodleSparkle, DoodleStar } from './doodles';

gsap.registerPlugin(ScrollTrigger);

/** Section ids the line visits, in page order (missing ones are skipped). */
const ANCHOR_IDS = ['how', 'try', 'why', 'safety', 'faq', 'waitlist'] as const;

/** Doodle stamped beside each visited anchor, by anchor index. */
const WAYPOINT_DOODLES: ReadonlyArray<(p: DoodleProps) => JSX.Element> = [
  DoodlePin,
  DoodleHeart,
  DoodleStar,
  DoodleCoffee,
  DoodleSparkle,
  DoodleHeart,
];

interface Point {
  x: number;
  y: number;
}

interface Waypoint extends Point {
  side: -1 | 1;
  kind: number;
}

interface Geometry {
  width: number;
  height: number;
  /** Container's top edge in document coordinates. */
  top: number;
  d: string;
  waypoints: Waypoint[];
}

/** Deterministic pseudo-random in [-1, 1) — geometry rebuilds stay idempotent. */
const wobble = (i: number) => {
  const x = Math.sin(i * 91.7 + 47.3) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

/**
 * Catmull-Rom → cubic bezier: one smooth meandering stroke through the points.
 * Control-point x is clamped (the curve is contained by its hull, so this
 * keeps the stroke on the page even when consecutive points hug one gutter
 * and the next sits in the opposite one).
 */
const toPathD = (pts: Point[], clampX: (x: number) => number = (x) => x): string => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = clampX(p1.x + (p2.x - p0.x) / 6);
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = clampX(p2.x - (p3.x - p1.x) / 6);
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
};

const sameGeometry = (a: Geometry | null, b: Geometry | null) =>
  a === b || (!!a && !!b && a.d === b.d && a.width === b.width && a.height === b.height && a.top === b.top);

/**
 * "The pen is still drawing the page": one long wobbly dashed coral stroke
 * that meanders down the page margins (hugging the gutters, crossing sides
 * only near each waypoint), drawing itself on as you scroll (the pen tip
 * roughly tracks the viewport) and stamping little doodles beside each
 * section it passes.
 *
 * Placement contract (integration): render as the FIRST child of
 * `<main id="main" className="relative">`. The overlay is `absolute inset-0
 * z-0`, `aria-hidden`, `pointer-events-none`, desktop `lg:` only — sections
 * must sit on `relative z-10` so content always paints above the line.
 * Sections with opaque backgrounds naturally occlude it (by design: the line
 * lives "between" sections). Renders nothing when `animate` is false.
 *
 * Geometry rebuilds idempotently on ScrollTrigger refresh, debounced resize
 * and the lg media-query flipping — layout shifts (e.g. a pinned section's
 * +250vh spacer) are re-measured via the `.pin-spacer` wrapper so document
 * coordinates stay honest. All x coords are clamped inside the container, so
 * it can never cause horizontal overflow.
 */
export function JourneyLine({ animate }: { animate: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const maskId = `journey-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  /* ── measure & (re)build geometry ─────────────────────────── */
  useEffect(() => {
    if (!animate) return;

    const measure = (): Geometry | null => {
      const host = rootRef.current;
      const main = host?.parentElement;
      if (!host || !main) return null;
      if (!window.matchMedia('(min-width: 1024px)').matches) return null;

      const rect = main.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width < 200 || height < 400) return null;

      const vh = window.innerHeight;
      const inset = Math.min(Math.max(width * 0.05, 26), 90);
      const clampX = (x: number) => Math.min(Math.max(x, 24), width - 24);

      const waypoints: Waypoint[] = [];
      ANCHOR_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        // A pinned section is measured via its pin-spacer (stays in flow).
        const box = (el.closest('.pin-spacer') as HTMLElement | null) ?? el;
        const r = box.getBoundingClientRect();
        const yTop = r.top + window.scrollY - top;
        const side: -1 | 1 = waypoints.length % 2 === 0 ? -1 : 1;
        const x =
          side === -1
            ? inset + 12 + wobble(i * 3 + 1) * 10
            : width - inset - 12 + wobble(i * 3 + 2) * 10;
        const y = yTop + Math.min(r.height * 0.32, vh * 0.55) + wobble(i * 3 + 3) * 36;
        waypoints.push({ x: clampX(x), y: Math.max(y, 60), side, kind: i });
      });
      if (waypoints.length < 3) return null;

      // Path: start under the hero → each gutter waypoint. Between waypoints
      // the pen keeps meandering down the CURRENT gutter (never through the
      // text columns mid-page); the swing across to the opposite gutter
      // happens late in the span, close to the next waypoint.
      const pts: Point[] = [];
      pts.push({
        x: clampX(width * 0.5 + wobble(97) * width * 0.08),
        y: Math.max(waypoints[0].y - vh * 0.55, 32),
      });
      waypoints.forEach((wp, i) => {
        pts.push({ x: wp.x, y: wp.y });
        const next = waypoints[i + 1];
        if (next && next.y - wp.y > 380) {
          const gutterX = wp.side === -1 ? inset + 12 : width - inset - 12;
          pts.push({
            x: clampX(gutterX + wobble(i * 7 + 5) * 16),
            y: (wp.y + next.y) / 2 + wobble(i * 7 + 6) * 60,
          });
        }
      });
      const last = waypoints[waypoints.length - 1];
      pts.push({
        x: clampX(width * 0.5 + wobble(131) * 70),
        y: Math.min(last.y + 220, height - 24),
      });

      return { width, height, top, d: toPathD(pts, clampX), waypoints };
    };

    const rebuild = () => {
      const next = measure();
      setGeometry((prev) => (sameGeometry(prev, next) ? prev : next));
    };

    rebuild();
    ScrollTrigger.addEventListener('refresh', rebuild);

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(rebuild, 250);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const mq = window.matchMedia('(min-width: 1024px)');
    mq.addEventListener('change', rebuild);

    return () => {
      ScrollTrigger.removeEventListener('refresh', rebuild);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
      mq.removeEventListener('change', rebuild);
    };
  }, [animate]);

  /* ── animate: scrubbed draw-on + waypoint doodle pops ─────── */
  useLayoutEffect(() => {
    const host = rootRef.current;
    const maskPath = maskPathRef.current;
    if (!host || !maskPath || !animate || !geometry) return;

    let length = 0;
    try {
      length = maskPath.getTotalLength();
    } catch {
      return;
    }
    if (!Number.isFinite(length) || length <= 0) return;

    const ctx = gsap.context(() => {
      // The visible stroke is dashed; drawing is revealed through a mask twin
      // whose dashoffset is scrubbed — the classic draw-a-dashed-line trick.
      gsap.set(maskPath, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(maskPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      });

      const stamps = host.querySelectorAll<SVGGElement>('[data-journey-doodle]');
      stamps.forEach((el, i) => {
        const wp = geometry.waypoints[i];
        if (!wp) return;
        gsap.fromTo(
          el,
          { scale: 0, rotation: -30 + wobble(i * 13 + 2) * 10, transformOrigin: '50% 50%' },
          {
            scale: 1,
            rotation: wobble(i * 13 + 4) * 10,
            duration: 0.55,
            ease: 'back.out(2.4)',
            scrollTrigger: {
              // Fire as the pen tip (≈ viewport) reaches the waypoint.
              start: () => Math.max(geometry.top + wp.y - window.innerHeight * 0.75, 0),
              end: () => Math.max(geometry.top + wp.y - window.innerHeight * 0.75, 0) + 1,
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }, host);

    return () => ctx.revert();
  }, [animate, geometry]);

  if (!animate) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
    >
      {geometry && (
        <svg
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          className="absolute left-0 top-0"
          fill="none"
        >
          <defs>
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={geometry.width}
              height={geometry.height}
            >
              <path
                ref={maskPathRef}
                d={geometry.d}
                stroke="#fff"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
            </mask>
          </defs>
          <path
            d={geometry.d}
            stroke="rgb(var(--coral-500))"
            strokeOpacity="0.5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="12 10 6 10"
            fill="none"
            mask={`url(#${maskId})`}
          />
          {geometry.waypoints.map((wp, i) => {
            const Stamp = WAYPOINT_DOODLES[wp.kind % WAYPOINT_DOODLES.length];
            const x = Math.min(Math.max(wp.x - 13 - wp.side * 6, 12), geometry.width - 40);
            return (
              <g key={`${wp.kind}-${i}`} transform={`translate(${x.toFixed(1)}, ${(wp.y - 46).toFixed(1)})`}>
                <g data-journey-doodle className="text-coral-500" opacity="0.8">
                  <Stamp size={26} />
                </g>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

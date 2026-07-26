import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { steps } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { Avatar } from './ui';
import { PinSolid, PinIcon, VerifiedIcon, XMarkIcon, HeartIcon } from './icons';
import {
  DoodleHeart,
  DoodleSparkle,
  DoodleCoffee,
  DoodleArrow,
  DoodleSquiggle,
  DoodleAsterisk,
  DoodleCircleScribble,
} from './doodles';

gsap.registerPlugin(ScrollTrigger);

/** One-shot guard: fragment deep links are re-anchored once per page load. */
let reanchored = false;

/**
 * The centerpiece: a scroll-pinned motion-graphics storyboard. On desktop
 * (lg+, motion allowed) the section pins for ~2.5 screens while one scrubbed
 * master timeline tells the app's story in three acts on a "phone over a
 * napkin" stage — the map draws itself and a pin drops (act 1), a hand of
 * profile cards is dealt out of the phone (act 2), two people meet in the
 * middle and a heart draws itself between them (act 3). The steps rail on the
 * left tracks the acts: a progress stroke draws down it and the active step's
 * number gets circled in coral scribble.
 *
 * Everywhere else (mobile, reduced motion, no JS) the same content renders as
 * a clean stack of step cards, each with a static final-frame illustration.
 * All hidden states are set in JS only — nothing is ever stuck invisible.
 */
export function HowItWorks({ animate }: { animate: boolean }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const stackRef = useReveal<HTMLDivElement>({ enabled: animate });

  useLayoutEffect(() => {
    if (!animate) return;
    const board = boardRef.current;
    if (!board) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const $ = <E extends Element = HTMLElement>(sel: string) =>
        Array.from(board.querySelectorAll<E>(sel));

      /* ── collect the cast ──────────────────────────────────────────── */
      const phone = $('[data-phone]');
      const phoneFloat = $('[data-phone-float]');
      const act1 = $('[data-act1]');
      const park = $<SVGPathElement>('[data-park]');
      const chaiLabel = $('[data-chai-label]');
      const pin = $('[data-pin]');
      const ripple = $('[data-ripple]');
      const radius = $('[data-radius]');
      const neighbors = $('[data-neighbor]');
      const pinChip = $('[data-pin-chip]');
      const note1 = $('[data-note1]');
      const note2 = $('[data-note2]');
      const cards = $('[data-deck-card]');
      const avL = $('[data-m-av-l]');
      const avR = $('[data-m-av-r]');
      const heart = $('[data-m-heart]');
      const bubA = $('[data-m-bub-a]');
      const bubB = $('[data-m-bub-b]');
      const sparks = $('[data-m-spark]');
      const chip3 = $('[data-m-chip]');
      const stepBlocks = $('[data-step-block]');
      const stepDots = $('[data-step-dot]');
      const scribbleWraps = $('[data-step-scribble]');
      const scribblePaths = scribbleWraps.map((w) => w.querySelector<SVGPathElement>('path'));

      /* ── prime every hand-drawn stroke (hidden in JS only) ─────────── */
      const streets = primeDashed($<SVGPathElement>('[data-street]'));
      const mapDoodles = primeSolid($<SVGGeometryElement>('[data-map-doodle], [data-chai] path'));
      const heartStroke = primeSolid($<SVGGeometryElement>('[data-m-heart] path'));
      const railStroke = primeSolid($<SVGGeometryElement>('[data-rail-draw]'));
      scribblePaths.forEach((p) => {
        if (p) primeSolid([p]);
      });

      /* ── initial states (JS only — reverted by mm on teardown) ─────── */
      gsap.set(phone, { rotation: -1.5 });
      gsap.set(park, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' });
      gsap.set(chaiLabel, { opacity: 0 });
      gsap.set(pin, { y: -150, opacity: 0, transformOrigin: '50% 100%' });
      gsap.set(ripple, { scale: 0.2, opacity: 0, transformOrigin: '50% 50%' });
      gsap.set(radius, { scale: 0.25, opacity: 0, transformOrigin: '50% 50%' });
      gsap.set(neighbors, { scale: 0, opacity: 0 });
      gsap.set([...note1, ...pinChip, ...note2, ...chip3], { opacity: 0, y: 12 });
      gsap.set(cards, { x: 0, y: 150, rotation: 0, scale: 0.55, opacity: 0 });
      gsap.set(avL, { x: -110, opacity: 0 });
      gsap.set(avR, { x: 110, opacity: 0 });
      gsap.set([...bubA, ...bubB], { opacity: 0, y: 14, scale: 0.9 });
      gsap.set(sparks, { scale: 0, opacity: 0, rotation: -30, transformOrigin: '50% 50%' });
      gsap.set(heart, { transformOrigin: '50% 50%' });
      stepBlocks.forEach((block, i) => {
        if (i > 0) gsap.set(block, { opacity: 0.45 });
      });
      gsap.set(stepDots, { scale: 0, transformOrigin: '50% 50%' });

      /* ── the master timeline, scrubbed to the pin ──────────────────── */
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          id: 'how-pin',
          trigger: board,
          start: 'top top',
          end: '+=250%',
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      /* Act 1 — DROP: the map sketches itself, the pin lands. */
      if (streets.length)
        tl.to(streets, { strokeDashoffset: 0, duration: 1.05, stagger: 0.14, ease: 'power1.inOut' }, 0.05);
      tl.to(park, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, 0.5);
      if (mapDoodles.length)
        tl.to(mapDoodles, { strokeDashoffset: 0, duration: 0.55, stagger: 0.1, ease: 'power1.inOut' }, 0.6);
      tl.to(chaiLabel, { opacity: 1, duration: 0.3 }, 0.95);
      // drop → squash → springy settle
      tl.to(pin, { y: 0, opacity: 1, duration: 0.32, ease: 'power2.in' }, 1.15);
      tl.to(pin, { scaleX: 1.3, scaleY: 0.7, duration: 0.09, ease: 'power1.out' }, 1.47);
      tl.to(pin, { scaleX: 1, scaleY: 1, duration: 0.55, ease: 'elastic.out(1.5, 0.45)' }, 1.56);
      tl.to(ripple, { opacity: 0.55, duration: 0.06, ease: 'none' }, 1.5);
      tl.to(ripple, { scale: 2.1, duration: 0.6, ease: 'power1.out' }, 1.5);
      tl.to(ripple, { opacity: 0, duration: 0.45, ease: 'none' }, 1.65);
      tl.to(radius, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, 1.62);
      tl.to(note1, { opacity: 1, y: 0, duration: 0.4 }, 1.95);
      tl.to(pinChip, { opacity: 1, y: 0, duration: 0.4 }, 2.05);
      if (neighbors.length)
        tl.to(neighbors, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.16, ease: 'back.out(2.2)' }, 2.2);

      /* Crossfade into Act 2 — the map recedes, the deck is dealt. */
      tl.to(note1, { opacity: 0, y: -8, duration: 0.35, ease: 'power2.in' }, 3.9);
      tl.to(act1, { opacity: 0.16, scale: 0.985, duration: 0.7, ease: 'power2.inOut' }, 3.95);

      /* Act 2 — DISCOVER: a hand of cards fans out of the phone. */
      cards.forEach((card, i) => {
        const f = FAN[i];
        if (!f) return;
        tl.to(
          card,
          { x: f.x, y: f.y, rotation: f.r, scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.3)' },
          4.3 + i * 0.18,
        );
      });
      const midCard = cards[1];
      if (midCard) tl.to(midCard, { y: FAN[1].y - 26, rotation: FAN[1].r - 2.5, scale: 1.06, duration: 0.5 }, 5.7);
      tl.to(note2, { opacity: 1, y: 0, duration: 0.4 }, 5.4);

      /* Crossfade into Act 3 — the deck folds away. */
      tl.to(note2, { opacity: 0, y: -8, duration: 0.35, ease: 'power2.in' }, 7.5);
      if (cards.length)
        tl.to(cards, { y: '+=70', opacity: 0, scale: 0.72, duration: 0.5, stagger: 0.07, ease: 'power2.in' }, 7.55);

      /* Act 3 — MATCH: two people, one heart, a plan. */
      tl.to(avL, { x: 0, opacity: 1, duration: 0.6 }, 8.25);
      tl.to(avR, { x: 0, opacity: 1, duration: 0.6 }, 8.32);
      if (heartStroke.length)
        tl.to(heartStroke, { strokeDashoffset: 0, duration: 0.65, ease: 'power1.inOut' }, 8.7);
      tl.to(heart, { scale: 1.14, duration: 0.16, ease: 'power1.out' }, 9.35);
      tl.to(heart, { scale: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.5)' }, 9.51);
      tl.to(bubA, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }, 9.15);
      tl.to(bubB, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }, 9.55);
      if (sparks.length) {
        tl.to(sparks, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, stagger: 0.08, ease: 'back.out(2)' }, 9.4);
        tl.to(sparks, { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' }, 9.95);
      }
      tl.to(chip3, { opacity: 1, y: 0, duration: 0.4 }, 10.05);
      tl.to({}, { duration: 0.9 }, 10.45); // settle: hold the final frame before the pin releases

      /* Steps rail — activation, scribbled circles, dimming. */
      stepBlocks.forEach((block, i) => {
        const at = ACT_AT[i] ?? 0;
        if (i > 0) {
          tl.to(block, { opacity: 1, duration: 0.4, ease: 'none' }, at);
          const prev = stepBlocks[i - 1];
          if (prev) tl.to(prev, { opacity: 0.45, duration: 0.4, ease: 'none' }, at - 0.3);
          const prevScrib = scribbleWraps[i - 1];
          if (prevScrib) tl.to(prevScrib, { opacity: 0, duration: 0.35, ease: 'none' }, at - 0.35);
        }
        const dot = stepDots[i];
        if (dot) tl.to(dot, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, at);
        const sp = scribblePaths[i];
        if (sp) tl.to(sp, { strokeDashoffset: 0, duration: 0.55, ease: 'power1.inOut' }, at + 0.05);
      });

      /* Full-length passes: rail progress stroke + a slow lean on the phone. */
      const total = tl.duration();
      if (railStroke.length) tl.to(railStroke, { strokeDashoffset: 0, duration: total, ease: 'none' }, 0);
      tl.to(phone, { rotation: 1.2, duration: total, ease: 'none' }, 0);

      /* Idle life (time-based, not scrubbed): the napkin breathes — but only
         while the board is on screen (mirrors Hero's cue/metronome gating so
         the ticker can go idle once the user scrolls past). */
      const bob = gsap.to(phoneFloat, {
        y: 7,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      const bobGate = ScrollTrigger.create({
        trigger: board,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? bob.play() : bob.pause()),
      });
      if (bobGate.isActive) bob.play();

      /* The pin spacer above just grew the page by ~2.5 viewports below the
         hero — if the browser anchored a fragment deep link (#faq…) against
         the prerendered (unpinned) layout, everything under the viewport has
         shifted. Re-anchor once per page load against the pinned layout. */
      if (!reanchored && window.location.hash.length > 1) {
        reanchored = true;
        requestAnimationFrame(() => {
          let id = window.location.hash.slice(1);
          try {
            id = decodeURIComponent(id);
          } catch {
            /* keep the raw fragment */
          }
          const target = document.getElementById(id);
          if (!target) return;
          ScrollTrigger.refresh();
          const top = target.getBoundingClientRect().top;
          if (Math.abs(top) > 2) window.scrollTo(0, top + window.scrollY);
        });
      }
    });

    return () => mm.revert();
  }, [animate]);

  return (
    <section id="how" className="relative z-10 overflow-hidden">
      {/* Desktop storyboard — only rendered when motion is allowed, so its
          JS-hidden states can never strand content for anyone else. */}
      {animate && <Storyboard boardRef={boardRef} />}

      {/* Stacked fallback: mobile always; every viewport when animate=false.
          This is also exactly what the reduced-motion prerender snapshots. */}
      <div ref={stackRef} className={`section-pad ${animate ? 'lg:hidden' : ''}`}>
        <div className="wrap">
          <SectionHeader />
          {/* grid-cols-1 (minmax(0,1fr)) so the fixed-width scene art can't
              inflate the mobile track past the viewport — the art boxes clip
              it instead. md:grid-cols-3 already behaves this way. */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.num}
                data-reveal
                className="flex min-w-0 flex-col rounded-3xl border-[1.5px] border-ink/10 bg-cream-25 p-5 shadow-lift sm:p-6"
              >
                <div
                  aria-hidden
                  className="pointer-events-none relative mb-6 flex h-[200px] items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-ink/10 bg-cream-100"
                >
                  {i === 0 && <CardMapArt />}
                  {i === 1 && <DeckFan fanned className="scale-[0.58]" />}
                  {i === 2 && <MatchMoment className="scale-[0.85]" />}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral-600 text-[15px] font-semibold text-cream-25">
                    {s.num}
                  </span>
                  <h3 className="font-display text-[22px] font-semibold leading-tight text-ink">{s.title}</h3>
                </div>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-ink-2">{s.body}</p>
                <p className="mt-3 -rotate-1 font-hand text-[18px] text-coral-600">{s.note} ✦</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── choreography constants ─────────────────────────────────────────────── */

/** Where each dealt card lands (relative to the phone's center). */
const FAN = [
  { x: -158, y: 12, r: -9 },
  { x: 0, y: -24, r: 1.5 },
  { x: 158, y: 14, r: 8.5 },
] as const;

/** Timeline moment each step of the rail becomes the active one. */
const ACT_AT = [0.15, 4.3, 8.2] as const;

const DECK_PROFILES = [
  { name: 'Sara', age: 24, dist: '200 m', area: 'HSR Layout', tone: 2 },
  { name: 'Arjun', age: 28, dist: '500 m', area: 'Indiranagar', tone: 1 },
  { name: 'Meera', age: 25, dist: '400 m', area: 'Jayanagar', tone: 3 },
] as const;

const NEIGHBORS = [
  { left: '22%', top: '26%', name: 'Sara', tone: 2 },
  { left: '66%', top: '31%', name: 'Arjun', tone: 1 },
  { left: '58%', top: '58%', name: 'Meera', tone: 3 },
] as const;

/** Sparkle burst offsets around the heart (px from the heart's center). */
const SPARKS = [
  { x: -46, y: -26, s: 16 },
  { x: 30, y: -30, s: 20 },
  { x: -56, y: 8, s: 13 },
  { x: 44, y: 2, s: 14 },
] as const;

/* ── stroke helpers (draw-on, hidden in JS only) ────────────────────────── */

function strokeLength(el: SVGGeometryElement): number {
  if (typeof el.getTotalLength !== 'function') return 0;
  try {
    const len = el.getTotalLength();
    return Number.isFinite(len) && len > 0 ? len : 0;
  } catch {
    return 0;
  }
}

/** Prime solid strokes for draw-on; returns only the measurable ones. */
function primeSolid(els: SVGGeometryElement[]): SVGGeometryElement[] {
  return els.filter((el) => {
    const len = strokeLength(el);
    if (!len) return false;
    gsap.set(el, { strokeDasharray: len + 1, strokeDashoffset: len + 1 });
    return true;
  });
}

/**
 * Prime a solid path to render as a *dashed* street that can still draw
 * itself on: the dash pattern covers exactly one path-length, followed by a
 * gap longer than the path, so scrubbing dashoffset → 0 reveals the dashes
 * from the start of the stroke.
 */
function primeDashed(els: SVGGeometryElement[], dash = 10, gap = 8): SVGGeometryElement[] {
  return els.filter((el) => {
    const len = strokeLength(el);
    if (!len) return false;
    const parts: number[] = [];
    let acc = 0;
    while (acc + dash + gap < len) {
      parts.push(dash, gap);
      acc += dash + gap;
    }
    parts.push(Math.max(1, len - acc), len + 2);
    gsap.set(el, { attr: { 'stroke-dasharray': parts.join(' ') }, strokeDashoffset: len + 1 });
    return true;
  });
}

/* ── shared header ──────────────────────────────────────────────────────── */

function SectionHeader({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="max-w-[720px]">
        <span className="eyebrow !mb-2 !text-[19px]">how it works</span>
        <h2 className="font-display text-[clamp(28px,3vw,40px)] font-semibold leading-[1.05] tracking-[-0.015em] text-ink">
          Pin. People. <em className="italic text-coral-600">Plans.</em>
        </h2>
        <p className="mt-2 max-w-[560px] text-[15px] leading-[1.55] text-ink-2 [@media(max-height:800px)]:hidden">
          No personality quizzes, no 40-km “nearby”. Three steps between opening the app and actually
          meeting someone.
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-[640px]">
      <span data-reveal className="eyebrow">
        how it works
      </span>
      <h2 data-reveal className="title">
        Pin. People. <em className="italic text-coral-600">Plans.</em>
      </h2>
      <p data-reveal className="lede">
        No personality quizzes, no 40-km “nearby”. Three steps between opening the app and actually
        meeting someone.
      </p>
    </div>
  );
}

/* ── desktop storyboard ─────────────────────────────────────────────────── */

function Storyboard({ boardRef }: { boardRef: RefObject<HTMLDivElement> }) {
  return (
    // pt clears the fixed nav's condensed pill (~72px incl. its top gap) —
    // the board pins flush to the viewport top for ~250vh, so the headline
    // must stay below the pill the whole time.
    <div ref={boardRef} className="hidden h-[100svh] flex-col justify-center gap-5 pb-6 pt-[100px] lg:flex">
      <div className="wrap shrink-0">
        <SectionHeader compact />
      </div>
      <div className="wrap grid min-h-0 flex-1 grid-cols-[minmax(360px,430px)_1fr] items-center gap-12">
        <StepsRail />
        <Stage />
      </div>
    </div>
  );
}

function StepsRail() {
  return (
    <div className="relative">
      {/* rail track (dotted, static) + the scrubbed coral progress stroke */}
      <svg
        aria-hidden
        className="absolute bottom-16 left-[23px] top-11 w-[5px]"
        viewBox="0 0 6 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M3 2 C 4.6 62, 1.4 128, 3.4 196 C 5 262, 1.8 330, 3 398"
          stroke="rgb(36 21 33 / 0.16)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 7"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-rail-draw
          d="M3 2 C 4.6 62, 1.4 128, 3.4 196 C 5 262, 1.8 330, 3 398"
          stroke="rgb(var(--coral-500))"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {steps.map((s) => (
        <div key={s.num} data-step-block className="relative flex items-start gap-5 py-5">
          <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink/25 bg-cream-50">
            <span data-step-dot aria-hidden className="absolute inset-[3px] rounded-full bg-coral-200" />
            <span className="font-display relative text-[17px] font-semibold text-ink">{s.num}</span>
            <span
              data-step-scribble
              aria-hidden
              className="pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 text-coral-600"
            >
              <DoodleCircleScribble className="absolute inset-0 h-full w-full" />
            </span>
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-[21px] font-semibold leading-tight text-ink">{s.title}</h3>
            <p className="mt-2 max-w-[340px] text-[14.5px] leading-[1.55] text-ink-2">{s.body}</p>
            <p className="mt-2 -rotate-1 font-hand text-[17px] text-coral-600">{s.note} ✦</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** The stage: a phone resting on a napkin; three acts play over it. */
function Stage() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative flex h-[min(600px,72vh)] items-center justify-center [@media(max-height:760px)]:scale-[0.92]"
    >
      {/* the napkin underneath */}
      <div className="absolute left-1/2 top-1/2 h-[min(540px,100%)] w-[min(560px,100%)] -translate-x-1/2 -translate-y-1/2 -rotate-2 rounded-[30px] border-[1.5px] border-dashed border-ink/15 bg-cream-25/80 shadow-lift">
        <DoodleSquiggle size={54} className="absolute left-6 top-5 text-ink/15" />
        <DoodleAsterisk size={22} className="absolute right-8 top-7 rotate-12 text-coral-300/70" />
        {/* coffee-cup ring stain */}
        <span className="absolute bottom-6 right-10 h-14 w-14 rounded-full border-[3px] border-cream-300/70" />
        <span className="absolute bottom-4 left-7 -rotate-3 font-hand text-[17px] text-ink-3">
          sketched over chai ✦
        </span>
      </div>

      {/* the phone (float wrapper ≠ lean wrapper so tweens never collide) */}
      <div data-phone-float className="relative will-change-transform">
        <div
          data-phone
          className="relative h-[464px] w-[230px] rounded-[38px] bg-plum-950 p-[9px] shadow-lift-lg will-change-transform"
        >
          <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-cream-50">
            <StageMapAct />
            {/* punch-hole camera */}
            <span className="absolute left-1/2 top-2 z-30 h-[14px] w-[52px] -translate-x-1/2 rounded-full bg-plum-950" />
          </div>
        </div>
      </div>

      {/* Act 2 overlay — cards escape the phone, so they live at stage level */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <DeckFan />
      </div>

      {/* Act 3 overlay */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <MatchMoment />
      </div>

      {/* Caveat margin notes */}
      <div data-note1 className="absolute right-[1%] top-[13%] flex w-[170px] flex-col items-start gap-1">
        <span className="rotate-2 font-hand text-[19px] leading-[1.15] text-coral-600">
          your pin - lifts in 60 min
        </span>
        <DoodleArrow size={34} className="-scale-x-100 rotate-[24deg] text-coral-500" />
      </div>
      <div data-note2 className="absolute bottom-[9%] left-[2%] flex w-[150px] flex-col items-start gap-1">
        <DoodleArrow size={32} className="rotate-[-100deg] text-coral-500" />
        <span className="-rotate-2 font-hand text-[19px] text-coral-600">a hand-sized deck</span>
      </div>
    </div>
  );
}

/** Act 1, inside the phone: the napkin-map, streets, park, chai stall, pin. */
function StageMapAct() {
  return (
    <div data-act1 className="absolute inset-0 flex flex-col will-change-transform">
      {/* status bar */}
      <div className="flex items-center justify-between px-5 pb-0.5 pt-2.5 text-[10px] font-semibold text-ink-3">
        <span className="tabular-nums">10:24</span>
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-ink/30" />
          <span className="h-1 w-1 rounded-full bg-ink/30" />
          <span className="h-2 w-3.5 rounded-[2px] border border-ink/30" />
        </span>
      </div>
      <div className="px-4 pb-1.5 pt-1">
        <span className="font-hand text-[18px] leading-none text-coral-600">drop your pin</span>
      </div>

      {/* the map */}
      <div className="relative mx-3 flex-1 overflow-hidden rounded-2xl border-[1.5px] border-ink/15 bg-cream-100">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 200 300"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* wobbly streets — primed to dashed + drawn on by the timeline */}
          <path data-street d="M-8 56 C 44 50, 120 66, 208 54" stroke="rgb(36 21 33 / 0.32)" strokeWidth="2.5" strokeLinecap="round" />
          <path data-street d="M-8 138 C 52 132, 128 150, 208 138" stroke="rgb(36 21 33 / 0.3)" strokeWidth="2.5" strokeLinecap="round" />
          <path data-street d="M-8 226 C 46 220, 124 238, 208 224" stroke="rgb(36 21 33 / 0.26)" strokeWidth="2.5" strokeLinecap="round" />
          <path data-street d="M52 -8 C 46 90, 60 200, 50 308" stroke="rgb(36 21 33 / 0.3)" strokeWidth="2.5" strokeLinecap="round" />
          <path data-street d="M138 -8 C 132 84, 146 210, 136 308" stroke="rgb(36 21 33 / 0.26)" strokeWidth="2.5" strokeLinecap="round" />
          {/* the park */}
          <path
            data-park
            d="M112 212 C 124 198, 158 196, 174 210 C 188 222, 186 248, 168 258 C 150 267, 122 264, 112 250 C 104 239, 104 221, 112 212 Z"
            fill="rgb(var(--cream-200))"
            stroke="rgb(36 21 33 / 0.22)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* two scribbled trees */}
          <path data-map-doodle d="M136 226 C 132 218, 141 214, 145 221 C 148 227, 140 232, 136 226" stroke="rgb(36 21 33 / 0.35)" strokeWidth="2" strokeLinecap="round" />
          <path data-map-doodle d="M156 238 C 152 231, 161 227, 164 234 C 167 240, 159 244, 156 238" stroke="rgb(36 21 33 / 0.35)" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* the chai stall */}
        <span data-chai className="absolute left-[8%] top-[52%] text-ink/50">
          <DoodleCoffee size={22} />
        </span>
        <span data-chai-label className="absolute left-[7%] top-[61%] font-hand text-[14px] text-ink-3">
          chai
        </span>

        {/* discovery radius + ping (centered via margins so GSAP owns transform) */}
        <span
          data-radius
          className="absolute left-1/2 top-[42%] block h-[150px] w-[150px] rounded-full border-[1.5px] border-dashed border-coral-500/60"
          style={{ marginLeft: -75, marginTop: -75 }}
        />
        <span
          data-ripple
          className="absolute left-1/2 top-[42%] block h-[150px] w-[150px] rounded-full border-2 border-coral-500/50"
          style={{ marginLeft: -75, marginTop: -75 }}
        />

        {/* the pin — drops, squashes, springs */}
        <span
          data-pin
          className="absolute left-1/2 top-[42%] block text-coral-500 will-change-transform"
          style={{ marginLeft: -17, marginTop: -42 }}
        >
          <PinSolid size={34} />
        </span>

        {/* neighbours appearing around the pin */}
        {NEIGHBORS.map((n) => (
          <span key={n.name} data-neighbor className="absolute" style={{ left: n.left, top: n.top }}>
            <Avatar name={n.name} tone={n.tone} size={26} />
          </span>
        ))}
      </div>

      {/* bottom card */}
      <div className="px-3 py-2.5">
        <div
          data-pin-chip
          className="flex items-center justify-between rounded-xl border-[1.5px] border-ink bg-cream-25 px-2.5 py-1.5 shadow-stamp-sm"
        >
          <span className="text-[10.5px] font-bold text-ink">Pin dropped · Koramangala</span>
          <span className="rounded-full bg-coral-100 px-1.5 py-0.5 text-[9.5px] font-bold tabular-nums text-coral-700">
            59:40
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── shared scene pieces (stage act + static final frame) ───────────────── */

/**
 * The dealt hand of profile cards. `fanned` renders the final frame via
 * static CSS (stacked cards + reduced motion); without it the cards sit
 * unstyled at the center for the storyboard timeline to deal out.
 */
function DeckFan({ fanned = false, className = '' }: { fanned?: boolean; className?: string }) {
  return (
    <div className={`relative h-[224px] w-[480px] ${className}`}>
      {DECK_PROFILES.map((p, i) => {
        const f = FAN[i];
        return (
          <span key={p.name} className="absolute left-1/2 top-1/2" style={{ marginLeft: -70, marginTop: -95 }}>
            <span
              data-deck-card
              className="block will-change-transform"
              style={
                fanned && f
                  ? { transform: `translate(${f.x}px, ${f.y}px) rotate(${f.r}deg)` }
                  : undefined
              }
            >
              <MiniProfileCard {...p} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function MiniProfileCard({ name, age, dist, area, tone }: (typeof DECK_PROFILES)[number]) {
  return (
    <span className="flex h-[190px] w-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-ink bg-cream-25 px-3 text-center shadow-stamp-sm">
      <Avatar name={name} tone={tone} size={52} />
      <span className="flex items-center gap-1 font-display text-[15px] font-semibold leading-none text-ink">
        {name}, {age}
        <VerifiedIcon size={12} className="text-coral-500" />
      </span>
      <span className="rounded-full bg-coral-100 px-2 py-0.5 text-[10px] font-bold text-coral-700">
        {dist} · {area}
      </span>
      <span className="flex items-center gap-3 pt-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-ink/20 bg-cream-25 text-ink">
          <XMarkIcon size={10} />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral-600 text-cream-25">
          <HeartIcon size={11} />
        </span>
      </span>
    </span>
  );
}

/**
 * The match moment: two avatars, a hand-drawn heart, two chat bubbles and a
 * sparkle burst. Renders the finished frame by default (static cards); the
 * storyboard timeline hides and re-choreographs it in JS.
 */
function MatchMoment({ className = '' }: { className?: string }) {
  return (
    <div className={`flex w-[250px] flex-col items-center gap-3 ${className}`}>
      <div className="relative flex items-center gap-3">
        {SPARKS.map((sp, i) => (
          <span
            key={i}
            data-m-spark
            className="absolute text-coral-400 will-change-transform"
            style={{ left: `calc(50% + ${sp.x}px)`, top: sp.y }}
          >
            <DoodleSparkle size={sp.s} />
          </span>
        ))}
        <span data-m-av-l className="block will-change-transform">
          <Avatar name="You" tone={4} size={54} />
        </span>
        <span data-m-heart className="block text-coral-500 will-change-transform">
          <DoodleHeart size={42} />
        </span>
        <span data-m-av-r className="block will-change-transform">
          <Avatar name="Sara" tone={2} size={54} />
        </span>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <span data-m-bub-a className="w-fit self-start rounded-2xl rounded-bl-md border border-ink/10 bg-cream-25 px-3.5 py-2 text-[13.5px] font-medium text-ink shadow-lift">
          coffee in 20?
        </span>
        <span data-m-bub-b className="w-fit self-end rounded-2xl rounded-br-md bg-coral-600 px-3.5 py-2 text-[13.5px] font-medium text-cream-25 shadow-lift">
          already here.
        </span>
      </div>
      <span data-m-chip className="chip !py-1 !text-[10.5px]">
        <PinIcon size={10} className="text-coral-600" /> matched 200 m apart · Cubbon Park
      </span>
    </div>
  );
}

/** Static final frame of Act 1 for the stacked cards — map, radius, pin. */
function CardMapArt() {
  return (
    <div className="relative h-full w-full">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 190"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path d="M-8 48 C 70 40, 200 60, 328 46" stroke="rgb(36 21 33 / 0.28)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="9 8" />
        <path d="M-8 128 C 80 120, 210 140, 328 126" stroke="rgb(36 21 33 / 0.24)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="9 8" />
        <path d="M96 -8 C 90 60, 102 130, 94 198" stroke="rgb(36 21 33 / 0.24)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="9 8" />
        <path d="M226 -8 C 220 56, 232 140, 224 198" stroke="rgb(36 21 33 / 0.2)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="9 8" />
        <path
          d="M244 118 C 258 104, 292 102, 306 116 C 318 128, 316 152, 300 162 C 282 171, 254 168, 244 154 C 236 143, 236 127, 244 118 Z"
          fill="rgb(var(--cream-200))"
          stroke="rgb(36 21 33 / 0.22)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>
      <span className="absolute left-1/2 top-1/2 h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-coral-500/60" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-coral-500">
        <PinSolid size={30} />
      </span>
      <span className="absolute left-[20%] top-[24%]">
        <Avatar name="Sara" tone={2} size={26} />
      </span>
      <span className="absolute left-[70%] top-[60%]">
        <Avatar name="Arjun" tone={1} size={26} />
      </span>
      <span className="absolute bottom-2.5 right-3 -rotate-2 font-hand text-[16px] text-coral-600">
        lifts in 60 min ✦
      </span>
    </div>
  );
}

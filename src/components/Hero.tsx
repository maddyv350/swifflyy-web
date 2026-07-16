import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hero } from '../config/site';
import { MagneticButton } from './MagneticButton';
import { Underline } from './Underline';
import { Avatar } from './ui';
import { PinIcon, HeartIcon } from './icons';
import { DoodlePin } from './doodles';

gsap.registerPlugin(ScrollTrigger);

/**
 * The one unforgettable moment: an oversized Fraunces headline lands character
 * by character like handwriting on paper, over a warm coral/plum gradient mesh
 * that leans away from the pointer. Tiny pins drop onto the dot grid every few
 * seconds ("people are dropping pins right now" — no numbers claimed), floating
 * app fragments peel like stickers, and the whole scene parallaxes apart as
 * you scroll away.
 */

/** Fixed dot-grid spots for the ambient pin drops (deterministic, desktop). */
const PIN_SPOTS = [
  { x: '15%', y: '14%' },
  { x: '84%', y: '10%' },
  { x: '8%', y: '46%' },
  { x: '91%', y: '42%' },
  { x: '22%', y: '78%' },
  { x: '74%', y: '82%' },
] as const;
/** Drop order — hops around the grid instead of sweeping it. */
const PIN_ORDER = [0, 3, 1, 4, 2, 5] as const;

/** One headline line split into per-char spans (host h1 carries aria-label). */
function HeadlineChars({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          {wi > 0 && ' '}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} data-char className="inline-block">
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

interface HeroFragmentProps {
  /** Parallax + pointer-lean amplitude (px-ish). */
  depth: number;
  /** Resting rotation (deg) — hover straightens it, leave springs it back. */
  rot: number;
  /** Outer positioning classes. */
  className: string;
  /** Stagger for the idle CSS bob. */
  floatDelay?: string;
  /** The card's look (layout + surface). */
  cardClassName: string;
  animate: boolean;
  children: ReactNode;
}

/**
 * A floating app fragment. Transform duties are split across layers so GSAP
 * and CSS never fight over one element:
 *   outer  [data-fragment]      — scroll-away parallax (scrubbed y)
 *   lean   [data-fragment-lean] — pointer-follow drift (quickTo x/y)
 *   float                       — idle CSS bob (animate-pin-float)
 *   card   [data-fragment-card] — entrance pop + hover "peel" (rotation/y/scale)
 */
function HeroFragment({
  depth,
  rot,
  className,
  floatDelay,
  cardClassName,
  animate,
  children,
}: HeroFragmentProps) {
  const onEnter = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!animate || !window.matchMedia('(pointer: fine)').matches) return;
    gsap.to(e.currentTarget, {
      rotation: 0,
      y: -6,
      scale: 1.03,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };
  const onLeave = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!animate) return;
    gsap.to(e.currentTarget, {
      rotation: rot,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  };

  return (
    <div data-fragment data-depth={depth} className={`absolute hidden xl:block ${className}`}>
      <div data-fragment-lean data-lean={depth} className="will-change-transform">
        <div
          className="motion-safe:animate-pin-float"
          style={floatDelay ? { animationDelay: floatDelay } : undefined}
        >
          <div
            data-fragment-card
            data-cursor="tap"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{ transform: `rotate(${rot}deg)` }}
            className={`transition-[box-shadow,border-color] duration-200 ease-out hover:border-ink/70 hover:shadow-stamp ${cardClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero({ animate }: { animate: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Entrance: the headline lands char by char (slight random y/rotation,
  // back-out settle — handwriting hitting paper), the underline sketches
  // itself right after, then the supporting cast fades up.
  // Skipped when JS boots late (slow network/device): the page is prerendered,
  // so re-hiding text someone is already reading would be jank — and it would
  // push LCP to the end of the animation.
  useLayoutEffect(() => {
    const rootEl = root.current;
    if (!animate || !rootEl) return;
    if (performance.now() > 2500) return;

    const ctx = gsap.context(() => {
      // Local dashoffset draw for the headline underline — hidden here (JS
      // only) so the prerender and any skipped-entrance path show it complete.
      const underline = rootEl.querySelector<SVGPathElement>('[data-hero-underline] path');
      let underLen = 0;
      if (underline) {
        try {
          underLen = underline.getTotalLength();
        } catch {
          underLen = 0;
        }
        if (!Number.isFinite(underLen) || underLen <= 0) underLen = 0;
        if (underLen > 0) {
          gsap.set(underline, { strokeDasharray: underLen + 1, strokeDashoffset: underLen + 1 });
        }
      }

      const tl = gsap.timeline({ delay: 0.12, defaults: { ease: 'power4.out' } });
      tl.from(
        '[data-char]',
        {
          yPercent: () => gsap.utils.random(55, 130),
          rotation: () => gsap.utils.random(-10, 10),
          transformOrigin: '50% 90%',
          duration: 0.9,
          ease: 'back.out(1.6)',
          stagger: 0.02,
        },
        0,
      ).from('[data-char]', { opacity: 0, duration: 0.45, stagger: 0.02 }, 0);
      if (underline && underLen > 0) {
        tl.to(underline, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' }, '-=0.25');
      }
      tl.from(
        '[data-fade]',
        { opacity: 0, y: 18, duration: 0.8, ease: 'power3.out', stagger: 0.09 },
        '-=0.55',
      ).from(
        '[data-fragment-card]',
        { opacity: 0, scale: 0.85, y: 16, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.12 },
        '-=0.6',
      );
    }, rootEl);
    return () => ctx.revert();
  }, [animate]);

  // Ambient life + scroll-away: one scrubbed parallax (fragments lead,
  // headline lingers, mesh dims), a looping pen-drawn scroll cue, and the
  // every-4s pin drops — both loops pause off-screen and when the tab hides.
  useLayoutEffect(() => {
    const rootEl = root.current;
    if (!animate || !rootEl) return;

    let cueTl: gsap.core.Timeline | null = null;
    let metronome: gsap.core.Timeline | null = null;
    let dropTl: gsap.core.Timeline | null = null;
    let inView = true;

    const sync = () => {
      const run = inView && !document.hidden;
      if (run) {
        metronome?.play();
        cueTl?.play();
      } else {
        metronome?.pause();
        cueTl?.pause();
      }
    };

    const ctx = gsap.context(() => {
      // ── scroll-away parallax (transform/opacity only, one trigger) ──
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: rootEl, start: 'top top', end: 'bottom top', scrub: 0.4 },
        })
        .to(
          '[data-fragment]',
          { y: (_i: number, el: Element) => -(Number((el as HTMLElement).dataset.depth ?? '14') * 5.5) },
          0,
        )
        .to('[data-headline]', { y: 70 }, 0)
        .to('[data-lede]', { y: 28 }, 0)
        .to('[data-atmosphere]', { opacity: 0.45 }, 0);

      // ── scroll cue: the pen redraws the little arrow every few seconds ──
      const cueSvg = rootEl.querySelector<SVGSVGElement>('[data-cue]');
      const cuePaths = Array.from(rootEl.querySelectorAll<SVGPathElement>('[data-cue-stroke]'));
      const cueLens: number[] = [];
      for (const p of cuePaths) {
        let len = 0;
        try {
          len = p.getTotalLength();
        } catch {
          len = 0;
        }
        if (!Number.isFinite(len) || len <= 0) {
          cueLens.length = 0;
          break;
        }
        cueLens.push(len + 1);
      }
      if (cueSvg && cuePaths.length > 0 && cueLens.length === cuePaths.length) {
        cueTl = gsap.timeline({ repeat: -1, repeatDelay: 1.7, delay: 1.4 });
        cueTl
          .set(cuePaths, {
            strokeDasharray: (i: number) => cueLens[i],
            strokeDashoffset: (i: number) => cueLens[i],
          })
          .set(cueSvg, { opacity: 1 })
          .to(cuePaths, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut', stagger: 0.22 })
          .to(cueSvg, { opacity: 0, duration: 0.4, ease: 'power1.in' }, '+=1.5');
      }

      // ── ambient pin drops (desktop only — the spots are lg-hidden) ──
      if (window.matchMedia('(min-width: 1024px)').matches) {
        const spots = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-pin-spot]'));
        const order = PIN_ORDER.filter((i) => i < spots.length);
        let step = 0;

        const drop = () => {
          if (document.hidden || order.length === 0) return;
          const spot = spots[order[step % order.length]];
          step += 1;
          const pin = spot.querySelector('svg');
          const ping = spot.querySelector<HTMLElement>('[data-pin-ping]');
          if (!pin || !ping) return;
          dropTl?.kill();
          dropTl = gsap
            .timeline({
              onComplete: () => {
                ping.classList.remove('animate-radar-ping');
              },
            })
            .set(spot, { opacity: 1 })
            .fromTo(
              pin,
              { y: -18, opacity: 0, scale: 0.7, transformOrigin: '50% 100%' },
              { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'bounce.out' },
            )
            .add(() => {
              ping.classList.add('animate-radar-ping');
            }, '-=0.15')
            .to(spot, { opacity: 0, duration: 0.6, ease: 'power1.in' }, '+=2.05');
        };

        if (spots.length > 0) {
          // A 4s metronome; the drop itself is a short one-shot timeline.
          metronome = gsap.timeline({ repeat: -1, onRepeat: drop });
          metronome.to({}, { duration: 4 });
        }
      }

      const st = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          inView = self.isActive;
          sync();
        },
      });
      inView = st.isActive;
      sync();
    }, rootEl);

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      dropTl?.kill();
      rootEl.querySelectorAll<HTMLElement>('[data-pin-ping]').forEach((el) => {
        el.classList.remove('animate-radar-ping');
      });
      rootEl.querySelectorAll<HTMLElement>('[data-pin-spot]').forEach((el) => {
        gsap.set(el, { clearProps: 'opacity' });
      });
      rootEl.querySelectorAll<SVGElement>('[data-pin-spot] svg').forEach((el) => {
        gsap.set(el, { clearProps: 'all' });
      });
      ctx.revert();
    };
  }, [animate]);

  // Depth: fragments lean gently and the mesh blobs drift in opposing
  // directions as the pointer moves (desktop only, one passive listener).
  useEffect(() => {
    const rootEl = root.current;
    if (!animate || !rootEl) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // The listener is window-level, so gate it on the hero actually being on
    // screen — otherwise every mousemove over the footer keeps ~7 quickTo
    // tween sets writing transforms on elements nobody can see.
    let inView = true;
    const st = ScrollTrigger.create({
      trigger: rootEl,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        inView = self.isActive;
      },
    });
    inView = st.isActive;

    const leanEls = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-fragment-lean]'));
    const blobEls = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-blob]'));
    const leans = leanEls.map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
      amp: Number(el.dataset.lean ?? '12'),
    }));
    const blobs = blobEls.map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power2' }),
      y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power2' }),
      ax: Number(el.dataset.blobX ?? '18'),
      ay: Number(el.dataset.blobY ?? '12'),
    }));

    const onMove = (e: PointerEvent) => {
      if (!inView) return; // off-screen: let the tweens settle and stop
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      leans.forEach((m) => {
        m.x(nx * m.amp);
        m.y(ny * m.amp * 0.7);
      });
      blobs.forEach((b) => {
        b.x(nx * b.ax);
        b.y(ny * b.ay);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      st.kill();
      [...leanEls, ...blobEls].forEach((el) => {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: 'transform' });
      });
    };
  }, [animate]);

  return (
    <section ref={root} id="top" className="grain relative z-10 overflow-hidden">
      {/* gradient mesh atmosphere (+ dot grid + ambient pin spots) */}
      <div aria-hidden data-atmosphere className="pointer-events-none absolute inset-0">
        {/* each blob: GSAP drifts the wrapper, CSS keeps its slow idle drift
            on the inner — separate elements so transforms never collide */}
        <div data-blob="0" data-blob-x="22" data-blob-y="16" className="absolute -right-[12%] -top-[18%]">
          <div
            className="h-[480px] w-[480px] rounded-full opacity-70 blur-[90px] md:h-[52vw] md:w-[52vw] motion-safe:animate-mesh-drift"
            style={{
              background: 'radial-gradient(closest-side, rgb(var(--coral-300) / 0.75), transparent 72%)',
            }}
          />
        </div>
        <div data-blob="1" data-blob-x="-30" data-blob-y="-22" className="absolute -bottom-[22%] -left-[14%]">
          <div
            className="h-[440px] w-[440px] rounded-full opacity-60 blur-[90px] md:h-[46vw] md:w-[46vw] motion-safe:animate-mesh-drift-2"
            style={{
              background: 'radial-gradient(closest-side, rgb(var(--plum-300) / 0.65), transparent 72%)',
            }}
          />
        </div>
        <div data-blob="2" data-blob-x="14" data-blob-y="-10" className="absolute left-[28%] top-[8%]">
          <div
            className="h-[320px] w-[320px] rounded-full opacity-50 blur-[80px]"
            style={{
              background: 'radial-gradient(closest-side, rgb(var(--coral-100)), transparent 70%)',
            }}
          />
        </div>
        {/* faint paper dot grid, fading out towards the edges */}
        <div
          className="absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_42%,#000,transparent)]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(var(--cream-400) / 0.55) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        {/* ambient pin drops — invisible until JS animates one in (transient
            by nature, like PinDrops; nothing here is content) */}
        {PIN_SPOTS.map((s, i) => (
          <div
            key={i}
            data-pin-spot
            className="absolute hidden -translate-x-1/2 opacity-0 lg:block"
            style={{ left: s.x, top: s.y }}
          >
            <span
              data-pin-ping
              className="absolute -left-[9px] -top-[2px] h-9 w-9 rounded-full border-2 border-coral-500/60 opacity-0"
            />
            <DoodlePin size={18} className="block text-coral-600" />
          </div>
        ))}
      </div>

      <div className="wrap relative flex min-h-[100svh] flex-col items-center justify-center pb-28 pt-32 text-center">
        <span data-fade className="eyebrow text-[24px]">
          {hero.eyebrow}
        </span>

        <h1
          data-headline
          aria-label={hero.headline.join(' ')}
          className="font-display text-[clamp(52px,9.2vw,116px)] font-semibold leading-[0.98] tracking-[-0.03em] text-ink"
        >
          {hero.headline.map((line, i) => {
            const last = i === hero.headline.length - 1;
            return (
              <span key={line} aria-hidden className="block">
                {last ? (
                  <em data-hero-underline className="relative inline-block not-italic">
                    <span className="italic text-coral-600">
                      <HeadlineChars text={line} />
                    </span>
                    <Underline className="text-coral-500" />
                  </em>
                ) : (
                  <HeadlineChars text={line} />
                )}
              </span>
            );
          })}
        </h1>

        {/* No entrance fade on this paragraph: it's the page's LCP element —
            hiding it after the prerendered paint would re-time LCP to the
            animation's end. (The scrubbed parallax only transforms it, which
            is safe — it starts at identity and never hides it.) */}
        <p data-lede className="lede mx-auto mt-7 text-center text-[17px] sm:text-lg">
          {hero.sub}
        </p>

        <div data-fade className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={hero.primaryCta.href} enabled={animate} className="btn-primary">
            {hero.primaryCta.label}
          </MagneticButton>
          <a href={hero.secondaryCta.href} data-cursor="tap" className="btn-ghost">
            {hero.secondaryCta.label}
          </a>
        </div>

        <p data-fade className="mt-7 -rotate-1 font-hand text-[19px] text-ink-3">
          {hero.note} ✦
        </p>

        {/* floating app fragments — the depth layer (large screens only) */}
        <HeroFragment
          depth={16}
          rot={-5}
          className="left-[3%] top-[24%]"
          animate={animate}
          cardClassName="flex items-center gap-3 rounded-2xl border border-ink/10 bg-cream-25/90 px-4 py-3 shadow-lift backdrop-blur-sm"
        >
          <span className="flex">
            <Avatar name="Priya" tone={0} size={34} />
            <Avatar name="Rahul" tone={1} size={34} className="-ml-2.5" />
          </span>
          <span className="text-left">
            <span className="block text-[13px] font-bold text-ink">It’s a match</span>
            <span className="block text-[11.5px] text-ink-3">Priya & Rahul · 200 m apart</span>
          </span>
          <HeartIcon size={16} className="text-coral-500" />
        </HeroFragment>

        <HeroFragment
          depth={22}
          rot={3}
          className="right-[4%] top-[31%]"
          floatDelay="0.8s"
          animate={animate}
          cardClassName="flex items-center gap-2 rounded-full border border-ink/10 bg-cream-25/90 px-4 py-2.5 shadow-lift backdrop-blur-sm"
        >
          <PinIcon size={15} className="text-coral-600" />
          <span className="text-[13px] font-bold text-ink">Koramangala</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-ink/25" />
          <span className="text-[12.5px] tabular-nums text-ink-3">pin live · 42:10</span>
        </HeroFragment>

        <HeroFragment
          depth={12}
          rot={2}
          className="bottom-[17%] left-[7%]"
          floatDelay="1.6s"
          animate={animate}
          cardClassName="w-[190px] rounded-2xl border border-ink/10 bg-cream-25/90 p-3 shadow-lift backdrop-blur-sm"
        >
          <span className="block w-fit rounded-2xl rounded-bl-md bg-cream-100 px-3 py-1.5 text-left text-[12.5px] font-medium text-ink">
            coffee in 20?
          </span>
          <span className="mt-1.5 ml-auto block w-fit rounded-2xl rounded-br-md bg-coral-600 px-3 py-1.5 text-[12.5px] font-medium text-cream-25">
            already here.
          </span>
        </HeroFragment>

        <HeroFragment
          depth={26}
          rot={-4}
          className="bottom-[24%] right-[8%]"
          floatDelay="2.2s"
          animate={animate}
          cardClassName="flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-50/90 px-4 py-2.5 shadow-lift backdrop-blur-sm"
        >
          <span className="text-[13px] font-bold text-coral-700">selfie-verified</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4.5 12.5l5 5L19.5 7"
              stroke="rgb(var(--coral-600))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </HeroFragment>

        {/* scroll cue — a pen-drawn arrow that redraws itself in a loop */}
        <div
          data-fade
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-ink-3"
        >
          <span className="font-hand text-[18px]">take a stroll</span>
          <svg
            data-cue
            width="15"
            height="20"
            viewBox="0 0 20 27"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path data-cue-stroke d="M10.3 2.6 C 9.2 8.2, 10.8 13.6, 9.9 20.4" />
            <path data-cue-stroke d="M4.2 15.8 C 6.1 18.3, 8 20.8, 9.9 23.3 C 12.1 20.7, 14.2 18.2, 16.2 15.9" />
          </svg>
        </div>
      </div>
    </section>
  );
}

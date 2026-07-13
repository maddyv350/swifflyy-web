import { useLayoutEffect, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { hero } from '../config/site';
import { MagneticButton } from './MagneticButton';
import { Underline } from './Underline';
import { Avatar } from './ui';
import { PinIcon, HeartIcon, ArrowDownIcon } from './icons';

/**
 * The one unforgettable moment: an oversized Fraunces headline over a warm
 * coral/plum gradient mesh, staggered line reveal, and floating app-fragment
 * cards that drift with the pointer.
 */
export function Hero({ animate }: { animate: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Entrance: masked headline lines rise first, then the supporting cast.
  // Skipped when JS boots late (slow network/device): the page is prerendered,
  // so re-hiding text someone is already reading would be jank — and it would
  // push LCP to the end of the animation.
  useLayoutEffect(() => {
    if (!animate || !root.current) return;
    if (performance.now() > 2500) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.12, defaults: { ease: 'power4.out' } })
        .from('[data-line-inner]', { yPercent: 115, duration: 1.1, stagger: 0.1 })
        .from(
          '[data-fade]',
          { opacity: 0, y: 18, duration: 0.8, ease: 'power3.out', stagger: 0.09 },
          '-=0.7',
        )
        .from(
          '[data-fragment]',
          { opacity: 0, scale: 0.85, y: 16, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.12 },
          '-=0.6',
        );
    }, root);
    return () => ctx.revert();
  }, [animate]);

  // Depth: fragments lean gently with the pointer (desktop only).
  useEffect(() => {
    if (!animate || !root.current) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    const frags = Array.from(root.current.querySelectorAll<HTMLElement>('[data-fragment]'));
    const movers = frags.map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
      depth: Number(el.dataset.depth || 12),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      movers.forEach((m) => {
        m.x(nx * m.depth);
        m.y(ny * m.depth * 0.7);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [animate]);

  return (
    <section ref={root} id="top" className="grain relative overflow-hidden">
      {/* gradient mesh atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-[12%] -top-[18%] h-[480px] w-[480px] rounded-full opacity-70 blur-[90px] md:h-[52vw] md:w-[52vw] motion-safe:animate-mesh-drift"
          style={{
            background: 'radial-gradient(closest-side, rgb(var(--coral-300) / 0.75), transparent 72%)',
          }}
        />
        <div
          className="absolute -bottom-[22%] -left-[14%] h-[440px] w-[440px] rounded-full opacity-60 blur-[90px] md:h-[46vw] md:w-[46vw] motion-safe:animate-mesh-drift-2"
          style={{
            background: 'radial-gradient(closest-side, rgb(var(--plum-300) / 0.65), transparent 72%)',
          }}
        />
        <div
          className="absolute left-[28%] top-[8%] h-[320px] w-[320px] rounded-full opacity-50 blur-[80px]"
          style={{
            background: 'radial-gradient(closest-side, rgb(var(--coral-100)), transparent 70%)',
          }}
        />
        {/* faint paper dot grid, fading out towards the edges */}
        <div
          className="absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_42%,#000,transparent)]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(var(--cream-400) / 0.55) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
      </div>

      <div className="wrap relative flex min-h-[100svh] flex-col items-center justify-center pb-28 pt-32 text-center">
        <span data-fade className="eyebrow text-[24px]">
          {hero.eyebrow}
        </span>

        <h1 className="font-display text-[clamp(52px,9.2vw,116px)] font-semibold leading-[0.98] tracking-[-0.03em] text-ink">
          {hero.headline.map((line, i) => {
            const last = i === hero.headline.length - 1;
            return (
              <span key={line} className="block overflow-hidden pb-[0.08em] [margin-bottom:-0.08em]">
                <span data-line-inner className="block will-change-transform">
                  {last ? (
                    <em className="relative inline-block not-italic">
                      <span className="italic text-coral-600">{line}</span>
                      <Underline className="text-coral-500" />
                    </em>
                  ) : (
                    line
                  )}
                </span>
              </span>
            );
          })}
        </h1>

        {/* No entrance fade on this paragraph: it's the page's LCP element —
            hiding it after the prerendered paint would re-time LCP to the
            animation's end. The headline mask reveal above carries the moment. */}
        <p className="lede mx-auto mt-7 text-center text-[17px] sm:text-lg">
          {hero.sub}
        </p>

        <div data-fade className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={hero.primaryCta.href} enabled={animate} className="btn-primary">
            {hero.primaryCta.label}
          </MagneticButton>
          <a href={hero.secondaryCta.href} className="btn-ghost">
            {hero.secondaryCta.label}
          </a>
        </div>

        <p data-fade className="mt-7 -rotate-1 font-hand text-[19px] text-ink-3">
          {hero.note} ✦
        </p>

        {/* floating app fragments — the depth layer (large screens only) */}
        <div
          data-fragment
          data-depth="16"
          className="absolute left-[3%] top-[24%] hidden -rotate-[5deg] xl:block motion-safe:animate-pin-float"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-cream-25/90 px-4 py-3 shadow-lift backdrop-blur-sm">
            <span className="flex">
              <Avatar name="Priya" tone={0} size={34} />
              <Avatar name="Rahul" tone={1} size={34} className="-ml-2.5" />
            </span>
            <span className="text-left">
              <span className="block text-[13px] font-bold text-ink">It’s a match</span>
              <span className="block text-[11.5px] text-ink-3">Priya & Rahul · 200 m apart</span>
            </span>
            <HeartIcon size={16} className="text-coral-500" />
          </div>
        </div>

        <div
          data-fragment
          data-depth="22"
          className="absolute right-[4%] top-[31%] hidden rotate-[3deg] xl:block motion-safe:animate-pin-float [animation-delay:0.8s]"
        >
          <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-cream-25/90 px-4 py-2.5 shadow-lift backdrop-blur-sm">
            <PinIcon size={15} className="text-coral-600" />
            <span className="text-[13px] font-bold text-ink">Koramangala</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-ink/25" />
            <span className="text-[12.5px] tabular-nums text-ink-3">pin live · 42:10</span>
          </div>
        </div>

        <div
          data-fragment
          data-depth="12"
          className="absolute bottom-[17%] left-[7%] hidden rotate-[2deg] xl:block motion-safe:animate-pin-float [animation-delay:1.6s]"
        >
          <div className="w-[190px] rounded-2xl border border-ink/10 bg-cream-25/90 p-3 shadow-lift backdrop-blur-sm">
            <span className="block w-fit rounded-2xl rounded-bl-md bg-cream-100 px-3 py-1.5 text-left text-[12.5px] font-medium text-ink">
              coffee in 20?
            </span>
            <span className="mt-1.5 ml-auto block w-fit rounded-2xl rounded-br-md bg-coral-600 px-3 py-1.5 text-[12.5px] font-medium text-cream-25">
              already here.
            </span>
          </div>
        </div>

        <div
          data-fragment
          data-depth="26"
          className="absolute bottom-[24%] right-[8%] hidden -rotate-[4deg] xl:block motion-safe:animate-pin-float [animation-delay:2.2s]"
        >
          <div className="flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-50/90 px-4 py-2.5 shadow-lift backdrop-blur-sm">
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
          </div>
        </div>

        {/* scroll cue */}
        <div
          data-fade
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 text-ink-3"
        >
          <span className="font-hand text-[18px]">take a stroll</span>
          <ArrowDownIcon size={15} className="motion-safe:animate-bounce" />
        </div>
      </div>
    </section>
  );
}

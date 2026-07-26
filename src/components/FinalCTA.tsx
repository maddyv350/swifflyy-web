import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '../hooks/useReveal';
import { useDrawOn } from '../hooks/useDrawOn';
import { WaitlistForm } from './WaitlistForm';
import { DoodleArrow } from './doodles';

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits text into per-letter spans (`data-letter`) so each character can
 * spring on hover. Words stay in nowrap spans with real spaces between them,
 * so line wrapping behaves exactly like plain text.
 */
function JumpLetters({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} data-letter className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}

/** The conversion moment: a deep-plum room with a warm coral glow. */
export function FinalCTA({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate });
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  /* The pen's final stroke — the arrow draws itself into the form. */
  const drawRef = useDrawOn<HTMLDivElement>({ enabled: animate, start: 'top 75%', duration: 1.15 });

  /* Per-character elastic jumps as the pointer sweeps the headline. */
  useEffect(() => {
    const el = headlineRef.current;
    if (!el || !animate) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const ctx = gsap.context(() => {}, el);
    const onOver = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const letter = target.closest<HTMLElement>('[data-letter]');
      if (!letter || gsap.isTweening(letter)) return;
      const lift = Math.max(12, letter.offsetHeight * 0.2);
      ctx.add(() => {
        gsap
          .timeline()
          .to(letter, {
            y: -lift,
            scaleY: 1.06,
            transformOrigin: '50% 100%',
            duration: 0.16,
            ease: 'power2.out',
          })
          .to(letter, { y: 0, scaleY: 1, duration: 0.9, ease: 'elastic.out(1.15, 0.38)' });
      });
    };

    el.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      el.removeEventListener('pointerover', onOver);
      ctx.revert();
    };
  }, [animate]);

  /* One-time attention wiggle when the form card first enters the viewport. */
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !animate) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: card, start: 'top 82%', once: true } })
        .to(card, { rotation: -1.2, duration: 0.1, ease: 'power1.inOut' }, 0.35)
        .to(card, { rotation: 1, duration: 0.11, ease: 'power1.inOut' })
        .to(card, { rotation: -0.6, duration: 0.11, ease: 'power1.inOut' })
        .to(card, { rotation: 0, duration: 0.7, ease: 'elastic.out(1.6, 0.26)' });
    }, card);
    return () => ctx.revert();
  }, [animate]);

  return (
    <section id="waitlist" className="grain relative z-10 overflow-hidden bg-plum-950">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[35%] left-1/2 h-[560px] w-[880px] -translate-x-1/2 opacity-50 blur-[110px] motion-safe:animate-mesh-drift"
          style={{
            background: 'radial-gradient(closest-side, rgb(var(--coral-500) / 0.6), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-[30%] -right-[10%] h-[420px] w-[420px] opacity-40 blur-[100px] motion-safe:animate-mesh-drift-2"
          style={{
            background: 'radial-gradient(closest-side, rgb(var(--plum-600) / 0.8), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_55%_at_50%_45%,#000,transparent)]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(var(--cream-50) / 0.12) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
      </div>

      <div ref={ref} className="wrap relative py-24 text-center md:py-36">
        <span data-reveal className="eyebrow-on-dark text-[24px]">
          early access ✦
        </span>
        <h2
          data-reveal
          ref={headlineRef}
          aria-label="Be first in your city."
          className="font-display mx-auto max-w-[820px] cursor-default text-[clamp(40px,6.5vw,84px)] font-semibold leading-[1.0] tracking-[-0.025em] text-cream-50"
        >
          <span aria-hidden>
            <JumpLetters text="Be first in" />{' '}
            <em className="italic text-coral-300">
              <JumpLetters text="your city." />
            </em>
          </span>
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-[520px] text-lg leading-[1.65] text-plum-200">
          Join the list with your city. When Swifflyy lands in your neighbourhood, you - and the
          friends you bring - walk in first.
        </p>

        <div data-reveal ref={drawRef} className="relative mx-auto mt-12 max-w-[560px]">
          {/* the pen's last stroke: swoops off the headline, lands on the form */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-10 hidden rotate-[18deg] md:block lg:-left-32"
          >
            <DoodleArrow size={86} className="text-coral-400" />
          </span>

          {/* the form card — stamped onto the dark paper */}
          <div
            ref={cardRef}
            className="relative rounded-[26px] border-[1.5px] border-cream-50/25 bg-plum-900/60 px-5 pb-7 shadow-[5px_6px_0_rgb(var(--coral-500)/0.85)] will-change-transform sm:px-8"
          >
            <span
              aria-hidden
              className="absolute -top-3.5 left-8 -rotate-3 rounded-md border-[1.5px] border-ink bg-cream-25 px-2.5 py-0.5 font-hand text-[17px] leading-tight text-ink shadow-stamp-sm"
            >
              your ticket in ✦
            </span>
            <div className="-mt-2">
              <WaitlistForm />
            </div>
          </div>
        </div>

        <p data-reveal className="mt-8 font-hand text-[19px] text-plum-300">
          one email when we land in your city - no spam, ever ✦
        </p>
      </div>
    </section>
  );
}

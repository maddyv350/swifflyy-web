import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Underline } from './Underline';
import { PhoneMockup } from './PhoneMockup';
import { MagneticButton } from './MagneticButton';
import { DownloadIcon } from './icons';

interface HeroProps {
  animate: boolean;
}

/** Two-column hero: pitch copy on the left, the animated phone on the right. */
export function Hero({ animate }: HeroProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  // Entrance: stagger the left column up on load.
  useEffect(() => {
    if (!animate || !leftRef.current) return;
    const items = leftRef.current.querySelectorAll<HTMLElement>('[data-hero]');
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.15,
      });
    });
    return () => ctx.revert();
  }, [animate]);

  // Subtle pointer parallax/tilt on the phone (desktop, motion-on only).
  useEffect(() => {
    if (!animate) return;
    const el = phoneRef.current;
    if (!el || window.matchMedia('(max-width: 900px)').matches) return;

    const quickX = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    const quickY = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      quickX(nx * 6);
      quickY(-ny * 5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [animate]);

  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      {/* subtle dot grid */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden />

      <div className="mx-auto grid min-h-[100svh] max-w-[1280px] grid-cols-1 items-center gap-12 px-6 pb-20 pt-28 md:grid-cols-2 md:gap-[60px] md:px-10 md:pt-[120px]">
        {/* left */}
        <div ref={leftRef} className="flex flex-col gap-7 md:gap-8">
          <span data-hero className="inline-block -rotate-1 self-start font-hand text-[22px] text-accent">
            ✦ now available
          </span>

          <h1
            data-hero
            className="font-head text-[clamp(48px,6vw,80px)] font-extrabold leading-[1.0] tracking-[-2.5px] text-ink"
            style={{ textWrap: 'pretty' }}
          >
            Meet people
            <br />
            <span className="relative inline-block text-accent">
              where you are
              <Underline />
            </span>
          </h1>

          <p data-hero className="max-w-[440px] font-body text-xl leading-[1.55] text-muted">
            Drop a pin at your favourite spot. See who’s nearby. Connect with people who share your
            world — not just your algorithm.
          </p>

          <div data-hero className="flex flex-wrap items-center gap-4">
            <MagneticButton href="#download" enabled={animate} className="btn-stack">
              <span className="btn-stack-shadow bg-line/85" />
              <span className="btn-ink">
                <DownloadIcon />
                Download free
              </span>
            </MagneticButton>
            <a href="#try" className="btn-ghost">
              Try the swipe demo →
            </a>
          </div>

          <div data-hero className="-rotate-1 font-hand text-[18px] text-faint">
            free to download · works anywhere ✦
          </div>
        </div>

        {/* right */}
        <div className="relative flex items-center justify-center [perspective:1200px]">
          <div className="absolute -top-5 right-5 hidden rotate-2 font-hand text-[18px] text-muted md:block">
            drop your pin ↓
          </div>

          {/* floating sticker badges */}
          <div className="absolute left-0 top-6 z-10 hidden -rotate-6 rounded-full border-[1.5px] border-line bg-paper px-3 py-1.5 font-body text-[13px] font-semibold text-ink shadow-sketch-sm md:block">
            no situationships 🙅
          </div>
          <div className="absolute -bottom-2 right-8 z-10 hidden rotate-3 rounded-full border-[1.5px] border-accent bg-accent-soft px-3 py-1.5 font-body text-[13px] font-semibold text-accent shadow-sketch-sm md:block">
            230m away ✦
          </div>

          <div ref={phoneRef} className="[transform-style:preserve-3d]">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

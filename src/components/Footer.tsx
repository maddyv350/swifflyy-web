import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { site, footer, social } from '../config/site';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { burstConfetti } from '../lib/confetti';
import { InstagramIcon, LinkedInIcon } from './icons';

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
} as const;

/**
 * The big hand-written wordmark, split into per-letter spans so each letter
 * does a small elastic hop under the pointer (a quieter echo of the FinalCTA
 * headline). Visually identical to `<Wordmark tone="dark" />` when idle.
 */
function HopWordmark({ animate }: { animate: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const ctx = gsap.context(() => {}, el);
    const onOver = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const letter = target.closest<HTMLElement>('[data-hop]');
      if (!letter || gsap.isTweening(letter)) return;
      ctx.add(() => {
        gsap
          .timeline()
          .to(letter, { y: -6, duration: 0.14, ease: 'power2.out' })
          .to(letter, { y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
      });
    };

    el.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      el.removeEventListener('pointerover', onOver);
      ctx.revert();
    };
  }, [animate]);

  return (
    <span
      ref={ref}
      className="relative inline-block font-hand text-[38px] font-bold leading-none tracking-[-1px] text-coral-300"
    >
      <span className="sr-only">{site.name}</span>
      <span aria-hidden>
        {Array.from(site.name).map((ch, i) => (
          <span key={i} data-hop className="inline-block will-change-transform">
            {ch}
          </span>
        ))}
      </span>
      <svg
        className="pointer-events-none absolute -bottom-1.5 left-0 w-full"
        viewBox="0 0 120 12"
        height="10"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M2 6 C 25 2, 55 10, 85 4 S 115 8, 118 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

/** A footer link with a tiny hand-drawn underline that slides in on hover/focus. */
function FooterLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`group relative inline-block no-underline ${className}`}>
      {children}
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-0 h-[5px] w-full origin-left scale-x-[0.4] text-coral-400 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100"
        viewBox="0 0 60 6"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M2 4.2 C 12 1.6, 24 5.6, 34 3.2 S 52 4.4, 58 2.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </a>
  );
}

export function Footer({ animate }: { animate?: boolean }) {
  const year = new Date().getFullYear();
  const [found, setFound] = useState(false);
  const reduced = usePrefersReducedMotion();
  const shouldAnimate = animate ?? !reduced;

  const onSecretPin = (e: React.MouseEvent<HTMLButtonElement>) => {
    burstConfetti(e.currentTarget, 40);
    setFound(true);
  };

  return (
    <footer className="border-t border-cream-50/10 bg-plum-950">
      <div className="wrap py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* brand */}
          <div className="max-w-[280px]">
            <HopWordmark animate={shouldAnimate} />
            <p className="mt-5 text-[15px] leading-relaxed text-cream-50/55">{footer.tagline}</p>
            <p className="mt-4 -rotate-1 font-hand text-[18px] text-plum-300">{footer.madeIn}</p>

            {/* socials — hand-drawn glyphs in little ink circles */}
            <ul className="mt-6 flex items-center gap-3">
              {social.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${s.label}`}
                      data-cursor="tap"
                      className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-cream-50/20 text-cream-50/65 no-underline transition-[color,border-color,transform] duration-200 ease-spring hover:-translate-y-0.5 hover:border-coral-400 hover:text-coral-300 focus-visible:border-coral-400 focus-visible:text-coral-300"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* links */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footer.linkGroups.map((g) => (
              <div key={g.title}>
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-cream-50/60">
                  {g.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink
                        href={l.href}
                        className="text-[14.5px] text-cream-50/65 transition-colors duration-200 hover:text-cream-50"
                      >
                        {l.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-cream-50/10 pt-7">
          <span className="text-[13px] text-cream-50/55">
            {found ? (
              <span className="font-hand text-[17px] text-coral-300">
                you found the secret pin ✦ good luck on your next match
              </span>
            ) : (
              <>© {year} {site.name}. All rights reserved.</>
            )}
          </span>

          <span className="flex items-center gap-4">
            <FooterLink
              href={`mailto:${site.email}`}
              className="text-[13px] text-cream-50/60 transition-colors duration-200 hover:text-cream-50/90"
            >
              {site.email}
            </FooterLink>
            {/* the secret pin — subtle, wiggles once in a while, pays off in confetti */}
            <button
              type="button"
              onClick={onSecretPin}
              aria-label="A mysterious little pin"
              className="secret-pin relative select-none text-plum-400 opacity-50 transition-opacity duration-200 hover:opacity-100"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 22S4.5 15.2 4.5 9.9A7.5 7.5 0 0 1 12 2.5a7.5 7.5 0 0 1 7.5 7.4C19.5 15.2 12 22 12 22Z" />
                <circle cx="12" cy="9.9" r="2.7" fill="rgb(var(--plum-950))" />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </footer>
  );
}

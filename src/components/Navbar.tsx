import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { site } from '../config/site';
import { Wordmark } from './Wordmark';
import { DoodlePin } from './doodles';

/** Section ids spied on — derived from the nav links themselves. */
const SPY_IDS = site.navLinks.map((l) => l.href.slice(1));

/** Unscaled width (px) of the gliding squiggle; scaleX fits it to each link. */
const SQUIGGLE_WIDTH = 160;

interface NavbarProps {
  /**
   * NOT prefers-reduced-motion. When false/omitted the scrollspy still marks
   * the active link (static squiggle + aria-current) — it just snaps instead
   * of gliding.
   */
  animate?: boolean;
}

/**
 * Fixed nav that starts transparent over the hero and condenses into a
 * floating glass pill once you scroll. A scrollspy watches the anchor
 * sections and slides one hand-drawn squiggle underline between the active
 * links; between sections (hero, marquee, footer…) it fades away.
 */
export function Navbar({ animate = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const squiggleRef = useRef<HTMLLIElement>(null);
  const prevActive = useRef<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy: a narrow probe band ~40% down the viewport — whichever section
  // crosses it is "where you are". Nothing crossing → no active link.
  useEffect(() => {
    const sections = SPY_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const intersecting = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) intersecting.add(e.target.id);
          else intersecting.delete(e.target.id);
        }
        setActive(SPY_IDS.find((id) => intersecting.has(id)) ?? null);
      },
      { rootMargin: '-38% 0px -57% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Glide the shared squiggle to the active link's box (transforms only:
  // x/y position it, scaleX fits it to the link's width).
  useEffect(() => {
    const list = listRef.current;
    const squiggle = squiggleRef.current;
    if (!list || !squiggle) return;

    const position = (immediate: boolean) => {
      if (!active) {
        gsap.to(squiggle, { autoAlpha: 0, duration: animate ? 0.2 : 0, overwrite: 'auto' });
        return;
      }
      const link = list.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      if (!link) return;
      const x = link.offsetLeft;
      const y = link.offsetTop + link.offsetHeight - 4;
      const scaleX = link.offsetWidth / SQUIGGLE_WIDTH;
      if (immediate) {
        gsap.set(squiggle, { x, y, scaleX });
        gsap.to(squiggle, { autoAlpha: 1, duration: animate ? 0.25 : 0, overwrite: 'auto' });
      } else {
        gsap.to(squiggle, {
          x,
          y,
          scaleX,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'back.out(1.6)',
          overwrite: 'auto',
        });
      }
    };

    // Fresh appearance (from "nothing active") jumps into place and fades in;
    // link → link glides. With animate=false everything snaps.
    const fresh = prevActive.current === null || !animate;
    prevActive.current = active;
    position(fresh);

    // Re-measure when the layout may have shifted: window resize, and the
    // pill condensing/expanding (its 300ms transition settles by ~350ms).
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => position(true));
    };
    window.addEventListener('resize', onResize, { passive: true });
    const settle = window.setTimeout(() => position(true), 350);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener('resize', onResize);
    };
  }, [active, animate, scrolled]);

  // Kill any in-flight squiggle tween when the navbar unmounts.
  useEffect(() => {
    const squiggle = squiggleRef.current;
    return () => {
      if (squiggle) gsap.killTweensOf(squiggle);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 sm:px-5">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-plum-950 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-cream-50"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className={`mx-auto flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled
            ? 'mt-3 max-w-[980px] rounded-full border border-ink/10 bg-cream-25/85 px-5 py-2.5 shadow-lift backdrop-blur-md sm:px-6'
            : 'mt-0 max-w-[1200px] border border-transparent bg-transparent px-2 py-5 sm:px-3'
        }`}
      >
        <a
          href="#top"
          aria-label="Swifflyy home"
          className="group relative inline-block pb-1.5 transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-105"
        >
          <Wordmark className="text-[30px]" />
          {/* A tiny pin pops up over the wordmark on hover — the app in one gesture. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-1.5 inline-block translate-y-1.5 rotate-[14deg] scale-50 opacity-0 transition-[transform,opacity] duration-300 ease-spring group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
          >
            <DoodlePin size={15} className="text-coral-500" />
          </span>
        </a>

        <ul ref={listRef} className="relative hidden items-center gap-7 lg:flex">
          {site.navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group relative text-[15px] font-medium no-underline transition-colors duration-200 hover:text-ink ${
                    isActive ? 'text-ink' : 'text-ink-2'
                  }`}
                >
                  {l.label}
                  {/* Hover bar (suppressed on the active link — the squiggle owns it). */}
                  {!isActive && (
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-coral-500 transition-transform duration-300 ease-out group-hover:scale-x-100"
                    />
                  )}
                </a>
              </li>
            );
          })}
          {/* One shared squiggle underline, glided between links with gsap. */}
          <li
            ref={squiggleRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-2 w-40 origin-left list-none opacity-0"
          >
            <svg
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              className="h-full w-full text-coral-500"
              aria-hidden
            >
              <path
                d="M4 6 C 44 1, 100 12, 150 4 S 195 8, 196 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </li>
        </ul>

        <a
          href="#waitlist"
          className={`btn-ink !px-5 !text-[13.5px] ${scrolled ? '!py-2.5' : '!py-3'}`}
        >
          Early access
        </a>
      </nav>
    </header>
  );
}

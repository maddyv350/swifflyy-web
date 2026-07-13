import { useEffect, useState } from 'react';
import { site } from '../config/site';
import { Wordmark } from './Wordmark';

/**
 * Fixed nav that starts transparent over the hero and condenses into a
 * floating glass pill once you scroll.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
          className="inline-block pb-1.5 transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-105"
        >
          <Wordmark className="text-[30px]" />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {site.navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-[15px] font-medium text-ink-2 no-underline transition-colors duration-200 hover:text-ink"
              >
                {l.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-coral-500 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
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

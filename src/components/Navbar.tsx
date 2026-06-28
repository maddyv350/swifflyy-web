import { useEffect, useState } from 'react';
import { site } from '../config/site';
import { Wordmark } from './Wordmark';

/** Fixed cream nav that gains a soft drop shadow once you scroll. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b-[1.5px] border-paper3 bg-paper px-6 py-[18px] transition-shadow duration-200 md:px-10"
      style={scrolled ? { boxShadow: '0 4px 24px rgba(31,29,27,0.06)' } : undefined}
      aria-label="Primary"
    >
      <a href="#top" aria-label={`${site.name} home`}>
        <Wordmark className="text-[34px]" />
      </a>

      <ul className="hidden items-center gap-8 md:flex">
        {site.navLinks.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="font-body text-[15px] font-medium text-muted no-underline transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <a href="#download" className="relative inline-flex">
        <span aria-hidden className="absolute rounded-xl bg-line/80" style={{ inset: '3px -3px -3px 3px' }} />
        <span className="relative cursor-pointer rounded-xl border-[1.5px] border-line bg-ink px-[22px] py-[11px] font-body text-[13px] font-bold uppercase tracking-[2px] text-paper transition-transform duration-100 hover:translate-x-px hover:-translate-y-px">
          Get the app
        </span>
      </a>
    </nav>
  );
}

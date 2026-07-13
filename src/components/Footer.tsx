import { useState } from 'react';
import { site, footer } from '../config/site';
import { Wordmark } from './Wordmark';
import { burstConfetti } from '../lib/confetti';

export function Footer() {
  const year = new Date().getFullYear();
  const [found, setFound] = useState(false);

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
            <Wordmark tone="dark" className="text-[38px]" />
            <p className="mt-5 text-[15px] leading-relaxed text-cream-50/55">{footer.tagline}</p>
            <p className="mt-4 -rotate-1 font-hand text-[18px] text-plum-300">
              made with ♥ in Bengaluru
            </p>
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
                      <a
                        href={l.href}
                        className="text-[14.5px] text-cream-50/65 no-underline transition-colors duration-200 hover:text-cream-50"
                      >
                        {l.label}
                      </a>
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
            <a
              href={`mailto:${site.email}`}
              className="text-[13px] text-cream-50/60 no-underline transition-colors duration-200 hover:text-cream-50/90"
            >
              {site.email}
            </a>
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

import { useState } from 'react';
import { site } from '../config/site';
import { burstConfetti } from '../lib/confetti';

export function Footer() {
  const year = new Date().getFullYear();
  const [found, setFound] = useState(false);

  const onSecretPin = (e: React.MouseEvent<HTMLButtonElement>) => {
    burstConfetti(e.currentTarget, 40);
    setFound(true);
  };

  return (
    <footer className="flex flex-wrap items-center justify-between gap-6 border-t-[1.5px] border-ink2 bg-ink px-6 py-12 md:px-10">
      <div className="font-hand text-[30px] font-bold tracking-[-0.5px] text-accent">{site.name}</div>

      <nav aria-label="Footer">
        <ul className="flex flex-wrap gap-7">
          {site.footerLinks.map((l) => (
            <li key={l}>
              <a
                href="#"
                className="font-body text-sm text-paper/40 no-underline transition-colors hover:text-paper/80"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2 font-body text-[13px] text-paper/25">
        {found ? (
          <span className="font-hand text-lg text-accent-soft">
            you found the secret pin ✦ good luck on your next match
          </span>
        ) : (
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
        )}
        {/* the secret pin — subtle, wiggles once in a while, pays off in confetti */}
        <button
          type="button"
          onClick={onSecretPin}
          aria-label="A mysterious little pin"
          className="secret-pin relative select-none text-[13px] opacity-30 transition-opacity hover:opacity-90"
        >
          📍
        </button>
      </div>
    </footer>
  );
}

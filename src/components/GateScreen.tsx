import { gate, social } from '../config/site';
import { Wordmark } from './Wordmark';
import { Underline } from './Underline';
import { DoodlePin } from './doodles';
import { InstagramIcon, LinkedInIcon } from './icons';

/**
 * The pre-launch teaser, shown *instead of* the site while the admin panel's
 * coming-soon gate is on. It names the brand and gives away nothing else.
 * CSS-only motion (no GSAP/Lenis): this screen must boot instantly and stay
 * feather-light. Copy lives in `gate` in config/site.ts; the tab title swap
 * is owned by Root in main.tsx.
 */
export function GateScreen() {
  const rise = (delay: number) => ({ animationDelay: `${delay}s` });

  return (
    <main className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-cream-50 px-6">
      {/* atmosphere: the hero's coral/plum mesh + paper dot grid, standing still-ish */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[12%] -top-[18%]">
          <div
            className="h-[440px] w-[440px] rounded-full opacity-60 blur-[90px] md:h-[46vw] md:w-[46vw] motion-safe:animate-mesh-drift"
            style={{
              background: 'radial-gradient(closest-side, rgb(var(--coral-300) / 0.7), transparent 72%)',
            }}
          />
        </div>
        <div className="absolute -bottom-[22%] -left-[14%]">
          <div
            className="h-[400px] w-[400px] rounded-full opacity-50 blur-[90px] md:h-[42vw] md:w-[42vw] motion-safe:animate-mesh-drift-2"
            style={{
              background: 'radial-gradient(closest-side, rgb(var(--plum-300) / 0.6), transparent 72%)',
            }}
          />
        </div>
        <div
          className="absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(var(--cream-400) / 0.55) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
      </div>

      <div className="relative flex flex-col items-center py-16 text-center">
        {/* a lone pin, quietly pinging — the one hint there's a *where* to this */}
        <span className="relative mb-7 motion-safe:animate-rise" style={rise(0)}>
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-[58%] rounded-full border-2 border-coral-500/50 motion-safe:animate-radar-ping"
          />
          <span className="block motion-safe:animate-pin-float">
            <DoodlePin size={38} className="text-coral-600" />
          </span>
        </span>

        <span className="eyebrow motion-safe:animate-rise" style={rise(0.1)}>
          {gate.eyebrow}
        </span>

        <h1 className="motion-safe:animate-rise" style={rise(0.2)}>
          <Wordmark className="text-[clamp(72px,14vw,150px)]" />
        </h1>

        <p
          className="mt-8 font-display text-[clamp(28px,4.6vw,48px)] font-semibold leading-tight tracking-[-0.02em] text-ink motion-safe:animate-rise"
          style={rise(0.35)}
        >
          {gate.line[0]}
          <em className="relative inline-block not-italic">
            <span className="italic text-coral-600">{gate.line[1]}</span>
            <Underline className="text-coral-500" />
          </em>
        </p>

        <p
          className="mt-8 -rotate-1 font-hand text-[22px] text-ink-3 motion-safe:animate-rise"
          style={rise(0.5)}
        >
          {gate.note}
        </p>

        <div
          className="mt-10 flex items-center gap-3 motion-safe:animate-rise"
          style={rise(0.65)}
        >
          <span className="font-hand text-[19px] text-ink-3">{gate.follow}</span>
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="chip transition-colors hover:border-ink/40 hover:text-ink"
            >
              {s.icon === 'instagram' ? <InstagramIcon size={15} /> : <LinkedInIcon size={15} />}
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

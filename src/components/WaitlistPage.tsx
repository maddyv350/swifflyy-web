import { site, social, waitlistPage, footer } from '../config/site';
import { Wordmark } from './Wordmark';
import { Underline } from './Underline';
import { WaitlistForm } from './WaitlistForm';
import { DoodlePin, DoodleArrow, DoodleSparkle } from './doodles';
import { InstagramIcon, LinkedInIcon, ArrowRightIcon } from './icons';

/**
 * The /waitlist page: "Swifflyy is dropping soon to Church Street" and the two
 * ways in — the thirty-second email signup (the same form as the landing
 * page, in its dark ticket card) or setting up the full profile today at
 * /join/ (the app's onboarding, running in the browser). Napkin look
 * throughout; CSS-only motion so it boots instantly.
 */
export function WaitlistPage() {
  const rise = (delay: number) => ({ animationDelay: `${delay}s` });
  const legal = footer.linkGroups.find((g) => g.title === 'Legal')?.links ?? [];

  return (
    <div className="flex min-h-[100svh] flex-col bg-cream-50 text-ink">
      {/* header */}
      <header className="wrap flex items-center justify-between py-5">
        <a href="/" aria-label="Swifflyy home" className="inline-block pb-1.5 no-underline">
          <Wordmark className="text-[30px]" />
        </a>
        <span className="chip -rotate-1 font-hand text-[16px] text-ink-2">
          <DoodlePin size={14} className="text-coral-600" />
          {waitlistPage.chip}
        </span>
      </header>

      <main className="flex-1">
        {/* hero */}
        <section className="grain relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-[10%] -top-[30%]">
              <div
                className="h-[380px] w-[380px] rounded-full opacity-60 blur-[90px] md:h-[40vw] md:w-[40vw] motion-safe:animate-mesh-drift"
                style={{ background: 'radial-gradient(closest-side, rgb(var(--coral-300) / 0.7), transparent 72%)' }}
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

          <div className="wrap relative pb-12 pt-10 text-center md:pb-16 md:pt-16">
            <span className="relative mb-6 inline-block motion-safe:animate-rise" style={rise(0)}>
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-[58%] rounded-full border-2 border-coral-500/50 motion-safe:animate-radar-ping"
              />
              <span className="block motion-safe:animate-pin-float">
                <DoodlePin size={34} className="text-coral-600" />
              </span>
            </span>

            <span className="eyebrow block motion-safe:animate-rise" style={rise(0.1)}>
              {waitlistPage.eyebrow}
            </span>

            <h1 className="title mx-auto max-w-[760px] motion-safe:animate-rise" style={rise(0.2)}>
              {waitlistPage.headline[0]}{' '}
              <em className="relative inline-block not-italic">
                <span className="italic text-coral-600">{waitlistPage.headline[1]}</span>
                <Underline className="text-coral-500" />
              </em>
            </h1>

            <p className="lede mx-auto text-center motion-safe:animate-rise" style={rise(0.3)}>
              {waitlistPage.sub}
            </p>
          </div>
        </section>

        {/* the two ways in */}
        <section className="wrap relative pb-20 md:pb-28">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* 01 — the quick way: the ticket card, same as the landing page */}
            <div
              id="waitlist"
              className="relative rounded-[26px] border-[1.5px] border-ink bg-plum-950 px-6 pb-8 pt-9 shadow-[5px_6px_0_rgb(var(--coral-500)/0.85)] motion-safe:animate-rise sm:px-8"
              style={rise(0.4)}
            >
              {/* glow + grain clipped to the card, so the stamp above can hang over the edge */}
              <div aria-hidden className="grain pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
                <div
                  className="absolute -top-[40%] left-1/2 h-[380px] w-[520px] -translate-x-1/2 opacity-50 blur-[100px]"
                  style={{ background: 'radial-gradient(closest-side, rgb(var(--coral-500) / 0.6), transparent 70%)' }}
                />
              </div>
              <span
                aria-hidden
                className="absolute -top-3.5 left-7 -rotate-3 rounded-md border-[1.5px] border-ink bg-cream-25 px-2.5 py-0.5 font-hand text-[17px] leading-tight text-ink shadow-stamp-sm"
              >
                {waitlistPage.quick.stamp}
              </span>
              <div className="relative">
                <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-plum-300">
                  {waitlistPage.quick.kicker}
                </span>
                <h2 className="mt-2 font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.02em] text-cream-50">
                  {waitlistPage.quick.title}
                </h2>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-plum-200">{waitlistPage.quick.body}</p>
                <div className="-mt-4">
                  <WaitlistForm />
                </div>
              </div>
            </div>

            {/* 02 — the head start: set up the whole profile at /join/ */}
            <div
              className="card-stamp relative px-6 pb-8 pt-9 motion-safe:animate-rise sm:px-8"
              style={rise(0.5)}
            >
              <span
                aria-hidden
                className="absolute -top-3.5 left-7 -rotate-3 rounded-md border-[1.5px] border-ink bg-coral-500 px-2.5 py-0.5 font-hand text-[17px] leading-tight text-cream-25 shadow-stamp-sm"
              >
                {waitlistPage.full.stamp}
              </span>
              <span aria-hidden className="absolute -right-3 -top-4 hidden rotate-12 text-coral-500 md:block">
                <DoodleSparkle size={40} />
              </span>
              <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink-3">
                {waitlistPage.full.kicker}
              </span>
              <h2 className="mt-2 font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
                {waitlistPage.full.title}
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.6] text-ink-2">{waitlistPage.full.body}</p>

              <ul className="mt-6 flex flex-col gap-3">
                {waitlistPage.full.points.map((p, i) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] leading-[1.5] text-ink-2">
                    <span
                      aria-hidden
                      className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] font-body text-[12px] font-bold ${
                        i === 0
                          ? 'border-coral-600 bg-coral-600 text-cream-25'
                          : 'border-ink/25 bg-cream-25 text-ink-2'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <a href={waitlistPage.full.href} className="btn-primary mt-8 w-full sm:w-auto">
                {waitlistPage.full.cta}
                <ArrowRightIcon size={16} />
              </a>
              <p className="mt-4 -rotate-1 font-hand text-[18px] text-ink-3">{waitlistPage.full.note}</p>

              <span aria-hidden className="pointer-events-none absolute -bottom-6 right-6 hidden -rotate-[160deg] text-coral-400 md:block">
                <DoodleArrow size={54} />
              </span>
            </div>
          </div>

          <p className="mt-10 text-center font-hand text-[20px] text-ink-3">{waitlistPage.footnote}</p>
        </section>
      </main>

      <footer className="border-t border-ink/10">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-7 text-[13px] text-ink-3 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {site.name} · {footer.madeIn}
          </span>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legal.map((l) => (
              <a key={l.href} href={l.href} className="no-underline hover:text-ink">
                {l.label}
              </a>
            ))}
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} on ${s.label}`}
                className="text-ink-3 hover:text-ink"
              >
                {s.icon === 'instagram' ? <InstagramIcon size={16} /> : <LinkedInIcon size={16} />}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

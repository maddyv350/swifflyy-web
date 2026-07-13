import { safety } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { ShieldIcon, PinClockIcon, GpsCrossIcon, HandStopIcon } from './icons';

const ICONS = {
  verified: ShieldIcon,
  pin: PinClockIcon,
  spoof: GpsCrossIcon,
  control: HandStopIcon,
} as const;

/**
 * Safety & trust — a framed deep-plum panel. This section matters
 * disproportionately (especially for women in the Indian market), so it gets
 * its own grounded, serious moment.
 */
export function Safety({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate, stagger: 0.1 });

  return (
    <section id="safety" className="section-pad">
      <div className="wrap">
        <div className="grain relative overflow-hidden rounded-[36px] bg-plum-950 px-6 py-16 sm:px-12 md:py-20 lg:px-16">
          {/* warm glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[30%] left-1/2 h-[480px] w-[720px] -translate-x-1/2 opacity-45 blur-[100px]"
            style={{
              background: 'radial-gradient(closest-side, rgb(var(--coral-500) / 0.55), transparent 70%)',
            }}
          />

          <div ref={ref} className="relative">
            <div data-reveal className="mx-auto max-w-[640px] text-center">
              <span className="eyebrow-on-dark">{safety.eyebrow}</span>
              <h2 className="title-on-dark">{safety.title}</h2>
              <p className="lede mx-auto text-center !text-plum-200">{safety.sub}</p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {safety.points.map((p) => {
                const Icon = ICONS[p.k as keyof typeof ICONS];
                return (
                  <article
                    key={p.k}
                    data-reveal
                    className="group rounded-3xl border border-cream-50/10 bg-cream-50/[0.04] p-7 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-coral-400/40 sm:p-8"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cream-50/10 bg-cream-50/[0.06] text-coral-300 transition-colors duration-300 group-hover:text-coral-200">
                      <Icon size={24} />
                    </span>
                    <h3 className="font-display mt-5 text-[22px] font-semibold tracking-[-0.01em] text-cream-50">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-[15.5px] leading-[1.65] text-plum-200">{p.body}</p>
                  </article>
                );
              })}
            </div>

            <p
              data-reveal
              className="mt-10 rotate-[-1deg] text-center font-hand text-[22px] text-coral-300"
            >
              built for the person who reads this section first ✦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

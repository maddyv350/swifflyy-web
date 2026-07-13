import { useReveal } from '../hooks/useReveal';
import { WaitlistForm } from './WaitlistForm';

/** The conversion moment: a deep-plum room with a warm coral glow. */
export function FinalCTA({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate });

  return (
    <section id="waitlist" className="grain relative overflow-hidden bg-plum-950">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[35%] left-1/2 h-[560px] w-[880px] -translate-x-1/2 opacity-50 blur-[110px] motion-safe:animate-mesh-drift"
          style={{
            background: 'radial-gradient(closest-side, rgb(var(--coral-500) / 0.6), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-[30%] -right-[10%] h-[420px] w-[420px] opacity-40 blur-[100px] motion-safe:animate-mesh-drift-2"
          style={{
            background: 'radial-gradient(closest-side, rgb(var(--plum-600) / 0.8), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_55%_at_50%_45%,#000,transparent)]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(var(--cream-50) / 0.12) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
      </div>

      <div ref={ref} className="wrap relative py-24 text-center md:py-36">
        <span data-reveal className="eyebrow-on-dark text-[24px]">
          early access ✦
        </span>
        <h2
          data-reveal
          className="font-display mx-auto max-w-[820px] text-[clamp(40px,6.5vw,84px)] font-semibold leading-[1.0] tracking-[-0.025em] text-cream-50"
        >
          Be first in <em className="italic text-coral-300">your city.</em>
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-[520px] text-lg leading-[1.65] text-plum-200">
          Join the list with your city. When Swifflyy lands in your neighbourhood, you — and the
          friends you bring — walk in first.
        </p>

        <div data-reveal>
          <WaitlistForm />
        </div>

        <p data-reveal className="mt-8 font-hand text-[19px] text-plum-300">
          one email when we land in your city — no spam, ever ✦
        </p>
      </div>
    </section>
  );
}

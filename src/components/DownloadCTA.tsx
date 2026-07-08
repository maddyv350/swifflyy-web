import { Wordmark } from './Wordmark';
import { WaitlistForm } from './WaitlistForm';

/** Dark ink call-to-action with the big wordmark and early-access signup. */
export function DownloadCTA() {
  return (
    <section id="waitlist" className="relative overflow-hidden bg-ink px-6 py-[120px] text-center md:px-10">
      {/* faint dot grid on the dark field */}
      <div
        className="dot-grid pointer-events-none absolute inset-0"
        style={{ '--dot': 'rgba(251,248,241,0.06)' } as React.CSSProperties}
        aria-hidden
      />
      {/* soft doodle smudges */}
      <svg className="pointer-events-none absolute left-14 top-8 opacity-[0.08]" width="180" height="120" viewBox="0 0 180 120" fill="none" aria-hidden>
        <path d="M10 60 C 50 20, 130 100, 170 60" stroke="#fbf8f1" strokeWidth="40" strokeLinecap="round" />
      </svg>
      <svg className="pointer-events-none absolute bottom-8 right-14 opacity-[0.08]" width="180" height="120" viewBox="0 0 180 120" fill="none" aria-hidden>
        <path d="M10 60 C 50 20, 130 100, 170 60" stroke="#fbf8f1" strokeWidth="40" strokeLinecap="round" />
      </svg>

      <div className="relative z-[1] mx-auto max-w-2xl">
        <Wordmark className="text-[64px] md:text-[80px]" />

        <h2 className="mt-7 font-head text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.1] tracking-[-2px] text-paper">
          Be first when
          <br />
          we launch.
        </h2>
        <p className="mt-4 font-body text-lg leading-[1.55] text-paper/55">
          Swifflyy is launching soon, city by city. Join the early-access list and you’ll be the
          first to drop a pin the moment it goes live near you.
        </p>

        <WaitlistForm />

        <div className="mt-5 inline-block -rotate-1 font-hand text-xl text-paper/35">
          no spam · unsubscribe anytime ✦
        </div>
      </div>
    </section>
  );
}

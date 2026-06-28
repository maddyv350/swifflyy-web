import { Wordmark } from './Wordmark';
import { AppleIcon, PlayIcon } from './icons';

/** Dark ink call-to-action with the big wordmark and app-store buttons. */
export function DownloadCTA() {
  return (
    <section id="download" className="relative overflow-hidden bg-ink px-6 py-[120px] text-center md:px-10">
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
          Drop your first pin
          <br />
          today. It’s free.
        </h2>
        <p className="mt-4 font-body text-lg leading-[1.55] text-paper/55">
          Join the people already finding connection in the places they actually love. No algorithm.
          Just proximity.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="#" className="btn-stack" aria-label="Download on the App Store">
            <span className="btn-stack-shadow bg-accent/60" />
            <span className="btn-coral !px-10 !py-5">
              <AppleIcon />
              App Store
            </span>
          </a>
          <a
            href="#"
            aria-label="Get it on Google Play"
            className="inline-flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-paper/25 px-9 py-5 font-body text-[15px] font-semibold text-paper/70 no-underline transition-colors hover:border-paper/60 hover:text-paper"
          >
            <PlayIcon />
            Google Play
          </a>
        </div>

        <div className="mt-5 inline-block -rotate-1 font-hand text-xl text-paper/35">
          no credit card · drop a pin in 30 seconds ✦
        </div>
      </div>
    </section>
  );
}

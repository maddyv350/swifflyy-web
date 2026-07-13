import { marquee } from '../config/site';

/** A tilted plum ribbon of one-liners scrolling across the page. */
export function Marquee() {
  const Track = ({ hidden }: { hidden?: boolean }) => (
    <div className="marquee-track" aria-hidden={hidden}>
      {marquee.map((m) => (
        <span
          key={m}
          className="flex items-center gap-6 pr-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-cream-50"
        >
          {m}
          <span className="text-coral-400" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section aria-label="Swifflyy in seven lines" className="relative -my-2 overflow-hidden py-8">
      <div className="marquee -mx-4 -rotate-[1.2deg] bg-plum-950 py-4">
        <Track />
        <Track hidden />
        <Track hidden />
      </div>
    </section>
  );
}

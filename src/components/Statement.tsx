import { WordCycler } from './WordCycler';
import { cyclerWords } from '../config/site';

/** A big, Bumble-bold statement on the dark field with a cycling interest word. */
export function Statement({ animate }: { animate: boolean }) {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-[120px] text-center md:px-10">
      <div
        className="dot-grid pointer-events-none absolute inset-0"
        style={{ '--dot': 'rgba(251,248,241,0.06)' } as React.CSSProperties}
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-4xl">
        <span className="inline-block -rotate-1 font-hand text-2xl text-accent">the whole point ✦</span>
        <h2 className="mt-4 font-head text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.05] tracking-[-2px] text-paper">
          Meet people who are
          <br />
          actually into{' '}
          <WordCycler words={cyclerWords} animate={animate} className="font-head" />.
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-body text-lg text-paper/60">
          Not your algorithm’s idea of a match — the person two streets over who loves the same
          weird, specific things you do.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-5 py-2 font-body text-sm font-medium text-paper/70">
          🗑️ designed to get you offline — fast
        </div>
      </div>
    </section>
  );
}

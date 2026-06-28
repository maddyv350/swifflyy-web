import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { vibes } from '../config/site';

/** Playful interest picker — tap chips to build "your vibe"; copy reacts to the
 *  count. Purely for delight (and to show how prompt-first discovery feels). */
export function VibePicker({ animate }: { animate: boolean }) {
  const ref = useReveal<HTMLDivElement>({ enabled: animate });
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const toggle = (v: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  };

  const n = picked.size;
  const message =
    n === 0
      ? 'tap a few — we’ll find your people'
      : n < 3
        ? `nice. ${n} down, keep going ✦`
        : n < 6
          ? `now we’re talking — ${n} vibes locked in`
          : `${n}?! you contain multitudes 🤝`;

  return (
    <section className="bg-paper2 py-[100px]">
      <div ref={ref} className="section !py-0 text-center">
        <span data-reveal className="section-label">
          your vibe
        </span>
        <h2 data-reveal className="section-title mx-auto">
          What are you <span className="text-accent">into</span>?
        </h2>
        <p data-reveal className="section-sub mx-auto">
          This is the energy your profile leads with — interests first, selfies later.
        </p>

        <div data-reveal className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {vibes.map((v) => {
            const on = picked.has(v);
            return (
              <button
                key={v}
                onClick={() => toggle(v)}
                aria-pressed={on}
                className={`rounded-full border-[1.5px] px-4 py-2.5 font-body text-[15px] font-medium transition-all duration-150 ${
                  on
                    ? 'border-accent bg-accent text-paper shadow-sketch-sm -translate-y-0.5'
                    : 'border-line bg-paper text-ink hover:-translate-y-0.5 hover:bg-paper2'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>

        <div data-reveal className="mt-8 font-hand text-2xl text-accent">{message}</div>
      </div>
    </section>
  );
}

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReveal } from '../hooks/useReveal';
import { vibes } from '../config/site';
import { burstConfetti } from '../lib/confetti';

/** Playful interest picker — tap chips to build "your vibe"; copy reacts to the
 *  count. Chips pop confetti when picked; hitting 5 earns a bigger burst.
 *  Purely for delight (and to show how prompt-first discovery feels). */
export function VibePicker({ animate }: { animate: boolean }) {
  const ref = useReveal<HTMLDivElement>({ enabled: animate });
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const msgRef = useRef<HTMLDivElement>(null);

  const toggle = (v: string, btn: HTMLButtonElement) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(v)) {
        next.delete(v);
      } else {
        next.add(v);
        burstConfetti(btn, 10);
        if (animate) {
          gsap.fromTo(btn, { scale: 0.85, rotation: -4 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
        }
        if (next.size === 5 && msgRef.current) burstConfetti(msgRef.current, 28);
      }
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
                onClick={(e) => toggle(v, e.currentTarget)}
                aria-pressed={on}
                className={`relative rounded-full border-[1.5px] px-4 py-2.5 font-body text-[15px] font-medium transition-all duration-150 ${
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

        <div ref={msgRef} data-reveal className="relative mt-8 font-hand text-2xl text-accent">
          {message}
        </div>
      </div>
    </section>
  );
}

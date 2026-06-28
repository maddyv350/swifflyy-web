import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { features } from '../config/site';

/** A flip card: hover (desktop) or tap (touch) to reveal the playful back. */
function FeatureCard({ icon, title, body, back }: (typeof features)[number]) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div data-reveal className="flip h-[240px]" onClick={() => setFlipped((f) => !f)}>
      <div className={`flip-inner ${flipped ? 'is-flipped' : ''}`}>
        {/* front */}
        <div className="flip-face bg-paper shadow-sketch">
          <div className="mb-auto flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border-[1.5px] border-dashed border-faint bg-paper2 text-2xl">
            {icon}
          </div>
          <h3 className="mt-4 font-head text-xl font-bold tracking-[-0.3px] text-ink">{title}</h3>
          <p className="mt-2 font-body text-[15px] leading-[1.55] text-muted">{body}</p>
          <span className="mt-3 font-hand text-base text-accent">flip me ↺</span>
        </div>
        {/* back */}
        <div className="flip-face flip-back bg-ink shadow-sketch">
          <div className="text-3xl">{icon}</div>
          <p className="mt-auto font-head text-xl font-bold leading-snug text-paper">{back}</p>
          <span className="mt-3 font-hand text-base text-accent">↺ flip back</span>
        </div>
      </div>
    </div>
  );
}

export function Features({ animate }: { animate: boolean }) {
  const ref = useReveal<HTMLDivElement>({ enabled: animate, stagger: 0.1 });

  return (
    <section id="features" className="bg-paper py-[100px]">
      <div ref={ref} className="section !py-0">
        <div>
          <span data-reveal className="section-label">
            features
          </span>
          <h2 data-reveal className="section-title">
            Built for how
            <br />
            people actually meet
          </h2>
          <p data-reveal className="section-sub">
            Tap a card to see why it matters. (Yes, they flip — we had fun building this.)
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { faqs } from '../config/site';

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div data-reveal className="sketch-card overflow-hidden !shadow-sketch-sm">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-head text-lg font-bold text-ink">{q}</span>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-line text-xl transition-transform duration-300 ${
            open ? 'rotate-45 bg-accent text-paper' : 'text-ink'
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div className={`faq-body ${open ? 'is-open' : ''}`}>
        <div>
          <p className="px-6 pb-5 font-body text-[15px] leading-[1.6] text-muted">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ({ animate }: { animate: boolean }) {
  const ref = useReveal<HTMLDivElement>({ enabled: animate, stagger: 0.08 });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-[100px]">
      <div ref={ref} className="section !py-0">
        <div className="text-center">
          <span data-reveal className="section-label">
            the fine print, made fun
          </span>
          <h2 data-reveal className="section-title mx-auto">
            Questions? <span className="text-accent">Same.</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-4">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

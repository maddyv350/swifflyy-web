import { useState } from 'react';
import { faqs } from '../config/site';
import { useReveal } from '../hooks/useReveal';

/** Accordion FAQ + FAQPage structured data (rendered from the same source). */
export function FAQ({ animate }: { animate: boolean }) {
  const [open, setOpen] = useState(0);
  const ref = useReveal({ enabled: animate, stagger: 0.07 });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section id="faq" className="section-pad bg-cream-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div ref={ref} className="wrap max-w-[780px]">
        <div data-reveal className="text-center">
          <span className="eyebrow">questions, answered</span>
          <h2 className="title">
            The things you’d <em className="italic text-coral-600">actually</em> ask.
          </h2>
        </div>

        <div className="mt-12">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-reveal className="border-b border-ink/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-body-${i}`}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-coral-700">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-300 ease-out ${
                        isOpen
                          ? 'rotate-45 border-coral-600 bg-coral-600 text-cream-25'
                          : 'border-ink/20 text-ink-2 group-hover:border-ink/50'
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div id={`faq-body-${i}`} className={`faq-body ${isOpen ? 'is-open' : ''}`}>
                  <div>
                    <p className="max-w-[640px] pb-6 text-[15.5px] leading-[1.7] text-ink-2">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

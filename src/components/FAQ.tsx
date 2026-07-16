import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faqs } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { Underline } from './Underline';

gsap.registerPlugin(ScrollTrigger);

interface FaqItemProps {
  q: string;
  a: string;
  index: number;
  isOpen: boolean;
  animate: boolean;
  onToggle: () => void;
}

/**
 * One accordion row. The indicator is a hand-drawn plus: on open, GSAP swings
 * the vertical stroke 90° into the horizontal one (fading it out) so the plus
 * collapses into a minus — no CSS toggle jumps. The open question also gets a
 * subtle coral underline that draws itself on and retracts on close. Both are
 * state indicators, so with animate=false they still update — instantly, via
 * gsap.set. Keyboard behaviour and ARIA wiring are unchanged.
 */
function FaqItem({ q, a, index, isOpen, animate, onToggle }: FaqItemProps) {
  const plusVRef = useRef<SVGPathElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const firstPlus = useRef(true);
  const firstUnderline = useRef(true);

  // Plus → minus: the vertical stroke swings into the horizontal one.
  useLayoutEffect(() => {
    const v = plusVRef.current;
    if (!v) return;
    const state = { rotation: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1, transformOrigin: '50% 50%' };
    if (firstPlus.current || !animate) {
      firstPlus.current = false;
      gsap.set(v, state);
      return;
    }
    gsap.to(v, {
      ...state,
      duration: 0.45,
      ease: isOpen ? 'back.out(2.2)' : 'back.out(1.6)',
      overwrite: 'auto',
    });
    return () => {
      gsap.killTweensOf(v);
    };
  }, [isOpen, animate]);

  // The open question's underline draws on (and un-draws on close).
  useLayoutEffect(() => {
    const path = underlineRef.current;
    if (!path) return;
    let len = 0;
    try {
      len = path.getTotalLength();
    } catch {
      return;
    }
    if (!Number.isFinite(len) || len <= 0) return;

    const target = isOpen ? 0 : len + 1;
    gsap.set(path, { strokeDasharray: len + 1 });
    if (firstUnderline.current || !animate) {
      firstUnderline.current = false;
      gsap.set(path, { strokeDashoffset: target });
      return;
    }
    gsap.to(path, {
      strokeDashoffset: target,
      duration: isOpen ? 0.55 : 0.28,
      ease: isOpen ? 'power2.inOut' : 'power2.in',
      overwrite: 'auto',
    });
    return () => {
      gsap.killTweensOf(path);
    };
  }, [isOpen, animate]);

  return (
    <>
      <h3>
        <button
          type="button"
          data-cursor="tap"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-body-${index}`}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="relative font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-coral-700">
            {q}
            {/* coral squiggle, drawn on while this question is open */}
            <svg
              className="pointer-events-none absolute -bottom-1.5 left-0 h-2.5 w-full text-coral-500/70"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                ref={underlineRef}
                d="M3 8 C 42 3, 98 11, 146 5 S 192 8.5, 197 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span
            aria-hidden
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300 ease-out ${
              isOpen
                ? 'border-coral-600 bg-coral-600 text-cream-25'
                : 'border-ink/20 text-ink-2 group-hover:border-ink/50'
            }`}
          >
            {/* hand-drawn plus — two wobbly strokes; GSAP owns the vertical one */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 12.3 C 9.5 11.7, 14.6 11.7, 19.7 12.1" />
              <path ref={plusVRef} d="M12.2 4.5 C 11.8 9.5, 11.8 14.6, 12.1 19.6" />
            </svg>
          </span>
        </button>
      </h3>
      <div id={`faq-body-${index}`} className={`faq-body ${isOpen ? 'is-open' : ''}`}>
        <div>
          <p className="max-w-[640px] pb-6 text-[15.5px] leading-[1.7] text-ink-2">{a}</p>
        </div>
      </div>
    </>
  );
}

/** Accordion FAQ + FAQPage structured data (rendered from the same source). */
export function FAQ({ animate }: { animate: boolean }) {
  const [open, setOpen] = useState(0);
  const ref = useReveal({ enabled: animate, stagger: 0.07 });
  const toggled = useRef(false);

  // Opening/closing an answer changes the document height (the 0.35s
  // grid-rows transition grows/shrinks the page by the answer's height), so
  // every ScrollTrigger below the FAQ — and the JourneyLine geometry, which
  // rebuilds on ScrollTrigger's 'refresh' — must be re-measured once the
  // transition settles.
  useEffect(() => {
    if (!toggled.current) {
      toggled.current = true; // skip the initial mount — nothing moved yet
      return;
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, [open]);

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
    <section id="faq" className="section-pad relative z-10 bg-cream-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div ref={ref} className="wrap max-w-[780px]">
        <div data-reveal className="text-center">
          <span className="eyebrow">questions, answered</span>
          <h2 className="title">
            The things you’d{' '}
            <span className="relative inline-block">
              <em className="italic text-coral-600">actually</em>
              <Underline className="text-coral-500" draw animate={animate} />
            </span>{' '}
            ask.
          </h2>
        </div>

        <div className="mt-12">
          {faqs.map((f, i) => (
            <div key={f.q} data-reveal className="border-b border-ink/10">
              <FaqItem
                q={f.q}
                a={f.a}
                index={i}
                isOpen={open === i}
                animate={animate}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

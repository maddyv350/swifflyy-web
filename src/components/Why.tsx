import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { why } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { useDrawOn } from '../hooks/useDrawOn';
import { Underline } from './Underline';
import { DoodleLayer, type DoodleLayerItem } from './DoodleLayer';
import { DoodleArrow, DoodleAsterisk, DoodleCircleScribble, DoodleSquiggle } from './doodles';

gsap.registerPlugin(ScrollTrigger);

/** lg-only margin offsets that cascade the four notes diagonally down the grid. */
const OFFSETS = [
  'lg:ml-[22%] lg:mt-0',
  'lg:ml-0 lg:-mt-6',
  'lg:ml-[30%] lg:mt-10',
  'lg:ml-[8%] lg:mt-10',
] as const;

/** Static sticker tilts — kept on the inner card so the slide-in wrapper can settle to 0. */
const TILTS = ['lg:-rotate-1', 'lg:rotate-1', 'lg:-rotate-[1.5deg]', 'lg:rotate-[0.75deg]'] as const;

/** Split the title around its first “quoted” word so that word can take the underline. */
function splitQuoted(title: string): { before: string; word: string; after: string } | null {
  const m = /“([^”]+)”/.exec(title);
  if (!m) return null;
  return {
    before: title.slice(0, m.index),
    word: m[1] ?? '',
    after: title.slice(m.index + m[0].length),
  };
}

/** Low-key margin scribbles drifting behind the section (lg+ only). */
const LAYER_ITEMS: DoodleLayerItem[] = [
  { node: <DoodleAsterisk size={30} className="text-plum-400/50" />, x: '2.5%', y: '9%', depth: 0.7, rotate: -10 },
  { node: <DoodleSquiggle size={72} className="text-coral-400/40" />, x: '88%', y: '15%', depth: 0.45, rotate: 6 },
  { node: <DoodleArrow size={44} className="text-coral-500/40" />, x: '34%', y: '62%', depth: 0.3, rotate: -14 },
];

interface WhyPointProps {
  index: number;
  title: string;
  body: string;
  animate: boolean;
}

/**
 * One differentiation point, set as a hand-annotated margin note. The parent
 * slides the wrapper in (via [data-why-card]); this component owns the
 * circle-scribble the pen draws around its index numeral on scroll-in.
 */
function WhyPoint({ index, title, body, animate }: WhyPointProps) {
  // Fires a touch later than the slide-in (72% vs 86%), so the pen circles the
  // number after the note has settled — with animate=false nothing is hidden.
  const drawRef = useDrawOn<HTMLDivElement>({ enabled: animate, start: 'top 72%', duration: 0.85 });
  const coral = index === 2;

  return (
    <div
      ref={drawRef}
      data-why-card
      className={`max-w-[460px] will-change-transform ${OFFSETS[index] ?? ''}`}
    >
      <article
        className={`relative rounded-3xl p-7 transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-0 sm:p-8 ${
          TILTS[index] ?? ''
        } ${
          coral
            ? 'bg-coral-600 text-cream-25 shadow-lift-lg'
            : 'border border-ink/10 bg-cream-25 shadow-lift'
        }`}
      >
        <span
          aria-hidden
          className={`font-display absolute -top-5 ${index % 2 ? '-right-2' : '-left-2'} text-[64px] font-semibold italic leading-none ${
            coral ? 'text-cream-25/25' : 'text-coral-500/25'
          }`}
        >
          <span className="relative inline-block">
            {String(index + 1).padStart(2, '0')}
            <DoodleCircleScribble
              className={`absolute -left-3 -top-1.5 h-[calc(100%+12px)] w-[calc(100%+24px)] ${
                coral ? 'text-cream-25/50' : 'text-coral-500/60'
              }`}
            />
          </span>
        </span>
        <h3
          className={`font-display text-[23px] font-semibold leading-snug tracking-[-0.01em] ${
            coral ? 'text-cream-25' : 'text-ink'
          }`}
        >
          {title}
        </h3>
        <p className={`mt-3 text-[15.5px] leading-[1.65] ${coral ? 'text-cream-25/85' : 'text-ink-2'}`}>
          {body}
        </p>
      </article>
    </div>
  );
}

/**
 * Differentiation, set asymmetrically — an editorial title block with four
 * offset "margin note" cards flowing diagonally down the grid. Each note
 * slides in from an alternating side with a slight rotation that settles to 0,
 * then the pen scribbles a circle around its index number. One card flips to
 * coral to break the rhythm.
 */
export function Why({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate, stagger: 0.12 });
  const cardsRef = useRef<HTMLDivElement>(null);
  const split = splitQuoted(why.title);

  // Margin notes slide in from alternating sides, over-rotated, and settle
  // flat (the static lg tilt lives on the inner article, untouched by GSAP).
  useLayoutEffect(() => {
    const root = cardsRef.current;
    if (!root || !animate) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-why-card]'));
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        gsap.set(card, { opacity: 0, x: fromLeft ? -64 : 64, rotation: fromLeft ? -3 : 3 });
        gsap.to(card, {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 86%' },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [animate]);

  return (
    <section id="why" className="section-pad relative z-10 overflow-hidden">
      {/* soft plum wash drifting in from the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] top-[10%] h-[520px] w-[520px] rounded-full opacity-40 blur-[100px]"
        style={{ background: 'radial-gradient(closest-side, rgb(var(--plum-200)), transparent 70%)' }}
      />

      {/* restrained hand-drawn marginalia, parallax-drifting behind the notes */}
      <DoodleLayer animate={animate} draw className="hidden lg:block" items={LAYER_ITEMS} />

      <div ref={ref} className="wrap relative lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* title block — hangs left, off the grid's center of gravity */}
        <div className="lg:col-span-5 lg:pt-10">
          <span data-reveal className="eyebrow">
            {why.eyebrow}
          </span>
          <h2 data-reveal className="title">
            {split ? (
              <>
                {split.before}
                {/* Quotes live inside a no-break span with the word so the
                    opening “ can never wrap onto its own line; the underline
                    still spans only the word itself. */}
                <span className="whitespace-nowrap">
                  {'“'}
                  <span className="relative inline-block">
                    {split.word}
                    <Underline className="text-coral-500" draw animate={animate} />
                  </span>
                  {'”'}
                </span>
                {split.after}
              </>
            ) : (
              why.title
            )}
          </h2>
          <p data-reveal className="lede">
            {why.sub}
          </p>
          <p data-reveal className="mt-6 -rotate-1 font-hand text-[21px] text-coral-600">
            same city ≠ nearby ✦
          </p>
        </div>

        {/* the four margin notes, cascading diagonally */}
        <div ref={cardsRef} className="mt-12 flex flex-col gap-8 lg:col-span-7 lg:mt-0 lg:block">
          {why.points.map((p, i) => (
            <WhyPoint key={p.title} index={i} title={p.title} body={p.body} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}

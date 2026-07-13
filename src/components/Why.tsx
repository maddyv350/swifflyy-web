import { why } from '../config/site';
import { useReveal } from '../hooks/useReveal';

/**
 * Differentiation, set asymmetrically — an editorial title block with four
 * offset cards flowing diagonally down the grid. One card flips to coral to
 * break the rhythm.
 */
export function Why({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate, stagger: 0.14 });

  return (
    <section id="why" className="section-pad relative overflow-hidden">
      {/* soft plum wash drifting in from the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] top-[10%] h-[520px] w-[520px] rounded-full opacity-40 blur-[100px]"
        style={{ background: 'radial-gradient(closest-side, rgb(var(--plum-200)), transparent 70%)' }}
      />

      <div ref={ref} className="wrap relative lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* title block — hangs left, off the grid's center of gravity */}
        <div data-reveal className="lg:col-span-5 lg:pt-10">
          <span className="eyebrow">{why.eyebrow}</span>
          <h2 className="title">{why.title}</h2>
          <p className="lede">{why.sub}</p>
          <p className="mt-6 -rotate-1 font-hand text-[21px] text-coral-600">
            same city ≠ nearby ✦
          </p>
        </div>

        {/* the four points, cascading diagonally */}
        <div className="mt-12 flex flex-col gap-8 lg:col-span-7 lg:mt-0 lg:block">
          {why.points.map((p, i) => {
            const coral = i === 2;
            const offsets = [
              'lg:ml-[22%] lg:mt-0',
              'lg:ml-0 lg:-mt-6',
              'lg:ml-[30%] lg:mt-10',
              'lg:ml-[8%] lg:mt-10',
            ];
            const tilts = ['lg:-rotate-1', 'lg:rotate-1', 'lg:-rotate-[1.5deg]', 'lg:rotate-[0.75deg]'];
            return (
              <article
                key={p.title}
                data-reveal
                className={`relative max-w-[460px] rounded-3xl p-7 transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-0 sm:p-8 ${
                  offsets[i]
                } ${tilts[i]} ${
                  coral
                    ? 'bg-coral-600 text-cream-25 shadow-lift-lg'
                    : 'border border-ink/10 bg-cream-25 shadow-lift'
                }`}
              >
                <span
                  aria-hidden
                  className={`font-display absolute -top-5 ${i % 2 ? '-right-2' : '-left-2'} text-[64px] font-semibold italic leading-none ${
                    coral ? 'text-cream-25/25' : 'text-coral-500/25'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className={`font-display text-[23px] font-semibold leading-snug tracking-[-0.01em] ${
                    coral ? 'text-cream-25' : 'text-ink'
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`mt-3 text-[15.5px] leading-[1.65] ${
                    coral ? 'text-cream-25/85' : 'text-ink-2'
                  }`}
                >
                  {p.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

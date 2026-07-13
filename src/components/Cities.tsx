import { cities } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { PinIcon, ArrowRightIcon } from './icons';

/**
 * Waitlist momentum, kept honest: no invented counters — just where we're
 * landing first and where the list can take us next.
 */
export function Cities({ animate }: { animate: boolean }) {
  const ref = useReveal({ enabled: animate });

  return (
    <section id="cities" className="section-pad relative overflow-hidden">
      <div ref={ref} className="wrap text-center">
        <span data-reveal className="eyebrow">
          {cities.eyebrow}
        </span>
        <h2 data-reveal className="title mx-auto max-w-[700px]">
          {cities.first} first.{' '}
          <em className="italic text-coral-600">Your city next.</em>
        </h2>
        <p data-reveal className="lede mx-auto text-center">
          {cities.sub}
        </p>

        <div data-reveal className="relative mx-auto mt-12 flex max-w-[760px] flex-wrap items-center justify-center gap-3">
          {/* the first drop */}
          <span className="relative">
            <span className="flex items-center gap-2 rounded-full bg-coral-600 py-3 pl-5 pr-6 text-[16px] font-bold text-cream-25 shadow-lift">
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute h-4 w-4 rounded-full bg-cream-25/40 motion-safe:animate-radar-ping"
                />
                <PinIcon size={15} />
              </span>
              {cities.first}
            </span>
            <span
              aria-hidden
              className="absolute -top-9 left-1/2 w-max -translate-x-1/2 -rotate-3 font-hand text-[19px] text-coral-600"
            >
              first drop ✦
            </span>
          </span>

          {cities.next.map((c) => (
            <span
              key={c}
              className="rounded-full border-[1.5px] border-dashed border-ink/25 px-5 py-3 text-[15px] font-semibold text-ink-2 transition-colors duration-200 hover:border-coral-500 hover:text-coral-700"
            >
              {c}
            </span>
          ))}
        </div>

        <div data-reveal className="mt-11">
          <a href="#waitlist" className="btn-ink group">
            {cities.cta}
            <ArrowRightIcon size={15} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

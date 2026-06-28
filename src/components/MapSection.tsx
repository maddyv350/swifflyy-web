import { useReveal } from '../hooks/useReveal';
import { mapBullets } from '../config/site';
import { CityMap } from './CityMap';

export function MapSection({ animate }: { animate: boolean }) {
  const ref = useReveal<HTMLDivElement>({ enabled: animate, stagger: 0.15 });

  return (
    <section className="overflow-hidden bg-paper2 pt-[100px]">
      <div ref={ref} className="section !pb-0">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-[60px]">
          {/* copy */}
          <div data-reveal>
            <span className="section-label">location-first</span>
            <h2 className="section-title">
              The city is
              <br />
              your matchmaker
            </h2>
            <p className="section-sub">
              Most apps forget where you are. Swifflyy puts place at the centre — because the coffee
              shop you love, the park you run through, the market you haunt every Sunday — those are
              who you are.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {mapBullets.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                  <span className="font-body text-base text-ink2">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* illustration — bottom edge bleeds into the section seam */}
          <div
            data-reveal
            className="mt-10 h-[420px] overflow-hidden rounded-t-[24px] border-[1.5px] border-b-0 border-line"
            style={{ boxShadow: '4px 4px 0 #2a2724' }}
          >
            <CityMap />
          </div>
        </div>
      </div>
    </section>
  );
}

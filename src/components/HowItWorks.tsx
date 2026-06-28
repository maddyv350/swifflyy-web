import { useReveal } from '../hooks/useReveal';
import { steps } from '../config/site';

export function HowItWorks({ animate }: { animate: boolean }) {
  const ref = useReveal<HTMLDivElement>({ enabled: animate, stagger: 0.12 });

  return (
    <section id="how" className="bg-paper2 py-[100px]">
      <div ref={ref} className="section !py-0">
        <div>
          <span data-reveal className="section-label">
            how it works
          </span>
          <h2 data-reveal className="section-title">
            Three steps to
            <br />a real connection
          </h2>
          <p data-reveal className="section-sub">
            Swifflyy works with the physical world. No endless swiping — just honest discovery based
            on where you actually are.
          </p>
        </div>

        <div className="mt-[60px] grid grid-cols-1 gap-7 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.num}
              data-reveal
              className="sketch-card flex flex-col gap-4 px-7 pb-8 pt-9 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <div className="font-hand text-[52px] font-bold leading-none text-accent">{s.num}</div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border-[1.5px] border-faint bg-paper2 text-[26px]">
                {s.icon}
              </div>
              <h3 className="font-head text-[22px] font-bold tracking-[-0.5px] text-ink">{s.title}</h3>
              <p className="font-body text-base leading-[1.55] text-muted">{s.body}</p>
              <div className="-rotate-1 font-hand text-[15px] text-faint">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

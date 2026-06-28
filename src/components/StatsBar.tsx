import { stats } from '../config/site';
import { useCountUp } from '../hooks/useCountUp';

/** Parses "2.4M+" → counts the number up, keeps the suffix ("M+", "%", "★"). */
function AnimatedStat({ value, label, animate }: { value: string; label: string; animate: boolean }) {
  const m = value.match(/^([\d.]+)(.*)$/);
  const numStr = m ? m[1] : value;
  const suffix = m ? m[2] : '';
  const decimals = (numStr.split('.')[1] || '').length;
  const target = parseFloat(numStr) || 0;
  const { ref, value: current } = useCountUp(target, animate);

  return (
    <div className="text-center">
      <div className="font-head text-[32px] font-extrabold tracking-[-1.5px] text-ink">
        <span ref={ref}>{current.toFixed(decimals)}</span>
        {suffix}
      </div>
      <div className="mt-0.5 font-hand text-base text-muted">{label}</div>
    </div>
  );
}

export function StatsBar({ animate }: { animate: boolean }) {
  return (
    <div className="border-y-[1.5px] border-paper3 bg-paper2">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6 py-6 md:px-10">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-12">
            {i > 0 && <div className="hidden h-9 w-px bg-paper3 sm:block" />}
            <AnimatedStat value={s.value} label={s.label} animate={animate} />
          </div>
        ))}
      </div>
    </div>
  );
}

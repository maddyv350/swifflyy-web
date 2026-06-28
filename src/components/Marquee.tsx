import { marquee } from '../config/site';

/** An infinite scrolling statement band (pauses on hover). Two copies of the
 *  track sit side by side so the loop is seamless. */
export function Marquee() {
  const Item = ({ text }: { text: string }) => (
    <span className="flex items-center gap-6">
      <span className="font-head text-2xl font-extrabold uppercase tracking-tight text-paper md:text-3xl">
        {text}
      </span>
      <span className="text-2xl text-accent md:text-3xl">✦</span>
    </span>
  );

  const Track = () => (
    <div className="marquee-track" aria-hidden>
      {marquee.map((m) => (
        <Item key={m} text={m} />
      ))}
    </div>
  );

  return (
    <div className="border-y-[1.5px] border-line bg-ink py-5">
      <div className="marquee">
        <Track />
        <Track />
      </div>
    </div>
  );
}

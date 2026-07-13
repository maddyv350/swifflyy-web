import { useEffect, useRef, useState } from 'react';
import { steps } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { Avatar } from './ui';
import { PinSolid, PinIcon, HeartIcon, XMarkIcon, VerifiedIcon } from './icons';

/**
 * The site's signature moment: on desktop a phone stays pinned while the app
 * story plays through it — pin drops → nearby deck → match chat — advancing
 * with the steps you scroll past. On mobile each step carries its own screen.
 * All transitions are transform/opacity only.
 */
export function HowItWorks({ animate }: { animate: boolean }) {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const headRef = useReveal({ enabled: animate });

  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    blocks.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <section id="how" className="section-pad relative overflow-hidden">
      <div ref={headRef} className="wrap">
        <div data-reveal className="max-w-[640px]">
          <span className="eyebrow">how it works</span>
          <h2 className="title">
            Pin. People.{' '}
            <em className="italic text-coral-600">Plans.</em>
          </h2>
          <p className="lede">
            No personality quizzes, no 40-km “nearby”. Three steps between opening the app and
            actually meeting someone.
          </p>
        </div>
      </div>

      <div className="wrap mt-8 lg:mt-4 lg:grid lg:grid-cols-2 lg:gap-16">
        {/* steps rail */}
        <div ref={stepsRef} className="relative">
          <span
            aria-hidden
            className="absolute bottom-24 left-[27px] top-10 hidden w-px border-l-[1.5px] border-dashed border-ink/20 lg:block"
          />
          {steps.map((s, i) => (
            <div
              key={s.num}
              data-step={i}
              className="relative flex flex-col justify-center py-14 lg:min-h-[72vh] lg:py-0"
            >
              <div className="flex items-start gap-6">
                <span
                  className={`font-display z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[19px] font-semibold transition-colors duration-300 ${
                    active >= i
                      ? 'border-coral-600 bg-coral-600 text-cream-25'
                      : 'border-ink/20 bg-cream-50 text-ink-3'
                  }`}
                >
                  {s.num}
                </span>
                <div>
                  <h3 className="font-display text-[clamp(26px,2.6vw,34px)] font-semibold leading-tight tracking-[-0.01em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[420px] text-[16.5px] leading-[1.65] text-ink-2">
                    {s.body}
                  </p>
                  <p className="mt-3 -rotate-1 font-hand text-[19px] text-coral-600">
                    {s.note} ✦
                  </p>
                </div>
              </div>

              {/* mobile: this step's screen */}
              <div className="mt-8 flex justify-center lg:hidden">
                <PhoneFrame small>
                  {i === 0 && <MapScreen active />}
                  {i === 1 && <DeckScreen active />}
                  {i === 2 && <ChatScreen active />}
                </PhoneFrame>
              </div>
            </div>
          ))}
        </div>

        {/* pinned phone (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6">
            <PhoneFrame>
              <Screen show={active === 0}>
                <MapScreen active={active === 0} />
              </Screen>
              <Screen show={active === 1}>
                <DeckScreen active={active === 1} />
              </Screen>
              <Screen show={active === 2}>
                <ChatScreen active={active === 2} />
              </Screen>
            </PhoneFrame>
            <div className="flex items-center gap-2" aria-hidden>
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ease-out ${
                    active === i ? 'w-7 bg-coral-600' : 'w-2 bg-ink/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Phone chrome ───────────────────────────────────────────────────────── */

function PhoneFrame({ children, small = false }: { children: React.ReactNode; small?: boolean }) {
  return (
    <div
      className={`relative shrink-0 rounded-[44px] bg-plum-950 p-[10px] shadow-lift-lg ${
        small ? 'h-[540px] w-[266px]' : 'h-[600px] w-[296px]'
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-cream-50">
        {children}
        {/* punch-hole camera */}
        <span
          aria-hidden
          className="absolute left-1/2 top-2.5 z-30 h-[18px] w-[64px] -translate-x-1/2 rounded-full bg-plum-950"
        />
      </div>
    </div>
  );
}

/** Crossfade wrapper for the pinned phone's screens. */
function Screen({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 transition-[opacity,transform] duration-500 ease-out"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.985)',
        pointerEvents: 'none',
      }}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold text-ink-3">
      <span className="tabular-nums">10:24</span>
      <span className="flex items-center gap-1" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
        <span className="h-2.5 w-4 rounded-[3px] border border-ink/30" />
      </span>
    </div>
  );
}

/* ── Screen 1: drop a pin ───────────────────────────────────────────────── */

function MapScreen({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <div className="px-5 pb-2 pt-2">
        <span className="font-hand text-[20px] leading-none text-coral-600">drop your pin</span>
      </div>
      {/* the map */}
      <div className="relative mx-4 flex-1 overflow-hidden rounded-2xl border-[1.5px] border-ink/15 bg-cream-100">
        {/* hand-drawn streets */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 240 380" fill="none" aria-hidden>
          <path d="M-10 90 C 60 82, 150 100, 250 88" stroke="rgb(36 21 33 / 0.14)" strokeWidth="10" />
          <path d="M-10 210 C 80 200, 170 224, 250 210" stroke="rgb(36 21 33 / 0.14)" strokeWidth="8" />
          <path d="M-10 320 C 70 314, 160 330, 250 318" stroke="rgb(36 21 33 / 0.10)" strokeWidth="7" />
          <path d="M70 -10 C 64 120, 80 260, 66 390" stroke="rgb(36 21 33 / 0.12)" strokeWidth="8" />
          <path d="M175 -10 C 168 110, 186 270, 172 390" stroke="rgb(36 21 33 / 0.10)" strokeWidth="7" />
          {/* the park */}
          <ellipse cx="180" cy="300" rx="52" ry="38" fill="rgb(var(--cream-200))" stroke="rgb(36 21 33 / 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        {/* discovery radius */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[46%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-coral-500/60 transition-transform duration-700 ease-out"
          style={{ transform: `translate(-50%,-50%) scale(${active ? 1 : 0.4})`, opacity: active ? 1 : 0 }}
        />
        {/* radar ping */}
        {active && (
          <span
            aria-hidden
            className="absolute left-1/2 top-[46%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-coral-500/50 motion-safe:animate-radar-ping"
          />
        )}

        {/* the pin, dropping in */}
        <span
          className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-full text-coral-500 transition-all duration-500 ease-spring"
          style={{
            transform: `translate(-50%, ${active ? '-100%' : '-260%'})`,
            opacity: active ? 1 : 0,
          }}
        >
          <PinSolid size={34} />
        </span>

        {/* neighbours fading in around the pin */}
        {[
          { left: '24%', top: '30%', name: 'Sara', tone: 2, d: '200' },
          { left: '70%', top: '36%', name: 'Arjun', tone: 1, d: '450' },
          { left: '62%', top: '66%', name: 'Meera', tone: 3, d: '650' },
        ].map((p, i) => (
          <span
            key={p.name}
            className="absolute transition-all duration-500 ease-out"
            style={{
              left: p.left,
              top: p.top,
              opacity: active ? 1 : 0,
              transform: active ? 'scale(1)' : 'scale(0.5)',
              transitionDelay: `${450 + i * 180}ms`,
            }}
          >
            <Avatar name={p.name} tone={p.tone} size={30} />
          </span>
        ))}
      </div>

      {/* bottom card */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between rounded-2xl border-[1.5px] border-ink bg-cream-25 px-4 py-3 shadow-stamp-sm">
          <span>
            <span className="block text-[13px] font-bold text-ink">Pin dropped · Koramangala</span>
            <span className="block text-[11.5px] text-ink-3">only visible while it’s live</span>
          </span>
          <span className="rounded-full bg-coral-100 px-2.5 py-1 text-[11px] font-bold tabular-nums text-coral-700">
            lifts in 59:40
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Screen 2: the nearby deck ──────────────────────────────────────────── */

function DeckScreen({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <div className="flex items-center justify-between px-5 pb-2 pt-2">
        <span className="font-hand text-[20px] leading-none text-coral-600">nearby</span>
        <span className="chip !py-1 !text-[11px]">
          <PinIcon size={11} className="text-coral-600" /> 400 m radius
        </span>
      </div>

      <div className="relative flex-1 px-4">
        {/* back cards */}
        <div
          aria-hidden
          className="absolute inset-x-7 top-3 h-full rounded-3xl border-[1.5px] border-ink/10 bg-cream-100 transition-transform duration-500 ease-out"
          style={{ transform: active ? 'rotate(3deg)' : 'rotate(0deg)' }}
        />
        {/* top profile card */}
        <div
          className="relative flex h-[92%] flex-col overflow-hidden rounded-3xl border-[1.5px] border-ink bg-cream-25 shadow-stamp transition-all duration-500 ease-spring"
          style={{
            transform: active ? 'rotate(-1.5deg) scale(1)' : 'rotate(0deg) scale(0.94)',
          }}
        >
          <div className="relative flex h-[46%] items-center justify-center bg-gradient-to-br from-coral-100 to-plum-100">
            <Avatar name="Sara" tone={2} size={84} />
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-cream-25/90 px-2.5 py-1 text-[10.5px] font-bold text-coral-700">
              <PinIcon size={10} /> 200 m · HSR Layout
            </span>
          </div>
          <div className="flex flex-1 flex-col px-4 py-3">
            <span className="flex items-center gap-1.5 font-display text-[19px] font-semibold text-ink">
              Sara, 24 <VerifiedIcon size={15} className="text-coral-500" />
            </span>
            <span className="mt-1.5 font-hand text-[16px] leading-tight text-ink-3">
              the way to my heart
            </span>
            <span className="text-[13px] font-medium leading-snug text-ink-2">
              “rec me a book i haven’t read yet”
            </span>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {['bookshops', 'art', 'chai'].map((t) => (
                <span key={t} className="rounded-full bg-cream-100 px-2.5 py-0.5 text-[10.5px] font-semibold text-ink-2">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* like / pass */}
      <div className="flex items-center justify-center gap-8 py-3.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink/25 bg-cream-25 text-ink">
          <XMarkIcon size={16} />
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-600 text-cream-25 shadow-lift">
          <HeartIcon size={17} />
        </span>
      </div>
    </div>
  );
}

/* ── Screen 3: match & chat ─────────────────────────────────────────────── */

function ChatScreen({ active }: { active: boolean }) {
  const bubbles = [
    { me: false, text: 'you’re the book person from the café list?' },
    { me: true, text: 'guilty. filter coffee, 20 mins?' },
    { me: false, text: 'walking over. blue kurta.' },
  ];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      {/* match header */}
      <div className="border-b-[1.5px] border-dashed border-ink/15 px-4 pb-3 pt-2 text-center">
        <span className="flex items-center justify-center">
          <Avatar name="You" tone={4} size={34} />
          <HeartIcon size={14} className="z-10 -mx-1 text-coral-500" />
          <Avatar name="Sara" tone={2} size={34} />
        </span>
        <span className="mt-1 block font-display text-[16px] font-semibold text-ink">You & Sara</span>
        <span className="mx-auto mt-1 flex w-fit items-center gap-1 rounded-full bg-cream-100 px-2.5 py-0.5 text-[10.5px] font-semibold text-ink-3">
          <PinIcon size={10} className="text-coral-600" /> matched 200 m apart · Cubbon Park
        </span>
      </div>

      {/* bubbles */}
      <div className="flex flex-1 flex-col justify-end gap-2 px-4 pb-3">
        {bubbles.map((b, i) => (
          <span
            key={b.text}
            className={`block max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] font-medium leading-snug transition-all duration-500 ease-out ${
              b.me
                ? 'self-end rounded-br-md bg-coral-600 text-cream-25'
                : 'self-start rounded-bl-md bg-cream-100 text-ink'
            }`}
            style={{
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(10px)',
              transitionDelay: `${250 + i * 260}ms`,
            }}
          >
            {b.text}
          </span>
        ))}
        <span
          className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-cream-100 px-3.5 py-2.5 transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0, transitionDelay: '1100ms' }}
          aria-hidden
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="h-1.5 w-1.5 rounded-full bg-ink/30 motion-safe:animate-blink"
              style={{ animationDelay: `${d * 0.2}s` }}
            />
          ))}
        </span>
      </div>

      {/* input bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between rounded-full border-[1.5px] border-ink/15 bg-cream-25 py-2 pl-4 pr-2">
          <span className="text-[12.5px] text-ink-3">say something nice…</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral-600 text-cream-25">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 12l16-7-6 16-2.5-6.5L4 12z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

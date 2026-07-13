import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { swipeProfiles } from '../config/site';
import { burstConfetti } from '../lib/confetti';
import { useReveal } from '../hooks/useReveal';
import { Avatar } from './ui';
import { PinIcon, HeartIcon, XMarkIcon, VerifiedIcon } from './icons';

type Profile = (typeof swipeProfiles)[number];
type Dir = 'left' | 'right';

const THRESHOLD = 110;

/**
 * A fully interactive Tinder-style deck you can actually drag. Swipe (or tap
 * the buttons) to like/pass; certain profiles trigger an "it's a match!"
 * burst. Drag is gsap-driven; vertical page scroll still works (pan-y).
 */
export function SwipeDeck({ animate }: { animate: boolean }) {
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [passes, setPasses] = useState(0);
  const [match, setMatch] = useState<Profile | null>(null);

  const headRef = useReveal({ enabled: animate });
  const topRef = useRef<HTMLDivElement | null>(null);
  const likeStamp = useRef<HTMLDivElement | null>(null);
  const nopeStamp = useRef<HTMLDivElement | null>(null);
  const burstHost = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, sx: 0, sy: 0, dx: 0, dy: 0 });
  const busy = useRef(false);

  const done = index >= swipeProfiles.length;

  const setStamps = (dx: number) => {
    gsap.set(likeStamp.current, { opacity: gsap.utils.clamp(0, 1, dx / 100) });
    gsap.set(nopeStamp.current, { opacity: gsap.utils.clamp(0, 1, -dx / 100) });
  };

  const advance = (dir: Dir) => {
    const profile = swipeProfiles[index];
    if (dir === 'right') {
      setLikes((l) => l + 1);
      if (profile.match) {
        setMatch(profile);
        if (burstHost.current) burstConfetti(burstHost.current);
      }
    } else {
      setPasses((p) => p + 1);
    }
    setIndex((i) => i + 1);
    busy.current = false;
  };

  const commit = (dir: Dir) => {
    if (busy.current || done) return;
    busy.current = true;
    const el = topRef.current;
    if (!el || !animate) {
      advance(dir);
      return;
    }
    gsap.to(el, {
      x: dir === 'right' ? 720 : -720,
      y: drag.current.dy,
      rotation: dir === 'right' ? 20 : -20,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => advance(dir),
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (busy.current) return;
    drag.current = { active: true, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.dx = e.clientX - d.sx;
    d.dy = e.clientY - d.sy;
    gsap.set(topRef.current, { x: d.dx, y: d.dy, rotation: d.dx * 0.05 });
    setStamps(d.dx);
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.dx > THRESHOLD) commit('right');
    else if (d.dx < -THRESHOLD) commit('left');
    else {
      gsap.to(topRef.current, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'elastic.out(1,0.5)' });
      gsap.to([likeStamp.current, nopeStamp.current], { opacity: 0, duration: 0.2 });
    }
  };

  const reset = () => {
    setIndex(0);
    setLikes(0);
    setPasses(0);
    setMatch(null);
  };

  const visible = swipeProfiles.slice(index, index + 3);

  return (
    <section id="try" className="section-pad relative overflow-hidden bg-cream-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(var(--cream-400) / 0.5) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="wrap relative">
        <div ref={headRef} className="text-center">
          <span data-reveal className="eyebrow">
            try it — no download
          </span>
          <h2 data-reveal className="title">
            Go on. <em className="italic text-coral-600">Swipe.</em>
          </h2>
          <p data-reveal className="lede mx-auto text-center">
            Drag a card, or tap the buttons. This is how discovery feels in the app — minus the
            part where these are real, verified people near you.
          </p>
        </div>

        <div className="relative mx-auto mt-14 flex w-full max-w-[350px] flex-col items-center">
          {/* confetti origin lives above the stack */}
          <div ref={burstHost} className="pointer-events-none absolute left-1/2 top-1/3 z-[60]" />

          {/* card stack */}
          <div data-no-pin className="relative h-[470px] w-full select-none" style={{ touchAction: 'pan-y' }}>
            {done ? (
              <div className="card-stamp flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral-100 text-coral-600">
                  <HeartIcon size={26} />
                </span>
                <h3 className="font-display text-2xl font-semibold text-ink">You’re all caught up</h3>
                <p className="text-[15px] leading-relaxed text-ink-2">
                  You liked {likes} and passed on {passes}. Drop a pin in the real app to see who’s
                  actually nearby.
                </p>
                <button onClick={reset} className="btn-ghost mt-1 !py-3 !text-[14px]">
                  ↺ Swipe again
                </button>
              </div>
            ) : (
              visible
                .map((p, posFromTop) => {
                  const isTop = posFromTop === 0;
                  return (
                    <ProfileCard
                      key={p.name}
                      profile={p}
                      tone={(index + posFromTop) % 5}
                      pos={posFromTop}
                      cardRef={isTop ? topRef : undefined}
                      likeStamp={isTop ? likeStamp : undefined}
                      nopeStamp={isTop ? nopeStamp : undefined}
                      onPointerDown={isTop ? onPointerDown : undefined}
                      onPointerMove={isTop ? onPointerMove : undefined}
                      onPointerUp={isTop ? onPointerUp : undefined}
                    />
                  );
                })
                .reverse() /* render back cards first for correct stacking */
            )}

            {/* It's a match overlay */}
            {match && (
              <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center gap-4 rounded-[26px] border-[1.5px] border-ink bg-cream-25/95 px-8 text-center backdrop-blur-sm">
                <span className="-rotate-2 font-hand text-4xl text-coral-600">it’s a match!</span>
                <span className="flex items-center">
                  <Avatar name="You" tone={4} size={52} />
                  <HeartIcon size={20} className="z-10 -mx-1.5 text-coral-500" />
                  <Avatar name={match.name} tone={2} size={52} />
                </span>
                <h3 className="font-display text-[22px] font-semibold leading-tight text-ink">
                  You &amp; {match.name} both said yes
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  In the app, a chat opens right here — starting with where you crossed paths.
                </p>
                <button onClick={() => setMatch(null)} className="btn-ink !py-3 !text-[13.5px]">
                  Keep swiping →
                </button>
              </div>
            )}
          </div>

          {/* controls */}
          {!done && (
            <div className="mt-8 flex items-center gap-6">
              <button
                onClick={() => commit('left')}
                aria-label="Pass"
                className="flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-ink/25 bg-cream-25 text-ink shadow-lift transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-95"
              >
                <XMarkIcon size={20} />
              </button>
              <span className="text-center font-hand text-xl text-ink-3">
                <span className="text-coral-700">{likes} liked</span> · {passes} passed
              </span>
              <button
                onClick={() => commit('right')}
                aria-label="Like"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-coral-600 text-cream-25 shadow-lift transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-95"
              >
                <HeartIcon size={22} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── A single profile card ──────────────────────────────────────────────── */
function ProfileCard({
  profile,
  tone,
  pos,
  cardRef,
  likeStamp,
  nopeStamp,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  profile: Profile;
  tone: number;
  pos: number;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  likeStamp?: React.RefObject<HTMLDivElement | null>;
  nopeStamp?: React.RefObject<HTMLDivElement | null>;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}) {
  const isTop = pos === 0;
  return (
    <div
      ref={cardRef as React.Ref<HTMLDivElement>}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="card-stamp absolute inset-0 flex flex-col overflow-hidden !rounded-[26px]"
      style={{
        zIndex: 30 - pos,
        transform: `translateY(${pos * 14}px) scale(${1 - pos * 0.05})`,
        cursor: isTop ? 'grab' : 'default',
        transition: isTop ? 'none' : 'transform 0.3s ease',
      }}
    >
      {/* like / nope stamps (top card only) */}
      {isTop && (
        <>
          <div
            ref={likeStamp as React.Ref<HTMLDivElement>}
            className="font-display pointer-events-none absolute left-5 top-6 z-20 -rotate-12 rounded-xl border-[3px] border-coral-600 px-3.5 py-1 text-2xl font-bold uppercase tracking-wide text-coral-600 opacity-0"
          >
            Liked
          </div>
          <div
            ref={nopeStamp as React.Ref<HTMLDivElement>}
            className="font-display pointer-events-none absolute right-5 top-6 z-20 rotate-12 rounded-xl border-[3px] border-ink px-3.5 py-1 text-2xl font-bold uppercase tracking-wide text-ink opacity-0"
          >
            Nope
          </div>
        </>
      )}

      {/* header */}
      <div className="relative flex h-[50%] items-center justify-center bg-gradient-to-br from-coral-100 via-cream-100 to-plum-100">
        <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-cream-25/90 px-2.5 py-1 text-[11px] font-bold text-coral-700">
          <PinIcon size={11} /> {profile.distance} · {profile.area}
        </span>
        <Avatar name={profile.name} tone={tone} size={116} className="shadow-lift" />
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 px-6 py-5">
        <span className="flex items-center gap-2 font-display text-[24px] font-semibold tracking-[-0.01em] text-ink">
          {profile.name}, {profile.age}
          <VerifiedIcon size={17} className="text-coral-500" />
        </span>
        <span>
          <span className="block font-hand text-[18px] text-ink-3">{profile.prompt}</span>
          <span className="block text-[15px] font-medium text-ink-2">“{profile.answer}”</span>
        </span>
        <span className="mt-auto flex flex-wrap gap-2">
          {profile.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-ink/10 bg-cream-100 px-3 py-1 text-xs font-semibold text-ink-2"
            >
              {t}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

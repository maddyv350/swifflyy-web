import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { swipeProfiles } from '../config/site';
import { burstConfetti } from '../lib/confetti';

type Profile = (typeof swipeProfiles)[number];
type Dir = 'left' | 'right';

const THRESHOLD = 110;

/**
 * A fully interactive Tinder-style deck you can actually drag. Swipe (or tap
 * the buttons) to like/pass; certain profiles trigger an "it's a match!" burst.
 * Drag is gsap-driven for buttery transforms; vertical page scroll still works
 * (touch-action: pan-y).
 */
export function SwipeDeck({ animate }: { animate: boolean }) {
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [passes, setPasses] = useState(0);
  const [match, setMatch] = useState<Profile | null>(null);

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
    <section id="try" className="bg-paper py-[100px]">
      <div className="section !py-0">
        <div className="text-center">
          <span className="section-label">try it — no download</span>
          <h2 className="section-title">
            Go on. <span className="text-accent">Swipe.</span>
          </h2>
          <p className="section-sub mx-auto">
            Drag a card, or tap the buttons. This is exactly how discovery feels in the app — minus
            the part where these are real people near you.
          </p>
        </div>

        <div className="relative mx-auto mt-14 flex w-full max-w-[360px] flex-col items-center">
          {/* confetti origin + match overlay live above the stack */}
          <div ref={burstHost} className="pointer-events-none absolute left-1/2 top-1/3 z-[60]" />

          {/* card stack */}
          <div className="relative h-[460px] w-full select-none" style={{ touchAction: 'pan-y' }}>
            {done ? (
              <div className="sketch-card flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="text-5xl">🎉</div>
                <h3 className="font-head text-2xl font-bold text-ink">You’re all caught up</h3>
                <p className="font-body text-muted">
                  You liked {likes} and passed on {passes}. Drop a pin in the real app to see who’s
                  actually nearby.
                </p>
                <button onClick={reset} className="btn-ghost mt-2 !py-3">
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
              <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center gap-4 rounded-[24px] border-[1.5px] border-line bg-paper/95 px-8 text-center backdrop-blur-sm">
                <div className="font-hand text-3xl text-accent">it’s a match!</div>
                <div className="flex items-center gap-3 text-4xl">
                  <span>🧑</span>
                  <span className="text-accent">♥</span>
                  <span>{match.avatar}</span>
                </div>
                <h3 className="font-head text-2xl font-extrabold text-ink">
                  You &amp; {match.name} both liked each other
                </h3>
                <p className="font-body text-sm text-muted">
                  In the app, a chat would open right here — starting with where you crossed paths.
                </p>
                <button onClick={() => setMatch(null)} className="btn-ink !py-3 !text-[13px]">
                  Keep swiping →
                </button>
              </div>
            )}
          </div>

          {/* controls */}
          {!done && (
            <div className="mt-8 flex items-center gap-5">
              <button
                onClick={() => commit('left')}
                aria-label="Pass"
                className="flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-line bg-paper text-2xl shadow-sketch-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                ✕
              </button>
              <div className="text-center font-hand text-lg text-muted">
                <span className="text-accent">♥ {likes}</span> · {passes} nope
              </div>
              <button
                onClick={() => commit('right')}
                aria-label="Like"
                className="flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-accent bg-accent text-2xl text-paper shadow-sketch-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                ♥
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
  pos,
  cardRef,
  likeStamp,
  nopeStamp,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  profile: Profile;
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
      className="sketch-card absolute inset-0 flex flex-col overflow-hidden rounded-[24px]"
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
            className="pointer-events-none absolute left-5 top-6 z-20 -rotate-12 rounded-lg border-[3px] border-accent px-3 py-1 font-head text-2xl font-extrabold uppercase tracking-wide text-accent opacity-0"
          >
            Liked
          </div>
          <div
            ref={nopeStamp as React.Ref<HTMLDivElement>}
            className="pointer-events-none absolute right-5 top-6 z-20 rotate-12 rounded-lg border-[3px] border-ink px-3 py-1 font-head text-2xl font-extrabold uppercase tracking-wide text-ink opacity-0"
          >
            Nope
          </div>
        </>
      )}

      {/* header: avatar over a sketchy dot-grid */}
      <div className="dot-grid relative flex h-[52%] items-center justify-center bg-paper2">
        <span className="absolute left-4 top-4 rounded-full border border-accent bg-accent-soft px-2.5 py-1 font-body text-[11px] font-semibold text-accent">
          📍 {profile.distance} · {profile.area}
        </span>
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-[1.5px] border-line bg-paper text-6xl shadow-sketch-sm">
          {profile.avatar}
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2.5 px-6 py-5">
        <div className="font-head text-2xl font-extrabold tracking-[-0.5px] text-ink">
          {profile.name}, {profile.age}
        </div>
        <div className="-mt-1">
          <div className="font-hand text-lg text-muted">{profile.prompt}</div>
          <div className="font-body text-[15px] font-medium text-ink2">“{profile.answer}”</div>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {profile.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border-[1.5px] border-paper3 bg-paper2 px-3 py-1 font-body text-xs font-medium text-ink2"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

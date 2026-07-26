import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { swipeProfiles, waitlist } from '../config/site';
import { burstConfetti } from '../lib/confetti';
import { useReveal } from '../hooks/useReveal';
import { useDrawOn } from '../hooks/useDrawOn';
import { Avatar } from './ui';
import { DoodleArrow, DoodleHeart, DoodleSquiggle } from './doodles';
import { PinIcon, HeartIcon, XMarkIcon, VerifiedIcon } from './icons';

gsap.registerPlugin(ScrollTrigger);

type Profile = (typeof swipeProfiles)[number];
type Dir = 'left' | 'right';

const THRESHOLD = 110;
/** Degrees of card rotation per px of horizontal drag. */
const ROT = 0.055;

/** Resting transform for a card at stack position 0 / 1 / 2. */
const slotFor = (pos: number) => ({ x: 0, y: pos * 14, scale: 1 - pos * 0.05, rotation: 0 });

/** Spawn points for the match-moment hearts (percentages of the stack box). */
const MATCH_HEARTS = [
  { x: '-6%', y: '72%', size: 26, cls: 'text-coral-500' },
  { x: '10%', y: '88%', size: 18, cls: 'text-coral-400' },
  { x: '38%', y: '94%', size: 22, cls: 'text-coral-300' },
  { x: '64%', y: '90%', size: 19, cls: 'text-coral-400' },
  { x: '88%', y: '84%', size: 24, cls: 'text-coral-500' },
  { x: '99%', y: '64%', size: 28, cls: 'text-coral-600' },
] as const;

type QuickFns = {
  x: ReturnType<typeof gsap.quickTo>;
  y: ReturnType<typeof gsap.quickTo>;
  r: ReturnType<typeof gsap.quickTo>;
  /** Depth: the card beneath scales toward its top slot while dragging. */
  bScale?: ReturnType<typeof gsap.quickTo>;
  bY?: ReturnType<typeof gsap.quickTo>;
};

/**
 * A fully interactive Tinder-style deck you can actually drag. Swipe (drag,
 * arrow keys, or the buttons) to like/pass; certain profiles trigger an
 * "it's a match!" burst with a slow-mo beat. Springy gsap.quickTo drag with
 * rubber LIKE/NOPE stamps; vertical page scroll still works (pan-y).
 *
 * All card positioning transforms are GSAP-owned (never React inline styles)
 * so drag, depth-scaling and promotion tweens never fight React re-renders.
 * With `animate=false` everything still works — positions are gsap.set
 * instantly and no tweens run.
 */
export function SwipeDeck({ animate }: { animate: boolean }) {
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [passes, setPasses] = useState(0);
  const [match, setMatch] = useState<Profile | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const headRef = useReveal({ enabled: animate });
  const hintRef = useDrawOn<HTMLDivElement>({ enabled: animate, start: 'top 75%' });
  const stackRef = useRef<HTMLDivElement | null>(null);
  const likeStamp = useRef<HTMLDivElement | null>(null);
  const nopeStamp = useRef<HTMLDivElement | null>(null);
  const burstHost = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const keepSwipingRef = useRef<HTMLButtonElement | null>(null);
  const heartsRef = useRef<HTMLDivElement | null>(null);
  const cardEls = useRef(new Map<string, HTMLDivElement>());
  const quick = useRef<QuickFns | null>(null);
  const drag = useRef({ active: false, sx: 0, sy: 0, dx: 0, dy: 0, vx: 0, lastX: 0, lastT: 0 });
  const busy = useRef(false);
  const dealing = useRef(false);
  const slowMo = useRef<number | null>(null);

  const done = index >= swipeProfiles.length;

  const getCard = (offset: number): HTMLDivElement | undefined => {
    const p = swipeProfiles[index + offset];
    return p ? cardEls.current.get(p.name) : undefined;
  };
  const stampEls = () =>
    [likeStamp.current, nopeStamp.current].filter((n): n is HTMLDivElement => n !== null);

  /* ── Card positioning: GSAP owns every stack transform ─────────────────
     New cards are set into their slot before paint; already-slotted cards
     tween into their new slot (the "promotion" after a swipe). A reset with
     `dealing` flies the whole hand back in with a stagger. */
  useLayoutEffect(() => {
    if (done) return;
    const els: HTMLDivElement[] = [];
    for (let i = 0; i < 3; i++) {
      const p = swipeProfiles[index + i];
      if (!p) break;
      const el = cardEls.current.get(p.name);
      if (el) els.push(el);
    }
    if (els.length === 0) return;

    const ctx = gsap.context(() => {
      if (dealing.current) {
        dealing.current = false;
        els.forEach((el, pos) => {
          gsap.set(el, { ...slotFor(pos), opacity: 1 });
          el.dataset.slotted = '1';
        });
        if (animate) {
          gsap.from(els, {
            x: (i: number) => (i % 2 ? -1 : 1) * (window.innerWidth * 0.55 + 280),
            y: -40,
            rotation: (i: number) => (i % 2 ? -20 : 20),
            duration: 0.6,
            ease: 'power3.out',
            stagger: { each: 0.09, from: 'end' }, // back card lands first, top card last
          });
        }
        return;
      }
      els.forEach((el, pos) => {
        const target = slotFor(pos);
        if (!el.dataset.slotted || !animate) {
          gsap.set(el, { ...target, opacity: 1 });
          el.dataset.slotted = '1';
        } else {
          gsap.to(el, { ...target, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        }
      });
    });
    return () => ctx.kill();
  }, [index, animate, done]);

  /* ── Match moment: overlay pop-in + doodle hearts floating up ────────── */
  useLayoutEffect(() => {
    if (!match || !animate) return;
    const ctx = gsap.context(() => {
      if (overlayRef.current) {
        gsap.from(overlayRef.current, {
          opacity: 0,
          scale: 0.92,
          y: 14,
          duration: 0.5,
          ease: 'back.out(1.8)',
        });
      }
      if (heartsRef.current) {
        const hearts = gsap.utils.toArray<HTMLElement>(heartsRef.current.children);
        gsap.fromTo(
          hearts,
          { y: 26, opacity: 0, scale: 0.4, rotation: () => gsap.utils.random(-20, 20) },
          {
            y: () => gsap.utils.random(-200, -120),
            x: () => gsap.utils.random(-28, 28),
            opacity: 1,
            scale: 1,
            rotation: () => gsap.utils.random(-24, 24),
            duration: 1.5,
            stagger: 0.09,
            ease: 'power2.out',
          },
        );
        gsap.to(hearts, { opacity: 0, duration: 0.6, delay: 1, stagger: 0.09, ease: 'power1.in' });
      }
    });
    return () => ctx.revert();
  }, [match, animate]);

  /* Safety net: never leave the world in slow motion. */
  useEffect(
    () => () => {
      if (slowMo.current !== null) window.clearTimeout(slowMo.current);
      gsap.globalTimeline.timeScale(1);
    },
    [],
  );

  /* The match overlay is modal for focus too: move focus to its button on
     mount (its dismiss handler returns focus to the stack). */
  useEffect(() => {
    if (!match) return;
    const raf = requestAnimationFrame(() =>
      keepSwipingRef.current?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(raf);
  }, [match]);

  /* Emptying the deck unmounts the controls row (~88px) and reshuffling
     restores it — both shift every section below, so re-measure all
     ScrollTriggers (JourneyLine self-heals via its 'refresh' listener) once
     the payoff-card mount tween / re-deal has settled. */
  const measured = useRef(false);
  useEffect(() => {
    if (!measured.current) {
      measured.current = true; // initial mount — nothing shifted yet
      return;
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => window.clearTimeout(id);
  }, [done]);

  /* ── Rubber stamps ──────────────────────────────────────────────────── */
  const setStamps = (dx: number) => {
    const p = gsap.utils.clamp(0, 1, Math.abs(dx) / (THRESHOLD * 0.8));
    const show = dx >= 0 ? likeStamp.current : nopeStamp.current;
    const hide = dx >= 0 ? nopeStamp.current : likeStamp.current;
    if (show) gsap.set(show, { opacity: p, scale: 0.6 + 0.4 * p, rotation: dx >= 0 ? -12 : 12 });
    if (hide) gsap.set(hide, { opacity: 0 });
  };

  const flashStamp = (dir: Dir) => {
    const stamp = dir === 'right' ? likeStamp.current : nopeStamp.current;
    const other = dir === 'right' ? nopeStamp.current : likeStamp.current;
    if (other) gsap.set(other, { opacity: 0 });
    if (!stamp) return;
    gsap.killTweensOf(stamp);
    const rotation = dir === 'right' ? -12 : 12;
    if (Number(gsap.getProperty(stamp, 'opacity')) > 0.5) {
      // Already inked in by the drag — just settle it.
      gsap.to(stamp, { opacity: 1, scale: 1, rotation, duration: 0.15, ease: 'power2.out' });
    } else {
      // Button/keyboard swipe — thump the stamp on.
      gsap.fromTo(
        stamp,
        { opacity: 0, scale: 0.4, rotation },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2.5)' },
      );
    }
  };

  /* ── Advance / commit ───────────────────────────────────────────────── */
  const advance = (dir: Dir) => {
    const profile = swipeProfiles[index];
    const isLast = index + 1 >= swipeProfiles.length;
    let matched = false;
    let msg: string;
    if (dir === 'right') {
      setLikes((l) => l + 1);
      if (profile.match) {
        matched = true;
        msg = `It’s a match with ${profile.name}!`;
        setMatch(profile);
        navigator.vibrate?.(12);
        if (animate) {
          // Slow-mo beat: dip the whole GSAP world briefly, then snap back.
          gsap.globalTimeline.timeScale(0.35);
          if (slowMo.current !== null) window.clearTimeout(slowMo.current);
          slowMo.current = window.setTimeout(() => gsap.globalTimeline.timeScale(1), 250);
        }
        if (burstHost.current) burstConfetti(burstHost.current);
      } else {
        msg = `Liked ${profile.name}.`;
      }
    } else {
      setPasses((p) => p + 1);
      msg = `Passed on ${profile.name}.`;
    }
    setAnnouncement(isLast ? `${msg} That was the last card in the demo deck.` : msg);
    setIndex((i) => i + 1);
    busy.current = false;
    // Mirror reset(): the Like/Pass controls unmount with the last swipe, so
    // park focus on the still-mounted stack (next Tab lands on the payoff
    // card's CTAs). A match owns focus instead — see the match effect.
    if (isLast && !matched) {
      requestAnimationFrame(() => stackRef.current?.focus({ preventScroll: true }));
    }
  };

  const commit = (dir: Dir) => {
    // `match` guards keyboard swipes and the Like/Pass buttons alike while
    // the overlay is up — it only blocks pointer drags by covering the stack.
    if (busy.current || done || match) return;
    busy.current = true;
    const el = getCard(0);
    if (!el || !animate) {
      advance(dir);
      return;
    }
    gsap.killTweensOf(el);
    flashStamp(dir);

    const d = drag.current;
    const speed = Math.abs(d.vx); // px per ms at release
    const dur = gsap.utils.clamp(0.3, 0.5, 0.5 - speed * 0.12);
    const sign = dir === 'right' ? 1 : -1;

    // Promote the cards beneath in parallel with the throw.
    const behind = getCard(1);
    if (behind) {
      gsap.killTweensOf(behind);
      gsap.to(behind, { ...slotFor(0), duration: dur, ease: 'power2.out' });
    }
    const third = getCard(2);
    if (third) gsap.to(third, { ...slotFor(1), duration: dur, ease: 'power2.out' });

    gsap.to(el, {
      x: sign * (window.innerWidth * 0.6 + 320),
      y: d.dy * 1.5,
      // Exit rotation continues the drag direction, plus a velocity flick.
      rotation: d.dx * ROT + sign * (16 + Math.min(14, speed * 18)),
      opacity: 0,
      duration: dur + 0.05,
      ease: 'power2.in',
      onComplete: () => advance(dir),
    });
    drag.current = { ...d, dx: 0, dy: 0, vx: 0 };
  };

  /* ── Pointer drag (springy quickTo followers) ───────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (busy.current || done) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const el = getCard(0);
    if (!el) return;
    drag.current = {
      active: true,
      sx: e.clientX,
      sy: e.clientY,
      dx: 0,
      dy: 0,
      vx: 0,
      lastX: e.clientX,
      lastT: e.timeStamp,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    if (animate) {
      gsap.killTweensOf(el);
      gsap.killTweensOf(stampEls());
      const behind = getCard(1);
      if (behind) gsap.killTweensOf(behind);
      quick.current = {
        x: gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3' }),
        r: gsap.quickTo(el, 'rotation', { duration: 0.38, ease: 'power3' }),
        ...(behind
          ? {
              bScale: gsap.quickTo(behind, 'scale', { duration: 0.3, ease: 'power2' }),
              bY: gsap.quickTo(behind, 'y', { duration: 0.3, ease: 'power2' }),
            }
          : {}),
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.dx = e.clientX - d.sx;
    d.dy = e.clientY - d.sy;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.vx = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;

    const q = quick.current;
    if (animate && q) {
      q.x(d.dx);
      q.y(d.dy);
      q.r(gsap.utils.clamp(-20, 20, d.dx * ROT));
      const p = gsap.utils.clamp(0, 1, Math.abs(d.dx) / THRESHOLD);
      q.bScale?.(0.95 + 0.05 * p);
      q.bY?.(14 - 14 * p);
    } else {
      const el = getCard(0);
      if (el) gsap.set(el, { x: d.dx, y: d.dy, rotation: d.dx * ROT });
    }
    setStamps(d.dx);
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    quick.current = null;
    const el = getCard(0);
    if (!el) return;

    if (d.dx > THRESHOLD) {
      commit('right');
    } else if (d.dx < -THRESHOLD) {
      commit('left');
    } else if (animate) {
      // Elastic snap back — the napkin springs the card home.
      gsap.killTweensOf(el);
      gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.55)' });
      const behind = getCard(1);
      if (behind) {
        gsap.killTweensOf(behind);
        gsap.to(behind, { ...slotFor(1), duration: 0.4, ease: 'power3.out' });
      }
      gsap.to(stampEls(), { opacity: 0, scale: 0.6, duration: 0.2, overwrite: 'auto' });
    } else {
      gsap.set(el, { x: 0, y: 0, rotation: 0 });
      const behind = getCard(1);
      if (behind) gsap.set(behind, slotFor(1));
      gsap.set(stampEls(), { opacity: 0 });
    }
  };

  /* ── Keyboard: focus the deck, arrow keys swipe ─────────────────────── */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commit('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      commit('right');
    }
  };

  const reset = () => {
    dealing.current = true;
    setIndex(0);
    setLikes(0);
    setPasses(0);
    setMatch(null);
    setAnnouncement('Deck reshuffled.');
    requestAnimationFrame(() => stackRef.current?.focus({ preventScroll: true }));
  };

  const visible = swipeProfiles.slice(index, index + 3);

  return (
    <section id="try" className="section-pad relative z-10 overflow-hidden bg-cream-100">
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
            try it - no download
          </span>
          <h2 data-reveal className="title">
            Go on. <em className="italic text-coral-600">Swipe.</em>
          </h2>
          <p data-reveal className="lede mx-auto text-center">
            Drag a card, or tap the buttons. This is how discovery feels in the app - minus the
            part where these are real, verified people near you.
          </p>
        </div>

        <div className="relative mx-auto mt-14 flex w-full max-w-[350px] flex-col items-center">
          {/* margin note: a little pen scribble pointing at the deck */}
          <div
            ref={hintRef}
            aria-hidden
            className="pointer-events-none absolute -left-48 top-8 hidden w-40 rotate-[-6deg] lg:block"
          >
            <span className="font-hand text-[21px] leading-tight text-ink-3">
              yes, it really drags
            </span>
            <DoodleArrow size={46} className="ml-16 mt-1 rotate-[-35deg] text-coral-500" />
          </div>

          {/* screen-reader announcements for swipes and matches */}
          <div aria-live="polite" className="sr-only">
            {announcement}
          </div>

          {/* confetti origin lives above the stack */}
          <div ref={burstHost} className="pointer-events-none absolute left-1/2 top-1/3 z-[60]" />

          {/* card stack */}
          <div
            ref={stackRef}
            data-no-pin
            data-cursor={done ? undefined : 'drag'}
            role="group"
            tabIndex={0}
            aria-label={`Interactive demo deck of ${swipeProfiles.length} profiles. Press the right arrow key to like, the left arrow key to pass.`}
            onKeyDown={onKeyDown}
            className="relative h-[470px] w-full select-none rounded-[26px] focus-visible:rounded-[30px]"
            style={{ touchAction: 'pan-y' }}
          >
            {done ? (
              <PayoffCard animate={animate} likes={likes} passes={passes} onShuffle={reset} />
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
                      setEl={(el) => {
                        if (el) cardEls.current.set(p.name, el);
                        else cardEls.current.delete(p.name);
                      }}
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

            {/* match-moment hearts floating up around the deck */}
            {match && animate && (
              <div
                ref={heartsRef}
                aria-hidden
                className="pointer-events-none absolute -inset-x-12 inset-y-0 z-[65]"
              >
                {MATCH_HEARTS.map((h, i) => (
                  <span key={i} className="absolute" style={{ left: h.x, top: h.y }}>
                    <DoodleHeart size={h.size} className={h.cls} />
                  </span>
                ))}
              </div>
            )}

            {/* It's a match overlay */}
            {match && (
              <div
                ref={overlayRef}
                data-cursor="tap"
                className="absolute inset-0 z-[70] flex flex-col items-center justify-center gap-4 rounded-[26px] border-[1.5px] border-ink bg-cream-25/95 px-8 text-center backdrop-blur-sm"
              >
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
                  In the app, a chat opens right here - starting with where you crossed paths.
                </p>
                <button
                  ref={keepSwipingRef}
                  onClick={() => {
                    setMatch(null);
                    // Hand focus back to the stack the overlay took it from.
                    requestAnimationFrame(() =>
                      stackRef.current?.focus({ preventScroll: true }),
                    );
                  }}
                  data-cursor="tap"
                  className="btn-ink !py-3 !text-[13.5px]"
                >
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
                data-cursor="tap"
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
                data-cursor="tap"
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

/* ── End-of-deck napkin payoff card ─────────────────────────────────────── */
function PayoffCard({
  animate,
  likes,
  passes,
  onShuffle,
}: {
  animate: boolean;
  likes: number;
  passes: number;
  onShuffle: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // Mounts fresh when the deck empties, so the doodles draw themselves on.
  const drawRef = useDrawOn<HTMLDivElement>({ enabled: animate, duration: 0.8, stagger: 0.1 });

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!animate || !el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 22,
        rotation: -2.5,
        scale: 0.95,
        duration: 0.55,
        ease: 'back.out(1.6)',
      });
    }, el);
    return () => ctx.revert();
  }, [animate]);

  return (
    <div
      ref={rootRef}
      className="card-stamp flex h-full w-full flex-col items-center justify-center px-8 text-center"
    >
      <div ref={drawRef} className="flex flex-col items-center gap-4">
        <DoodleHeart size={40} className="-rotate-6 text-coral-500" />
        <p className="-rotate-1 font-hand text-[26px] leading-snug text-ink">
          that’s the whole demo deck - the real one is your neighbourhood
        </p>
        <DoodleSquiggle size={64} className="text-coral-400" />
        <p className="text-sm text-ink-3">
          you liked {likes} · passed on {passes}
        </p>
        <div className="mt-2 flex flex-col items-center gap-3">
          <a href="#waitlist" data-cursor="tap" className="btn-primary !py-3.5 !text-[14px]">
            {waitlist.cta}
          </a>
          <button onClick={onShuffle} data-cursor="tap" className="btn-ghost !py-3 !text-[13.5px]">
            ↺ shuffle again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── A single profile card ──────────────────────────────────────────────── */
function ProfileCard({
  profile,
  tone,
  pos,
  setEl,
  likeStamp,
  nopeStamp,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  profile: Profile;
  tone: number;
  pos: number;
  setEl: (el: HTMLDivElement | null) => void;
  likeStamp?: React.RefObject<HTMLDivElement | null>;
  nopeStamp?: React.RefObject<HTMLDivElement | null>;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}) {
  const isTop = pos === 0;
  return (
    <div
      ref={setEl}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="card-stamp absolute inset-0 flex flex-col overflow-hidden !rounded-[26px]"
      /* Stack transforms are GSAP-owned (see the positioning effect) —
         only paint-order and cursor live here. */
      style={{ zIndex: 30 - pos, cursor: isTop ? 'grab' : 'default' }}
    >
      {/* rubber LIKE / NOPE stamps (top card only) */}
      {isTop && (
        <>
          <div
            ref={likeStamp as React.Ref<HTMLDivElement>}
            className="font-display pointer-events-none absolute left-5 top-6 z-20 -rotate-12 rounded-xl border-[3px] border-dashed border-coral-600 bg-cream-25 px-3.5 py-1 text-2xl font-bold uppercase tracking-wide text-coral-600 opacity-0 shadow-stamp"
          >
            Like
          </div>
          <div
            ref={nopeStamp as React.Ref<HTMLDivElement>}
            className="font-display pointer-events-none absolute right-5 top-6 z-20 rotate-12 rounded-xl border-[3px] border-dashed border-plum-800 bg-cream-25 px-3.5 py-1 text-2xl font-bold uppercase tracking-wide text-plum-800 opacity-0 shadow-stamp"
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

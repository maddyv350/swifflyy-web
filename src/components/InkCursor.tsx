import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CURSOR_KINDS = ['drag', 'tap', 'draw'] as const;
type CursorKind = (typeof CURSOR_KINDS)[number];

const TRAIL_MAX = 28;
const TRAIL_LIFE_MS = 520;

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

/**
 * A coral ink dot that lags the pointer plus a fading hand-drawn ink trail on
 * a fixed canvas — the pen the visitor is holding. The native cursor stays.
 *
 * Contract for sections: put `data-cursor="drag" | "tap" | "draw"` on any
 * interactive element and the dot swells into a ring with a small Caveat
 * label ("drag" / "tap" / "draw") beside it while hovered. Detection is
 * delegated on `window` — no per-element wiring needed.
 *
 * Desktop only: renders nothing unless `enabled` AND `(pointer: fine)` AND
 * `min-width: 1025px`. All per-frame work lives in refs + gsap.ticker (no
 * React state), and pauses while the tab is hidden.
 */
export function InkCursor({ enabled }: { enabled: boolean }) {
  const [active, setActive] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Media gate — re-evaluated live so window resizes / input changes apply.
  useEffect(() => {
    if (!enabled) {
      setActive(false);
      return;
    }
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1025px)');
    const update = () => setActive(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [enabled]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const canvas = canvasRef.current;
    if (!active || !wrap || !dot || !ring || !label || !canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    /* ── setup ─────────────────────────────────────────────── */
    const coral =
      (getComputedStyle(document.documentElement).getPropertyValue('--coral-500').trim() || '226 91 62')
        .split(/\s+/)
        .join(', ');

    gsap.set(wrap, { x: -100, y: -100, autoAlpha: 0 });
    gsap.set(ring, { scale: 0 });
    gsap.set(label, { autoAlpha: 0, scale: 0.6, transformOrigin: 'left bottom' });

    const xTo = gsap.quickTo(wrap, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(wrap, 'y', { duration: 0.35, ease: 'power3' });

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── pointer tracking ──────────────────────────────────── */
    const points: TrailPoint[] = [];
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!shown) {
        shown = true;
        gsap.set(wrap, { x: e.clientX, y: e.clientY });
        gsap.to(wrap, { autoAlpha: 1, duration: 0.25, overwrite: 'auto' });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const last = points[points.length - 1];
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) > 3) {
        points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
        if (points.length > TRAIL_MAX) points.shift();
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    /* ── data-cursor hover contract (delegated) ────────────── */
    let hoverHost: Element | null = null;

    const setKind = (kind: CursorKind | null) => {
      if (kind) {
        label.textContent = kind;
        gsap.to(ring, { scale: 1, duration: 0.45, ease: 'back.out(2.2)', overwrite: 'auto' });
        gsap.to(dot, { scale: 0.35, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)', overwrite: 'auto' });
      } else {
        gsap.to(ring, { scale: 0, duration: 0.3, ease: 'power3.in', overwrite: 'auto' });
        gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(label, { autoAlpha: 0, scale: 0.6, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
      }
    };

    const onOver = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const host = target.closest('[data-cursor]');
      if (host === hoverHost) return;
      hoverHost = host;
      const kind = host?.getAttribute('data-cursor') ?? '';
      setKind((CURSOR_KINDS as readonly string[]).includes(kind) ? (kind as CursorKind) : null);
    };
    window.addEventListener('pointerover', onOver, { passive: true });

    // Pointer left the window entirely: fade the ink out and reset.
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      hoverHost = null;
      setKind(null);
      shown = false;
      gsap.to(wrap, { autoAlpha: 0, duration: 0.3, overwrite: 'auto' });
    };
    window.addEventListener('pointerout', onOut, { passive: true });

    /* ── ink trail (canvas, gsap.ticker) ───────────────────── */
    let hadInk = false;
    const drawTrail = () => {
      const now = performance.now();
      while (points.length > 0 && now - points[0].t > TRAIL_LIFE_MS) points.shift();
      if (points.length < 2) {
        if (hadInk) {
          ctx2d.clearRect(0, 0, canvas.width, canvas.height);
          hadInk = false;
        }
        return; // idle — no per-frame cost
      }
      hadInk = true;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.lineCap = 'round';
      ctx2d.lineJoin = 'round';
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const life = 1 - (now - b.t) / TRAIL_LIFE_MS; // 1 fresh → 0 gone
        const along = i / (points.length - 1); //         0 tail → 1 tip
        const alpha = 0.35 * life * (0.3 + 0.7 * along);
        if (alpha < 0.015) continue;
        ctx2d.strokeStyle = `rgba(${coral}, ${alpha.toFixed(3)})`;
        ctx2d.lineWidth = (0.6 + 2.6 * along * life) * dpr;
        ctx2d.beginPath();
        ctx2d.moveTo(a.x * dpr, a.y * dpr);
        ctx2d.lineTo(b.x * dpr, b.y * dpr);
        ctx2d.stroke();
      }
    };
    gsap.ticker.add(drawTrail);

    const onVisibility = () => {
      gsap.ticker.remove(drawTrail);
      if (!document.hidden) gsap.ticker.add(drawTrail);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      document.removeEventListener('visibilitychange', onVisibility);
      gsap.ticker.remove(drawTrail);
      gsap.killTweensOf([wrap, dot, ring, label]);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={wrapRef} className="absolute left-0 top-0 will-change-transform">
        <div ref={dotRef} className="ink-cursor-dot" />
        <div ref={ringRef} className="ink-cursor-ring" />
        <span ref={labelRef} className="ink-cursor-label font-hand" />
      </div>
    </div>
  );
}

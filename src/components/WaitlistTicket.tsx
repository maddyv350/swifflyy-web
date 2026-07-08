import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { shareLink } from '../lib/referral';
import { burstConfetti } from '../lib/confetti';

const SHARE_TEXT = 'I just grabbed early access to Swifflyy — a location-first dating app. Drop a pin, meet people where you actually are. Join with my link:';

/**
 * Post-signup "napkin ticket": confirms the spot and hands the person a
 * referral link with copy / native-share / X / WhatsApp actions. The share
 * loop is the growth engine — every friend who joins with this link is
 * attributed to them.
 */
export function WaitlistTicket({ code, city }: { code: string; city?: string }) {
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const link = shareLink(code);

  // Getting on the list is the site's conversion moment — celebrate it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    burstConfetti(el, 44);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from(el, { y: 26, opacity: 0, rotation: -1.5, duration: 0.6, ease: 'back.out(1.6)' });
    }
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Swifflyy early access', text: SHARE_TEXT, url: link });
      } catch {
        /* user dismissed */
      }
    } else {
      copy();
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(link)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${link}`)}`;

  return (
    <div ref={rootRef} className="relative mx-auto mt-10 max-w-md text-left">
      {/* the ticket */}
      <div className="overflow-hidden rounded-[20px] border-[1.5px] border-paper/25 bg-paper/[0.05]">
        <div className="flex items-center justify-between px-7 pt-6">
          <span className="font-hand text-2xl text-accent-soft">early access ✦</span>
          <span className="text-2xl">🎟️</span>
        </div>
        <div className="px-7 pb-6 pt-3">
          <div className="font-head text-[26px] font-extrabold leading-tight text-paper">
            You’re on the list.
          </div>
          <p className="mt-2 font-body text-[15px] leading-[1.5] text-paper/60">
            {city ? (
              <>We’ll email you the moment Swifflyy lands in <span className="text-paper/90">{city}</span>.</>
            ) : (
              <>We’ll email you the moment Swifflyy lands in your neighbourhood.</>
            )}
          </p>
        </div>

        {/* perforated divider */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
          <div className="absolute right-0 top-1/2 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
          <div className="mx-5 border-t-[1.5px] border-dashed border-paper/25" />
        </div>

        {/* referral stub */}
        <div className="px-7 py-6">
          <div className="font-hand text-xl text-paper/70">want in sooner?</div>
          <p className="mt-1 font-body text-[14px] leading-[1.5] text-paper/55">
            Friends who join with your link jump the line right alongside you.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Your referral link"
              className="min-w-0 flex-1 rounded-[12px] border-[1.5px] border-paper/20 bg-paper/[0.04] px-4 py-3 font-body text-[13px] text-paper/80 outline-none"
            />
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-[12px] border-[1.5px] border-paper/25 px-4 py-3 font-body text-[13px] font-bold text-paper transition-colors hover:border-paper/60"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={nativeShare} className="share-chip">Share ↗</button>
            <a href={xUrl} target="_blank" rel="noopener noreferrer" className="share-chip">Post on X</a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="share-chip">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}

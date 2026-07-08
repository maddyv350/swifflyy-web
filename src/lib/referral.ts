/**
 * Client-side referral helpers. A person's code is derived deterministically
 * from their email (so re-signing up yields the same link), and their share
 * link deep-links back to the waitlist with `?ref=<code>`. The code is sent to
 * the waitlist backend on signup, so "friends who join with your link" is real
 * once an endpoint is wired — no crowd numbers are ever fabricated.
 */

/** Stable, short, URL-safe code from a seed (djb2 → base36). */
export function refCode(seed: string): string {
  let h = 5381;
  const s = seed.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36).padStart(7, '0').slice(0, 7);
}

/** Absolute share URL that reopens the waitlist with this ref attached. */
export function shareLink(code: string): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?ref=${code}#waitlist`;
}

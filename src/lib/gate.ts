import { gate } from '../config/site';

/**
 * Coming-soon gate resolution. Pairs with the inline boot snippet in
 * index.html: that script holds the prerendered page invisible
 * (`html[data-gate='pending']`) for any visitor we haven't already shown the
 * full site, so nothing can flash before the flag is known; main.tsx renders
 * the verdict and then lifts the hold.
 */

export type GateState = 'open' | 'gated';

/** Must match the key the index.html boot snippet reads. */
const KEY = 'swifflyy:gate';

export function cachedGateState(): GateState | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'open' || v === 'gated' ? v : null;
  } catch {
    return null;
  }
}

function remember(state: GateState) {
  try {
    localStorage.setItem(KEY, state);
  } catch {
    /* private mode etc. — the boot hold simply runs again next visit */
  }
}

function timeoutSignal(ms: number): AbortSignal | undefined {
  try {
    return AbortSignal.timeout(ms);
  } catch {
    return undefined; // very old browser — the fetch just runs unbounded
  }
}

/**
 * Ask the platform API whether the gate is up.
 *  - 2xx        → the flag decides (cached so the next boot skips the hold)
 *  - 404        → the API doesn't know the flag yet (older deploy) → open, so
 *                 shipping the site ahead of the backend can never dark it
 *  - error/slow → last cached answer, else the baked `gate.fallback`
 */
export async function resolveGateState(): Promise<GateState> {
  try {
    const res = await fetch(gate.endpoint, { signal: timeoutSignal(gate.timeoutMs) });
    if (res.status === 404) {
      remember('open');
      return 'open';
    }
    if (!res.ok) throw new Error(`site-config ${res.status}`);
    const json = (await res.json()) as { data?: { comingSoon?: boolean } };
    const state: GateState = json?.data?.comingSoon ? 'gated' : 'open';
    remember(state);
    return state;
  } catch {
    return cachedGateState() ?? gate.fallback;
  }
}

/** Lift the pre-paint hold once the verdict is in the DOM. */
export function revealPage() {
  delete document.documentElement.dataset.gate;
}

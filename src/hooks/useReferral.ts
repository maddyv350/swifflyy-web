import { useEffect, useState } from 'react';

const KEY = 'swifflyy_ref';

/**
 * Reads an incoming `?ref=<code>` once on mount and remembers it (so it
 * survives navigation). Returns the referrer's code, or null. Passed along on
 * signup as `referredBy` to attribute the invite.
 */
export function useReferral(): string | null {
  const [referredBy, setReferredBy] = useState<string | null>(null);

  useEffect(() => {
    let ref: string | null = null;
    try {
      const fromUrl = new URL(window.location.href).searchParams.get('ref');
      if (fromUrl) {
        ref = fromUrl;
        localStorage.setItem(KEY, fromUrl);
      } else {
        ref = localStorage.getItem(KEY);
      }
    } catch {
      /* private mode / no storage — ignore */
    }
    setReferredBy(ref);
  }, []);

  return referredBy;
}

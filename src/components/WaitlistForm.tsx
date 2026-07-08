import { useState, type FormEvent } from 'react';
import { waitlist } from '../config/site';
import { useReferral } from '../hooks/useReferral';
import { refCode } from '../lib/referral';
import { WaitlistTicket } from './WaitlistTicket';

type Status = 'idle' | 'loading' | 'done' | 'error';

/**
 * Early-access email capture. POSTs the signup to `waitlist.endpoint`; if no
 * endpoint is configured it runs in demo mode (shows the ticket, stores
 * nothing). On success it hands the person a shareable referral ticket.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [code, setCode] = useState('');
  const referredBy = useReferral();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    const ref = refCode(email);
    const payload = {
      email: email.trim(),
      city: city.trim() || undefined,
      ref,
      referredBy: referredBy || undefined,
    };
    try {
      if (waitlist.endpoint) {
        const res = await fetch(waitlist.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      }
      setCode(ref);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return <WaitlistTicket code={code} city={city.trim() || undefined} />;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-md flex-col items-stretch gap-3">
      {referredBy && (
        <p className="-mt-2 mb-1 font-hand text-lg text-accent-soft">✦ a friend sent you — nice taste</p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder={waitlist.placeholder}
          aria-label="Email address"
          aria-invalid={status === 'error'}
          className="min-w-0 flex-1 rounded-[14px] border-[1.5px] border-paper/25 bg-paper/[0.04] px-5 py-4 font-body text-[15px] text-paper placeholder:text-paper/35 outline-none transition-colors focus:border-paper/60"
        />
        <button type="submit" disabled={status === 'loading'} className="btn-stack shrink-0">
          <span className="btn-stack-shadow bg-accent/60" />
          <span className="btn-coral !px-8 !py-4 disabled:opacity-70">
            {status === 'loading' ? 'Joining…' : waitlist.cta}
          </span>
        </button>
      </div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="your city (optional) — we launch city by city"
        aria-label="Your city (optional)"
        className="w-full rounded-[14px] border-[1.5px] border-paper/20 bg-paper/[0.04] px-5 py-3.5 font-body text-[14px] text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-paper/50"
      />
      {status === 'error' && (
        <p role="alert" className="font-body text-[13px] text-accent-soft">
          {waitlist.error}
        </p>
      )}
    </form>
  );
}

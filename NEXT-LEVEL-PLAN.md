# Swifflyy — Site Vision & "Next-Level" Plan

_Last updated: 2026-07-08_

---

## 1. What this website actually is

**Swifflyy** is a **location-first dating app** — you drop a pin at a place you love (your café,
the park, a bookshop), see who else is nearby, and match with people who share your *world*, not
just your *algorithm*. Every match remembers **where** you both were when you connected, so your
first chat opens with a shared map moment. The pitch line is **"Meet people where you are."**

This repo is the **pre-launch marketing site** for that app (`swifflyy.com`). Its `package.json`
literally describes it as a _"marketing / waitlist site"_ — so a waitlist was always the intent, it
just hasn't been built yet.

### The aesthetic
A hand-drawn **"napkin sketch"** brand: warm paper tones, dashed borders, hand-written accent
font, doodle underlines, sketchy shadows. It feels personal and human — the opposite of the cold,
gamified swipe apps it's positioning against. This is a genuine asset; whatever we add should feel
drawn on the same napkin.

### What's on the page today (in order)
| Section | Component | What it does |
|---|---|---|
| Nav | `Navbar` | Sticky links + download button |
| Hero | `Hero` | Pitch + animated, pointer-tilting phone mockup |
| Marquee | `Marquee` | Scrolling band of playful one-liners |
| How it works | `HowItWorks` | 3 steps: drop pin → discover → connect |
| **Swipe demo** | `SwipeDeck` | **Fully draggable Tinder-style deck with confetti + "it's a match!"** — the current showpiece |
| Statement | `Statement` | Big word-cycling manifesto line |
| Features | `Features` | 4 flip cards (hover/tap to reveal the back) |
| Vibe picker | `VibePicker` | Selectable interest chips ("what's your vibe?") |
| Map | `MapSection` | "The city is your matchmaker" + animated `CityMap` |
| FAQ | `FAQ` | Incl. "When does it launch? → **Soon, city by city**" |
| CTA | `DownloadCTA` | Big wordmark + App Store / Google Play buttons |

### The stack (and the constraint it imposes)
- **Vite + React 18 + TypeScript + Tailwind**, animation via **GSAP** + **Lenis** smooth scroll.
- Deployed as a **static site to GitHub Pages** (`public/CNAME` → `swifflyy.com`, `.github/workflows/deploy.yml`).
- **Constraint:** there is **no backend**. Anything that captures data (emails, pins, quiz results)
  must use a third-party service or a small serverless function — see §5.

---

## 2. The core problem = the biggest opportunity

The product **is not launched yet** (FAQ confirms it, and we just removed the fabricated metrics for
that reason). But the site still tells three stories that contradict that:

- Hero badge says **"✦ now available"**
- Buttons say **"Download free"**
- The CTA links to **App Store / Google Play** — but they're dead `#` links.

A visitor who clicks and hits nothing **bounces and never comes back.** Right now the site generates
excitement and then has nowhere to put it.

> **The single highest-leverage move: convert every "download" moment into a real, exciting
> _early-access waitlist_.** It fixes the honesty gap *and* is the #1 proven pre-launch growth engine.
> This is what turns the site from "a pretty brochure" into "a machine that builds an audience before
> day one."

Everything in §3 is built around that spine.

---

## 3. Ideas, ranked by impact ÷ effort

### ⭐ TIER 1 — The hero move: a viral "skip-the-line" waitlist

Replace "Download free" everywhere with **"Get early access."** But don't stop at an email box —
make signing up a *reward*:

1. **Instant queue position.** On submit: _"You're #1,247 on the list."_ (The Robinhood/Dropbox
   playbook — the mechanic that built million-user waitlists.)
2. **Referral to skip the line.** Each person gets a share link; every friend who joins moves them
   up. This turns each signup into a distributor — share rate is the metric that compounds.
3. **A shareable "napkin ticket."** The confirmation is a hand-drawn boarding-pass/ticket with their
   position and city that they can screenshot to their story. On-brand and built for sharing.
4. **Milestone rewards** (free to deliver, high perceived value): 3 referrals → "founding member"
   badge, 10 → skip to the front / first-in-your-city, 25+ → free premium at launch.

**Why first:** highest impact, and it's the honest version of what the buttons already promise.
Tools that do the queue + referral + emails out of the box: **GetWaitlist, LaunchList, Prefinery,
Viral Loops, KickoffLabs** (see §5). Effort: **M** with a hosted tool, **L** for a basic embed.

### ⭐ TIER 1 — "Is Swifflyy live in *your* city?" geo-hook

The whole product is location-first, so the site should be too. Add an interactive moment (extend
the existing `CityMap` / `MapSection`):

- Detect or let the user type their city → _"Swifflyy is coming to **Bangalore** — **312 people
  near you** are already on the list."_
- CTA: _"Be the pin that starts it here."_ → feeds the waitlist, tagged by city.

**Why:** creates real, personal FOMO, gives the waitlist a purpose ("notify me when it's live in my
area"), and lets you launch city-by-city to a warm audience. Effort: **M**.

### ⭐ TIER 2 — Turn the swipe demo into a personalized, shareable payoff

The `SwipeDeck` is already the best thing on the page — but the demo ends and does nothing. Make it
*close the loop*:

- After the demo: _"Based on what you liked, your type is the **Coffee-Crawl Creative** ☕. There are
  real ones near you."_ → CTA into the waitlist.
- Optionally output a **shareable "your dating vibe" card** (reuse the napkin-ticket styling).

**Why:** we already built the engagement; right now it leaks out. Effort: **S–M**.

### ⭐ TIER 2 — "What's your meet-cute vibe?" quiz (from the existing `VibePicker`)

Grow the interest-chip picker into a 4–5 question quiz that outputs a shareable, personality-style
result card (e.g. _"You're a Sunrise-Walk Romantic 🌅"_). Quizzes + one-click share buttons are a
staple pre-launch virality play, and the napkin aesthetic makes the result cards genuinely
screenshot-worthy. Result → soft CTA into the waitlist. Effort: **M**.

### TIER 3 — Delight & polish (cheap, high-charm, very on-brand)

- **Custom cursor as a map pin** that "drops" with a little bounce on click.
- **Sound + haptics** on match/confetti (opt-in, respects reduced-motion which is already wired up).
- **Easter egg:** a hidden pin somewhere on the page that drops confetti / unlocks a "you found it"
  badge — the kind of thing people post about.
- **A real, honest counter** to replace the fake metrics we removed: _"427 people already on the
  list"_ (pulled live from the waitlist tool) — social proof that's *true*.

### TIER 3 — Shareability & first-impression infrastructure

- **A killer Open Graph / Twitter card image** so every shared link looks like the brand (right now
  a shared link is invisible — critical when the whole strategy is virality).
- **Motion-honest hero refresh:** swap "✦ now available" → "✦ launching soon / early access open,"
  and the phone mockup can show the "you're #1,247" ticket.
- **Analytics** (Plausible/Umami — privacy-friendly, one script tag) so we can actually see share
  rate, city demand, and quiz completion. You can't optimize a funnel you can't see.

---

## 4. Recommended sequence

**Phase 1 — Make it honest & capture demand (do first)**
1. Pick a waitlist tool (§5) and wire real email capture.
2. Replace every "Download / App Store / Google Play" CTA with "Get early access."
3. Update hero badge + FAQ copy to match ("launching soon" not "now available").
4. Add OG image + analytics.

**Phase 2 — Make signing up exciting**
5. Queue position + referral "skip the line" + shareable napkin ticket.
6. City geo-hook ("live in your city?") feeding the waitlist.

**Phase 3 — Feed the top of funnel**
7. Swipe-demo payoff → personalized result → CTA.
8. "What's your vibe?" quiz with shareable cards.
9. Delight layer (cursor, sound, easter egg, true live counter).

Phase 1 alone flips the site from "brochure" to "audience machine." 2 and 3 are the growth
multipliers.

---

## 5. Technical notes & options (the static-hosting constraint)

Because the site is static on GitHub Pages, data capture needs one of:

| Approach | Good for | Notes |
|---|---|---|
| **Hosted waitlist tool** (GetWaitlist, LaunchList, Prefinery, Viral Loops, KickoffLabs) | Fastest path to queue + referral + emails | Embed a widget or redirect. Least code, proven mechanics. **Recommended for Phase 1–2.** |
| **Form service** (Formspree, Buttondown, ConvertKit) | Simple email capture only | No referral/queue logic — you'd build the "exciting" layer yourself. |
| **Serverless + DB** (Cloudflare Pages/Workers or Vercel + Supabase/Turso) | Full control, custom referral logic, own the data | Bigger lift; may mean moving hosting off GitHub Pages. Best long-term if virality mechanics get custom. |

**Recommendation:** start with a **hosted waitlist tool** for speed (Phase 1–2), and only graduate to
**serverless + our own DB** if we want fully custom mechanics and to own the email list. The quiz and
swipe-payoff cards can be **100% client-side** (no backend) and just hand off to whichever waitlist
backend we choose.

---

## 6. Decisions needed before building

1. **Confirm the pivot:** are we comfortable replacing "Download / now available" with "early access /
   launching soon"? (Strongly recommended — the current buttons are dead.)
2. **Build vs. buy the waitlist:** hosted tool (fast) vs. our own serverless (custom, owns the data)?
3. **Referral rewards:** what do we actually promise founding members? (Free premium at launch is the
   usual free-to-deliver winner.)
4. **First cities:** which markets do we tag/prioritize for the geo-hook? (Bangalore is all over the
   current demo copy.)

---

## 7. Progress log

**✅ Phase 1 — shipped (2026-07-08)**
- Messaging pivoted from "now available / download" → **"launching soon / early access"** across
  Hero, Navbar, DownloadCTA, and FAQ copy. No more dead App Store / Google Play links.
- Real, provider-agnostic **waitlist form** (`WaitlistForm.tsx`) POSTing `{ email, city, ref,
  referredBy }` to `waitlist.endpoint` in `config/site.ts`. Runs in **demo mode** until an endpoint
  is set (accepts input, shows the ticket, stores nothing).
- Social/meta upgraded in `index.html` (og:url, og:site_name, twitter title/description) to the
  early-access story.

**✅ Phase 2 — shipped the client-side half (2026-07-08)**
- **Referral loop:** each signup gets a deterministic code + share link (`lib/referral.ts`);
  incoming `?ref=` is captured and attributed (`hooks/useReferral.ts`) and sent to the backend.
- **Shareable "napkin ticket"** success state (`WaitlistTicket.tsx`) with copy / native-share / X /
  WhatsApp actions, plus a "a friend sent you" nudge for referred visitors.
- **City geo-hook:** optional city field on the form, echoed back in the ticket ("we'll email you
  when Swifflyy lands in <city>"), tagging every signup for city-by-city launch.
- No fabricated crowd numbers — honesty preserved (see §2).

**✅ Phase 3 (delight layer) — shipped (2026-07-08)**
- **Pin-drop clicks** (`PinDrops.tsx`): click anywhere → a map pin drops with a bounce + ripple.
  Skips interactive elements and the swipe deck; fully disabled for reduced motion.
- **VibePicker**: chips burst mini-confetti + elastic-pop when picked; 5 picks = bigger burst.
- **Hero stickers** bob gently; **navbar wordmark** tilts on hover.
- **Signup celebration**: confetti + springy entrance on the waitlist ticket.
- **Footer easter egg**: a secret 📍 that wiggles every ~7s; clicking it bursts confetti and swaps
  the copyright line ("you found the secret pin ✦").
- Verified with headless Chrome (app mounts, features render, `?ref=` nudge works).

**⏳ Still needs an external asset / account (can't be done from code alone):**
- **Waitlist endpoint** — paste a real URL into `waitlist.endpoint` (Formspree is the 2-min option).
- **OG image PNG** — rasterize `public/og-image.svg` → `public/og-image.png` and uncomment its tags
  in `index.html`.
- **Analytics** — create the Plausible/Umami site for `swifflyy.com`, uncomment the snippet.
- **Live queue position** ("you're #1,247") — deliberately deferred: it requires a backend to be
  truthful, and we won't fabricate it. Wire it when the endpoint returns a real position.

### Sources
- [Waitlist landing pages that convert (Flowjam, 2026)](https://www.flowjam.com/blog/waitlist-landing-page-examples-10-high-converting-pre-launch-designs-how-to-build-yours)
- [Dropbox-style viral waitlist guide (LaunchList)](https://getlaunchlist.com/blog/waitlist-referral-program-guide)
- [Best pre-launch waitlist tools 2026 (DEV)](https://dev.to/tahseen_rahman/best-pre-launch-waitlist-tools-in-2026-compared-20pg)
- [Best waitlist software: honest comparison (Waitlister)](https://waitlister.me/growth-hub/guides/best-pre-launch-waitlist-tools)
- [Pre-launch waitlist playbook for mobile apps (SEM Nexus)](https://semnexus.com/the-pre-launch-waitlist-playbook-for-mobile-apps)
- [Pre-launch marketing strategies (Viral Marketing Lab)](https://www.viralmarketinglab.com/articles/pre-launch-marketing-strategies)
- [Set up a pre-launch waitlist that converts (KickoffLabs)](https://kickofflabs.com/blog/pre-launch-waitlist-guide/)

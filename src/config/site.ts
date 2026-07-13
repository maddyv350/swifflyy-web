/**
 * Single source of truth for copy and content. Edit text here; components
 * stay about layout/behaviour. Honesty rule: nothing on this site claims
 * numbers, testimonials or availability we don't have.
 */

export const site = {
  name: 'swifflyy',
  tagline: 'Meet people where you are',
  url: 'https://swifflyy.com',
  email: 'hello@swifflyy.com',
  navLinks: [
    { label: 'How it works', href: '#how' },
    { label: 'Try it', href: '#try' },
    { label: 'Why Swifflyy', href: '#why' },
    { label: 'Safety', href: '#safety' },
    { label: 'FAQ', href: '#faq' },
  ],
} as const;

/**
 * Early-access waitlist. Point `endpoint` at your form/waitlist provider's
 * POST URL (Formspree, Buttondown, GetWaitlist, LaunchList, a serverless
 * function, …). It receives JSON `{ email, city, ref, referredBy }` and should
 * return a 2xx on success.
 *
 * Leave `endpoint: ''` to run the form in DEMO mode — it accepts input and
 * shows the success state but stores nothing. Swap in a real URL to go live.
 */
export const waitlist = {
  endpoint: '',
  placeholder: 'you@email.com',
  cta: 'Get early access',
  success: 'You’re on the list ✦',
  successSub: 'We’ll email you the moment Swifflyy lands in your neighbourhood.',
  error: 'Hmm, that didn’t go through. Mind trying again?',
} as const;

export const hero = {
  eyebrow: 'launching soon — Bengaluru first ✦',
  /** Rendered one line per entry, with the last line set in coral italic. */
  headline: ['Love, within', 'walking distance.'],
  sub: 'Swifflyy is a location-first dating app. Drop a pin at a place you love — your café, your park, your street — and meet the people who already share it.',
  primaryCta: { label: 'Get early access', href: '#waitlist' },
  secondaryCta: { label: 'See how it works', href: '#how' },
  note: 'free to join · launching city by city',
} as const;

export const marquee = [
  'drop a pin',
  'real places, real people',
  'meet your neighbours',
  'no endless swiping',
  'chai date > cold DMs',
  'love, locally',
  'touch grass, meet people',
] as const;

export const steps = [
  {
    num: '01',
    title: 'Drop your pin',
    body: 'Pick a place that means something — your corner café, the park, your street. You’re only discoverable while your pin is live, and it lifts itself within the hour.',
    note: 'your location, on your terms',
  },
  {
    num: '02',
    title: 'See who’s really nearby',
    body: 'A hand-sized deck of people around your pin — not an infinite feed of strangers 40 km away. Read their prompts. Get their vibe before their photos.',
    note: 'a deck, not a slot machine',
  },
  {
    num: '03',
    title: 'Match & meet sooner',
    body: 'Two yeses open a chat that remembers where you both were. And when you’re 500 metres apart, “coffee?” is a plan — not a promise.',
    note: 'every match has a place',
  },
] as const;

/** Profiles for the interactive swipe deck. `match` = guaranteed "it's a match". */
export const swipeProfiles = [
  {
    name: 'Priya',
    age: 26,
    distance: '300 m',
    area: 'Koramangala',
    prompt: 'my simple pleasures',
    answer: 'filter coffee + a playlist that slaps',
    tags: ['coffee crawls', 'indie gigs', 'dog person'],
    match: true,
  },
  {
    name: 'Arjun',
    age: 28,
    distance: '500 m',
    area: 'Indiranagar',
    prompt: 'we’ll get along if',
    answer: 'you have aggressive ramen opinions',
    tags: ['ramen', 'vinyl', 'live music'],
    match: false,
  },
  {
    name: 'Sara',
    age: 24,
    distance: '200 m',
    area: 'HSR Layout',
    prompt: 'the way to my heart',
    answer: 'rec me a book i haven’t read yet',
    tags: ['bookshops', 'art', 'chai'],
    match: true,
  },
  {
    name: 'Dev',
    age: 27,
    distance: '700 m',
    area: 'Whitefield',
    prompt: 'my ideal sunday',
    answer: 'park run, then dosa, obviously',
    tags: ['morning runs', 'street food', 'travel'],
    match: false,
  },
  {
    name: 'Meera',
    age: 25,
    distance: '400 m',
    area: 'Jayanagar',
    prompt: 'i’m weirdly good at',
    answer: 'finding the best street food, anywhere',
    tags: ['galleries', 'foodie', 'plants'],
    match: true,
  },
] as const;

export const why = {
  eyebrow: 'why swifflyy',
  title: 'Dating apps forgot the “meet” part.',
  sub: 'Endless swiping across a 40-km radius produces chats, not dates. We started over from the one thing that actually predicts a first date: being in the same place.',
  points: [
    {
      title: 'Proximity-first, not algorithm-first',
      body: 'Tinder, Bumble and Hinge rank faces to keep you swiping. Swifflyy starts from where you are — the people in your deck are close enough that meeting is the easy part.',
    },
    {
      title: 'A deck, not a slot machine',
      body: 'A small, curated hand of people near your pin. When it’s done, it’s done — no doomswiping at 2 a.m., no thousand maybes.',
    },
    {
      title: 'Every match has a place',
      body: 'Your chat opens with the spot where you crossed paths. “We matched 200 m apart at Cubbon Park” is an origin story — “we both swiped right” isn’t.',
    },
    {
      title: 'Priced for India',
      body: 'The core experience is free. A ₹9 day pass unlocks the extras when you want them — no bloated monthly subscription doing the guilt-tripping.',
    },
  ],
} as const;

export const safety = {
  eyebrow: 'safety & trust',
  title: 'Safety isn’t a feature. It’s the floor.',
  sub: 'A location-based app only works if the location is honest and the people are real. We built for the person who reads this section first.',
  points: [
    {
      k: 'verified',
      title: 'Real faces only',
      body: 'Every profile is verified with a live smiling selfie — matched to profile photos before anyone can swipe. No catfish, no recycled photos.',
    },
    {
      k: 'pin',
      title: 'Your pin, your rules',
      body: 'Your location is shared only while a pin you dropped is live — and every pin expires on its own within the hour. No background tracking. Ever.',
    },
    {
      k: 'spoof',
      title: 'Fake GPS gets bounced',
      body: 'Mock locations and impossible travel are detected and rejected, so the person “400 m away” actually is.',
    },
    {
      k: 'control',
      title: 'One tap to end it',
      body: 'Report and unmatch live one tap from every chat. Unmatching erases the connection both ways — no lingering threads, no awkward re-appearances.',
    },
  ],
} as const;

export const cities = {
  eyebrow: 'city by city',
  title: 'Bengaluru first. Your city next.',
  sub: 'Swifflyy opens neighbourhood by neighbourhood, so the map is never empty. Tell us your city when you join the list — enough neighbours, and you’re next.',
  first: 'Bengaluru',
  next: ['Delhi NCR', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'],
  cta: 'Be the pin that starts your city',
} as const;

export const faqs = [
  {
    q: 'Is my exact location shared with everyone?',
    a: 'Never automatically. You’re only discoverable while a pin you deliberately dropped is live, and every pin expires on its own within the hour. There’s no background tracking and no “live location” — you’re always the one holding the pin.',
  },
  {
    q: 'How is this different from Tinder, Bumble or Hinge?',
    a: 'Those apps rank a 40-km radius of faces to keep you swiping. Swifflyy is location-first: you discover a small deck of verified people around a place you actually go, and every match remembers where you both were. Less swiping, more meeting.',
  },
  {
    q: 'Is it free?',
    a: 'Yes — joining, dropping pins, discovering people and matching are free. A ₹9 day pass unlocks a few extras when you want them; the core experience costs nothing.',
  },
  {
    q: 'When does it launch?',
    a: 'Soon, city by city — Bengaluru first. Join the early-access list with your city and you’ll get an email the moment Swifflyy goes live in your neighbourhood.',
  },
  {
    q: 'How do you keep it safe?',
    a: 'Every profile is selfie-verified, fake GPS is detected and rejected, your location is only shared on your terms, and report/unmatch are one tap from every chat. Safety isn’t a premium feature here — it’s the default.',
  },
] as const;

export const footer = {
  tagline: 'Meet people where you are.',
  linkGroups: [
    {
      title: 'Product',
      links: [
        { label: 'How it works', href: '#how' },
        { label: 'Try the demo', href: '#try' },
        { label: 'Why Swifflyy', href: '#why' },
        { label: 'Safety', href: '#safety' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'FAQ', href: '#faq' },
        { label: 'Early access', href: '#waitlist' },
        { label: 'Contact', href: 'mailto:hello@swifflyy.com' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy.html' },
        { label: 'Terms', href: '/terms.html' },
      ],
    },
  ],
} as const;

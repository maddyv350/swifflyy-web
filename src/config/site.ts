/**
 * Single source of truth for copy and brand tokens. Edit text here; components
 * stay about layout/behaviour.
 *
 * Brand name: the live product is "Swifflyy" (renamed from the old "Findly").
 * The reference design was branded "findly" — flip `name` below to switch.
 */

export const site = {
  /** Brand wordmark (lowercase, hand-written). Set to 'findly' for the old name. */
  name: 'swifflyy',
  /** Page <title> / hero support copy use these. */
  tagline: 'Meet people where you are',
  navLinks: [
    { label: 'How it works', href: '#how' },
    { label: 'Try it', href: '#try' },
    { label: 'Features', href: '#features' },
    { label: 'FAQ', href: '#faq' },
  ],
  footerLinks: ['About', 'Blog', 'Careers', 'Safety', 'Privacy', 'Terms', 'Contact'],
} as const;

/**
 * Early-access waitlist. Point `endpoint` at your form/waitlist provider's POST
 * URL (Formspree, Buttondown, GetWaitlist, LaunchList, a serverless function, …).
 * It receives JSON `{ email }` and should return a 2xx on success.
 *
 * Leave `endpoint: ''` to run the form in DEMO mode — it accepts input and shows
 * the success state but stores nothing. Swap in a real URL to go live.
 */
export const waitlist = {
  endpoint: '',
  placeholder: 'you@email.com',
  cta: 'Get early access',
  success: 'You’re on the list ✦',
  successSub: 'We’ll email you the moment Swifflyy lands in your neighbourhood.',
  error: 'Hmm, that didn’t go through. Mind trying again?',
} as const;

/** Napkin palette mirrored for inline SVG use (CSS vars don't reach <svg fill>). */
export const palette = {
  paper: '#fbf8f1',
  paper2: '#f3eee2',
  paper3: '#ede7d6',
  ink: '#1f1d1b',
  ink2: '#3a3733',
  muted: '#7a766f',
  faint: '#bbb6ac',
  line: '#2a2724',
  accent: '#d94f3a',
  accentSoft: '#f2c9c0',
} as const;

/** Words that cycle through the hero/statement headline. */
export const cyclerWords = ['coffee', 'vinyl', 'ramen', 'bouldering', 'bookshops', 'house plants'] as const;

/** Scrolling marquee band copy. */
export const marquee = [
  'drop a pin',
  'meet your neighbours',
  'no situationships',
  'touch grass, meet people',
  'real places, real people',
  'delete-worthy in the best way',
  'left on read? not here',
] as const;

export const steps = [
  {
    num: '01',
    icon: '📍',
    title: 'Drop your pin',
    body: 'Leave a pin at a place that matters to you — your corner café, the park, a bookshop. You decide when you’re visible and where.',
    note: 'you control your location ✦',
  },
  {
    num: '02',
    icon: '🗺️',
    title: 'Discover nearby',
    body: 'See people who’ve dropped pins near yours. Browse profiles, read their prompts, get a real sense of who they are — not just a face.',
    note: 'context over thumbnails ✦',
  },
  {
    num: '03',
    icon: '💬',
    title: 'Connect & chat',
    body: 'Like their profile, wait for the match, then start a conversation. Every chat shows where you both were when you found each other.',
    note: 'location stays the memory ✦',
  },
] as const;

/** Profiles for the interactive swipe deck. `match` = guaranteed "it's a match". */
export const swipeProfiles = [
  {
    name: 'Priya',
    age: 26,
    avatar: '🌸',
    distance: '0.3 km',
    area: 'Koramangala',
    prompt: 'my simple pleasures',
    answer: 'filter coffee + a playlist that slaps',
    tags: ['☕ coffee', '🎧 indie', '🐶 dogs'],
    match: true,
  },
  {
    name: 'Arjun',
    age: 28,
    avatar: '🎧',
    distance: '0.5 km',
    area: 'Indiranagar',
    prompt: 'we’ll get along if',
    answer: 'you have aggressive ramen opinions',
    tags: ['🍜 ramen', '💿 vinyl', '🎸 gigs'],
    match: false,
  },
  {
    name: 'Sara',
    age: 24,
    avatar: '📚',
    distance: '0.2 km',
    area: 'HSR Layout',
    prompt: 'the way to my heart',
    answer: 'rec me a book i haven’t read yet',
    tags: ['📖 books', '🎨 art', '🍵 chai'],
    match: true,
  },
  {
    name: 'Dev',
    age: 27,
    avatar: '🏀',
    distance: '0.7 km',
    area: 'Whitefield',
    prompt: 'my ideal sunday',
    answer: 'park run, then dosa, obviously',
    tags: ['🏃 fitness', '🌮 food', '✈️ travel'],
    match: false,
  },
  {
    name: 'Meera',
    age: 25,
    avatar: '🪴',
    distance: '0.4 km',
    area: 'Jayanagar',
    prompt: 'i’m weirdly good at',
    answer: 'finding the best street food, anywhere',
    tags: ['🎨 art', '🌶️ foodie', '🪴 plants'],
    match: true,
  },
] as const;

export const features = [
  {
    icon: '📌',
    title: 'You control visibility',
    body: 'Your location is only shared when you actively drop a pin. Lift it anytime. No passive tracking, no background sharing.',
    back: 'Drop it. Lift it. Ghost the whole map if you want. You’re always the one holding the pin.',
  },
  {
    icon: '✍️',
    title: 'Prompt-first profiles',
    body: 'Journal-style prompts surface personality before photos. Write about your weekend, your last great read, or what you’re looking for.',
    back: 'Personality > posing. Read the vibe before you see the selfie.',
  },
  {
    icon: '💌',
    title: 'Map-tied matches',
    body: 'Every match remembers where you both were. Your first chat opens with the map moment — a shared story from day one.',
    back: 'Your origin story, built in. “We matched 0.2 km apart” hits different.',
  },
  {
    icon: '🌿',
    title: 'No endless swipe',
    body: 'A curated nearby feed, not an infinite scroll. Quality over quantity, always — fewer options, better decisions.',
    back: 'No doomswiping at 2am. A handful of real people, not a thousand maybes.',
  },
] as const;

/** Selectable interest chips for the "what's your vibe?" section. */
export const vibes = [
  '☕ coffee crawls',
  '🎧 live music',
  '📚 bookstores',
  '🏃 morning runs',
  '🍜 street food',
  '🎨 gallery hops',
  '🪴 plant parent',
  '🎬 indie films',
  '🧗 bouldering',
  '🐶 dog person',
  '🌅 sunrise walks',
  '🎮 co-op nights',
  '☀️ farmers markets',
  '✈️ weekend trips',
  '🍷 wine + cheese',
] as const;

export const faqs = [
  {
    q: 'Is my exact location shared with everyone?',
    a: 'Never automatically. Your location is only visible when you actively drop a pin, and you can lift it any time. No background tracking, no “live” location — you’re always in control.',
  },
  {
    q: 'How is this different from every other dating app?',
    a: 'Swifflyy is location-first. Instead of a global firehose of profiles, you discover people around the places you actually go. Matches even remember where you both were when you connected.',
  },
  {
    q: 'Is it free?',
    a: 'Yes — joining, dropping pins, discovering people and matching will be free. A low-friction pass unlocks a few extras, but the core experience costs nothing.',
  },
  {
    q: 'When does it launch?',
    a: 'Soon, city by city. Join the early-access list and you’ll be the first to know the moment Swifflyy goes live in your neighbourhood.',
  },
  {
    q: 'How do you keep it safe?',
    a: 'Block and report are one tap away, profiles can be verified, and your location is only ever shared on your terms. Safety isn’t a feature here — it’s the default.',
  },
] as const;

export const mapBullets = [
  'See who’s active in your exact neighbourhood',
  'Your pin lifts automatically — no tracking without consent',
  'Matches remember where they began — forever',
] as const;

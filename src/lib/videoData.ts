/**
 * Video data types and sample content for the testimonial site.
 *
 * Categories: Voices, Gratitude, Stories, Moments, Behind
 * Supports both YouTube embeds and self-hosted MP4.
 */

/** Supported video source types. */
export type VideoSource = 'youtube' | 'self-hosted';

/** A single video entry in the library. */
export interface Video {
  /** Unique slug for routing. */
  slug: string;
  /** Display title. */
  title: string;
  /** Short description for metadata and cards. */
  description: string;
  /** Category this video belongs to. */
  category: CategoryId;
  /** Duration in "M:SS" format. */
  duration: string;
  /** Video source type. */
  source: VideoSource;
  /** YouTube video ID or MP4 URL. */
  videoId: string;
  /** Poster/thumbnail image URL (YouTube auto-generates these). */
  poster: string;
  /** Whether this video is featured in the hero carousel. */
  featured?: boolean;
}

/** Category identifiers matching the concept sidebar. */
export type CategoryId = 'voices' | 'gratitude' | 'stories' | 'moments' | 'behind';

/** Category metadata. */
export interface Category {
  id: CategoryId;
  label: string;
}

/** All categories in display order. */
export const CATEGORIES: Category[] = [
  { id: 'voices', label: 'Voices' },
  { id: 'gratitude', label: 'Gratitude' },
  { id: 'stories', label: 'Stories' },
  { id: 'moments', label: 'Moments' },
  { id: 'behind', label: 'Behind' },
];

/**
 * Video library data.
 * The first real YouTube video is included. Others are placeholders
 * with YouTube-style poster images that can be swapped for real content.
 */
export const VIDEOS: Video[] = [
  // ── Voices ──────────────────────────────
  {
    slug: 'introductions',
    title: 'Introductions',
    description: 'How it felt the very first time — raw and unfiltered.',
    category: 'voices',
    duration: '10:26',
    source: 'self-hosted',
    videoId: 'https://g0ajugqlpdgho5xr.public.blob.vercel-storage.com/videos/IMG_3851.webm',
    poster: '/IMG_3851_poster.jpg',
    featured: true,
  },
  {
    slug: 'one-year-later',
    title: '\'Live a little\' | an award winning short film made with iPhone',
    description: 'Looking back after twelve months of change.',
    category: 'voices',
    duration: '2:20',
    source: 'youtube',
    videoId: '3iH8l6dN6Ow',
    poster: 'https://img.youtube.com/vi/3iH8l6dN6Ow/hqdefault.jpg',
  },
  {
    slug: 'changed-everything',
    title: 'Say "Thank You" - A Motivational Video On The Importance Of Gratitude',
    description: 'The moment that shifted perspective permanently.',
    category: 'voices',
    duration: '5:11',
    source: 'youtube',
    videoId: '7uzynHWxn5Q',
    poster: 'https://img.youtube.com/vi/7uzynHWxn5Q/hqdefault.jpg',
  },

  // ── Gratitude ───────────────────────────
  {
    slug: 'a-note-from-maria',
    title: 'Mr Thankful || A Harvest Short Film',
    description: 'Maria shares her heartfelt thanks and what it means to her.',
    category: 'gratitude',
    duration: '2:26',
    source: 'youtube',
    videoId: 'lXYy4W5wAfM',
    poster: 'https://img.youtube.com/vi/lXYy4W5wAfM/hqdefault.jpg',
  },
  {
    slug: 'the-team-says-thank-you',
    title: 'Timepiece (2024) | Short Film',
    description: 'A collective message of gratitude from everyone involved.',
    category: 'gratitude',
    duration: '8:40',
    source: 'youtube',
    videoId: 'X4EcUcoo0r4',
    poster: 'https://img.youtube.com/vi/X4EcUcoo0r4/hqdefault.jpg',
    featured: true,
  },

  // ── Stories ─────────────────────────────
  {
    slug: 'where-it-started',
    title: 'THE POWER OF GRATITUDE - Best Morning Motivational Video Speeches Compilation 2024',
    description: 'The origin story — how everything began from nothing.',
    category: 'stories',
    duration: '29:49',
    source: 'youtube',
    videoId: 'gQ0nLHIAC94',
    poster: 'https://img.youtube.com/vi/gQ0nLHIAC94/hqdefault.jpg',
    featured: true,
  },
  {
    slug: 'the-turning-point',
    title: 'Gratitude Story: A Rich Boy Learns to Be Thankful',
    description: 'The pivotal decision that changed the trajectory.',
    category: 'stories',
    duration: '1:00',
    source: 'youtube',
    videoId: 'w2CHrCvW31k',
    poster: 'https://img.youtube.com/vi/w2CHrCvW31k/hqdefault.jpg',
  },
  {
    slug: 'two-years-in',
    title: 'The simple life. 🌻🌤 #onlyyesterday',
    description: 'Reflections from two years deep into the journey.',
    category: 'stories',
    duration: '0:23',
    source: 'youtube',
    videoId: '7CH_dO_bSfs',
    poster: 'https://img.youtube.com/vi/7CH_dO_bSfs/hqdefault.jpg',
  },

  // ── Moments ─────────────────────────────
  
  // ── User Added ─────────────────────────────
  {
    slug: 'two-astrophysicists-debate-free-will',
    title: 'Two Astrophysicists Debate Free Will',
    description: 'An insightful debate about the concept of free will.',
    category: 'voices',
    duration: '15:19',
    source: 'youtube',
    videoId: 'LXvv6CbGg8A',
    poster: 'https://img.youtube.com/vi/LXvv6CbGg8A/hqdefault.jpg',
    featured: true,
  },
  {
    slug: 'what-trauma-taught-me',
    title: 'What Trauma Taught Me About Resilience',
    description: 'Charles Hunt on what trauma taught him about resilience.',
    category: 'stories',
    duration: '14:21',
    source: 'youtube',
    videoId: '3qELiw_1Ddg',
    poster: 'https://img.youtube.com/vi/3qELiw_1Ddg/hqdefault.jpg',
    featured: true,
  },
  {
    slug: 'how-your-attitude-defines-your-life',
    title: 'How Your Attitude Defines Your Life',
    description: 'A motivational story about how attitude shapes our lives and outcomes.',
    category: 'moments',
    duration: '6:06',
    source: 'youtube',
    videoId: '7gM0f0ifGfI',
    poster: 'https://img.youtube.com/vi/7gM0f0ifGfI/hqdefault.jpg',
    featured: true,
  },
  {
    slug: 'kobe-bryant-champion-mindset',
    title: 'Kobe Bryant CHAMPION MINDSET',
    description: 'What separates the winners from the losers, featuring Kobe Bryant.',
    category: 'behind',
    duration: '10:21',
    source: 'youtube',
    videoId: 'Ju5kyQJyGBY',
    poster: 'https://img.youtube.com/vi/Ju5kyQJyGBY/hqdefault.jpg',
    featured: true,
  },
];

/**
 * Get videos filtered by category.
 * @param categoryId - The category to filter by.
 * @returns Filtered array of videos.
 */
export function getVideosByCategory(categoryId: CategoryId): Video[] {
  return VIDEOS.filter((v) => v.category === categoryId);
}

/**
 * Get featured videos for the hero carousel.
 * @returns Array of featured videos.
 */
export function getFeaturedVideos(): Video[] {
  return VIDEOS.filter((v) => v.featured);
}

/**
 * Get a single video by slug.
 * @param slug - The video slug.
 * @returns The matching video or undefined.
 */
export function getVideoBySlug(slug: string): Video | undefined {
  return VIDEOS.find((v) => v.slug === slug);
}

/** Represents a floating quote. */
export interface Quote {
  text: string;
  author: string;
}

/** Curated floating quotes for the hero section. */
export const FLOATING_QUOTES: Quote[] = [
  { text: 'this genuinely made me cry', author: 'Sarah' },
  { text: 'watched this three times', author: 'Michael' },
  { text: 'exactly what I needed to hear', author: 'Elena' },
  { text: 'the realest thing I\'ve seen all year', author: 'David' },
  { text: 'can\'t stop thinking about this', author: 'James' },
  { text: 'sent this to my whole family', author: 'Linda' },
  { text: 'came back to watch this again', author: 'Robert' },
  { text: 'this hit different', author: 'Anita' },
  { text: 'no words honestly', author: 'Marcus' },
  { text: 'they really captured it', author: 'Sophie' },
  { text: 'been waiting for someone to say this', author: 'Daniel' },
  { text: 'the part at the end — wow', author: 'Chloe' },
  { text: 'paused here for a minute', author: 'Tom' },
  { text: 'sharing this everywhere', author: 'Rachel' },
  { text: 'this is the one', author: 'Chris' },
  { text: 'I needed this today', author: 'Emma' },
  { text: 'beautifully done', author: 'Alex' },
  { text: 'this changed my perspective', author: 'Nina' },
];

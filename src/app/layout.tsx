import type { Metadata, Viewport } from 'next';
import { Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

/**
 * Playfair Display — elegant serif for display headings.
 * Loaded via next/font for automatic optimization.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

/**
 * JetBrains Mono — monospace for timestamps and metadata.
 */
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

/** Site metadata for SEO and social sharing. */
export const metadata: Metadata = {
  title: 'Video Website — Stories That Move',
  description:
    'A community of real people sharing stories that matter. Watch testimonials, moments of gratitude, and behind-the-scenes journeys.',
  keywords: ['testimonials', 'community', 'video stories', 'gratitude', 'real stories'],
  openGraph: {
    title: 'Video Website — Stories That Move',
    description: 'Real people. Real stories. Watch and share.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Website — Stories That Move',
    description: 'Real people. Real stories. Watch and share.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Viewport configuration — dark theme, responsive. */
export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Root layout — wraps all pages with fonts, theme, and base structure.
 * No navbar by design — immersive, content-first experience.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`}>
      <head>
        {/* Satoshi font — loaded from CDN (not available in next/font) */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          as="style"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

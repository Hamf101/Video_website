import { getFeaturedVideos, FLOATING_QUOTES } from '@/lib/videoData';
import HeroCarousel from '@/components/hero/HeroCarousel';
import VideoLibrary from '@/components/library/VideoLibrary';
import { Suspense } from 'react';
import StoryForm from '@/components/form/StoryForm';
import Footer from '@/components/footer/Footer';
import QueryVideoModal from '@/components/library/QueryVideoModal';
import styles from './page.module.css';

/**
 * Next.js Incremental Static Regeneration configuration.
 * Revalidate page data every hour.
 */
export const revalidate = 3600;

export default function Home() {
  const featuredVideos = getFeaturedVideos();

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <HeroCarousel videos={featuredVideos} quotes={FLOATING_QUOTES} />
      </section>

      {/* Video Library Section */}
      <section className={styles.librarySection}>
        <div className="container">
          <VideoLibrary />
        </div>
      </section>

      {/* Story Submission Form */}
      <section className={styles.formSection}>
        <div className="container">
          <StoryForm />
        </div>
      </section>

      <Footer />
      <Suspense fallback={null}>
        <QueryVideoModal />
      </Suspense>
    </main>
  );
}

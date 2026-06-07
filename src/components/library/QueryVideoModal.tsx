'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { getVideoBySlug, getVideosByCategory, CATEGORIES } from '@/lib/videoData';
import LiteYouTube from '@/components/player/LiteYouTube';
import VideoCard from '@/components/library/VideoCard';
import styles from './QueryVideoModal.module.css';

export default function QueryVideoModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('v');

  const onDismiss = useCallback(() => {
    router.push('/', { scroll: false });
  }, [router]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    if (slug) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [slug, onKeyDown]);

  if (!slug) return null;

  const video = getVideoBySlug(slug);
  if (!video) return null;

  const category = CATEGORIES.find((c) => c.id === video.category);
  const categoryLabel = category?.label || video.category;

  const relatedVideos = getVideosByCategory(video.category)
    .filter((v) => v.slug !== slug)
    .slice(0, 3);

  return (
    <div className={styles.backdrop} onClick={onDismiss}>
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button 
          className={styles.closeButton} 
          onClick={onDismiss}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.modalScroll}>
          <div className={styles.topHalf}>
            <div className={styles.playerWrapper}>
              {video.source === 'youtube' ? (
                <LiteYouTube videoId={video.videoId} title={video.title} />
              ) : (
                <video 
                  src={video.videoId} 
                  controls 
                  preload="none"
                  poster={video.poster}
                  style={{ width: '100%', height: '100%', backgroundColor: 'black', objectFit: 'contain' }} 
                />
              )}
            </div>
          </div>

          <div className={styles.bottomHalf}>
            <span className={styles.categoryBadge}>{categoryLabel}</span>
            <h1 className={styles.title}>{video.title}</h1>
            <p className={styles.description}>{video.description}</p>
            <div className={styles.metaRow}>
              <span className={styles.duration}>{video.duration}</span>
            </div>

            {relatedVideos.length > 0 && (
              <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>More from {categoryLabel}</h2>
                <div className={styles.relatedGrid}>
                  {relatedVideos.map((v) => (
                    <VideoCard key={v.slug} video={v} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

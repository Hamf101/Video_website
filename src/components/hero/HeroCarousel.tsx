'use client';

/**
 * HeroCarousel — Full-width cinematic video carousel for the hero section.
 *
 * Displays featured videos with poster images, play buttons, and
 * slide navigation (arrows + dots). Supports keyboard navigation
 * with arrow keys.
 *
 * @module components/hero/HeroCarousel
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Video, Quote } from '@/lib/videoData';
import styles from './HeroCarousel.module.css';
import FloatingQuotes from './FloatingQuotes';

/** Props for the HeroCarousel component. */
interface HeroCarouselProps {
  /** Array of featured videos to display in the carousel. */
  videos: Video[];
  /** Array of curated quote objects to display in the comment feed. */
  quotes: Quote[];
}

/**
 * Full-width hero carousel that cycles through featured videos.
 *
 * @param props - Component props containing the video array.
 * @returns The rendered carousel JSX element.
 */
export default function HeroCarousel({ videos, quotes }: HeroCarouselProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const isMutedRef = useRef<boolean>(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLIFrameElement | HTMLVideoElement | null)[]>([]);
  const slideCount = videos.length;

  // Try to autoplay the first video with audio. If the browser blocks it,
  // fall back to muted autoplay and unmute on the first user interaction.
  useEffect(() => {
    const firstMedia = mediaRefs.current[0];
    if (!firstMedia || !('play' in firstMedia)) return;

    const vid = firstMedia as HTMLVideoElement;
    vid.muted = false;

    vid.play().then(() => {
      // Unmuted autoplay succeeded — audio is playing
      setIsMuted(false);
      isMutedRef.current = false;
      setHasInteracted(true);
    }).catch(() => {
      // Browser blocked unmuted autoplay — fall back to muted
      vid.muted = true;
      setIsMuted(true);
      isMutedRef.current = true;
      vid.play().catch(() => {});

      // Unmute on first user interaction within the carousel
      const unmuteOnInteraction = () => {
        vid.muted = false;
        setIsMuted(false);
        isMutedRef.current = false;
        setHasInteracted(true);

        // Also unmute any YouTube iframe that might be active
        mediaRefs.current.forEach((media, idx) => {
          if (!media) return;
          if (idx === 0 && 'contentWindow' in media && media.contentWindow) {
            media.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
          }
        });

        const carouselNode = carouselRef.current;
        if (carouselNode) {
          carouselNode.removeEventListener('click', unmuteOnInteraction);
          carouselNode.removeEventListener('touchstart', unmuteOnInteraction);
          carouselNode.removeEventListener('keydown', unmuteOnInteraction);
        }
      };

      const carouselNode = carouselRef.current;
      if (carouselNode) {
        carouselNode.addEventListener('click', unmuteOnInteraction, { once: true });
        carouselNode.addEventListener('touchstart', unmuteOnInteraction, { once: true });
        carouselNode.addEventListener('keydown', unmuteOnInteraction, { once: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track visited slides to keep them mounted and preserve video state
  const visitedRef = useRef<Set<number>>(new Set([0]));
  visitedRef.current.add(activeIndex);
  visitedRef.current.add((activeIndex - 1 + slideCount) % slideCount);
  visitedRef.current.add((activeIndex + 1) % slideCount);

  const isAdjacent = useCallback((idx: number): boolean => {
    return visitedRef.current.has(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, slideCount]);

  const goToPrev = useCallback((): void => {
    setActiveIndex((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }, [slideCount]);

  const goToNext = useCallback((): void => {
    setActiveIndex((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  }, [slideCount]);

  const goToSlide = useCallback((index: number): void => {
    setActiveIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!carouselRef.current?.contains(document.activeElement)) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); goToPrev(); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); goToNext(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  const togglePlay = useCallback(() => {
    const media = mediaRefs.current[activeIndex];
    if (!media) return;

    if (videos[activeIndex]?.source === 'youtube') {
      if ('contentWindow' in media && media.contentWindow) {
        if (isPlaying) {
          media.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          setIsPlaying(false);
        } else {
          media.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          setIsPlaying(true);
        }
      }
      return;
    }

    if (isPlaying) {
      if ('pause' in media) (media as HTMLVideoElement).pause();
      setIsPlaying(false);
    } else {
      if ('play' in media) (media as HTMLVideoElement).play();
      setIsPlaying(true);
    }
  }, [activeIndex, isPlaying, videos]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setHasInteracted(true);
    mediaRefs.current.forEach((media, idx) => {
      if (!media) return;
      const shouldMute = idx === activeIndex ? newMuted : true;
      if ('contentWindow' in media && media.contentWindow) {
        media.contentWindow.postMessage(
          shouldMute
            ? '{"event":"command","func":"mute","args":""}'
            : '{"event":"command","func":"unMute","args":""}',
          '*'
        );
      } else if ('muted' in media) {
        (media as HTMLVideoElement).muted = shouldMute;
      }
    });
  }, [isMuted, activeIndex]);

  // When slide changes, unmute active and keep all YouTube iframes playing
  useEffect(() => {
    setIsPlaying(true);
    mediaRefs.current.forEach((media, idx) => {
      if (!media) return;

      if ('contentWindow' in media && media.contentWindow) {
        // Always keep YouTube iframes playing — pausing causes the play button to reappear
        media.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');

        if (idx === activeIndex) {
          // Restore the user's chosen mute state on the active slide
          media.contentWindow.postMessage(
            isMutedRef.current
              ? '{"event":"command","func":"mute","args":""}'
              : '{"event":"command","func":"unMute","args":""}',
            '*'
          );
        } else {
          // Force-mute all background slides
          media.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        }
      } else if ('play' in media) {
        const vid = media as HTMLVideoElement;
        if (idx === activeIndex) {
          vid.play().catch(() => {});
          vid.muted = isMutedRef.current;
        } else {
          vid.pause();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const showArrows = slideCount > 1;

  return (
    <section
      ref={carouselRef}
      className={styles.carousel}
      aria-label="Featured videos"
      aria-roledescription="carousel"
      tabIndex={0}
    >
      {/* ── Slide track ─────────────────────────────────────── */}
      <div
        className={styles.track}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        aria-live="polite"
      >
        {videos.map((video, index) => (
          <article
            key={video.slug}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideCount}`}
          >
            <div className={styles.poster}>
              {isAdjacent(index) && (
                video.source === 'youtube' ? (
                  <iframe
                    ref={(el) => { mediaRefs.current[index] = el; }}
                    /*
                     * Only load the current and adjacent YouTube iframes to save massive amounts of data.
                     * 
                     * Key parameters:
                     *   autoplay=1        — begin playing immediately on mount
                     *   mute=1            — required for autoplay in all browsers (unmuted via JS on first interaction)
                     *   controls=0        — hide all YouTube UI chrome
                     *   loop=1            — loop the video indefinitely
                     *   playlist=...      — required for loop to work on a single video
                     *   enablejsapi=1     — allow postMessage playback control
                     *   rel=0             — suppress related video suggestions
                     *   modestbranding=1  — reduce YouTube branding
                     *   playsinline=1     — prevent fullscreen takeover on mobile
                     *   start=3           — skip any black opening frames
                     */
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.videoId}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1&start=3`}
                    allow="autoplay; fullscreen"
                    className={styles.videoFrame}
                    title={`Video ${index + 1}`}
                    loading="lazy"
                    style={{ 
                      opacity: index === activeIndex ? 1 : 0, 
                      transition: index === activeIndex ? 'opacity 0.3s ease-out 0.2s' : 'opacity 0.3s ease-out' 
                    }}
                  />
                ) : (
                  <video
                    ref={(el) => { mediaRefs.current[index] = el; }}
                    src={video.videoId}
                    className={styles.videoFrame}
                    autoPlay
                    loop
                    playsInline
                    preload={index === 0 ? 'auto' : 'none'}
                    style={{ objectFit: 'cover' }}
                  />
                )
              )}
            </div>

            {/* Click overlay to toggle play/pause */}
            <div
              className={styles.overlay}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  togglePlay();
                }
              }}
            />
          </article>
        ))}
      </div>

      {/* ── Tap to Unmute Overlay ────────────────────────────── */}
      {!hasInteracted && isMuted && (
        <button
          className={styles.unmuteOverlayButton}
          onClick={(e) => {
            // The document event listener will also fire and handle the actual unmute,
            // but we can ensure interaction state is updated here just in case.
            setHasInteracted(true);
            toggleMute();
          }}
          type="button"
          aria-label="Tap to unmute"
        >
          <div className={styles.unmuteOverlayIconWrapper}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.unmuteOverlayIcon}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </div>
          <span className={styles.unmuteOverlayText}>Tap to Unmute</span>
        </button>
      )}

      {/* ── Previous arrow ──────────────────────────────────── */}
      <button
        className={`${styles.arrow} ${styles.arrowPrev} ${!showArrows ? styles.arrowHidden : ''}`}
        onClick={goToPrev}
        aria-label="Previous slide"
        type="button"
      >
        <svg className={styles.arrowIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polyline points="15,4 7,12 15,20" />
        </svg>
      </button>

      {/* ── Next arrow ──────────────────────────────────────── */}
      <button
        className={`${styles.arrow} ${styles.arrowNext} ${!showArrows ? styles.arrowHidden : ''}`}
        onClick={goToNext}
        aria-label="Next slide"
        type="button"
      >
        <svg className={styles.arrowIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polyline points="9,4 17,12 9,20" />
        </svg>
      </button>

      {/* ── Dot indicators ──────────────────────────────────── */}
      {showArrows && (
        <nav className={styles.dots} aria-label="Slide navigation">
          {videos.map((video, index) => (
            <button
              key={video.slug}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${video.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              type="button"
            />
          ))}
        </nav>
      )}

      {/* ── Comments Feed ──────────────────────────────────── */}
      <FloatingQuotes quotes={quotes} />

      {/* ── Mute / Unmute Button ───────────────────────────── */}
      {/* TODO: The user requested this to eventually be moved to the bottom left */}
      <button
        className={styles.muteButton}
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        type="button"
      >
        {isMuted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.muteIcon}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.muteIcon}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>
    </section>
  );
}
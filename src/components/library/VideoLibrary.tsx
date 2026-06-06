'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORIES, getVideosByCategory } from '@/lib/videoData';
import type { CategoryId } from '@/lib/videoData';
import VideoGrid from './VideoGrid';
import styles from './VideoLibrary.module.css';

/**
 * Main video library section displayed below the hero.
 *
 * Renders a sticky sidebar TOC (desktop) or horizontal scrollable
 * tabs (mobile) alongside categorized video grids. Uses
 * IntersectionObserver to update the active TOC item on scroll.
 */
export default function VideoLibrary(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(CATEGORIES[0].id);
  const sectionRefs = useRef<Map<CategoryId, HTMLElement>>(new Map());

  /**
   * Register a section element reference for IntersectionObserver tracking.
   * Uses a callback ref pattern to populate the ref map.
   */
  const setSectionRef = useCallback(
    (id: CategoryId) => (el: HTMLElement | null) => {
      if (el) {
        sectionRefs.current.set(id, el);
      } else {
        sectionRefs.current.delete(id);
      }
    },
    [],
  );

  /** Track scroll position to update active TOC item instantly without skipping. */
  useEffect(() => {
    const handleScroll = () => {
      let currentActive: CategoryId = CATEGORIES[0].id;
      
      for (const cat of CATEGORIES) {
        const el = sectionRefs.current.get(cat.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Trigger when section top crosses the upper 40% of the viewport
          if (rect.top <= window.innerHeight * 0.4) {
            currentActive = cat.id;
          }
        }
      }

      // Fallback: if user is at the absolute bottom of the page, select the last category
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        currentActive = CATEGORIES[CATEGORIES.length - 1].id;
      }

      setActiveCategory(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  /**
   * Handle TOC button clicks — smooth-scroll to the target section.
   * State updates live via the scroll listener.
   */
  const handleTocClick = useCallback((categoryId: CategoryId) => {
    const target = sectionRefs.current.get(categoryId);
    if (!target) return;

    // We don't eagerly set active category here; the scroll listener 
    // handles it live as we scroll past sections, avoiding skips.
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section className={styles.wrapper} aria-label="Video library">
      {/* Sidebar / Tab navigation */}
      <nav className={styles.sidebar} aria-label="Video categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`${styles.tocButton}${activeCategory === cat.id ? ` ${styles.tocButtonActive}` : ''}`}
            onClick={() => handleTocClick(cat.id)}
            aria-current={activeCategory === cat.id ? 'true' : undefined}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Category sections */}
      <div className={styles.content}>
        {CATEGORIES.map((cat) => {
          const videos = getVideosByCategory(cat.id);
          return (
            <section
              key={cat.id}
              ref={setSectionRef(cat.id)}
              data-category={cat.id}
              className={styles.section}
              aria-labelledby={`section-${cat.id}`}
            >
              <h2 id={`section-${cat.id}`} className={styles.sectionLabel}>
                {cat.label}
              </h2>
              <VideoGrid videos={videos} />
            </section>
          );
        })}
      </div>
    </section>
  );
}

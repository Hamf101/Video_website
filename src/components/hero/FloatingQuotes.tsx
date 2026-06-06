'use client';

/**
 * FloatingQuotes — TikTok-style comment feed fixed to the right side of the hero.
 *
 * Comments appear one at a time at the bottom, sliding in from the right and stacking upward.
 * Includes auto-fadeout after 6 seconds and early fadeout when the list exceeds 4 items.
 *
 * @module components/hero/FloatingQuotes
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './FloatingQuotes.module.css';

import type { Quote } from '@/lib/videoData';

/** Props for the FloatingQuotes component. */
interface FloatingQuotesProps {
  /** Array of curated quote objects to display. */
  quotes: Quote[];
}

interface ActiveComment {
  id: string;
  quote: Quote;
  gradient: string;
  isExiting: boolean;
}

/**
 * Deterministically generates a vibrant, premium linear gradient for user avatars based on their name.
 * 
 * @param name - The author name.
 * @returns CSS linear gradient string.
 */
function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  const hue2 = (hue + 35) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 85%, 60%) 0%, hsl(${hue2}, 90%, 45%) 100%)`;
}

export default function FloatingQuotes({ quotes }: FloatingQuotesProps): React.JSX.Element {
  const [showComments, setShowComments] = useState(true);
  const [activeComments, setActiveComments] = useState<ActiveComment[]>([]);
  const quoteIdx = useRef(0);

  // Spawning comments loop
  useEffect(() => {
    if (!showComments || !quotes || quotes.length === 0) {
      setActiveComments([]);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spawnComment = () => {
      // Don't spawn if tab is in background
      if (document.hidden) return;

      const quote = quotes[quoteIdx.current % quotes.length];
      quoteIdx.current++;

      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newComment: ActiveComment = {
        id: newId,
        quote,
        gradient: getAvatarGradient(quote.author),
        isExiting: false,
      };

      setActiveComments((prev) => [...prev, newComment]);

      // Handle time-based auto-fadeout
      if (!prefersReducedMotion) {
        setTimeout(() => {
          setActiveComments((prev) =>
            prev.map((c) => (c.id === newId ? { ...c, isExiting: true } : c))
          );
          // Wait for exit transition (500ms) then remove from state
          setTimeout(() => {
            setActiveComments((prev) => prev.filter((c) => c.id !== newId));
          }, 500);
        }, 6000);
      }
    };

    // Spawn first comment immediately, then loop
    spawnComment();
    const intervalId = setInterval(spawnComment, 2500);

    return () => clearInterval(intervalId);
  }, [quotes, showComments]);

  // Handle feed capacity limit (max 4 comments visible at once to avoid screen overcrowding)
  useEffect(() => {
    const activeNonExiting = activeComments.filter((c) => !c.isExiting);
    if (activeNonExiting.length > 4) {
      const oldest = activeNonExiting[0];
      setActiveComments((prev) =>
        prev.map((c) => (c.id === oldest.id ? { ...c, isExiting: true } : c))
      );
      const removeTimer = setTimeout(() => {
        setActiveComments((prev) => prev.filter((c) => c.id !== oldest.id));
      }, 500);
      return () => clearTimeout(removeTimer);
    }
  }, [activeComments]);

  return (
    <>
      {showComments && activeComments.length > 0 && (
        <div 
          className={styles.feedContainer} 
          aria-label="Live comments feed" 
          role="log" 
          aria-live="polite"
        >
          {activeComments.map((c) => (
            <div
              key={c.id}
              className={`${styles.commentCard} ${c.isExiting ? styles.exiting : ''}`}
            >
              {/* Quote Text and Author formatted like previous version */}
              <div className={styles.contentBlock}>
                <div className={styles.quoteText}>"{c.quote.text}"</div>
                <div className={styles.quoteAuthor}>— {c.quote.author}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        className={styles.toggleButton} 
        onClick={() => setShowComments(!showComments)}
        type="button"
        aria-label={showComments ? 'Hide comments' : 'Show comments'}
      >
        {showComments ? 'turn comments off' : 'turn comments on'}
      </button>
    </>
  );
}

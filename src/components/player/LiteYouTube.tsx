'use client';

import { useState, useCallback } from 'react';
import styles from './LiteYouTube.module.css';

/** Props for the {@link LiteYouTube} component. */
interface LiteYouTubeProps {
  /** The YouTube video ID (the `v` param). */
  videoId: string;
  /** Accessible title for the iframe / poster button. */
  title: string;
  /** Optional poster override URL. Defaults to YouTube's maxresdefault thumbnail. */
  poster?: string;
}

/**
 * A lightweight YouTube embed facade that loads **zero** YouTube JS
 * until the user clicks play, saving ~500 KB per embed.
 *
 * @example
 * ```tsx
 * <LiteYouTube videoId="dQw4w9WgXcQ" title="Never Gonna Give You Up" />
 * ```
 */
export function LiteYouTube({ videoId, title, poster }: LiteYouTubeProps): React.JSX.Element {
  const [activated, setActivated] = useState<boolean>(false);

  const posterSrc = poster ?? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  const handleActivate = useCallback(() => {
    setActivated(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      {activated ? (
        <iframe
          className={styles.iframe}
          src={embedSrc}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          className={styles.poster}
          onClick={handleActivate}
          aria-label={`Play ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.posterImage}
            src={posterSrc}
            alt={`Thumbnail for ${title}`}
            loading="lazy"
          />
          <span className={styles.playButton} aria-hidden="true">
            <span className={styles.playIcon} />
          </span>
        </button>
      )}
    </div>
  );
}

export default LiteYouTube;

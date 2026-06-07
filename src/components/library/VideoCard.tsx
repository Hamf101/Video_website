'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/lib/videoData';
import styles from './VideoCard.module.css';

/** Props for the VideoCard component. */
interface VideoCardProps {
  /** The video data to display. */
  video: Video;
}

/**
 * Individual video thumbnail card.
 *
 * Displays a poster image with a title overlay, duration badge,
 * and a play ring that appears on hover. The entire card links
 * to the video detail page at `/video/[slug]`.
 */
export default function VideoCard({ video }: VideoCardProps): React.JSX.Element {
  return (
    <Link href={`/?v=${video.slug}`} scroll={false} prefetch={false} className={styles.card}>
      <div className={styles.thumbnailContainer}>
        {video.poster ? (
          <Image
            src={video.poster}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.poster}
          />
        ) : video.source === 'self-hosted' ? (
          <video
            src={`${video.videoId}#t=0.1`}
            className={styles.poster}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            preload="metadata"
            muted
            playsInline
          />
        ) : (
          <div className={styles.poster} style={{ backgroundColor: '#222', width: '100%', height: '100%' }} />
        )}
        <span className={styles.duration}>{video.duration}</span>
      </div>
      <span className={styles.title}>{video.title}</span>
    </Link>
  );
}

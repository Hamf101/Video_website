import type { Video } from '@/lib/videoData';
import VideoCard from './VideoCard';
import styles from './VideoGrid.module.css';

/** Props for the VideoGrid component. */
interface VideoGridProps {
  /** Array of videos to display in the grid. */
  videos: Video[];
}

/**
 * Responsive grid of VideoCard components.
 *
 * Renders 1 column on mobile (<640px), 2 on tablet, and 3 on
 * desktop (>1024px) with an 8px gap between cards.
 */
export default function VideoGrid({ videos }: VideoGridProps): React.JSX.Element {
  return (
    <div className={styles.grid}>
      {videos.map((video) => (
        <VideoCard key={video.slug} video={video} />
      ))}
    </div>
  );
}

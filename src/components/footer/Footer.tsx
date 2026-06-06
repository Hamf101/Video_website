import styles from './Footer.module.css';

/**
 * Minimal dark footer with copyright and subtle branding.
 * Keeps the cinematic, content-first aesthetic.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copyright}>
          FOrigins Studio
        </p>
        <p className={styles.copyright}>
          &copy; {year} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

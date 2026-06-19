import React from 'react';
import logo from '../../assets/logo.svg';
import styles from './Sidebar.module.css';

export function Sidebar({ currentView, onViewChange, likedCount = 0 }) {
  const playlists = [
    'Découvertes de la semaine',
    'Radar des sorties',
    'Chill Vibes',
    'Focus Rap',
    'Classiques Rock',
    'Électro Party',
    'Jazz Café',
  ];

  return (
    <aside className={styles.sidebar} aria-label="Navigation principale">
      <div className={styles.brand}>
        <img src={logo} alt="Spotify Clone Logo" className={styles.logo} />
        <span className={styles.appName}>Spotify</span>
      </div>

      <nav className={styles.navGroup} aria-label="Menu principal">
        <button
          type="button"
          className={`${styles.navItem} ${currentView === 'all' ? styles.active : ''}`}
          onClick={() => onViewChange('all')}
          aria-label="Accueil"
        >
          <svg viewBox="0 0 24 24" className={styles.navIcon} fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className={styles.navText}>Accueil</span>
        </button>

        <button
          type="button"
          className={`${styles.navItem} ${currentView === 'liked' ? styles.active : ''}`}
          onClick={() => onViewChange('liked')}
          aria-label="Titres Likés"
        >
          <svg viewBox="0 0 24 24" className={styles.navIcon} fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className={styles.navText}>Titres Likés</span>
          {likedCount > 0 && <span className={styles.badge}>{likedCount}</span>}
        </button>
      </nav>

      <div className={styles.librarySection}>
        <div className={styles.libraryHeader}>
          <svg viewBox="0 0 24 24" className={styles.libraryIcon} fill="currentColor">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
          </svg>
          <span className={styles.libraryTitle}>Bibliothèque</span>
        </div>

        <ul className={styles.playlistList}>
          {playlists.map((playlist, idx) => (
            <li key={idx} className={styles.playlistItem}>
              <button type="button" className={styles.playlistLink} title={playlist}>
                {playlist}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

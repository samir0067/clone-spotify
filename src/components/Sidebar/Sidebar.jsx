import React from 'react';
import styles from './Sidebar.module.css';

export function Sidebar({
  playlists = [],
  activeView = 'home',
  onViewChange,
  onCreatePlaylist,
}) {
  return (
    <aside className={styles.sidebar} aria-label="Navigation principale">
      {/* 1. Main Navigation Block */}
      <div className={styles.navBlock}>
        <button
          className={`${styles.navItem} ${activeView === 'home' ? styles.active : ''}`}
          onClick={() => onViewChange('home')}
          aria-label="Accueil"
        >
          <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
            <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20a1 1 0 001 1h5v-7h4v7h5a1 1 0 001-1V7.577l-7.5-4.33z" />
          </svg>
          <span className={styles.label}>Accueil</span>
        </button>
      </div>

      {/* 2. Library & Playlists Block */}
      <div className={styles.libraryBlock}>
        <div className={styles.libraryHeader}>
          <div className={styles.libraryTitle}>
            <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
              <path d="M3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zM6 2a1 1 0 00-1 1v18a1 1 0 002 0V3a1 1 0 00-1-1zm6 3a3 3 0 00-3 3v8a3 3 0 006 0V8a3 3 0 00-3-3zm1 11a1 1 0 01-2 0V8a1 1 0 012 0v8zm8-11a3 3 0 00-3 3v8a3 3 0 006 0V8a3 3 0 00-3-3zm1 11a1 1 0 01-2 0V8a1 1 0 012 0v8z" />
            </svg>
            <span className={styles.libraryLabel}>Bibliothèque</span>
          </div>
          <button
            className={styles.createBtn}
            onClick={onCreatePlaylist}
            aria-label="Créer une playlist"
            title="Créer une playlist"
          >
            <svg viewBox="0 0 24 24" className={styles.plusIcon} fill="currentColor">
              <path d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2h8z" />
            </svg>
          </button>
        </div>

        <div className={styles.libraryScrollable}>
          {/* Liked Songs Item */}
          <button
            className={`${styles.playlistItem} ${activeView === 'liked' ? styles.active : ''}`}
            onClick={() => onViewChange('liked')}
            aria-label="Titres aimés"
          >
            <div className={styles.likedSongsBadge}>
              <svg viewBox="0 0 24 24" className={styles.badgeHeartIcon} fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className={styles.playlistMeta}>
              <span className={styles.playlistName}>Titres aimés</span>
              <span className={styles.playlistCount}>Playlist • Coups de cœur</span>
            </div>
          </button>

          {/* User Playlists List */}
          {playlists.map((playlist) => {
            const isPlaylistActive = activeView === `playlist-${playlist.id}`;
            return (
              <button
                key={playlist.id}
                className={`${styles.playlistItem} ${isPlaylistActive ? styles.active : ''}`}
                onClick={() => onViewChange(`playlist-${playlist.id}`)}
                aria-label={`Playlist ${playlist.name}`}
              >
                <div className={styles.playlistIcon}>
                  <svg viewBox="0 0 24 24" className={styles.playlistSvg} fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-5h2v5zm0-7h-2V7h2v2z" />
                  </svg>
                </div>
                <div className={styles.playlistMeta}>
                  <span className={styles.playlistName}>{playlist.name}</span>
                  <span className={styles.playlistCount}>
                    Playlist • {playlist.tracks.length} {playlist.tracks.length > 1 ? 'titres' : 'titre'}
                  </span>
                </div>
              </button>
            );
          })}

          {playlists.length === 0 && (
            <p className={styles.emptyText}>Aucune playlist créée</p>
          )}
        </div>
      </div>
    </aside>
  );
}

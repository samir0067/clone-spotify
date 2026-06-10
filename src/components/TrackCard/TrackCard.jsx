import React from 'react';
import { formatTime } from '../../utils/formatTime';
import fallbackCover from '../../assets/album-cover.png';
import styles from './TrackCard.module.css';

/**
 * TrackCard component showing a single song's details.
 * Serves as the convention template for all components.
 *
 * @param {object} props - Component props.
 * @param {object} props.track - The track object.
 * @param {string} props.track.title - Song title.
 * @param {string} props.track.artist - Artist name.
 * @param {string} [props.track.album] - Album name.
 * @param {number} props.track.duration - Duration in seconds.
 * @param {string} props.track.coverUrl - URL or import path of the cover image.
 * @param {boolean} [props.isPlaying=false] - Whether the song is currently playing.
 * @param {function} [props.onPlayToggle] - Event handler for clicking play/pause.
 */
export function TrackCard({ track, isPlaying = false, onPlayToggle, isFavorite = false, onFavoriteToggle }) {
  if (!track) return null;

  const { id, title, artist, album, duration, coverUrl } = track;

  const handleKeyPress = (event) => {
    if ((event.key === ' ' || event.key === 'Enter') && onPlayToggle) {
      event.preventDefault();
      onPlayToggle(track);
    }
  };

  // Si la pochette distante échoue, on bascule une seule fois sur l'image
  // locale de remplacement pour ne jamais afficher d'image cassée.
  const handleImageError = (event) => {
    const img = event.currentTarget;
    if (img.dataset.fallback) return;
    img.dataset.fallback = 'true';
    img.src = fallbackCover;
  };

  return (
    <div
      className={styles.card}
      tabIndex={0}
      role="button"
      aria-label={`Lire ${title} par ${artist}`}
      onKeyDown={handleKeyPress}
      onClick={() => onPlayToggle && onPlayToggle(track)}
    >
      <div className={styles.coverWrapper}>
        <img
          src={coverUrl}
          alt={`Pochette de l'album pour ${title}`}
          className={styles.cover}
          onError={handleImageError}
          loading="lazy"
        />
        <button
          className={`${styles.playButton} ${isPlaying ? styles.active : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onPlayToggle) onPlayToggle(track);
          }}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className={styles.playIcon} fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.playIcon} fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <h3 className={styles.title} title={title}>{title}</h3>
          <button
            type="button"
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onFavoriteToggle) onFavoriteToggle(id);
            }}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isFavorite ? (
              <svg viewBox="0 0 24 24" className={styles.heartIcon} fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={styles.heartIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
        </div>
        <p className={styles.artist}>{artist}</p>
        {album && <p className={styles.album}>{album}</p>}
        <span className={styles.duration} aria-label={`Durée : ${formatTime(duration)}`}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

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
export function TrackCard({ track, isPlaying = false, onPlayToggle, isLiked = false, onLikeToggle }) {
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
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.artist}>{artist}</p>
        {album && <p className={styles.album}>{album}</p>}
        <div className={styles.metaRow}>
          <span className={styles.duration} aria-label={`Durée : ${formatTime(duration)}`}>
            {formatTime(duration)}
          </span>
          <button
            type="button"
            className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onLikeToggle) onLikeToggle(id);
            }}
            aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <svg viewBox="0 0 24 24" className={styles.heartIcon} fill="currentColor">
              {isLiked ? (
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              ) : (
                <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

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
export function TrackCard({ track, isPlaying = false, onPlayToggle }) {
  if (!track) return null;

  const { title, artist, album, duration, coverUrl } = track;

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
        <span className={styles.duration} aria-label={`Durée : ${formatTime(duration)}`}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

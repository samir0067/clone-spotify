import React from 'react';
import { formatDuration } from '../../utils/formatDuration';
import fallbackCover from '../../assets/album-cover.png';
import styles from './TrackCard.module.css';

/**
 * TrackCard : la carte d'UN morceau (pochette + titre + artiste + durée).
 * Sert de gabarit de référence pour les conventions du projet
 * (1 composant = 1 responsabilité).
 *
 * @param {object} props
 * @param {object} props.track - Le morceau { title, artist, album, duration, cover }.
 * @param {boolean} [props.isPlaying=false] - Vrai si CE morceau est en lecture.
 * @param {function} [props.onPlayToggle] - Appelé avec le morceau au clic.
 */
export function TrackCard({ track, isPlaying = false, onPlayToggle }) {
  if (!track) return null;

  const { title, artist, album, duration, cover } = track;

  const handleKeyPress = (event) => {
    if ((event.key === ' ' || event.key === 'Enter') && onPlayToggle) {
      event.preventDefault();
      onPlayToggle(track);
    }
  };

  // Si la pochette ne charge pas, on bascule une seule fois sur l'image
  // locale de remplacement pour ne jamais afficher de case cassée.
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
          src={cover}
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
        <span className={styles.duration} aria-label={`Durée : ${formatDuration(duration)}`}>
          {formatDuration(duration)}
        </span>
      </div>
    </div>
  );
}

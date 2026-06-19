import React from 'react';
import { formatDuration } from '../../utils/formatDuration';
import fallbackCover from '../../assets/album-cover.png';
import styles from './Player.module.css';

/**
 * Player : la barre de lecture fixée en bas de l'écran.
 *
 * Volontairement visuel uniquement (pas d'audio réel) : il affiche le morceau
 * courant et un bouton play/pause qui bascule l'icône. La barre de progression
 * est décorative.
 *
 * @param {object} props
 * @param {object|null} props.track - Le morceau courant, ou null si aucun.
 * @param {boolean} props.isPlaying - État play/pause (visuel).
 * @param {function} props.onPlayToggle - Bascule play/pause.
 */
export function Player({ track, isPlaying, onPlayToggle }) {
  // Pochette de repli si l'image ne charge pas (jamais de case cassée).
  const handleImageError = (event) => {
    const img = event.currentTarget;
    if (img.dataset.fallback) return;
    img.dataset.fallback = 'true';
    img.src = fallbackCover;
  };

  return (
    <footer className={styles.playerBar} aria-label="Lecteur de musique">
      {/* Gauche : infos du morceau courant (ou état vide) */}
      <div className={styles.playerTrackInfo}>
        {track ? (
          <>
            <img
              src={track.cover}
              alt={`Pochette de ${track.title}`}
              className={styles.playerCover}
              onError={handleImageError}
            />
            <div className={styles.metaData}>
              <p className={styles.playerTitle} title={track.title}>
                {track.title}
              </p>
              <p className={styles.playerArtist} title={`${track.artist} • ${track.album}`}>
                {track.artist} • {track.album}
              </p>
            </div>
          </>
        ) : (
          <div className={styles.emptyTrackInfo}>
            <div className={styles.playerCoverPlaceholder} aria-hidden="true">
              <svg viewBox="0 0 24 24" className={styles.placeholderIcon} fill="currentColor">
                <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
              </svg>
            </div>
            <p className={styles.emptyText}>Sélectionnez un morceau</p>
          </div>
        )}
      </div>

      {/* Centre : bouton play/pause + barre de progression (décorative) */}
      <div className={styles.playerControlsContainer}>
        <button
          className={styles.playerPlayBtn}
          onClick={onPlayToggle}
          disabled={!track}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
          title={isPlaying ? 'Pause' : 'Lecture'}
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

        <div className={styles.progressBarContainer}>
          <span className={styles.timeLabel}>{track && isPlaying ? '0:42' : '0:00'}</span>
          <div className={styles.progressBar} aria-hidden="true">
            <div
              className={styles.progressBarFill}
              style={{ width: track && isPlaying ? '28%' : '0%' }}
            />
          </div>
          <span className={styles.timeLabel}>
            {track ? formatDuration(track.duration) : '0:00'}
          </span>
        </div>
      </div>

      {/* Droite : espace vide pour garder le bloc central centré */}
      <div className={styles.playerSpacer} aria-hidden="true" />
    </footer>
  );
}

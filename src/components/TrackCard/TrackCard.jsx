import React, { useState } from 'react';
import { formatTime } from '../../utils/formatTime';
import fallbackCover from '../../assets/album-cover.png';
import styles from './TrackCard.module.css';

/**
 * TrackCard component showing a single song's details.
 *
 * @param {object} props - Component props.
 * @param {object} props.track - The track object.
 * @param {boolean} [props.isPlaying=false] - Whether the song is currently playing.
 * @param {function} [props.onPlayToggle] - Event handler for clicking play/pause.
 * @param {boolean} [props.isLiked=false] - Whether the track is liked.
 * @param {function} [props.onLikeToggle] - Event handler for liking/unliking.
 * @param {Array<object>} [props.playlists=[]] - List of user playlists.
 * @param {function} [props.onAddToPlaylist] - Handler to add track to a playlist.
 */
export function TrackCard({
  track,
  isPlaying = false,
  onPlayToggle,
  isLiked = false,
  onLikeToggle,
  playlists = [],
  onAddToPlaylist,
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (!track) return null;

  const { id, title, artist, album, duration, coverUrl } = track;

  const handleKeyPress = (event) => {
    if ((event.key === ' ' || event.key === 'Enter') && onPlayToggle) {
      event.preventDefault();
      onPlayToggle(track);
    }
  };

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

        {/* 1. Equalizer overlay when active and playing */}
        {isPlaying && (
          <div className={styles.eqOverlay} aria-hidden="true">
            <div className={styles.eq}>
              <div className={styles.eqBar} />
              <div className={styles.eqBar} />
              <div className={styles.eqBar} />
              <div className={styles.eqBar} />
            </div>
          </div>
        )}

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
          
          {/* Options button (three dots) */}
          <div className={styles.menuContainer}>
            <button
              className={styles.menuButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              aria-label="Options de morceau"
              aria-haspopup="true"
              aria-expanded={showMenu}
              title="Ajouter à la playlist"
            >
              <svg viewBox="0 0 24 24" className={styles.dotsIcon} fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className={styles.backdrop} onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }} />
                <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                  <p className={styles.dropdownHeader}>Ajouter à la playlist</p>
                  <div className={styles.dropdownList}>
                    {playlists.map((pl) => (
                      <button
                        key={pl.id}
                        className={styles.dropdownItem}
                        onClick={() => {
                          onAddToPlaylist(pl.id, track);
                          setShowMenu(false);
                        }}
                      >
                        {pl.name}
                      </button>
                    ))}
                    {playlists.length === 0 && (
                      <span className={styles.dropdownEmpty}>Créer une playlist d&apos;abord</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className={styles.artist} title={artist}>{artist}</p>
        {album && <p className={styles.album} title={album}>{album}</p>}
        
        {/* Footer row with duration and Heart button */}
        <div className={styles.footerRow}>
          <span className={styles.duration} aria-label={`Durée : ${formatTime(duration)}`}>
            {formatTime(duration)}
          </span>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onLikeToggle) onLikeToggle(id);
            }}
            aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
            title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isLiked ? (
              <svg viewBox="0 0 24 24" className={styles.heartIcon} fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={styles.heartIconOutline} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


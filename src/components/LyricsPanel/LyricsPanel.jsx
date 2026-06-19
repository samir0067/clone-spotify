import React, { useEffect, useRef } from 'react';
import styles from './LyricsPanel.module.css';

export function LyricsPanel({
  track,
  currentTime,
  isPlaying,
  onClose,
  onSeek,
}) {
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  const lyrics = track?.lyrics || [];

  // Find the index of the current active lyric line
  const activeIndex = lyrics.reduce((acc, line, index) => {
    if (currentTime >= line.time) {
      return index;
    }
    return acc;
  }, 0);

  // Auto-scroll the active line to the center of the viewport
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!track) {
    return (
      <div className={styles.panel} aria-label="Paroles de chanson">
        <div className={styles.header}>
          <h2 className={styles.title}>Paroles</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
            &times;
          </button>
        </div>
        <div className={styles.emptyState}>
          <p>Lancez un morceau pour afficher ses paroles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel} aria-label={`Paroles de ${track.title}`}>
      {/* Header with track details and Close button */}
      <div className={styles.header}>
        <div className={styles.trackInfo}>
          <img
            src={track.coverUrl}
            alt=""
            className={styles.miniCover}
          />
          <div className={styles.meta}>
            <h4 className={styles.trackTitle}>{track.title}</h4>
            <span className={styles.trackArtist}>{track.artist}</span>
          </div>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fermer les paroles"
          title="Fermer les paroles"
        >
          <svg viewBox="0 0 24 24" className={styles.closeIcon} fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      {/* Real-time frequency visualizer banner */}
      <div className={styles.visualizerBanner}>
        <span className={styles.visualizerLabel}>
          {isPlaying ? 'Paroles en direct' : 'Lecture en pause'}
        </span>
        <div className={`${styles.equalizer} ${!isPlaying ? styles.paused : ''}`}>
          <div className={styles.eqBar} />
          <div className={styles.eqBar} />
          <div className={styles.eqBar} />
          <div className={styles.eqBar} />
          <div className={styles.eqBar} />
        </div>
      </div>

      {/* Lyrics Scrollable container */}
      <div className={styles.scrollContainer} ref={containerRef}>
        <div className={styles.lyricsList}>
          {lyrics.map((line, index) => {
            const isActive = index === activeIndex;
            const isPassed = index < activeIndex;

            return (
              <p
                key={index}
                ref={isActive ? activeLineRef : null}
                className={`${styles.lyricLine} ${
                  isActive ? styles.active : isPassed ? styles.passed : ''
                }`}
                onClick={() => onSeek && onSeek(line.time)}
                role="button"
                tabIndex={0}
                aria-label={`Positionner la lecture à la parole : ${line.text}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSeek) onSeek(line.time);
                  }
                }}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

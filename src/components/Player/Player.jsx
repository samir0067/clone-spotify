import React from 'react';
import { formatTime } from '../../utils/formatTime';
import fallbackCover from '../../assets/album-cover.png';
import styles from './Player.module.css';

/**
 * Player component - Fixed media bar at the bottom of the screen.
 *
 * @param {object} props - Component props.
 * @param {object} props.track - The currently selected track object, or null.
 * @param {boolean} props.isPlaying - Play/pause state.
 * @param {number} props.currentTime - Real current playback position in seconds.
 * @param {number} props.duration - Real audio duration in seconds.
 * @param {boolean} props.isBuffering - True if audio is loading/buffering.
 * @param {boolean} props.hasError - True if playback failed.
 * @param {number} props.volume - Current volume (0.0 to 1.0).
 * @param {boolean} props.isMuted - True if audio is muted.
 * @param {function} props.onPlayToggle - Toggles play/pause state.
 * @param {function} props.onNext - Plays the next track.
 * @param {function} props.onPrev - Plays the previous track.
 * @param {function} props.onSeek - Seeks to a specific position in seconds.
 * @param {function} props.onVolumeChange - Changes volume level (0.0 to 1.0).
 * @param {function} props.onMuteToggle - Toggles mute state.
 */
export function Player({
  track,
  isPlaying,
  currentTime,
  duration,
  isBuffering,
  hasError,
  volume,
  isMuted,
  onPlayToggle,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onMuteToggle,
}) {
  // Image load fallback helper
  const handleImageError = (event) => {
    const img = event.currentTarget;
    if (img.dataset.fallback) return;
    img.dataset.fallback = 'true';
    img.src = fallbackCover;
  };

  // Determine display duration (fallback to hardcoded metadata if audio is not loaded)
  const displayDuration = duration && !isNaN(duration) ? duration : (track?.duration || 0);

  // Calculate percentage of track progress
  const progressPercentage = displayDuration > 0 ? (currentTime / displayDuration) * 100 : 0;

  // Calculate percentage of volume
  const volumePercentage = isMuted ? 0 : volume * 100;

  // Handle clicking on the progress bar to seek
  const handleProgressClick = (e) => {
    if (!track || !onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    onSeek(percentage * displayDuration);
  };

  // Handle clicking on the volume bar to adjust volume
  const handleVolumeClick = (e) => {
    if (!onVolumeChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    onVolumeChange(percentage);
  };

  return (
    <footer className={styles.playerBar} aria-label="Lecteur de musique">
      {/* 1. Left Section: Track Info & Error Messages */}
      <div className={styles.playerTrackInfo}>
        {track ? (
          <>
            <img
              src={track.coverUrl}
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
              {hasError && (
                <span className={styles.errorIndicator} aria-live="polite">
                  ⚠️ Erreur de chargement
                </span>
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyTrackInfo}>
            <div className={styles.playerCoverPlaceholder} aria-hidden="true">
              <svg viewBox="0 0 24 24" className={styles.placeholderIcon} fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
              </svg>
            </div>
            <p className={styles.emptyText}>Sélectionnez un morceau</p>
          </div>
        )}
      </div>

      {/* 2. Center Section: Playback Controls & Progress Bar */}
      <div className={styles.playerControlsContainer}>
        <div className={styles.playerControls}>
          <button
            className={styles.controlBtn}
            onClick={onPrev}
            disabled={!track}
            aria-label="Morceau précédent"
            title="Précédent"
          >
            <svg viewBox="0 0 24 24" className={styles.controlIcon} fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            className={styles.playerPlayBtn}
            onClick={onPlayToggle}
            disabled={!track}
            aria-label={isPlaying ? 'Pause' : 'Lecture'}
            title={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isBuffering && isPlaying ? (
              <svg viewBox="0 0 24 24" className={styles.spinner} aria-hidden="true">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="32"
                  strokeLinecap="round"
                />
              </svg>
            ) : isPlaying && track ? (
              <svg viewBox="0 0 24 24" className={styles.playIcon} fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={styles.playIcon} fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            className={styles.controlBtn}
            onClick={onNext}
            disabled={!track}
            aria-label="Morceau suivant"
            title="Suivant"
          >
            <svg viewBox="0 0 24 24" className={styles.controlIcon} fill="currentColor">
              <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
            </svg>
          </button>
        </div>

        <div className={styles.progressBarContainer}>
          <span className={styles.timeLabel} aria-label="Temps écoulé">
            {track ? formatTime(currentTime) : '0:00'}
          </span>
          <div
            className={styles.progressBar}
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax={displayDuration}
            aria-valuenow={currentTime}
            tabIndex={track ? 0 : -1}
          >
            <div
              className={styles.progressBarFill}
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
          <span className={styles.timeLabel} aria-label="Durée totale">
            {track ? formatTime(displayDuration) : '0:00'}
          </span>
        </div>
      </div>

      {/* 3. Right Section: Volume & Mute Controls */}
      <div className={styles.playerVolume}>
        <button
          className={styles.volumeBtn}
          onClick={onMuteToggle}
          disabled={!track}
          aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          title={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {isMuted || volume === 0 ? (
            <span className={styles.volumeIcon} aria-hidden="true">
              🔇
            </span>
          ) : volume < 0.4 ? (
            <span className={styles.volumeIcon} aria-hidden="true">
              🔈
            </span>
          ) : (
            <span className={styles.volumeIcon} aria-hidden="true">
              🔊
            </span>
          )}
        </button>
        <div
          className={`${styles.volumeSlider} ${!track ? styles.disabledSlider : ''}`}
          onClick={track ? handleVolumeClick : undefined}
          aria-label="Volume"
        >
          <div
            className={styles.volumeSliderProgress}
            style={{
              width: `${volumePercentage}%`,
            }}
          />
        </div>
      </div>
    </footer>
  );
}

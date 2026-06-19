import React from 'react';
import { useFetchTracks } from '../../hooks/useFetchTracks';
import styles from './FetchedTracksList.module.css';

/**
 * FetchedTracksList component - Example of using the useFetchTracks hook
 *
 * This component demonstrates how to:
 * - Fetch tracks from /tracks.json using the custom hook
 * - Handle loading state with a spinner
 * - Handle error state with an error message
 * - Display the fetched tracks in a list
 *
 * The hook manages all three states internally, making the component
 * clean and easy to understand.
 */
export function FetchedTracksList() {
  const { data: tracks, loading, error } = useFetchTracks();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Chargement des morceaux...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p className={styles.errorIcon}>⚠️</p>
          <p className={styles.errorMessage}>Erreur lors du chargement des morceaux</p>
          <p className={styles.errorDetails}>{error}</p>
        </div>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>Aucun morceau disponible</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Morceaux chargés (API)</h3>
        <span className={styles.count}>{tracks.length} morceaux</span>
      </div>

      <ul className={styles.list}>
        {tracks.map((track) => (
          <li key={track.id} className={styles.item}>
            <div className={styles.cover}>
              <img src={track.cover || 'data:image/svg+xml,%3Csvg/%3E'} alt={track.title} />
            </div>
            <div className={styles.info}>
              <h4 className={styles.title}>{track.title}</h4>
              <p className={styles.artist}>{track.artist}</p>
              <p className={styles.meta}>
                {track.genre} • {track.album} • {track.year}
              </p>
            </div>
            <div className={styles.duration}>{formatDuration(track.duration)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Helper function to format duration from seconds to mm:ss
 */
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

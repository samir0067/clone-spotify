import React from 'react';
import styles from './GenreFilter.module.css';

/**
 * GenreFilter component for filtering tracks by genre.
 *
 * This component displays a horizontal list of genre buttons that allows
 * users to filter the track list. Only one genre can be selected at a time.
 * Clicking "Tous les genres" will reset and show all tracks.
 *
 * @param {object} props - Component props.
 * @param {string[]} props.genres - Array of available genre names.
 * @param {string | null} props.selectedGenre - Currently selected genre (null for all).
 * @param {function} props.onGenreSelect - Callback when a genre is selected.
 *   Called with the genre string or null for "all genres".
 */
export function GenreFilter({ genres, selectedGenre = null, onGenreSelect }) {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterLabel}>Filtrer par genre :</div>

      <div className={styles.genreList}>
        {/* "All genres" button */}
        <button
          type="button"
          className={`${styles.genreButton} ${selectedGenre === null ? styles.active : ''}`}
          onClick={() => onGenreSelect(null)}
          aria-pressed={selectedGenre === null}
        >
          Tous les genres
        </button>

        {/* Genre buttons */}
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`${styles.genreButton} ${selectedGenre === genre ? styles.active : ''}`}
            onClick={() => onGenreSelect(genre)}
            aria-pressed={selectedGenre === genre}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

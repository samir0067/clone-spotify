import React from 'react';
import styles from './Filters.module.css';

export function Filters({
  genres = ['Tous', 'Pop', 'Rap', 'Rock', 'Électro', 'Jazz'],
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSortChange,
  selectedDecade = 'all',
  onSelectDecade,
  selectedDuration = 'all',
  onSelectDuration,
}) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.genres}>
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`${styles.genrePill} ${
              selectedGenre === genre ? styles.active : ''
            }`}
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className={styles.controlsGroup}>
        <div className={styles.control}>
          <label htmlFor="decade-select" className={styles.controlLabel}>
            Époque :
          </label>
          <select
            id="decade-select"
            className={styles.controlSelect}
            value={selectedDecade}
            onChange={(e) => onSelectDecade && onSelectDecade(e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="2020s">Années 2020+</option>
            <option value="2010s">Années 2010s</option>
            <option value="oldies">2000 & avant</option>
          </select>
        </div>

        <div className={styles.control}>
          <label htmlFor="duration-select" className={styles.controlLabel}>
            Durée :
          </label>
          <select
            id="duration-select"
            className={styles.controlSelect}
            value={selectedDuration}
            onChange={(e) => onSelectDuration && onSelectDuration(e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="short">Court (&lt; 3:30)</option>
            <option value="long">Long (&ge; 3:30)</option>
          </select>
        </div>

        <div className={styles.control}>
          <label htmlFor="sort-select" className={styles.controlLabel}>
            Trier par :
          </label>
          <select
            id="sort-select"
            className={styles.controlSelect}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">Recommandé</option>
            <option value="title-asc">Nom (A-Z)</option>
            <option value="title-desc">Nom (Z-A)</option>
            <option value="year-desc">Plus récent</option>
            <option value="year-asc">Plus ancien</option>
            <option value="duration-asc">Durée (Plus court)</option>
            <option value="duration-desc">Durée (Plus long)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

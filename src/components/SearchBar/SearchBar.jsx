import React, { useState } from 'react';
import styles from './SearchBar.module.css';

/**
 * SearchBar component: a controlled search input for the top bar.
 *
 * The typed value is held in local state (controlled input) and propagated
 * to the parent through the `onSearch` callback on every change. The actual
 * filtering logic is expected to live in the parent and will be wired later.
 *
 * @param {object} props - Component props.
 * @param {function} [props.onSearch] - Called with the current input value on each change.
 * @param {string} [props.placeholder='Que souhaitez-vous écouter ?'] - Input placeholder.
 */
export function SearchBar({ onSearch, placeholder = 'Que souhaitez-vous écouter ?' }) {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className={styles.searchBar}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 2a8 8 0 105.293 14.707l4.5 4.5a1 1 0 001.414-1.414l-4.5-4.5A8 8 0 0010 2zm-6 8a6 6 0 1112 0 6 6 0 01-12 0z" />
      </svg>
      <input
        type="search"
        className={styles.input}
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Rechercher"
      />
    </div>
  );
}

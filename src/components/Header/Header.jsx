import React from 'react';
import logo from '../../assets/logo.svg';
import styles from './Header.module.css';

/**
 * Header component for the top bar of the application.
 *
 * Layout (left → right):
 *  - App logo and name
 *  - A central slot reserved for the search bar (passed via `children`)
 *  - A placeholder user avatar
 *
 * The header is fixed to the top of the viewport so it stays visible on scroll.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} [props.children] - Content for the central slot,
 *   intended to host the SearchBar component once it is created.
 * @param {string} [props.appName='Spotify'] - Application name shown next to the logo.
 * @param {string} [props.userName='Utilisateur'] - User name used for the avatar label.
 */
export function Header({ children, appName = 'Spotify', userName = 'Utilisateur' }) {
  // Build initials from the user name for the fallback avatar.
  const initials = userName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img src={logo} alt="" className={styles.logo} />
        <span className={styles.appName}>{appName}</span>
      </div>

      <div className={styles.searchSlot}>{children}</div>

      <button
        type="button"
        className={styles.avatar}
        aria-label={`Compte de ${userName}`}
        title={userName}
      >
        <span aria-hidden="true">{initials}</span>
      </button>
    </header>
  );
}

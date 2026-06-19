import React, { useState } from 'react';
import styles from './AppMono.module.css';

/*
 * ============================================================================
 *  CLONE SPOTIFY — VERSION MONOLITHIQUE (« avant » de la démo Architecture)
 * ============================================================================
 *
 *  TOUT est dans ce seul fichier : les données en dur, les helpers, et tous
 *  les "composants" (header, recherche, carte, liste, lecteur). C'est exprès :
 *  c'est l'état de départ qu'on va RANGER en direct avec l'IA.
 *
 *  Le rendu est IDENTIQUE au clone principal. Seule l'organisation change.
 *
 *  COMMENT L'AFFICHER : dans src/main.jsx, commenter l'import de ./App et
 *  décommenter l'import de ./AppMono (une seule ligne à changer).
 *
 *  Objectif de la démo : demander à l'IA un découpage, puis extraire
 *  TrackCard, TrackList et Player dans /components un par un.
 * ============================================================================
 */

// --- Données EN DUR (les mêmes 12 morceaux que /tracks.json) -----------------
const TRACKS = [
  { id: 1, title: 'Golden Hour', artist: 'Mira Solenne', album: 'Daylight', duration: 213, cover: '/covers/cover-1.svg' },
  { id: 2, title: 'Electric Smile', artist: 'The Lanterns', album: 'Neon Youth', duration: 224, cover: '/covers/cover-2.svg' },
  { id: 3, title: 'Midnight Drive', artist: 'Halo Bright', album: 'Sweet Static', duration: 232, cover: '/covers/cover-3.svg' },
  { id: 4, title: 'Concrete Crown', artist: 'D-Lowe', album: 'City Pressure', duration: 241, cover: '/covers/cover-4.svg' },
  { id: 5, title: 'Marble Floors', artist: 'Kassi K', album: 'After Hours Money', duration: 215, cover: '/covers/cover-5.svg' },
  { id: 6, title: 'Paper Trail', artist: 'Vex', album: 'Receipts', duration: 179, cover: '/covers/cover-6.svg' },
  { id: 7, title: 'Hollow Bones', artist: 'Iron Tide', album: 'Saltwater', duration: 268, cover: '/covers/cover-7.svg' },
  { id: 8, title: 'Wildfire', artist: 'Northpoint', album: 'Embers', duration: 231, cover: '/covers/cover-8.svg' },
  { id: 9, title: 'Static Hymn', artist: 'Cobalt Year', album: 'Analog Heart', duration: 298, cover: '/covers/cover-9.svg' },
  { id: 10, title: 'Neon Drift', artist: 'Cyberwave Systems', album: 'Grid Runner', duration: 245, cover: '/covers/cover-10.svg' },
  { id: 11, title: 'Vapor Trails', artist: 'Lune Noire', album: 'Sous la Ville', duration: 229, cover: '/covers/cover-11.svg' },
  { id: 12, title: 'Blue Marrow', artist: 'The Ellis Quartet', album: 'Late Set', duration: 342, cover: '/covers/cover-12.svg' },
];

// Pochette de repli (SVG inline) si une image ne charge pas : jamais de case cassée.
const FALLBACK_COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#282828"/><text x="150" y="170" font-size="120" text-anchor="middle" fill="#1db954">♪</text></svg>'
  );

// Formate une durée en secondes vers "m:ss".
function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

function handleCoverError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = 'true';
  img.src = FALLBACK_COVER;
}

// --- "Composant" carte d'un morceau (tout en vrac dans App.jsx) ---------------
function TrackCard({ track, isPlaying, onSelect }) {
  if (!track) return null;
  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(track)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(track)}
      aria-label={`Lire ${track.title} par ${track.artist}`}
    >
      <div className={styles.coverWrapper}>
        <img
          src={track.cover}
          alt={`Pochette de ${track.title}`}
          className={styles.cover}
          onError={handleCoverError}
          loading="lazy"
        />
        <button
          className={`${styles.playButton} ${isPlaying ? styles.active : ''}`}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(track);
          }}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>
      <h3 className={styles.title}>{track.title}</h3>
      <p className={styles.artist}>{track.artist}</p>
      <span className={styles.duration}>{formatDuration(track.duration)}</span>
    </div>
  );
}

// --- "Composant" liste de morceaux -------------------------------------------
function TrackList({ tracks, currentTrackId, isPlaying, onSelect }) {
  if (!tracks || tracks.length === 0) {
    return <p className={styles.empty}>Aucun morceau à afficher.</p>;
  }
  return (
    <ul className={styles.grid}>
      {tracks.map((track) => (
        <li key={track.id}>
          <TrackCard
            track={track}
            isPlaying={isPlaying && currentTrackId === track.id}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}

// --- "Composant" lecteur (barre du bas) --------------------------------------
function Player({ track, isPlaying, onToggle }) {
  return (
    <footer className={styles.playerBar} aria-label="Lecteur de musique">
      <div className={styles.playerInfo}>
        {track ? (
          <>
            <img
              src={track.cover}
              alt={`Pochette de ${track.title}`}
              className={styles.playerCover}
              onError={handleCoverError}
            />
            <div className={styles.playerMeta}>
              <p className={styles.playerTitle}>{track.title}</p>
              <p className={styles.playerArtist}>
                {track.artist} • {track.album}
              </p>
            </div>
          </>
        ) : (
          <p className={styles.playerEmpty}>Sélectionnez un morceau</p>
        )}
      </div>

      <div className={styles.playerControls}>
        <button
          className={styles.playerPlayBtn}
          onClick={onToggle}
          disabled={!track}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <div className={styles.progressBar} aria-hidden="true">
          <div
            className={styles.progressBarFill}
            style={{ width: track && isPlaying ? '28%' : '0%' }}
          />
        </div>
      </div>

      <div className={styles.playerSpacer} aria-hidden="true" />
    </footer>
  );
}

// --- App : assemble tout (recherche + liste + lecteur) -----------------------
export function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [query, setQuery] = useState('');

  // Clic sur un morceau : bascule play/pause si c'est le même, sinon on change.
  const selectTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying((p) => !p);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (currentTrack) setIsPlaying((p) => !p);
  };

  // Filtre sur le titre ou l'artiste.
  const q = query.trim().toLowerCase();
  const filteredTracks = q
    ? TRACKS.filter(
        (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
      )
    : TRACKS;

  return (
    <div className={styles.container}>
      {/* Header + recherche */}
      <header className={styles.header}>
        <span className={styles.brand}>♪ Spotify</span>
        <input
          type="search"
          name="search"
          className={styles.search}
          placeholder="Que souhaitez-vous écouter ?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher"
        />
        <span className={styles.avatar} aria-hidden="true">
          U
        </span>
      </header>

      {/* Contenu principal */}
      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>Titres populaires</h2>
        <p className={styles.sectionSubtitle}>
          {filteredTracks.length} morceau{filteredTracks.length > 1 ? 'x' : ''} affiché
          {filteredTracks.length > 1 ? 's' : ''}.
        </p>
        <TrackList
          tracks={filteredTracks}
          currentTrackId={currentTrack?.id}
          isPlaying={isPlaying}
          onSelect={selectTrack}
        />
      </main>

      {/* Lecteur */}
      <Player track={currentTrack} isPlaying={isPlaying} onToggle={togglePlay} />
    </div>
  );
}

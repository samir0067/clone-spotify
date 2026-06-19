import React, { useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { useTracks } from '../../hooks/useTracks';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import styles from './Home.module.css';

/**
 * Home : la page principale du clone.
 *
 * Les morceaux viennent d'une « API » : on les charge avec le hook useTracks,
 * qui fait un fetch sur /tracks.json et gère les 3 états (chargement / succès /
 * erreur). Plus aucune donnée en dur ici.
 */
export function Home() {
  // Lecteur (morceau courant + play/pause).
  const { currentTrack, isPlaying, select, toggle } = usePlayer();

  // Données chargées depuis /tracks.json + les 3 états.
  const { tracks, loading, error, refetch } = useTracks();

  // Recherche : on garde la saisie dans un state, puis on filtre la liste.
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTracks = normalizedQuery
    ? tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(normalizedQuery) ||
          track.artist.toLowerCase().includes(normalizedQuery)
      )
    : tracks;

  return (
    <div className={styles.container}>
      <Header>
        <SearchBar onSearch={setQuery} />
      </Header>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Titres populaires</h2>

          {/* État 1 : ça charge → squelettes animés */}
          {loading && (
            <div className={styles.skeletonGrid} aria-label="Chargement des morceaux">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.skeletonCard}>
                  <div className={styles.skeletonCover} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonArtist}`} />
                </div>
              ))}
            </div>
          )}

          {/* État 3 : ça a raté → message clair (jamais d'écran blanc) */}
          {error && (
            <div className={styles.errorContainer} role="alert">
              <strong className={styles.errorTitle}>Impossible de charger les morceaux</strong>
              <p className={styles.errorMessage}>{error}</p>
              <button className={styles.retryButton} onClick={refetch}>
                Réessayer
              </button>
            </div>
          )}

          {/* État 2 : ça marche → on affiche la liste */}
          {!loading && !error && (
            <>
              <p className={styles.sectionSubtitle}>
                {filteredTracks.length} morceau{filteredTracks.length > 1 ? 'x' : ''} affiché
                {filteredTracks.length > 1 ? 's' : ''}.
              </p>
              <TrackList
                tracks={filteredTracks}
                onTrackSelect={select}
                currentTrackId={currentTrack?.id}
                isPlaying={isPlaying}
              />
            </>
          )}
        </section>
      </main>

      <Player track={currentTrack} isPlaying={isPlaying} onPlayToggle={toggle} />
    </div>
  );
}

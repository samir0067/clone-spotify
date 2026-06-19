import React, { useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { TRACKS } from '../../data/tracks';
import styles from './Home.module.css';

/**
 * Home : la page principale du clone.
 *
 * État de départ du cours :
 *   - Les morceaux viennent des DONNÉES EN DUR (import { TRACKS }).
 *   - /tracks.json existe déjà dans /public mais n'est PAS encore branché.
 *     C'est l'objet de la Démo 2 : remplacer cet import par un fetch via un hook.
 */
export function Home() {
  // Lecteur (morceau courant + play/pause), géré par notre hook.
  const { currentTrack, isPlaying, select, toggle } = usePlayer();

  // Recherche : on garde la saisie dans un state, puis on filtre la liste.
  const [query, setQuery] = useState('');

  // Filtre sur le titre OU l'artiste, insensible à la casse.
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTracks = normalizedQuery
    ? TRACKS.filter(
      (track) =>
        track.title.toLowerCase().includes(normalizedQuery) ||
        track.artist.toLowerCase().includes(normalizedQuery)
    )
    : TRACKS;

  return (
    <div className={styles.container}>
      <Header>
        <SearchBar onSearch={setQuery} />
      </Header>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Titres populaires</h2>
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
        </section>
      </main>

      <Player track={currentTrack} isPlaying={isPlaying} onPlayToggle={toggle} />
    </div>
  );
}


import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { useTracks } from '../../hooks/useTracks';
import styles from './Home.module.css';

export function Home() {
  const nextTrackRef = React.useRef(null);
  const { tracks, loading, error, refetch } = useTracks();

  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    isBuffering,
    hasError,
    volume,
    isMuted,
    play,
    toggle,
    seek,
    setVolume,
    toggleMute,
  } = useAudio({
    onEnded: () => {
      if (nextTrackRef.current) {
        nextTrackRef.current();
      }
    },
  });

  // Le filtrage sera branché plus tard ; pour l'instant on remonte la saisie.
  const handleSearch = (value) => {
    // eslint-disable-next-line no-console -- log temporaire de démonstration
    console.log('Recherche :', value);
  };

  // Clic sur une carte : on remonte le morceau sélectionné (affiché en console)
  // et on déclenche la lecture via le hook audio existant.
  const handleTrackSelect = (track) => {
    // eslint-disable-next-line no-console -- log temporaire de démonstration
    console.log('Morceau sélectionné :', track);
    if (currentTrack && currentTrack.id === track.id) {
      toggle();
    } else {
      play(track);
    }
  };

  // Navigue vers le morceau suivant dans le catalogue (boucle au début si à la fin)
  const handleNextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % tracks.length;
    play(tracks[nextIndex]);
  };

  // Navigue vers le morceau précédent dans le catalogue (boucle à la fin si au début)
  const handlePrevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    play(tracks[prevIndex]);
  };

  // Keep ref up to date to avoid stale closure in useAudio onEnded callback
  React.useEffect(() => {
    nextTrackRef.current = handleNextTrack;
  });

  return (
    <div className={styles.container}>
      <Header>
        <SearchBar onSearch={handleSearch} />
      </Header>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Titres populaires</h2>
          
          {loading && (
            <div className={styles.skeletonGrid} aria-label="Chargement des morceaux en cours">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.skeletonCard}>
                  <div className={styles.skeletonCover} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonArtist}`} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className={styles.errorContainer}>
              <h3 className={styles.errorTitle}>Impossible de charger les morceaux</h3>
              <p className={styles.errorMessage}>{error}</p>
              <button className={styles.retryButton} onClick={refetch}>
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <p className={styles.sectionSubtitle}>
                {tracks.length} morceaux répartis sur plusieurs genres et artistes.
              </p>
              <TrackList
                tracks={tracks}
                onTrackSelect={handleTrackSelect}
                currentTrackId={currentTrack?.id}
                isPlaying={isPlaying}
              />
            </>
          )}
        </section>
      </main>

      <Player
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isBuffering={isBuffering}
        hasError={hasError}
        volume={volume}
        isMuted={isMuted}
        onPlayToggle={toggle}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onSeek={seek}
        onVolumeChange={setVolume}
        onMuteToggle={toggleMute}
      />
    </div>
  );
}

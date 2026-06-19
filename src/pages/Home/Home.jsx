import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { TRACKS } from '../../data/tracks';
import styles from './Home.module.css';

export function Home() {
  const nextTrackRef = React.useRef(null);

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

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredTracks = React.useMemo(() => {
    if (!searchQuery.trim()) return TRACKS;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return TRACKS.filter(
      (track) =>
        track.title.toLowerCase().includes(normalizedQuery) ||
        track.artist.toLowerCase().includes(normalizedQuery) ||
        track.album.toLowerCase().includes(normalizedQuery)
    );
  }, [searchQuery]);

  // Clic sur une carte : on déclenche la lecture via le hook audio existant.
  const handleTrackSelect = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      toggle();
    } else {
      play(track);
    }
  };

  // Navigue vers le morceau suivant (boucle au début si à la fin) dans le contexte filtré ou complet
  const handleNextTrack = () => {
    if (!currentTrack) return;
    const listToUse = filteredTracks.some((t) => t.id === currentTrack.id) ? filteredTracks : TRACKS;
    const currentIndex = listToUse.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % listToUse.length;
    play(listToUse[nextIndex]);
  };

  // Navigue vers le morceau précédent (boucle à la fin si au début) dans le contexte filtré ou complet
  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const listToUse = filteredTracks.some((t) => t.id === currentTrack.id) ? filteredTracks : TRACKS;
    const currentIndex = listToUse.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + listToUse.length) % listToUse.length;
    play(listToUse[prevIndex]);
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
          <p className={styles.sectionSubtitle}>
            {searchQuery.trim()
              ? `${filteredTracks.length} morceau(x) trouvé(s)`
              : `${TRACKS.length} morceaux répartis sur plusieurs genres et artistes.`}
          </p>

          <TrackList
            tracks={filteredTracks}
            onTrackSelect={handleTrackSelect}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
          />
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

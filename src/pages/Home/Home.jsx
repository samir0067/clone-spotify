import React, { useState } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { TRACKS } from '../../data/tracks';
import styles from './Home.module.css';

export function Home() {
  const nextTrackRef = React.useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [likedTrackIds, setLikedTrackIds] = useState([]);

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

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleTrackSelect = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      toggle();
    } else {
      play(track);
    }
  };

  const handleLikeToggle = (track) => {
    setLikedTrackIds((prev) => {
      if (prev.includes(track.id)) {
        return prev.filter((id) => id !== track.id);
      } else {
        return [...prev, track.id];
      }
    });
  };

  const handleNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    play(TRACKS[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    play(TRACKS[prevIndex]);
  };

  React.useEffect(() => {
    nextTrackRef.current = handleNextTrack;
  });

  const lowerQuery = searchQuery.toLowerCase();
  const filteredTracks = TRACKS.filter(
    (track) =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery)
  );

  const likedArtists = [
    ...new Set(
      TRACKS.filter((track) => likedTrackIds.includes(track.id)).map(
        (track) => track.artist
      )
    ),
  ];

  const suggestedTracks = TRACKS.filter(
    (track) =>
      likedArtists.includes(track.artist) && !likedTrackIds.includes(track.id)
  );

  return (
    <div className={styles.container}>
      <Header>
        <SearchBar onSearch={handleSearch} />
      </Header>

      <main className={styles.mainContent}>
        {suggestedTracks.length > 0 && searchQuery === '' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Suggestions pour vous</h2>
            <p className={styles.sectionSubtitle}>
              Basé sur les artistes que vous aimez.
            </p>
            <TrackList
              tracks={suggestedTracks}
              onTrackSelect={handleTrackSelect}
              currentTrackId={currentTrack?.id}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              onLikeToggle={handleLikeToggle}
            />
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {searchQuery ? 'Résultats de recherche' : 'Titres populaires'}
          </h2>
          <p className={styles.sectionSubtitle}>
            {searchQuery
              ? `${filteredTracks.length} résultats pour "${searchQuery}"`
              : `${TRACKS.length} morceaux répartis sur plusieurs genres et artistes.`}
          </p>

          <TrackList
            tracks={filteredTracks}
            onTrackSelect={handleTrackSelect}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            likedTrackIds={likedTrackIds}
            onLikeToggle={handleLikeToggle}
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

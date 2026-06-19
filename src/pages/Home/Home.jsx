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
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Utilisateur');

  const handleAvatarClick = () => {
    const newName = window.prompt("Quel est votre nom d'utilisateur ?", userName);
    if (newName !== null && newName.trim() !== '') {
      setUserName(newName.trim());
      localStorage.setItem('userName', newName.trim());
    }
  };

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
    (track) => {
      const matchesSearch = track.title.toLowerCase().includes(lowerQuery) || track.artist.toLowerCase().includes(lowerQuery);
      const matchesGenre = selectedGenre === 'Tous' ? true : track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    }
  );

  const availableGenres = ['Tous', ...new Set(TRACKS.map(track => track.genre))];

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

  const favoriteTracks = TRACKS.filter((track) => likedTrackIds.includes(track.id));

  return (
    <div className={styles.container}>
      <Header userName={userName} onAvatarClick={handleAvatarClick}>
        <SearchBar onSearch={handleSearch} />
      </Header>

      <main className={styles.mainContent}>
        <h1 className={styles.greeting}>Bienvenue, {userName} !</h1>
        
        <div className={styles.genreFilters}>
          {availableGenres.map(genre => (
            <button 
              key={genre} 
              className={`${styles.genreBtn} ${selectedGenre === genre ? styles.activeGenreBtn : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {favoriteTracks.length > 0 && searchQuery === '' && selectedGenre === 'Tous' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vos titres aimés</h2>
            <p className={styles.sectionSubtitle}>
              Les morceaux que vous avez ajoutés à vos favoris.
            </p>
            <TrackList
              tracks={favoriteTracks}
              onTrackSelect={handleTrackSelect}
              currentTrackId={currentTrack?.id}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              onLikeToggle={handleLikeToggle}
            />
          </section>
        )}

        {suggestedTracks.length > 0 && searchQuery === '' && selectedGenre === 'Tous' && (
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

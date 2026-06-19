import React, { useState, useMemo } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { useTracks } from '../../hooks/useTracks';
import { Header } from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { Filters } from '../../components/Filters/Filters';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import styles from './Home.module.css';

export function Home() {
  const nextTrackRef = React.useRef(null);
  
  const { tracks: TRACKS, loading, error } = useTracks();
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  const [sortBy, setSortBy] = useState('default');
  const [currentView, setCurrentView] = useState('all'); // 'all' | 'liked'
  const [selectedDecade, setSelectedDecade] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  // Liked Tracks state with LocalStorage persistence
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_clone_liked_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync liked tracks to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('spotify_clone_liked_tracks', JSON.stringify(likedTrackIds));
    } catch (e) {
      console.error('Failed to save liked tracks to localStorage', e);
    }
  }, [likedTrackIds]);

  const handleLikeToggle = (trackId) => {
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
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

  // Calculate filtered and sorted tracks
  const filteredAndSortedTracks = useMemo(() => {
    let result = [...TRACKS];

    // 0. Sidebar View Filter (if "liked", only show liked tracks)
    if (currentView === 'liked') {
      result = result.filter((track) => likedTrackIds.includes(track.id));
    }

    // 1. Text Search Filter (title, artist, album)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.album.toLowerCase().includes(query)
      );
    }

    // 2. Genre Filter
    if (selectedGenre !== 'Tous') {
      result = result.filter((track) => track.genre === selectedGenre);
    }

    // 3. Decade Filter
    if (selectedDecade !== 'all') {
      if (selectedDecade === '2020s') {
        result = result.filter((track) => track.year >= 2020);
      } else if (selectedDecade === '2010s') {
        result = result.filter((track) => track.year >= 2010 && track.year < 2020);
      } else if (selectedDecade === 'oldies') {
        result = result.filter((track) => track.year < 2010);
      }
    }

    // 4. Duration Filter
    if (selectedDuration !== 'all') {
      if (selectedDuration === 'short') {
        result = result.filter((track) => track.duration < 210); // < 3min 30s
      } else if (selectedDuration === 'long') {
        result = result.filter((track) => track.duration >= 210); // >= 3min 30s
      }
    }

    // 5. Sorting
    if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'year-asc') {
      result.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'duration-asc') {
      result.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'duration-desc') {
      result.sort((a, b) => b.duration - a.duration);
    }

    return result;
  }, [searchQuery, selectedGenre, sortBy, currentView, likedTrackIds, selectedDecade, selectedDuration, TRACKS]);

  // Clic sur une carte : on déclenche la lecture via le hook audio existant.
  const handleTrackSelect = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      toggle();
    } else {
      play(track);
    }
  };

  // Navigue vers le morceau suivant dans la liste actuellement filtrée et triée
  const handleNextTrack = () => {
    if (!currentTrack || filteredAndSortedTracks.length === 0) return;
    const currentIndex = filteredAndSortedTracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) {
      // Si le morceau actuel n'est plus dans la liste filtrée, on lit le premier
      play(filteredAndSortedTracks[0]);
    } else {
      const nextIndex = (currentIndex + 1) % filteredAndSortedTracks.length;
      play(filteredAndSortedTracks[nextIndex]);
    }
  };

  // Navigue vers le morceau précédent dans la liste actuellement filtrée et triée
  const handlePrevTrack = () => {
    if (!currentTrack || filteredAndSortedTracks.length === 0) return;
    const currentIndex = filteredAndSortedTracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) {
      // Si le morceau actuel n'est plus dans la liste filtrée, on lit le premier
      play(filteredAndSortedTracks[0]);
    } else {
      const prevIndex = (currentIndex - 1 + filteredAndSortedTracks.length) % filteredAndSortedTracks.length;
      play(filteredAndSortedTracks[prevIndex]);
    }
  };

  // Keep ref up to date to avoid stale closure in useAudio onEnded callback
  React.useEffect(() => {
    nextTrackRef.current = handleNextTrack;
  });

  return (
    <div className={styles.appWrapper}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        likedCount={likedTrackIds.length}
      />
      
      <div className={styles.container}>
        <Header>
          <SearchBar onSearch={setSearchQuery} />
        </Header>

        <main className={styles.mainContent}>
          <Filters
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedDecade={selectedDecade}
            onSelectDecade={setSelectedDecade}
            selectedDuration={selectedDuration}
            onSelectDuration={setSelectedDuration}
          />

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {currentView === 'liked'
                ? 'Mes Titres Likés'
                : searchQuery || selectedGenre !== 'Tous' || selectedDecade !== 'all' || selectedDuration !== 'all'
                ? 'Résultats de recherche'
                : 'Titres populaires'}
            </h2>
            <p className={styles.sectionSubtitle}>
              {loading ? 'Chargement...' : `${filteredAndSortedTracks.length} ${filteredAndSortedTracks.length > 1 ? 'morceaux trouvés' : 'morceau trouvé'}`}
            </p>

            {loading && <div className={styles.loadingContainer}>Chargement des pistes en cours...</div>}
            {error && <div className={styles.errorContainer}>⚠️ {error}</div>}
            {!loading && !error && (
              <TrackList
                tracks={filteredAndSortedTracks}
                onTrackSelect={handleTrackSelect}
                currentTrackId={currentTrack?.id}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onLikeToggle={handleLikeToggle}
              />
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
          isLiked={currentTrack ? likedTrackIds.includes(currentTrack.id) : false}
          onLikeToggle={handleLikeToggle}
        />
      </div>
    </div>
  );
}


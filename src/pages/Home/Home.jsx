import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { Profile } from '../../components/Profile/Profile';
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
  const [activeTab, setActiveTab] = React.useState('home');

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = React.useState(() => {
    const saved = localStorage.getItem('spotify_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // User profile state persisted in localStorage
  const [profile, setProfile] = React.useState(() => {
    const saved = localStorage.getItem('spotify_profile');
    return saved ? JSON.parse(saved) : { name: 'Utilisateur', pfpUrl: '' };
  });

  // Persist favorites changes
  React.useEffect(() => {
    localStorage.setItem('spotify_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist profile changes
  React.useEffect(() => {
    localStorage.setItem('spotify_profile', JSON.stringify(profile));
  }, [profile]);

  const handleFavoriteToggle = React.useCallback((trackId) => {
    setFavorites((prev) => {
      if (prev.includes(trackId)) {
        return prev.filter((id) => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  }, []);

  const handleProfileUpdate = React.useCallback((updatedProfile) => {
    setProfile(updatedProfile);
  }, []);

  const filteredTracks = React.useMemo(() => {
    if (!searchQuery.trim()) return TRACKS;
    
    // Split the query into individual terms (e.g. "mira daylight" -> ["mira", "daylight"])
    const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return TRACKS;

    return TRACKS.filter((track) => {
      // Every typed term must match at least one attribute of the track (title, artist, album, genre, or year)
      return terms.every((term) => {
        const titleMatch = track.title.toLowerCase().includes(term);
        const artistMatch = track.artist.toLowerCase().includes(term);
        const albumMatch = track.album.toLowerCase().includes(term);
        const genreMatch = track.genre.toLowerCase().includes(term);
        const yearMatch = track.year.toString().includes(term);
        
        return titleMatch || artistMatch || albumMatch || genreMatch || yearMatch;
      });
    });
  }, [searchQuery]);

  const favoriteTracks = React.useMemo(() => {
    return TRACKS.filter((track) => favorites.includes(track.id));
  }, [favorites]);

  // Determine current active track list for next/prev playback queue navigation
  const activeTrackList = React.useMemo(() => {
    if (activeTab === 'profile' && favoriteTracks.length > 0) {
      return favoriteTracks;
    }
    return filteredTracks;
  }, [activeTab, favoriteTracks, filteredTracks]);

  const handleSearch = (value) => {
    setSearchQuery(value);
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
    if (!currentTrack) return;
    const list = activeTrackList.length > 0 ? activeTrackList : TRACKS;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % list.length;
    play(list[nextIndex]);
  };

  // Navigue vers le morceau précédent dans le catalogue (boucle à la fin si au début)
  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const list = activeTrackList.length > 0 ? activeTrackList : TRACKS;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    play(list[prevIndex]);
  };

  // Keep ref up to date to avoid stale closure in useAudio onEnded callback
  React.useEffect(() => {
    nextTrackRef.current = handleNextTrack;
  });

  return (
    <div className={styles.container}>
      <Header
        userName={profile.name}
        pfpUrl={profile.pfpUrl}
        onAvatarClick={() => setActiveTab('profile')}
        onBrandClick={() => setActiveTab('home')}
      >
        {activeTab === 'home' && <SearchBar onSearch={handleSearch} />}
      </Header>

      <main className={styles.mainContent}>
        {activeTab === 'home' ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Titres populaires</h2>
            <p className={styles.sectionSubtitle}>
              {searchQuery.trim()
                ? `${filteredTracks.length} morceau${filteredTracks.length > 1 ? 's' : ''} trouvé${filteredTracks.length > 1 ? 's' : ''} pour "${searchQuery}"`
                : `${TRACKS.length} morceaux répartis sur plusieurs genres et artistes.`}
            </p>

            <TrackList
              tracks={filteredTracks}
              onTrackSelect={handleTrackSelect}
              currentTrackId={currentTrack?.id}
              isPlaying={isPlaying}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </section>
        ) : (
          <Profile
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            favoriteTracks={favoriteTracks}
            onTrackSelect={handleTrackSelect}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
            onBrowseTracks={() => setActiveTab('home')}
          />
        )}
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
        isFavorite={currentTrack ? favorites.includes(currentTrack.id) : false}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
}


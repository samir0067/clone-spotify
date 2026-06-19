import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { ProfileModal } from '../../components/ProfileModal/ProfileModal';
import { TRACKS } from '../../data/tracks';
import styles from './Home.module.css';

const DEFAULT_USER = {
  name: 'Utilisateur',
  avatarColor: 'linear-gradient(135deg, #1db954 0%, #0d5c29 100%)',
  avatarEmoji: '🎵',
  subscription: 'Free',
  favoriteGenre: 'Pop',
};

export function Home() {
  const nextTrackRef = React.useRef(null);

  const [user, setUser] = React.useState(() => {
    try {
      const stored = localStorage.getItem('spotify_clone_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleSaveProfile = (updatedUser) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('spotify_clone_user', JSON.stringify(updatedUser));
    } catch {
      // ignore
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
    if (!currentTrack) return;
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    play(TRACKS[nextIndex]);
  };

  // Navigue vers le morceau précédent dans le catalogue (boucle à la fin si au début)
  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    play(TRACKS[prevIndex]);
  };

  // Keep ref up to date to avoid stale closure in useAudio onEnded callback
  React.useEffect(() => {
    nextTrackRef.current = handleNextTrack;
  });

  return (
    <div className={styles.container}>
      <Header user={user} onAvatarClick={() => setIsProfileOpen(true)}>
        <SearchBar onSearch={handleSearch} />
      </Header>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Titres populaires</h2>
          <p className={styles.sectionSubtitle}>
            {TRACKS.length} morceaux répartis sur plusieurs genres et artistes.
          </p>

          <TrackList
            tracks={TRACKS}
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

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

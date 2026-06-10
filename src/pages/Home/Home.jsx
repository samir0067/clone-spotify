import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { TrackCard } from '../../components/TrackCard/TrackCard';
import logo from '../../assets/logo.svg';
import albumCover from '../../assets/album-cover.png';
import styles from './Home.module.css';

// Mock catalog of tracks using our generated asset and Spotify style info
const MOCK_TRACKS = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'Cyberwave Systems',
    duration: 245,
    coverUrl: albumCover,
  },
  {
    id: '2',
    title: 'Midnight Grid',
    artist: 'Retro Horizon',
    duration: 188,
    coverUrl: albumCover,
  },
  {
    id: '3',
    title: 'Laser Flight',
    artist: 'Future Kid',
    duration: 312,
    coverUrl: albumCover,
  },
  {
    id: '4',
    title: 'Synth Dreams',
    artist: 'Vector Wave',
    duration: 205,
    coverUrl: albumCover,
  },
];

export function Home() {
  const { isPlaying, currentTrack, play, toggle } = useAudio();

  const handlePlayToggle = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      toggle();
    } else {
      play(track);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="Spotify Clone Logo" className={styles.logo} />
          <h1 className={styles.appName}>Spotify</h1>
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Titres populaires</h2>
          <p className={styles.sectionSubtitle}>
            Sélection pédagogique de morceaux synthwave rétro-futuristes.
          </p>

          <div className={styles.grid}>
            {MOCK_TRACKS.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isPlaying={isPlaying && currentTrack?.id === track.id}
                onPlayToggle={handlePlayToggle}
              />
            ))}
          </div>
        </section>
      </main>

      {currentTrack && (
        <footer className={styles.playerBar} aria-label="Lecteur audio en cours">
          <div className={styles.playerTrackInfo}>
            <img
              src={currentTrack.coverUrl}
              alt=""
              className={styles.playerCover}
            />
            <div>
              <p className={styles.playerTitle}>{currentTrack.title}</p>
              <p className={styles.playerArtist}>{currentTrack.artist}</p>
            </div>
          </div>

          <div className={styles.playerControls}>
            <button
              className={styles.playerPlayBtn}
              onClick={toggle}
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className={styles.playerIcon} fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className={styles.playerIcon} fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <span className={styles.playingStatus}>
              {isPlaying ? 'Lecture en cours...' : 'En pause'}
            </span>
          </div>

          <div className={styles.playerVolume}>
            <span className={styles.volumeIcon} aria-hidden="true">🔊</span>
            <div className={styles.volumeSlider} aria-label="Volume">
              <div className={styles.volumeSliderProgress} />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

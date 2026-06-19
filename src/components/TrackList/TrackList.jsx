import React, { useState, useEffect, useCallback } from 'react';
import { TrackCard } from '../TrackCard/TrackCard';
import { generateMockLyrics } from '../../data/tracks';
import styles from './TrackList.module.css';

const AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5-broken.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

/**
 * TrackList component: displays a responsive grid of TrackCard items.
 *
 * If `tracks` prop is not passed (or empty), it fetches `/tracks.json` locally
 * to load the starting library. Otherwise, it renders the passed list.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} [props.tracks] - Tracks to render (optional).
 * @param {function} [props.onTrackSelect] - Called with the clicked track object.
 * @param {number|string} [props.currentTrackId] - Id of the active track.
 * @param {boolean} [props.isPlaying=false] - Whether the active track is currently playing.
 * @param {Array<number>} [props.likedTrackIds=[]] - Array of liked track IDs.
 * @param {function} [props.onLikeToggle] - Called when a track is liked/unliked.
 * @param {Array<object>} [props.playlists=[]] - List of custom playlists.
 * @param {function} [props.onAddToPlaylist] - Called when a track is added to a playlist.
 */
export function TrackList({
  tracks,
  onTrackSelect,
  currentTrackId,
  isPlaying = false,
  likedTrackIds = [],
  onLikeToggle,
  playlists = [],
  onAddToPlaylist,
}) {
  const [localTracks, setLocalTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCrashSimulated, setIsCrashSimulated] = useState(false);

  // Check if we are using external tracks prop (for playlists, liked list, search results)
  const isExternal = tracks && tracks.length > 0;

  const loadTracks = useCallback(async () => {
    if (isExternal) return;

    setIsLoading(true);
    setError(null);
    try {
      const url = isCrashSimulated ? '/tracks-oops.json' : '/tracks.json';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Impossible de récupérer les titres sur ${url} (Code : ${response.status})`);
      }
      const data = await response.json();

      const formatted = data.map((track) => {
        const formattedTrack = {
          id: track.id,
          title: track.title || 'Titre inconnu',
          artist: track.artist || 'Artiste inconnu',
          album: track.album || 'Album inconnu',
          genre: track.genre || 'Pop',
          duration: track.duration || 180,
          coverUrl: track.cover || `https://picsum.photos/seed/spotify-${track.id}/300/300`,
          audioUrl: AUDIO_URLS[(track.id - 1) % AUDIO_URLS.length],
        };
        // Generate synced lyrics
        formattedTrack.lyrics = generateMockLyrics(formattedTrack);
        return formattedTrack;
      });

      setLocalTracks(formatted);
    } catch (err) {
      setError(err.message || 'Une erreur de connexion est survenue.');
    } finally {
      setIsLoading(false);
    }
  }, [isCrashSimulated, isExternal]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const activeTracks = isExternal ? tracks : localTracks;

  // 1. Render Loading Spinner
  if (!isExternal && isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spotifyLoader} />
        <p className={styles.loaderText}>Chargement des titres depuis le serveur...</p>
      </div>
    );
  }

  // 2. Render Pretty Error Card
  if (!isExternal && error) {
    return (
      <div className={styles.errorCard}>
        <div className={styles.errorHeader}>
          <svg viewBox="0 0 24 24" className={styles.errorIcon} fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h3 className={styles.errorTitle}>Erreur de connexion</h3>
        </div>
        <p className={styles.errorDetails}>{error}</p>
        <p className={styles.errorHint}>
          L&apos;application a tenté de lire l&apos;URL relative. Veuillez vérifier la connexion au serveur de fichiers.
        </p>
        <div className={styles.errorActions}>
          <button className={styles.retryBtn} onClick={loadTracks}>
            🔄 Réessayer la connexion
          </button>
          <button className={styles.resetBtn} onClick={() => setIsCrashSimulated(false)}>
            Rétablir l&apos;URL normale (/tracks.json)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Simulation controller banner */}
      {!isExternal && (
        <div className={styles.demoControls} role="toolbar" aria-label="Démo simulation">
          <span className={styles.demoLabel}>Contrôle Démo Live 2 :</span>
          <button
            className={`${styles.demoBtn} ${isCrashSimulated ? styles.demoBtnActive : ''}`}
            onClick={() => setIsCrashSimulated(!isCrashSimulated)}
            aria-pressed={isCrashSimulated}
          >
            {isCrashSimulated
              ? '⚠️ Simulation active (Cliquer pour réparer)'
              : '⚙️ Simuler une panne (/tracks-oops.json)'}
          </button>
        </div>
      )}

      {activeTracks.length === 0 ? (
        <p className={styles.empty}>Aucun morceau à afficher.</p>
      ) : (
        <ul className={styles.grid}>
          {activeTracks.map((track) => (
            <li key={track.id} className={styles.item}>
              <TrackCard
                track={track}
                isPlaying={isPlaying && currentTrackId === track.id}
                onPlayToggle={(t) => onTrackSelect && onTrackSelect(t, activeTracks)}
                isLiked={likedTrackIds.includes(track.id)}
                onLikeToggle={onLikeToggle}
                playlists={playlists}
                onAddToPlaylist={onAddToPlaylist}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



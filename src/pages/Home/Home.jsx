import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { LyricsPanel } from '../../components/LyricsPanel/LyricsPanel';
import { PlaylistView } from '../../components/PlaylistView/PlaylistView';
import { useFetchTracks } from '../../hooks/useFetchTracks';
import { generateMockLyrics } from '../../data/tracks';
import styles from './Home.module.css';

const GENRES = ['Tous', 'Pop', 'Rap', 'Rock', 'Électro', 'Jazz'];

export function Home() {
  const nextTrackRef = useRef(null);

  // --- States ---
  const [activeView, setActiveView] = useState('home'); // 'home', 'liked', 'playlist-${id}'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('Tous');
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

  // API Fetch states for iTunes search
  const [apiTracks, setApiTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hook to fetch local starting tracks (/tracks.json)
  const { tracks: localTracks, isLoading: isLocalLoading, error: localError } = useFetchTracks();

  // Playback Queue
  const [playbackQueue, setPlaybackQueue] = useState([]);

  // Liked Track IDs (Persistent in LocalStorage)
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    const saved = localStorage.getItem('spotify-clone-liked-tracks');
    return saved ? JSON.parse(saved) : [];
  });

  // User Playlists (Persistent in LocalStorage)
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('spotify-clone-playlists');
    return saved ? JSON.parse(saved) : [];
  });

  // --- LocalStorage Sync Effects ---
  useEffect(() => {
    localStorage.setItem('spotify-clone-liked-tracks', JSON.stringify(likedTrackIds));
  }, [likedTrackIds]);

  useEffect(() => {
    localStorage.setItem('spotify-clone-playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Sync playbackQueue when localTracks loads
  useEffect(() => {
    if (localTracks.length > 0 && playbackQueue.length === 0) {
      setPlaybackQueue(localTracks);
    }
  }, [localTracks, playbackQueue]);

  // --- API Fetch Function ---
  const fetchTracks = useCallback(async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`
      );
      if (!response.ok) {
        throw new Error('La requête réseau iTunes a échoué');
      }
      const data = await response.json();

      const formatted = data.results.map((item) => {
        const trackObj = {
          id: item.trackId,
          title: item.trackName || 'Titre inconnu',
          artist: item.artistName || 'Artiste inconnu',
          album: item.collectionName || 'Album inconnu',
          genre: item.primaryGenreName || 'Variété',
          duration: Math.round((item.trackTimeMillis || 180000) / 1000),
          coverUrl: item.artworkUrl100
            ? item.artworkUrl100.replace('100x100', '400x400')
            : 'https://picsum.photos/seed/spotify-fallback/300/300',
          audioUrl: item.previewUrl,
        };
        // Attach lyrics dynamically
        trackObj.lyrics = generateMockLyrics(trackObj);
        return trackObj;
      });

      setApiTracks(formatted);
    } catch (error) {
      console.warn('Erreur iTunes API (offline fallback) :', error);
      // Fallback to local loaded tracks
      setApiTracks(localTracks);
    } finally {
      setIsLoading(false);
    }
  }, [localTracks]);

  // --- Debounced Search Query Effect ---
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setApiTracks(localTracks);
    } else {
      const delayDebounceFn = setTimeout(() => {
        fetchTracks(searchQuery);
      }, 450); // 450ms debounce delay to avoid over-fetching

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, localTracks, fetchTracks]);

  // --- Audio Hook ---
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

  // --- Computed Memos ---
  const likedTracks = useMemo(() => {
    // Liked tracks could be from local JSON or dynamic search API.
    const allKnownTracks = [...localTracks, ...apiTracks];
    const uniqueKnownTracksMap = new Map(allKnownTracks.map((t) => [t.id, t]));
    return likedTrackIds
      .map((id) => uniqueKnownTracksMap.get(id))
      .filter((track) => !!track);
  }, [likedTrackIds, localTracks, apiTracks]);

  const activePlaylist = useMemo(() => {
    if (activeView.startsWith('playlist-')) {
      const plId = parseInt(activeView.replace('playlist-', ''), 10);
      return playlists.find((pl) => pl.id === plId) || null;
    }
    return null;
  }, [activeView, playlists]);

  // Filter dynamic iTunes results or local tracks by genre
  const filteredTracks = useMemo(() => {
    return apiTracks.filter((track) => {
      if (activeGenre !== 'Tous') {
        const queryGenre = activeGenre.toLowerCase();
        const trackGenre = (track.genre || '').toLowerCase();
        if (queryGenre === 'électro' && (trackGenre.includes('electro') || trackGenre.includes('dance') || trackGenre.includes('house'))) return true;
        if (queryGenre === 'rap' && (trackGenre.includes('rap') || trackGenre.includes('hip hop') || trackGenre.includes('hip-hop'))) return true;
        if (queryGenre === 'pop' && trackGenre.includes('pop')) return true;
        if (queryGenre === 'rock' && trackGenre.includes('rock')) return true;
        if (queryGenre === 'jazz' && trackGenre.includes('jazz')) return true;
        return trackGenre.includes(queryGenre);
      }
      return true;
    });
  }, [apiTracks, activeGenre]);

  // --- Handlers ---
  const handleSearch = (value) => {
    setSearchQuery(value);
    if (activeView !== 'home') {
      setActiveView('home');
    }
  };

  const handleLikeToggle = (trackId) => {
    setLikedTrackIds((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleCreatePlaylist = () => {
    const newId = Date.now();
    const newPlaylist = {
      id: newId,
      name: `Ma Playlist #${playlists.length + 1}`,
      tracks: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    setActiveView(`playlist-${newId}`);
  };

  const handleDeletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
    if (activeView === `playlist-${playlistId}`) {
      setActiveView('home');
    }
  };

  const handleRenamePlaylist = (playlistId, newName) => {
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === playlistId ? { ...pl, name: newName } : pl))
    );
  };

  const handleAddToPlaylist = (playlistId, track) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.tracks.some((t) => t.id === track.id)) return pl;
          return { ...pl, tracks: [...pl.tracks, track] };
        }
        return pl;
      })
    );
  };

  const handleRemoveTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) };
        }
        return pl;
      })
    );
  };

  const handleTrackSelect = (track, queue) => {
    setPlaybackQueue(queue);
    if (currentTrack && currentTrack.id === track.id) {
      toggle();
    } else {
      play(track);
    }
  };

  const handlePlayPlaylist = (queue) => {
    if (queue.length > 0) {
      setPlaybackQueue(queue);
      play(queue[0]);
    }
  };

  const handleNextTrack = () => {
    if (!currentTrack || playbackQueue.length === 0) return;
    const currentIndex = playbackQueue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % playbackQueue.length;
    play(playbackQueue[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack || playbackQueue.length === 0) return;
    const currentIndex = playbackQueue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + playbackQueue.length) % playbackQueue.length;
    play(playbackQueue[prevIndex]);
  };

  // Sync ref to avoid closures in useAudio
  useEffect(() => {
    nextTrackRef.current = handleNextTrack;
  });

  const isCurrentlyLoading = isLoading || (searchQuery.trim() === '' && isLocalLoading);
  const activeError = searchQuery.trim() === '' ? localError : null;

  return (
    <div className={styles.container}>
      {/* 1. Sidebar */}
      <Sidebar
        playlists={playlists}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view !== 'home') setSearchQuery('');
        }}
        onCreatePlaylist={handleCreatePlaylist}
      />

      {/* 2. Main Layout containing Header and Content */}
      <div className={`${styles.mainLayout} ${isLyricsOpen ? styles.withLyrics : ''}`}>
        <Header className={isLyricsOpen ? styles.headerWithLyrics : ''}>
          <SearchBar onSearch={handleSearch} />
        </Header>

        <main className={styles.mainContent}>
          {activeView === 'home' && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {searchQuery ? 'Résultats de recherche' : 'Titres populaires'}
              </h2>
              
              {!searchQuery && (
                <p className={styles.sectionSubtitle}>
                  Contenu récupéré en direct d&apos;iTunes. Recherchez vos artistes favoris !
                </p>
              )}

              {/* Genre Pills */}
              <div className={styles.genrePills} role="group" aria-label="Filtres par genre">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    className={`${styles.genrePill} ${
                      activeGenre === genre ? styles.activePill : ''
                    }`}
                    onClick={() => setActiveGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Loader Spinner or Error or Tracks List */}
              {isCurrentlyLoading ? (
                <div className={styles.loaderContainer}>
                  <div className={styles.spotifyLoader} />
                  <p className={styles.loaderText}>Chargement en cours...</p>
                </div>
              ) : activeError ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorText}>⚠️ Une erreur est survenue : {activeError}</p>
                </div>
              ) : (
                <TrackList
                  tracks={filteredTracks}
                  onTrackSelect={(track) => handleTrackSelect(track, filteredTracks)}
                  currentTrackId={currentTrack?.id}
                  isPlaying={isPlaying}
                  likedTrackIds={likedTrackIds}
                  onLikeToggle={handleLikeToggle}
                  playlists={playlists}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              )}
            </section>
          )}

          {activeView === 'liked' && (
            <PlaylistView
              playlist={{ id: 'liked', name: 'Titres aimés', tracks: likedTracks }}
              isLikedView={true}
              onTrackSelect={(track) => handleTrackSelect(track, likedTracks)}
              currentTrackId={currentTrack?.id}
              isPlaying={isPlaying}
              onPlayPlaylist={() => handlePlayPlaylist(likedTracks)}
              onRemoveTrack={(_, tid) => handleLikeToggle(tid)}
            />
          )}

          {activeView.startsWith('playlist-') && activePlaylist && (
            <PlaylistView
              playlist={activePlaylist}
              isLikedView={false}
              onTrackSelect={(track) => handleTrackSelect(track, activePlaylist.tracks)}
              currentTrackId={currentTrack?.id}
              isPlaying={isPlaying}
              onPlayPlaylist={() => handlePlayPlaylist(activePlaylist.tracks)}
              onRemoveTrack={handleRemoveTrackFromPlaylist}
              onRenamePlaylist={handleRenamePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
            />
          )}
        </main>
      </div>

      {/* 3. Lyrics Panel on the right */}
      {isLyricsOpen && (
        <LyricsPanel
          track={currentTrack}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onClose={() => setIsLyricsOpen(false)}
          onSeek={seek}
        />
      )}

      {/* 4. Player at the bottom */}
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
        isLyricsOpen={isLyricsOpen}
        onLyricsToggle={() => setIsLyricsOpen(!isLyricsOpen)}
      />
    </div>
  );
}



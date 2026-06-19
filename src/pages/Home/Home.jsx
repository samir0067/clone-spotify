import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Header } from '../../components/Header/Header';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TrackList } from '../../components/TrackList/TrackList';
import { Player } from '../../components/Player/Player';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { LyricsPanel } from '../../components/LyricsPanel/LyricsPanel';
import { PlaylistView } from '../../components/PlaylistView/PlaylistView';
import { TRACKS } from '../../data/tracks';
import styles from './Home.module.css';

const GENRES = ['Tous', 'Pop', 'Rap', 'Rock', 'Électro', 'Jazz'];

export function Home() {
  const nextTrackRef = useRef(null);

  // --- States ---
  const [activeView, setActiveView] = useState('home'); // 'home', 'liked', 'playlist-${id}'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('Tous');
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

  // Playback Queue
  const [playbackQueue, setPlaybackQueue] = useState(TRACKS);

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
    return TRACKS.filter((track) => likedTrackIds.includes(track.id));
  }, [likedTrackIds]);

  const activePlaylist = useMemo(() => {
    if (activeView.startsWith('playlist-')) {
      const plId = parseInt(activeView.replace('playlist-', ''), 10);
      return playlists.find((pl) => pl.id === plId) || null;
    }
    return null;
  }, [activeView, playlists]);

  // Real-time Home filtering (Search & Genres)
  const filteredTracks = useMemo(() => {
    return TRACKS.filter((track) => {
      if (activeGenre !== 'Tous' && track.genre !== activeGenre) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.album.toLowerCase().includes(query) ||
          track.genre.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, activeGenre]);

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
                  {TRACKS.length} morceaux répartis sur plusieurs genres et artistes.
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


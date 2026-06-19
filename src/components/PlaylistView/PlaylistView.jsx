import React, { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../utils/formatTime';
import styles from './PlaylistView.module.css';

export function PlaylistView({
  playlist,
  isLikedView = false,
  onRenamePlaylist,
  onRemoveTrack,
  onTrackSelect,
  currentTrackId,
  isPlaying = false,
  onPlayPlaylist,
  onDeletePlaylist,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (playlist) {
      setEditTitle(playlist.name);
    }
  }, [playlist]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!playlist) return null;

  const handleTitleClick = () => {
    if (!isLikedView) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (editTitle.trim() && editTitle !== playlist.name) {
      onRenamePlaylist(playlist.id, editTitle.trim());
    } else {
      setEditTitle(playlist.name);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(playlist.name);
    }
  };

  const totalDuration = playlist.tracks.reduce((acc, t) => acc + t.duration, 0);
  const formattedTotalTime = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    if (hours > 0) {
      return `${hours} h ${minutes} min`;
    }
    return `${minutes} min`;
  };

  return (
    <div className={styles.container}>
      {/* 1. Header Area with dynamic colors */}
      <header
        className={`${styles.header} ${isLikedView ? styles.likedHeader : styles.playlistHeader}`}
      >
        <div className={isLikedView ? styles.likedCover : styles.playlistCover}>
          {isLikedView ? (
            <svg viewBox="0 0 24 24" className={styles.coverHeart} fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.coverPlaylist} fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-5h2v5zm0-7h-2V7h2v2z" />
            </svg>
          )}
        </div>

        <div className={styles.headerInfo}>
          <span className={styles.type}>PLAYLIST</span>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className={styles.titleInput}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              maxLength={30}
              aria-label="Modifier le titre de la playlist"
            />
          ) : (
            <h1
              className={`${styles.title} ${!isLikedView ? styles.editable : ''}`}
              onClick={handleTitleClick}
              title={!isLikedView ? "Cliquer pour renommer" : undefined}
            >
              {playlist.name}
            </h1>
          )}
          <div className={styles.meta}>
            <span className={styles.userName}>Utilisateur</span>
            <span className={styles.dot}>•</span>
            <span>
              {playlist.tracks.length} {playlist.tracks.length > 1 ? 'titres' : 'titre'}
            </span>
            {playlist.tracks.length > 0 && (
              <>
                <span className={styles.dot}>•</span>
                <span className={styles.duration}>{formattedTotalTime()}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Control Bar (Play Playlist, Delete Playlist) */}
      <div className={styles.actionBar}>
        {playlist.tracks.length > 0 && (
          <button
            className={styles.playBtn}
            onClick={onPlayPlaylist}
            aria-label="Lire la playlist"
            title="Lire tout"
          >
            {isPlaying && playlist.tracks.some(t => t.id === currentTrackId) ? (
              <svg viewBox="0 0 24 24" className={styles.actionIcon} fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={styles.actionIcon} fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}

        {!isLikedView && onDeletePlaylist && (
          <button
            className={styles.deleteBtn}
            onClick={() => onDeletePlaylist(playlist.id)}
            aria-label="Supprimer la playlist"
            title="Supprimer la playlist"
          >
            Supprimer la playlist
          </button>
        )}
      </div>

      {/* 3. Playlist Tracks List */}
      <div className={styles.trackListArea}>
        {playlist.tracks.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Cette playlist est vide</p>
            <p className={styles.emptySubtitle}>
              Recherchez des morceaux et cliquez sur le menu &quot;...&quot; pour les ajouter.
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.colIndex}>#</th>
                <th className={styles.colTitle}>Titre</th>
                <th className={styles.colAlbum}>Album</th>
                <th className={styles.colDuration}>Durée</th>
                <th className={styles.colActions}></th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, index) => {
                const isCurrent = track.id === currentTrackId;
                return (
                  <tr
                    key={track.id}
                    className={`${styles.trackRow} ${isCurrent ? styles.activeRow : ''}`}
                    onClick={() => onTrackSelect(track)}
                  >
                    <td className={styles.colIndex}>
                      {isCurrent && isPlaying ? (
                        <div className={styles.smallEq}>
                          <div className={styles.smallEqBar} />
                          <div className={styles.smallEqBar} />
                          <div className={styles.smallEqBar} />
                        </div>
                      ) : (
                        <span className={styles.rowNumber}>{index + 1}</span>
                      )}
                    </td>
                    <td className={styles.colTitle}>
                      <div className={styles.trackInfoCell}>
                        <img
                          src={track.coverUrl}
                          alt=""
                          className={styles.rowCover}
                        />
                        <div className={styles.trackMeta}>
                          <span className={styles.rowTitle}>{track.title}</span>
                          <span className={styles.rowArtist}>{track.artist}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.colAlbum}>{track.album}</td>
                    <td className={styles.colDuration}>{formatTime(track.duration)}</td>
                    <td className={styles.colActions}>
                      <button
                        className={styles.removeBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveTrack(playlist.id, track.id);
                        }}
                        aria-label="Retirer de la playlist"
                        title="Retirer"
                      >
                        <svg viewBox="0 0 24 24" className={styles.removeIcon} fill="currentColor">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

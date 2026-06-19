import React from 'react';
import { TrackCard } from '../TrackCard/TrackCard';
import styles from './TrackList.module.css';

/**
 * TrackList component: displays a responsive grid of TrackCard items.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.tracks - Tracks to render.
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
  if (!tracks || tracks.length === 0) {
    return <p className={styles.empty}>Aucun morceau à afficher.</p>;
  }

  return (
    <ul className={styles.grid}>
      {tracks.map((track) => (
        <li key={track.id} className={styles.item}>
          <TrackCard
            track={track}
            isPlaying={isPlaying && currentTrackId === track.id}
            onPlayToggle={onTrackSelect}
            isLiked={likedTrackIds.includes(track.id)}
            onLikeToggle={onLikeToggle}
            playlists={playlists}
            onAddToPlaylist={onAddToPlaylist}
          />
        </li>
      ))}
    </ul>
  );
}


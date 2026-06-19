import React from 'react';
import { TrackCard } from '../TrackCard/TrackCard';
import styles from './TrackList.module.css';

/**
 * TrackList component: displays a responsive grid of TrackCard items.
 *
 * The list of tracks is received via props (data stays local to the project).
 * Clicking a card lifts the selected track up to the parent through
 * `onTrackSelect` — filtering / playback logic lives in the parent.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.tracks - Tracks to render.
 * @param {function} [props.onTrackSelect] - Called with the clicked track object.
 * @param {number|string} [props.currentTrackId] - Id of the active track (for the playing indicator).
 * @param {boolean} [props.isPlaying=false] - Whether the active track is currently playing.
 */
export function TrackList({ tracks, onTrackSelect, currentTrackId, isPlaying = false, likedTrackIds = [], onLikeToggle }) {
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
          />
        </li>
      ))}
    </ul>
  );
}

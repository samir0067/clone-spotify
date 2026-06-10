import { useState, useCallback } from 'react';

/**
 * A custom hook to mock audio playback controls.
 * Shows naming convention for custom React hooks in the project.
 *
 * @returns {object} Playback state and control handlers.
 */
export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const play = useCallback((track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    isPlaying,
    currentTrack,
    play,
    pause,
    toggle,
  };
}

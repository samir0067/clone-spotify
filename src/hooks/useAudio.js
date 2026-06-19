import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * A custom hook to orchestrate HTML5 Audio playback.
 *
 * @param {object} [options] - Configurations for the playback.
 * @param {function} [options.onEnded] - Callback when the current track finishes.
 * @returns {object} Audio state variables and control handlers.
 */
export function useAudio(options = {}) {
  const { onEnded } = options;
  const onEndedRef = useRef(onEnded);

  // Sync onEnded callback to ref to avoid stale closures
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, _setVolume] = useState(0.7); // 70% volume by default
  const [isMuted, setIsMuted] = useState(false);

  const prevVolumeRef = useRef(0.7);
  const audioRef = useRef(null);

  // Initialize Audio instance once
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }

  // Play a specific track
  const play = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    const isNewTrack = !currentTrack || currentTrack.id !== track.id;

    if (isNewTrack) {
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
      setHasError(false);
      setIsBuffering(true);

      audio.src = track.audioUrl;
      audio.load();
    }

    audio.play().catch((err) => {
      console.warn('Playback failed or aborted:', err);
    });
  }, [currentTrack]);

  // Pause playback
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn('Playback failed or aborted:', err);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack]);

  // Seek to specific time (seconds)
  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Adjust volume (0.0 to 1.0)
  const setVolume = useCallback((val) => {
    const audio = audioRef.current;
    if (!audio) return;

    const sanitizedVal = Math.max(0, Math.min(1, val));
    _setVolume(sanitizedVal);
    audio.volume = sanitizedVal;

    if (sanitizedVal > 0) {
      setIsMuted(false);
      audio.muted = false;
      prevVolumeRef.current = sanitizedVal;
    } else {
      setIsMuted(true);
      audio.muted = true;
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsMuted((prev) => {
      const nextMute = !prev;
      audio.muted = nextMute;
      if (nextMute) {
        audio.volume = 0;
      } else {
        audio.volume = prevVolumeRef.current;
        _setVolume(prevVolumeRef.current);
      }
      return nextMute;
    });
  }, []);

  // Sync event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setHasError(false);
    };
    const onLoadedData = () => setIsBuffering(false);
    const onError = (e) => {
      console.error('Audio element error:', e);
      setHasError(true);
      setIsBuffering(false);
      setIsPlaying(false);
    };
    const onEnded = () => {
      setIsPlaying(false);
      if (onEndedRef.current) {
        onEndedRef.current();
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('loadeddata', onLoadedData);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('loadeddata', onLoadedData);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  return {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    isBuffering,
    hasError,
    volume,
    isMuted,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    toggleMute,
  };
}

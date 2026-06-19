import { useState, useEffect, useCallback } from 'react';

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
 * Custom hook to fetch tracks from `/tracks.json` and handle loading/error states.
 *
 * @returns {object} An object containing the tracks, loading status, error status, and a refetch function.
 */
export function useTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTracks = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/tracks.json', { signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      // Map track data to include coverUrl (for compatibility with TrackCard)
      // and audioUrl (for compatibility with useAudio player)
      const mappedTracks = data.map((track) => ({
        ...track,
        coverUrl: track.coverUrl || track.cover,
        audioUrl: track.audioUrl || AUDIO_URLS[(track.id - 1) % AUDIO_URLS.length],
      }));

      setTracks(mappedTracks);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching tracks:', err);
        setError(err.message || 'An error occurred while loading tracks.');
      }
    } finally {
      // Only set loading to false if not aborted (though aborted requests won't reach here if we catch correctly,
      // signal.aborted check is a safe check if React state updates after unmount)
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchTracks(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchTracks]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchTracks(controller.signal);
    return () => controller.abort();
  }, [fetchTracks]);

  return { tracks, loading, error, refetch };
}

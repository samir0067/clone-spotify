import { useState, useEffect } from 'react';

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

export function useTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTracks() {
      try {
        setLoading(true);
        const response = await fetch('/tracks.json');
        
        if (!response.ok) {
          throw new Error(`Impossible de charger les musiques (${response.status})`);
        }

        const data = await response.json();

        // Map data to ensure compatibility with our components
        const formattedData = data.map((track) => ({
          ...track,
          // Use cover from JSON, fallback to picsum placeholder
          coverUrl: track.cover || `https://picsum.photos/seed/spotify-${track.id}/300/300`,
          // Ensure we have a year (mocked if not present) for filters
          year: track.year || (2018 + (track.id % 6)),
          // Assign dynamic audio urls
          audioUrl: track.audioUrl || AUDIO_URLS[(track.id - 1) % AUDIO_URLS.length],
        }));

        if (isMounted) {
          setTracks(formattedData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Une erreur est survenue lors de la récupération des pistes.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTracks();

    return () => {
      isMounted = false;
    };
  }, []);

  return { tracks, loading, error };
}

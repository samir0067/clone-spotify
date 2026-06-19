import { useState, useEffect } from 'react';
import { generateMockLyrics } from '../data/tracks';

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

export function useFetchTracks() {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadTracks() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/tracks.json');
        if (!response.ok) {
          throw new Error(`Erreur serveur : ${response.status}`);
        }
        const data = await response.json();
        
        // Map the payload to compliant tracks with covers and preview audios
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
          formattedTrack.lyrics = generateMockLyrics(formattedTrack);
          return formattedTrack;
        });

        if (active) {
          setTracks(formatted);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Impossible de charger la bibliothèque');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadTracks();

    return () => {
      active = false;
    };
  }, []);

  return { tracks, isLoading, error };
}

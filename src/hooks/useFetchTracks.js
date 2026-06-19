import React from 'react';

/**
 * Custom hook to fetch tracks data from /tracks.json
 *
 * Manages three states:
 * - data: Array of tracks fetched from the server
 * - loading: Boolean indicating if the fetch is in progress
 * - error: Error object or string if the fetch failed
 *
 * Usage:
 * ```js
 * const { data: tracks, loading, error } = useFetchTracks();
 *
 * if (loading) return <div>Chargement...</div>;
 * if (error) return <div>Erreur : {error}</div>;
 * return <div>{tracks.map(track => <div key={track.id}>{track.title}</div>)}</div>;
 * ```
 *
 * @returns {object} Object containing:
 *   - data: Array of track objects or null
 *   - loading: Boolean indicating fetch status
 *   - error: Error message string or null
 */
export function useFetchTracks() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/tracks.json');

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }

        const tracks = await response.json();

        // Validate that the response is an array
        if (!Array.isArray(tracks)) {
          throw new Error('Les données reçues ne sont pas un tableau de morceaux');
        }

        if (isMounted) {
          setData(tracks);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTracks();

    // Cleanup to avoid state updates on unmounted components
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}

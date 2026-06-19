import { useState, useEffect, useCallback } from 'react';

/**
 * useTracks : va chercher les morceaux dans /tracks.json et expose 3 états.
 *
 *   - tracks  : les données (tableau, vide au départ)
 *   - loading : true pendant le chargement
 *   - error   : message clair si la requête échoue (sinon null)
 *   - refetch : relance la requête (bouton « Réessayer »)
 *
 * 🎬 ASTUCE DÉMO : ajouter "?fail" dans l'URL (ex: http://localhost:3000/?fail)
 *    force une panne (on vise un fichier qui n'existe pas) — pratique pour
 *    montrer le 3ᵉ état EN DIRECT, sans rien modifier dans le code.
 */
export function useTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    // Mode démo panne : "?fail" dans l'URL => URL volontairement cassée.
    const failMode = new URLSearchParams(window.location.search).has('fail');
    const url = failMode ? '/tracks-oops.json' : '/tracks.json';

    // Petit délai volontaire (600 ms) : juste pour qu'on VOIE l'état
    // « Chargement… » pendant la démo (un fichier local arrive sinon instantanément).
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          // fetch ne "throw" pas sur un 404 : on vérifie response.ok nous-mêmes.
          if (!response.ok) throw new Error('Réponse réseau invalide');
          return response.json();
        })
        .then((data) => setTracks(data))
        .catch(() => setError('Impossible de charger les morceaux.'))
        .finally(() => setLoading(false));
    }, 600);
  }, []);

  // Au montage du composant, on lance la requête une fois.
  useEffect(() => {
    load();
  }, [load]);

  return { tracks, loading, error, refetch: load };
}

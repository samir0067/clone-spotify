import { useState } from 'react';

/**
 * usePlayer : petit hook qui gère l'état du lecteur.
 *
 * Volontairement simple et SANS audio réel (le cours est 100% hors-ligne) :
 * on suit juste « quel morceau est sélectionné » et « est-ce qu'il joue ».
 * Le bouton play/pause bascule donc visuellement, sans son.
 *
 * @returns {{
 *   currentTrack: object|null,   // le morceau affiché dans le lecteur
 *   isPlaying: boolean,          // état visuel lecture / pause
 *   select: (track: object) => void,  // clic sur un morceau
 *   toggle: () => void,          // bouton play/pause du lecteur
 * }}
 */
export function usePlayer() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Clic sur une carte :
  //  - même morceau déjà sélectionné -> on bascule play/pause
  //  - nouveau morceau -> on le sélectionne et on lance la « lecture »
  const select = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying((playing) => !playing);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // Bouton play/pause du lecteur en bas d'écran.
  const toggle = () => {
    if (!currentTrack) return;
    setIsPlaying((playing) => !playing);
  };

  return { currentTrack, isPlaying, select, toggle };
}

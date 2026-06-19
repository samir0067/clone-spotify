/**
 * Formate une durée en secondes vers une chaîne "m:ss".
 *
 * Exemples : formatDuration(213) -> "3:33", formatDuration(9) -> "0:09".
 *
 * @param {number} seconds - Durée en secondes.
 * @returns {string} Durée formatée (mm:ss).
 */
export function formatDuration(seconds) {
  // Garde-fou : si la valeur est absente ou invalide, on renvoie "0:00"
  // plutôt que de planter (cas limite d'un morceau incomplet).
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedSecs = secs < 10 ? `0${secs}` : secs;

  return `${mins}:${paddedSecs}`;
}

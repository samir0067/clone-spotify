/**
 * Formats a duration in seconds into a string in MM:SS format.
 *
 * @param {number} seconds - The duration in seconds.
 * @returns {string} The formatted duration (e.g., "3:45", "0:09").
 */
export function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedSecs = secs < 10 ? `0${secs}` : secs;

  return `${mins}:${formattedSecs}`;
}

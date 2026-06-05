/**
 * Format seconds into MM:SS display string.
 */
export const formatTime = (seconds: number | null | undefined): string => {
  if (seconds == null || seconds < 0) return '0:00';

  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format milliseconds into MM:SS display string.
 */
export const formatTimeMs = (ms: number | null | undefined): string => {
  if (ms == null || ms < 0) return '0:00';
  return formatTime(ms / 1000);
};

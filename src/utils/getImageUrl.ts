import { ImageQuality } from '../types';

/**
 * Extract the best quality image URL from the JioSaavn image array.
 */
export const getImageUrl = (
  images: ImageQuality[] | undefined | null,
  preferredQuality: '500x500' | '150x150' | '50x50' = '500x500'
): string => {
  if (!images || images.length === 0) {
    return '';
  }

  const preferred = images.find((img) => img.quality === preferredQuality);
  if (preferred) return preferred.url;

  // Fallback: pick highest quality available
  const qualityOrder = ['500x500', '150x150', '50x50'];
  for (const q of qualityOrder) {
    const found = images.find((img) => img.quality === q);
    if (found) return found.url;
  }

  // Last resort: return first available
  return images[0].url;
};

/**
 * Extract the best quality download URL.
 * Prefers 320kbps, falls back to 160kbps, then 96kbps.
 */
export const getDownloadUrl = (
  downloadUrls: ImageQuality[] | undefined | null,
  preferredQuality: string = '320kbps'
): string => {
  if (!downloadUrls || downloadUrls.length === 0) {
    return '';
  }

  const preferred = downloadUrls.find((d) => d.quality === preferredQuality);
  if (preferred) return preferred.url;

  const qualityOrder = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
  for (const q of qualityOrder) {
    const found = downloadUrls.find((d) => d.quality === q);
    if (found) return found.url;
  }

  return downloadUrls[0].url;
};

/**
 * Get primary artist names as a comma-separated string.
 */
export const getArtistNames = (
  artists: { primary: { name: string }[] } | undefined | null
): string => {
  if (!artists?.primary || artists.primary.length === 0) {
    return 'Unknown Artist';
  }
  return artists.primary.map((a) => a.name).join(', ');
};

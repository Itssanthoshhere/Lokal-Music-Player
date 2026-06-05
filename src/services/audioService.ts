import { AudioPlayer, AudioEvents } from 'expo-audio';
import { usePlayerStore } from '../store/playerStore';
import { getDownloadUrl } from '../utils/getImageUrl';

let player: AudioPlayer | null = null;

/**
 * Get or create the singleton audio player instance.
 */
export const getPlayer = (): AudioPlayer | null => {
  return player;
};

/**
 * Set the player instance (called from useAudioSetup hook).
 */
export const setPlayer = (p: AudioPlayer): void => {
  player = p;
};

/**
 * Load and play a song URL.
 */
export const loadAndPlay = async (url: string): Promise<void> => {
  if (!player) return;

  try {
    player.replace({ uri: url });
    player.play();
  } catch (error) {
    console.error('[AudioService] loadAndPlay error:', error);
    usePlayerStore.getState().setPlaybackState('error');
  }
};

/**
 * Pause playback.
 */
export const pause = (): void => {
  if (!player) return;
  player.pause();
};

/**
 * Resume playback.
 */
export const resume = (): void => {
  if (!player) return;
  player.play();
};

/**
 * Seek to position in seconds.
 */
export const seekTo = (seconds: number): void => {
  if (!player) return;
  player.seekTo(seconds);
};

/**
 * Play a song from the store by loading its download URL.
 */
export const playSongFromStore = (): void => {
  const { currentSong } = usePlayerStore.getState();
  if (!currentSong) return;

  const url = getDownloadUrl(currentSong.downloadUrl, '160kbps');
  if (!url) {
    console.error('[AudioService] No download URL available for song:', currentSong.name);
    usePlayerStore.getState().setPlaybackState('error');
    return;
  }

  loadAndPlay(url);
};

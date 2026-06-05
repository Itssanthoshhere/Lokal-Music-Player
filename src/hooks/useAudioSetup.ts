import { useEffect, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from 'expo-audio';
import { usePlayerStore } from '../store/playerStore';
import { setPlayer, playSongFromStore } from '../services/audioService';
import { getDownloadUrl } from '../utils/getImageUrl';

/**
 * Hook that bridges the expo-audio player with the Zustand store.
 * Must be called once at the app root level.
 *
 * Responsibilities:
 * - Creates and manages the audio player instance
 * - Syncs playback status (position, duration, state) to the store
 * - Handles auto-advance when a song finishes
 * - Reacts to currentSong changes to load new tracks
 */
export function useAudioSetup() {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const currentSong = usePlayerStore((s) => s.currentSong);
  const playbackState = usePlayerStore((s) => s.playbackState);
  const setPosition = usePlayerStore((s) => s.setPosition);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setPlaybackState = usePlayerStore((s) => s.setPlaybackState);
  const playNext = usePlayerStore((s) => s.playNext);

  const prevSongIdRef = useRef<string | null>(null);
  const hasEndedRef = useRef(false);

  // Register the player instance with the audio service singleton
  useEffect(() => {
    setPlayer(player);
  }, [player]);

  // When currentSong changes, load and play the new song
  useEffect(() => {
    if (!currentSong) return;
    if (currentSong.id === prevSongIdRef.current) return;

    prevSongIdRef.current = currentSong.id;
    hasEndedRef.current = false;

    // Check if song is downloaded
    const downloads = usePlayerStore.getState().downloads;
    const localUri = downloads[currentSong.id];
    const url = localUri || getDownloadUrl(currentSong.downloadUrl, '160kbps');
    if (!url) {
      setPlaybackState('error');
      return;
    }

    try {
      player.replace({ uri: url });
      player.play();
    } catch (error) {
      console.error('[useAudioSetup] Error loading song:', error);
      setPlaybackState('error');
    }
  }, [currentSong?.id]);

  // Sync player status to store
  useEffect(() => {
    if (!status) return;

    // Update position and duration
    if (typeof status.currentTime === 'number') {
      setPosition(status.currentTime * 1000);
    }
    if (typeof status.duration === 'number' && status.duration > 0) {
      setDuration(status.duration * 1000);
    }

    // Update playback state
    if (status.playing) {
      if (playbackState !== 'playing') {
        setPlaybackState('playing');
      }
    } else if (status.currentTime > 0 && !status.playing && playbackState === 'playing') {
      // Paused by user
      setPlaybackState('paused');
    }

    // Handle song completion
    if (
      status.duration > 0 &&
      status.currentTime >= status.duration - 0.5 &&
      !status.playing &&
      !hasEndedRef.current
    ) {
      hasEndedRef.current = true;
      playNext();
    }
  }, [status]);

  return player;
}

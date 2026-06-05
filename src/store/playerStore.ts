import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as FileSystem from 'expo-file-system/legacy';
import { Song, RepeatMode, PlaybackState } from '../types';
import { searchSongs as searchSongsApi } from '../api/songs';
import { getDownloadUrl } from '../utils/getImageUrl';
import { zustandStorage } from './storage';

interface PlayerState {
  // Playback
  currentSong: Song | null;
  playbackState: PlaybackState;
  currentPosition: number;
  duration: number;

  // Queue
  queue: Song[];
  queueIndex: number;
  originalQueue: Song[];

  // Modes
  repeatMode: RepeatMode;
  shuffleMode: boolean;

  // Favorites
  favorites: Song[];

  // Downloads (songId -> local file URI)
  downloads: Record<string, string>;
  isDownloading: Record<string, boolean>;

  // Search
  searchQuery: string;
  searchResults: Song[];
  searchPage: number;
  searchTotal: number;
  isSearching: boolean;
  hasMoreResults: boolean;

  // Playback actions
  setCurrentSong: (song: Song) => void;
  setPlaybackState: (state: PlaybackState) => void;
  setPosition: (positionMs: number) => void;
  setDuration: (durationMs: number) => void;

  // Transport actions
  playSong: (song: Song, addToQueue?: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;

  // Queue actions
  addToQueue: (song: Song) => void;
  insertNext: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  playFromQueue: (index: number) => void;

  // Mode actions
  toggleRepeat: () => void;
  toggleShuffle: () => void;

  // Favorite actions
  toggleFavorite: (song: Song) => void;

  // Download actions
  downloadSong: (song: Song) => Promise<void>;
  removeDownload: (song: Song) => Promise<void>;

  // Search actions
  setSearchQuery: (query: string) => void;
  searchSongs: (query: string, reset?: boolean) => Promise<void>;
  loadMoreResults: () => Promise<void>;
  clearSearch: () => void;
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSong: null,
      playbackState: 'idle',
      currentPosition: 0,
      duration: 0,
      queue: [],
      queueIndex: -1,
      originalQueue: [],
      repeatMode: 'off',
      shuffleMode: false,
      favorites: [],
      downloads: {},
      isDownloading: {},
      searchQuery: '',
      searchResults: [],
      searchPage: 0,
      searchTotal: 0,
      isSearching: false,
      hasMoreResults: false,

      // Playback actions
      setCurrentSong: (song) => set({ currentSong: song }),
      setPlaybackState: (state) => set({ playbackState: state }),
      setPosition: (positionMs) => set({ currentPosition: positionMs }),
      setDuration: (durationMs) => set({ duration: durationMs }),

      // Transport actions
      playSong: (song, addToQueue = true) => {
        const { queue, shuffleMode } = get();

        if (addToQueue) {
          const existingIndex = queue.findIndex((s) => s.id === song.id);

          if (existingIndex !== -1) {
            set({
              currentSong: song,
              queueIndex: existingIndex,
              playbackState: 'loading',
              currentPosition: 0,
            });
          } else {
            const newQueue = [...queue, song];
            const newIndex = newQueue.length - 1;
            set({
              currentSong: song,
              queue: newQueue,
              originalQueue: shuffleMode ? get().originalQueue : newQueue,
              queueIndex: newIndex,
              playbackState: 'loading',
              currentPosition: 0,
            });
          }
        } else {
          set({
            currentSong: song,
            playbackState: 'loading',
            currentPosition: 0,
          });
        }
      },

      playNext: () => {
        const { queue, queueIndex, repeatMode } = get();
        if (queue.length === 0) return;

        let nextIndex: number;

        if (repeatMode === 'one') {
          nextIndex = queueIndex;
        } else if (queueIndex < queue.length - 1) {
          nextIndex = queueIndex + 1;
        } else if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          set({ playbackState: 'paused', currentPosition: 0 });
          return;
        }

        const nextSong = queue[nextIndex];
        if (nextSong) {
          set({
            currentSong: nextSong,
            queueIndex: nextIndex,
            playbackState: 'loading',
            currentPosition: 0,
          });
        }
      },

      playPrevious: () => {
        const { queue, queueIndex, currentPosition, repeatMode } = get();
        if (queue.length === 0) return;

        // If more than 3 seconds in, restart current song
        if (currentPosition > 3000) {
          set({ currentPosition: 0 });
          return;
        }

        let prevIndex: number;

        if (queueIndex > 0) {
          prevIndex = queueIndex - 1;
        } else if (repeatMode === 'all') {
          prevIndex = queue.length - 1;
        } else {
          set({ currentPosition: 0 });
          return;
        }

        const prevSong = queue[prevIndex];
        if (prevSong) {
          set({
            currentSong: prevSong,
            queueIndex: prevIndex,
            playbackState: 'loading',
            currentPosition: 0,
          });
        }
      },

      // Queue actions
      addToQueue: (song) => {
        const { queue, originalQueue, shuffleMode } = get();
        const exists = queue.some((s) => s.id === song.id);
        if (exists) return;

        const newQueue = [...queue, song];
        set({
          queue: newQueue,
          originalQueue: shuffleMode ? [...originalQueue, song] : newQueue,
        });
      },

      insertNext: (song) => {
        const { queue, queueIndex, originalQueue, shuffleMode } = get();
        const exists = queue.some((s) => s.id === song.id);
        if (exists) return;

        const newQueue = [...queue];
        const insertAt = queueIndex >= 0 ? queueIndex + 1 : 0;
        newQueue.splice(insertAt, 0, song);

        let newOriginalQueue = [...originalQueue];
        if (shuffleMode) {
           newOriginalQueue.push(song);
        } else {
           newOriginalQueue = newQueue;
        }

        set({
          queue: newQueue,
          originalQueue: newOriginalQueue,
        });
      },

      removeFromQueue: (index) => {
        const { queue, queueIndex, currentSong, originalQueue, shuffleMode } = get();
        if (index < 0 || index >= queue.length) return;

        const removedSong = queue[index];
        const newQueue = queue.filter((_, i) => i !== index);

        let newIndex = queueIndex;
        if (index < queueIndex) {
          newIndex = queueIndex - 1;
        } else if (index === queueIndex) {
          if (newQueue.length === 0) {
            set({
              queue: [],
              originalQueue: [],
              queueIndex: -1,
              currentSong: null,
              playbackState: 'idle',
              currentPosition: 0,
              duration: 0,
            });
            return;
          }
          newIndex = Math.min(queueIndex, newQueue.length - 1);
          set({
            queue: newQueue,
            originalQueue: shuffleMode
              ? originalQueue.filter((s) => s.id !== removedSong.id)
              : newQueue,
            queueIndex: newIndex,
            currentSong: newQueue[newIndex],
            playbackState: 'loading',
            currentPosition: 0,
          });
          return;
        }

        set({
          queue: newQueue,
          originalQueue: shuffleMode
            ? originalQueue.filter((s) => s.id !== removedSong.id)
            : newQueue,
          queueIndex: newIndex,
        });
      },

      reorderQueue: (fromIndex, toIndex) => {
        const { queue, queueIndex, currentSong } = get();
        const newQueue = [...queue];
        const [movedItem] = newQueue.splice(fromIndex, 1);
        newQueue.splice(toIndex, 0, movedItem);

        let newQueueIndex = queueIndex;
        if (currentSong) {
          newQueueIndex = newQueue.findIndex((s) => s.id === currentSong.id);
        }

        set({
          queue: newQueue,
          queueIndex: newQueueIndex >= 0 ? newQueueIndex : queueIndex,
        });
      },

      clearQueue: () => {
        set({
          queue: [],
          originalQueue: [],
          queueIndex: -1,
          currentSong: null,
          playbackState: 'idle',
          currentPosition: 0,
          duration: 0,
        });
      },

      playFromQueue: (index) => {
        const { queue } = get();
        if (index < 0 || index >= queue.length) return;

        set({
          currentSong: queue[index],
          queueIndex: index,
          playbackState: 'loading',
          currentPosition: 0,
        });
      },

      // Mode actions
      toggleRepeat: () => {
        const { repeatMode } = get();
        const nextMode: RepeatMode =
          repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
        set({ repeatMode: nextMode });
      },

      toggleShuffle: () => {
        const { shuffleMode, queue, originalQueue, currentSong } = get();

        if (shuffleMode) {
          // Turning off shuffle: restore original order
          const currentIndex = currentSong
            ? originalQueue.findIndex((s) => s.id === currentSong.id)
            : -1;
          set({
            shuffleMode: false,
            queue: [...originalQueue],
            queueIndex: currentIndex >= 0 ? currentIndex : 0,
          });
        } else {
          // Turning on shuffle: save original, shuffle remaining
          const currentIndex = currentSong
            ? queue.findIndex((s) => s.id === currentSong.id)
            : -1;

          const before = currentIndex >= 0 ? [queue[currentIndex]] : [];
          const rest = queue.filter((_, i) => i !== currentIndex);
          const shuffledRest = shuffleArray(rest);
          const newQueue = [...before, ...shuffledRest];

          set({
            shuffleMode: true,
            originalQueue: [...queue],
            queue: newQueue,
            queueIndex: 0,
          });
        }
      },

      // Favorite actions
      toggleFavorite: (song) => {
        const { favorites } = get();
        const exists = favorites.some((s) => s.id === song.id);
        
        if (exists) {
          set({ favorites: favorites.filter((s) => s.id !== song.id) });
        } else {
          set({ favorites: [...favorites, song] });
        }
      },

      // Download actions
      downloadSong: async (song) => {
        const url = getDownloadUrl(song.downloadUrl, '320kbps') || getDownloadUrl(song.downloadUrl, '160kbps');
        if (!url) return;

        set((state) => ({
          isDownloading: { ...state.isDownloading, [song.id]: true }
        }));

        try {
          const fileUri = `${FileSystem.documentDirectory}${song.id}.mp3`;
          const result = await FileSystem.downloadAsync(url, fileUri);
          
          if (result.status === 200) {
            set((state) => ({
              downloads: { ...state.downloads, [song.id]: result.uri },
              isDownloading: { ...state.isDownloading, [song.id]: false }
            }));
          } else {
            throw new Error('Download failed');
          }
        } catch (error) {
          console.error('[Download Error]', error);
          set((state) => ({
            isDownloading: { ...state.isDownloading, [song.id]: false }
          }));
        }
      },

      removeDownload: async (song) => {
        const { downloads } = get();
        const fileUri = downloads[song.id];

        if (!fileUri) return;

        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
          
          set((state) => {
            const newDownloads = { ...state.downloads };
            delete newDownloads[song.id];
            return { downloads: newDownloads };
          });
        } catch (error) {
          console.error('[Remove Download Error]', error);
        }
      },

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      searchSongs: async (query, reset = true) => {
        if (!query.trim()) {
          set({
            searchResults: [],
            searchPage: 0,
            searchTotal: 0,
            isSearching: false,
            hasMoreResults: false,
          });
          return;
        }

        const page = reset ? 0 : get().searchPage;
        set({ isSearching: true });

        try {
          const response = await searchSongsApi(query, page, 20);
          const { results, total } = response.data;

          set({
            searchResults: reset ? results : [...get().searchResults, ...results],
            searchPage: page + 1,
            searchTotal: total,
            hasMoreResults: (reset ? results.length : get().searchResults.length + results.length) < total,
            isSearching: false,
          });
        } catch (error) {
          console.error('[Search Error]', error);
          set({ isSearching: false });
        }
      },

      loadMoreResults: async () => {
        const { searchQuery, hasMoreResults, isSearching } = get();
        if (!hasMoreResults || isSearching) return;
        await get().searchSongs(searchQuery, false);
      },

      clearSearch: () => {
        set({
          searchQuery: '',
          searchResults: [],
          searchPage: 0,
          searchTotal: 0,
          isSearching: false,
          hasMoreResults: false,
        });
      },
    }),
    {
      name: 'player-store',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        queue: state.queue,
        originalQueue: state.originalQueue,
        currentSong: state.currentSong,
        queueIndex: state.queueIndex,
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
        favorites: state.favorites,
        downloads: state.downloads,
      }),
    }
  )
);

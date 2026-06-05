import { createMMKV } from 'react-native-mmkv';
import type { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

let mmkvInstance: MMKV | null = null;

const getStorage = (): MMKV => {
  if (!mmkvInstance) {
    mmkvInstance = createMMKV({ id: 'lokal-music-player' });
  }
  return mmkvInstance;
};

/**
 * Custom storage adapter that bridges MMKV with Zustand's persist middleware.
 * MMKV is synchronous and significantly faster than AsyncStorage.
 */
export const zustandStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    getStorage().set(name, value);
  },
  getItem: (name: string) => {
    const value = getStorage().getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    getStorage().remove(name);
  },
};

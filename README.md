# Lokal Music Player

A beautiful, high-performance, locally-focused React Native music player built with Expo SDK 56. 

## Features

- 🎵 **Fully Featured Player**: Play, pause, skip, seek, and scrub through tracks seamlessly.
- 📱 **Mini-Player**: A persistent, perfectly-synced mini-player that follows you as you navigate the app.
- 🗂 **Smart Queue System**: Add songs to your queue, reorder them via drag-and-drop, and remove them—all persisted locally.
- ❤️ **Favorites**: Instantly add tracks to your favorites list for quick access.
- ☁️ **Offline Downloads**: Download any track locally to your device via `expo-file-system` and play it seamlessly without an internet connection.
- 🔄 **Modes**: Support for Shuffle and Repeat modes.
- 📴 **Background Playback**: Full background audio support via Expo Audio, allowing playback while minimized or when the screen is off.
- 🎨 **Premium UI**: Crafted with a beautiful dark theme, smooth micro-animations, and dynamic glassmorphism aesthetics.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) / [Expo SDK 56](https://expo.dev/)
- **Audio Engine**: `expo-audio`
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Storage**: `react-native-mmkv` (High-performance synchronous key-value storage)
- **Navigation**: `@react-navigation/native` & `@react-navigation/native-stack`
- **Networking**: `axios`

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or a physical device with Expo Go/Development build)

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd lokal-music-player
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Install Native Pods (iOS only)**:
   Because this app uses native modules (like `expo-file-system` and `react-native-mmkv`), you must build a custom dev client.
   ```bash
   npx pod-install ios
   ```

4. **Run the App**:
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## Development Notes
- The audio engine is initialized via a custom `useAudioSetup` hook that ties `expo-audio` strictly to the global Zustand `playerStore`.
- Remote downloads check the local file system first to avoid redundant network requests.

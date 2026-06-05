<div align="center">

## 🎵 Lokal Music Player

#### A Production-Quality Music Streaming App Built with React Native, Expo & JioSaavn API

![React Native](https://img.shields.io/badge/React%20Native-0.82-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-SDK%2056-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State%20Management-000000?style=for-the-badge)
![MMKV](https://img.shields.io/badge/MMKV-Storage-orange?style=for-the-badge)

> 🎧 Built as part of the Lokal React Native Internship Assignment

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Itssanthoshhere/Lokal-Music-Player)

</div>

</div>

---

# 📋 Table of Contents

- [📋 Table of Contents](#-table-of-contents)
- [📖 About The Project](#-about-the-project)
- [🌟 Bonus Features Implemented](#-bonus-features-implemented)
- [✨ Features](#-features)
  - [🎵 Music Search](#-music-search)
  - [▶️ Audio Playback](#️-audio-playback)
  - [📱 Mini Player](#-mini-player)
  - [🎛️ Full Player](#️-full-player)
  - [📋 Queue Management](#-queue-management)
  - [💾 Persistence \& Local Storage](#-persistence--local-storage)
  - [🔒 Background Playback](#-background-playback)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [⚖️ Trade-offs \& Decisions](#️-trade-offs--decisions)
    - [Zustand over Redux Toolkit](#zustand-over-redux-toolkit)
    - [MMKV over AsyncStorage](#mmkv-over-asyncstorage)
    - [Expo Audio over Expo AV](#expo-audio-over-expo-av)
    - [Single Global Player Store](#single-global-player-store)
    - [Offline Downloads](#offline-downloads)
- [✅ Assignment Requirements Checklist](#-assignment-requirements-checklist)
    - [Core Requirements](#core-requirements)
    - [Bonus Requirements](#bonus-requirements)
- [📁 Project Structure](#-project-structure)
- [📱 Screens](#-screens)
  - [🏠 Home Screen](#-home-screen)
    - [Features](#features)
  - [🎵 Full Player Screen](#-full-player-screen)
  - [📌 Mini Player](#-mini-player-1)
  - [📋 Queue Screen](#-queue-screen)
- [🧠 State Management](#-state-management)
- [🎧 Audio Playback System](#-audio-playback-system)
- [📥 Offline Downloads](#-offline-downloads)
- [🚀 Installation](#-installation)
  - [Clone Repository](#clone-repository)
  - [Install Dependencies](#install-dependencies)
  - [Start Development Server](#start-development-server)
- [📱 Running The Project](#-running-the-project)
  - [Android](#android)
  - [iOS](#ios)
  - [Expo Build Preview](#expo-build-preview)
- [🔮 Future Enhancements](#-future-enhancements)
- [👨‍💻 Author](#-author)
    - [V S Santhosh](#v-s-santhosh)
- [📜 License](#-license)

---

# 📖 About The Project

**Lokal Music Player** is a production-quality music streaming application built using **React Native**, **Expo SDK 56**, and the **JioSaavn API**.

The application was developed as part of the **Lokal React Native Internship Assignment** and focuses on delivering a smooth and scalable music streaming experience while demonstrating modern mobile development practices.

The project emphasizes:

- Clean Architecture
- Scalable State Management
- Real-Time Audio Synchronization
- Offline Music Support
- Background Playback
- Queue Management
- Pixel-Perfect UI Implementation
- Performance Optimization

The application follows the design provided by Lokal and uses real JioSaavn data instead of mock content.

---

# 🌟 Bonus Features Implemented

- Shuffle Mode
- Repeat Mode (Off / One / All)
- Offline Song Downloads
- Queue Persistence
- Background Playback
- Mini Player Synchronization
- Downloaded Song Playback
- MMKV Local Storage

---

# ✨ Features

## 🎵 Music Search

- Real-time song search
- Debounced API requests
- Infinite scrolling support
- Pagination support
- Loading states
- Empty states
- Fast search experience

---

## ▶️ Audio Playback

- Play songs instantly
- Pause / Resume playback
- Previous / Next track controls
- Seek controls
- Playback progress tracking
- Playback duration tracking
- Auto-play next track
- Continuous listening experience

---

## 📱 Mini Player

- Persistent across screens
- Real-time synchronization
- Quick play/pause controls
- Tap to expand into full player
- Smooth animations

---

## 🎛️ Full Player

- Large album artwork
- Song metadata
- Interactive seek bar
- Playback controls
- Queue access
- Shuffle mode
- Repeat modes
- Smooth user interactions

---

## 📋 Queue Management

- Add songs to queue
- Remove songs from queue
- Reorder songs
- Drag-and-drop support
- Queue persistence using MMKV
- Restore queue after app restart

---

## 💾 Persistence & Local Storage

- Current song persistence
- Queue persistence
- Playback preferences
- Repeat mode persistence
- Shuffle mode persistence
- Download metadata persistence

---

## 🔒 Background Playback

Audio playback continues when:

- App is minimized
- Screen is locked
- User switches screens
- User navigates throughout the application

---

# 🛠️ Tech Stack

| Category          | Technology                      |
| ----------------- | ------------------------------- |
| Framework         | React Native                    |
| Runtime           | Expo SDK 56                     |
| Language          | TypeScript                      |
| Navigation        | React Navigation v7             |
| State Management  | Zustand                         |
| Storage           | MMKV                            |
| Networking        | Axios                           |
| Audio Playback    | Expo Audio                      |
| Offline Downloads | Expo File System                |
| Animations        | React Native Reanimated         |
| Queue Reordering  | React Native Draggable FlatList |

---

# 🏗️ Architecture

The application follows a modular and scalable architecture.

```txt
UI Layer
│
├── Screens
├── Components
└── Navigation

        ↓

Global Zustand Store

        ↓

Audio Service Layer

        ↓

MMKV Storage

        ↓

JioSaavn API
```

The Home Screen, Queue Screen, Mini Player, and Full Player all consume a single global Zustand store.

This ensures:

- Consistent playback state
- Perfect synchronization
- Minimal re-renders
- Better maintainability

---

# ⚖️ Trade-offs & Decisions

During development, the focus was on building a reliable and maintainable music player while avoiding unnecessary complexity.

### Zustand over Redux Toolkit

**Decision:** Zustand

**Reason:**
The application requires a lightweight global store for playback synchronization across Home, Mini Player, Full Player, and Queue screens.

**Trade-off:**
Redux Toolkit provides more structure and tooling, but introduces additional boilerplate that was unnecessary for the scope of this assignment.

---

### MMKV over AsyncStorage

**Decision:** MMKV

**Reason:**
Queue state, playback preferences, and downloaded song metadata require fast local persistence.

**Trade-off:**
MMKV requires native setup but provides significantly better performance than AsyncStorage.

---

### Expo Audio over Expo AV

**Decision:** Expo Audio

**Reason:**
Expo Audio is the recommended audio solution for Expo SDK 56 and provides a modern playback API.

**Trade-off:**
Background playback requires a development build and cannot be fully tested inside Expo Go.

---

### Single Global Player Store

**Decision:** Centralized Zustand Store

**Reason:**
Mini Player and Full Player must always remain synchronized.

**Trade-off:**
A global store slightly increases coupling, but greatly simplifies synchronization and state consistency.

---

### Offline Downloads

**Decision:** Local file downloads using Expo File System

**Reason:**
Offline listening was implemented as a bonus feature to improve user experience.

**Trade-off:**
Downloaded audio increases device storage usage, but provides uninterrupted playback without internet connectivity.

---

# ✅ Assignment Requirements Checklist

### Core Requirements

- [x] React Native (Expo)
- [x] TypeScript
- [x] React Navigation v6+
- [x] Zustand State Management
- [x] MMKV Persistence
- [x] JioSaavn API Integration
- [x] Home Screen
- [x] Song Search
- [x] Pagination
- [x] Full Player
- [x] Mini Player
- [x] Queue Management
- [x] Background Playback
- [x] Local Persistence
- [x] No Mock Data

### Bonus Requirements

- [x] Shuffle Mode
- [x] Repeat Mode
- [x] Offline Downloads
- [x] Downloaded Song Playback

---

# 📁 Project Structure

```txt
src/
│
├── api/
│   ├── client.ts
│   └── songs.ts
│
├── components/
│   ├── MiniPlayer.tsx
│   ├── SongCard.tsx
│   ├── SearchBar.tsx
│   ├── SeekBar.tsx
│   ├── PlayerControls.tsx
│   ├── QueueItem.tsx
│   ├── LoadingState.tsx
│   └── EmptyState.tsx
│
├── hooks/
│   ├── useAudioSetup.ts
│   └── useDebounce.ts
│
├── navigation/
│   └── AppNavigator.tsx
│
├── screens/
│   ├── HomeScreen.tsx
│   ├── PlayerScreen.tsx
│   └── QueueScreen.tsx
│
├── services/
│   └── audioService.ts
│
├── store/
│   ├── playerStore.ts
│   └── storage.ts
│
├── types/
│   ├── song.ts
│   ├── player.ts
│   └── api.ts
│
└── utils/
    ├── formatTime.ts
    └── getImageUrl.ts
```

---

# 📱 Screens

## 🏠 Home Screen

- Search songs
- Infinite scrolling
- Song listing
- Loading states
- Empty states

### Features

- Debounced search
- Pagination
- Real API integration
- Fast rendering

---

## 🎵 Full Player Screen

- Large album artwork
- Song information
- Playback controls
- Seek bar
- Shuffle mode
- Repeat mode

---

## 📌 Mini Player

- Persistent playback controls
- Real-time synchronization
- Expand to full player

---

## 📋 Queue Screen

- Current queue display
- Song reordering
- Remove songs
- Queue persistence

---

# 🧠 State Management

The application uses **Zustand** for lightweight and scalable state management.

Managed states include:

```ts
currentSong;
queue;
playbackState;
currentPosition;
duration;
repeatMode;
shuffleMode;
searchResults;
downloadedSongs;
```

Benefits:

- Lightweight
- Minimal boilerplate
- Excellent performance
- Easy persistence integration
- Predictable state updates

---

# 🎧 Audio Playback System

The application uses **Expo Audio** for playback.

Features include:

- Background playback
- Position tracking
- Duration tracking
- Playback synchronization
- Auto-next functionality
- Repeat modes
- Shuffle support
- Offline playback support
- Downloaded media playback

A dedicated singleton Audio Service manages playback independently from the UI layer.

This prevents interruptions during navigation and ensures playback consistency.

---

# 📥 Offline Downloads

The application supports offline listening.

Features:

- Download songs directly from JioSaavn audio URLs
- Store music files locally on device
- Play downloaded songs without internet
- Download status tracking
- Persistent download library
- Offline playback support

Built using:

- Expo File System
- MMKV Storage

Benefits:

- Reduced data usage
- Faster playback
- Access music anywhere
- Improved user experience

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Itssanthoshhere/Lokal-Music-Player.git

cd Lokal-Music-Player
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npx expo start
```

---

# 📱 Running The Project

## Android

```bash
npx expo run:android
```

## iOS

```bash
npx expo run:ios
```

> Background playback requires a Development Build and will not work inside Expo Go.

## Expo Build Preview

View the latest Expo build here:

[https://expo.dev/accounts/itssanthoshhere/projects/lokal-music-player/builds/2e73de3f-5589-4be9-aa23-cf393fedc44f](https://expo.dev/accounts/itssanthoshhere/projects/lokal-music-player/builds/2e73de3f-5589-4be9-aa23-cf393fedc44f)

---

# 🔮 Future Enhancements

- Download Quality Selection
- Smart Download Management
- Favorites Playlist
- Recently Played
- Lyrics Support
- Artist Pages
- Album Pages
- Equalizer Controls
- Sleep Timer
- Crossfade Playback

---

# 👨‍💻 Author

### V S Santhosh

- GitHub: https://github.com/Itssanthoshhere
- LinkedIn: https://linkedin.com/in/thesanthoshvs
- Portfolio: https://santhosh-vs-portfolio.vercel.app

---

# 📜 License

This project was developed as part of the Lokal React Native Internship Assignment.

For educational, evaluation, and portfolio purposes.

---

<div align="center">

Built with ❤️ by V S Santhosh

</div>

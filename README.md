<div align="center">

## 🎵 Lokal Music Player

### A Production-Quality Music Streaming App Built with React Native, Expo & JioSaavn API

![React Native](https://img.shields.io/badge/React%20Native-0.82-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-SDK%2056-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State%20Management-000000?style=for-the-badge)
![MMKV](https://img.shields.io/badge/MMKV-Storage-orange?style=for-the-badge)

> 🎧 Built as part of the Lokal - React Native Internship Assignment

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Itssanthoshhere/Lokal-Music-Player)

</div>

</div>

---

# 📋 Table of Contents

- 📖 About The Project
- 🌟 Bonus Features
- ✨ Features
- 🛠️ Tech Stack
- 🏗️ Architecture
- 📁 Project Structure
- 📱 Screens
- 🧠 State Management
- 🎧 Audio Playback System
- 📥 Offline Downloads
- 🚀 Installation
- 📱 Running The Project
- 🎯 Key Engineering Decisions
- 🔮 Future Enhancements
- 👨‍💻 Author
- 📜 License

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

| Category          | Technology          |
| ----------------- | ------------------- |
| Framework         | React Native        |
| Runtime           | Expo SDK 56         |
| Language          | TypeScript          |
| Navigation        | React Navigation v7 |
| State Management  | Zustand             |
| Storage           | MMKV                |
| Networking        | Axios               |
| Audio Playback    | Expo Audio          |
| Offline Downloads | Expo File System    |
| Animations        | Reanimated          |
| Queue Reordering  | Draggable FlatList  |

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

Local Storage (MMKV)

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

---

## 🎵 Full Player Screen

- Large artwork display
- Song metadata
- Interactive seek bar
- Playback controls
- Shuffle mode
- Repeat mode

---

## 📌 Mini Player

- Persistent bottom player
- Quick playback controls
- Tap to open full player

---

## 📋 Queue Screen

- Current queue display
- Reordering support
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

> Background playback requires a Development Build and will not work in Expo Go.

---

# 🎯 Key Engineering Decisions

## Why Zustand?

- Simpler than Redux Toolkit
- Less boilerplate
- Better developer experience
- Faster implementation

---

## Why MMKV?

- Faster than AsyncStorage
- Synchronous reads
- Better performance
- Excellent for queue persistence

---

## Why Expo Audio?

- Recommended replacement for Expo AV
- Better SDK 56 compatibility
- Modern playback APIs
- Reliable background playback support

---

## Why Offline Downloads?

- Meets assignment bonus requirements
- Improves user experience
- Enables listening without internet
- Demonstrates advanced mobile development concepts

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

---

# 👨‍💻 Author

### V S Santhosh

- **GitHub**: https://github.com/Itssanthoshhere
- **LinkedIn**: https://linkedin.com/in/thesanthoshvs
- **Portfolio**: https://santhosh-vs-portfolio.vercel.app

---

# 📜 License

This project was developed as part of the Lokal React Native Internship Assignment.

The project is intended for educational, evaluation, and portfolio purposes.

---

<div align="center">

⭐ If you found this project interesting, consider starring the repository.

Built with ❤️ by V S Santhosh

</div>

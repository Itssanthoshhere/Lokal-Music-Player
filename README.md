# Lokal Music Player

A production-quality music player app built with React Native (Expo) using the JioSaavn API. Features real-time song search, audio playback with background support, queue management with persistence, and a synchronized mini player.

## 📱 Features

- **Song Search** — Debounced search with infinite pagination via JioSaavn API
- **Audio Playback** — Stream songs with play/pause, next/previous, seek
- **Mini Player** — Persistent, synchronized playback bar across all screens
- **Full Player** — Large album art, seek bar, transport controls
- **Queue Management** — Add, remove, reorder (drag-to-reorder), persisted via MMKV
- **Shuffle & Repeat** — Shuffle queue, repeat all, repeat one
- **Background Playback** — Audio continues when app is minimized or screen is locked

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Expo SDK 56 | Framework |
| TypeScript | Type safety |
| React Navigation v7 | Stack navigation (no Expo Router) |
| Zustand | Global state management |
| MMKV | Fast local persistence |
| Axios | HTTP client |
| expo-audio | Audio playback & background mode |
| react-native-draggable-flatlist | Queue reordering |
| react-native-reanimated | Animations |

## 📂 Folder Structure

```
src/
├── api/                  # Axios client & API functions
│   ├── client.ts         # Axios instance with interceptors
│   └── songs.ts          # Song search, detail, suggestions
├── components/           # Reusable UI components
│   ├── EmptyState.tsx    # Empty/no-results placeholder
│   ├── LoadingState.tsx  # Activity indicator
│   ├── MiniPlayer.tsx    # Persistent bottom player bar
│   ├── PlayerControls.tsx # Play/Pause/Next/Prev/Shuffle/Repeat
│   ├── QueueItem.tsx     # Draggable queue row
│   ├── SearchBar.tsx     # Debounced search input
│   ├── SeekBar.tsx       # Draggable progress slider
│   └── SongCard.tsx      # Song list item
├── hooks/                # Custom React hooks
│   ├── useAudioSetup.ts  # Audio ↔ Store bridge
│   └── useDebounce.ts    # Input debounce
├── navigation/           # React Navigation setup
│   └── AppNavigator.tsx  # Stack navigator definition
├── screens/              # App screens
│   ├── HomeScreen.tsx    # Search + song listing
│   ├── PlayerScreen.tsx  # Full player UI
│   └── QueueScreen.tsx   # Queue management
├── services/             # Business logic
│   └── audioService.ts   # expo-audio singleton wrapper
├── store/                # State management
│   ├── playerStore.ts    # Global Zustand store
│   └── storage.ts        # MMKV adapter for Zustand persist
├── types/                # TypeScript definitions
│   ├── api.ts            # API response types
│   ├── index.ts          # Barrel exports
│   ├── player.ts         # PlaybackState, RepeatMode
│   └── song.ts           # Song, Artist, Album
└── utils/                # Utilities
    ├── formatTime.ts     # Time formatting (MM:SS)
    ├── getImageUrl.ts    # Image/URL extraction helpers
    └── theme.ts          # Design tokens (colors, spacing, typography)
```

## 🏗 Architecture

### State Management Flow

```
┌─────────────────────────────────────────────┐
│              Zustand Store                   │
│  (Single source of truth for all state)      │
│                                              │
│  • currentSong    • queue      • searchResults│
│  • playbackState  • position   • repeatMode   │
│  • shuffleMode    • duration   • queueIndex   │
├──────────────┬──────────────┬────────────────┤
│  HomeScreen  │ PlayerScreen │  QueueScreen   │
│  MiniPlayer  │              │                │
└──────┬───────┴──────┬───────┴────────────────┘
       │              │
       │    ┌─────────┴─────────┐
       │    │   Audio Service    │
       │    │  (Singleton)       │
       │    │  expo-audio player │
       │    └───────────────────┘
       │
  ┌────┴────────────┐
  │  useAudioSetup  │
  │  (Root hook)    │
  │  Bridges audio  │
  │  status → store │
  └─────────────────┘
```

### Audio Playback Flow

1. User taps a song → `playSong()` sets `currentSong` in store
2. `useAudioSetup` hook detects `currentSong` change → loads URL into player
3. `expo-audio` player streams audio, reports status updates
4. Hook syncs position/duration/state back to store
5. MiniPlayer and PlayerScreen re-render with updated state
6. On song end → `playNext()` is called automatically

### Key Design Decisions

- **Singleton Audio Service**: Audio player lives outside React's component tree so it persists across navigation and doesn't get unmounted
- **Selective Persistence**: Only queue, preferences, and current song are persisted to MMKV. Transient state (position, playbackState, search results) is not
- **Memoized Components**: `SongCard` and `QueueItem` use `React.memo` to prevent unnecessary re-renders during list scrolling
- **Debounced Search**: 400ms debounce on search input to avoid excessive API calls

## 🚀 Setup

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (for dev builds)

### Installation

```bash
git clone https://github.com/Itssanthoshhere/Lokal-Music-Player.git
cd Lokal-Music-Player
npm install
```

### Development

```bash
# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

### Background Playback (Requires Dev Build)

```bash
# Create development build for iOS
npx expo run:ios

# Create development build for Android
npx expo run:android
```

> **Note**: Background playback will not work in Expo Go. A development build is required.

## 🔗 API

**Base URL**: `https://saavn.sumit.co/`

| Endpoint | Description |
|---|---|
| `GET /api/search/songs?query=...&page=0&limit=20` | Search songs |
| `GET /api/songs/{id}` | Get song details |
| `GET /api/songs/{id}/suggestions` | Get similar songs |

No API key required.

## ⚖️ Trade-offs

| Decision | Trade-off |
|---|---|
| `expo-audio` over `expo-av` | Newer API with better background support, but requires dev build |
| MMKV over AsyncStorage | Synchronous and faster, but adds native dependency |
| Single Zustand store | Simpler architecture, but store file is large |
| 160kbps audio quality default | Balance between quality and data usage |
| PanResponder for SeekBar | Full control over gesture handling vs. using a library slider |

## 🔮 Future Improvements

- [ ] Download songs for offline listening
- [ ] Recently played history
- [ ] Favorites / liked songs
- [ ] Lyrics display
- [ ] Artist and album detail screens
- [ ] Lock screen / notification controls
- [ ] Crossfade between tracks
- [ ] Equalizer settings

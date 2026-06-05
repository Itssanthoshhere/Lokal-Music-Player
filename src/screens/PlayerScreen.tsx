import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SeekBar } from '../components/SeekBar';
import { PlayerControls } from '../components/PlayerControls';
import { usePlayerStore } from '../store/playerStore';
import { getImageUrl, getArtistNames } from '../utils/getImageUrl';
import { colors, spacing, typography, dimensions, borderRadius } from '../utils/theme';
import * as audioService from '../services/audioService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ART_SIZE = SCREEN_WIDTH - 48;

type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Queue: undefined;
};

type PlayerScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Player'>;
};

export const PlayerScreen: React.FC<PlayerScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const currentSong = usePlayerStore((s) => s.currentSong);
  const playbackState = usePlayerStore((s) => s.playbackState);
  const currentPosition = usePlayerStore((s) => s.currentPosition);
  const duration = usePlayerStore((s) => s.duration);
  const shuffleMode = usePlayerStore((s) => s.shuffleMode);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrevious = usePlayerStore((s) => s.playPrevious);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);
  const setPlaybackState = usePlayerStore((s) => s.setPlaybackState);

  const isPlaying = playbackState === 'playing';
  const imageUrl = currentSong ? getImageUrl(currentSong.image, '500x500') : '';
  const artistName = currentSong ? getArtistNames(currentSong.artists) : '';

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioService.pause();
      setPlaybackState('paused');
    } else {
      audioService.resume();
      setPlaybackState('playing');
    }
  }, [isPlaying, setPlaybackState]);

  const handleSeek = useCallback((positionMs: number) => {
    audioService.seekTo(positionMs / 1000);
    usePlayerStore.getState().setPosition(positionMs);
  }, []);

  if (!currentSong) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.noSong}>No song selected</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-down" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Now Playing
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Queue')}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="list" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.artContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkPlaceholder]}>
            <Ionicons name="musical-note" size={80} color={colors.textMuted} />
          </View>
        )}
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {currentSong.name}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {artistName}
        </Text>
      </View>

      {/* Seek Bar */}
      <SeekBar
        currentPosition={currentPosition}
        duration={duration}
        onSeek={handleSeek}
      />

      {/* Player Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        shuffleMode={shuffleMode}
        repeatMode={repeatMode}
        onPlayPause={handlePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
      />

      <View style={{ height: insets.bottom + spacing.xxl }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  artContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    flex: 1,
    justifyContent: 'center',
  },
  artwork: {
    width: ART_SIZE,
    height: ART_SIZE,
    maxWidth: dimensions.playerArtSize,
    maxHeight: dimensions.playerArtSize,
    borderRadius: borderRadius.lg,
  },
  artworkPlaceholder: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
  },
  songTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  songArtist: {
    ...typography.body,
    color: colors.textSecondary,
  },
  noSong: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 100,
  },
});

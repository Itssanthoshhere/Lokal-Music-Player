import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayerStore } from '../store/playerStore';
import { getImageUrl, getArtistNames } from '../utils/getImageUrl';
import { colors, spacing, dimensions, typography, borderRadius } from '../utils/theme';
import * as audioService from '../services/audioService';

type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Queue: undefined;
};

export const MiniPlayer: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const currentSong = usePlayerStore((s) => s.currentSong);
  const playbackState = usePlayerStore((s) => s.playbackState);
  const currentPosition = usePlayerStore((s) => s.currentPosition);
  const duration = usePlayerStore((s) => s.duration);
  const setPlaybackState = usePlayerStore((s) => s.setPlaybackState);
  const playNext = usePlayerStore((s) => s.playNext);

  const isPlaying = playbackState === 'playing';

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioService.pause();
      setPlaybackState('paused');
    } else {
      audioService.resume();
      setPlaybackState('playing');
    }
  }, [isPlaying, setPlaybackState]);

  if (!currentSong) return null;

  const imageUrl = getImageUrl(currentSong.image, '150x150');
  const artistName = getArtistNames(currentSong.artists);
  const progress = duration > 0 ? currentPosition / duration : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { bottom: Math.max(insets.bottom, spacing.sm) }]}
      onPress={() => navigation.navigate('Player')}
      activeOpacity={0.95}
    >
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.content}>
        {/* Album art */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkPlaceholder]}>
            <Ionicons name="musical-note" size={16} color={colors.textMuted} />
          </View>
        )}

        {/* Song info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artistName}
          </Text>
        </View>

        {/* Controls */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.controlButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playNext}
          style={styles.controlButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="play-skip-forward"
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: 0,
    backgroundColor: colors.miniPlayerBg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  progressContainer: {
    height: 2,
    backgroundColor: colors.seekBarTrack,
  },
  progressBar: {
    height: 2,
    backgroundColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: dimensions.miniPlayerHeight - 2,
  },
  artwork: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  artworkPlaceholder: {
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    ...typography.captionBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  artist: {
    ...typography.small,
    color: colors.textSecondary,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

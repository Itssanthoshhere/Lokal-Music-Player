import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import { getImageUrl, getArtistNames } from '../utils/getImageUrl';
import { formatTime } from '../utils/formatTime';
import { colors, spacing, borderRadius, dimensions, typography } from '../utils/theme';
import { usePlayerStore } from '../store/playerStore';

interface SongCardProps {
  song: Song;
  onPress: (song: Song) => void;
  onOptionsPress?: (song: Song) => void;
  showDuration?: boolean;
}

const SongCardComponent: React.FC<SongCardProps> = ({
  song,
  onPress,
  onOptionsPress,
  showDuration = true,
}) => {
  const currentSongId = usePlayerStore((s) => s.currentSong?.id);
  const playbackState = usePlayerStore((s) => s.playbackState);
  const isDownloaded = usePlayerStore((s) => !!s.downloads[song.id]);
  const isPlaying = currentSongId === song.id;
  const imageUrl = getImageUrl(song.image, '150x150');
  const artistName = getArtistNames(song.artists);

  return (
    <TouchableOpacity
      style={[styles.container, isPlaying && styles.containerActive]}
      onPress={() => onPress(song)}
      activeOpacity={0.7}
    >
      <View style={styles.artContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkPlaceholder]}>
            <Ionicons name="musical-note" size={20} color={colors.textMuted} />
          </View>
        )}
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <Ionicons
              name={playbackState === 'playing' ? 'pause' : 'play'}
              size={16}
              color={colors.textPrimary}
            />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, isPlaying && styles.titleActive]}
            numberOfLines={1}
          >
            {song.name}
          </Text>
          {isDownloaded && (
            <Ionicons name="cloud-done" size={12} color={colors.success} style={{ marginLeft: 4 }} />
          )}
        </View>
        <Text style={styles.artist} numberOfLines={1}>
          {artistName}
        </Text>
      </View>

      {showDuration && song.duration && (
        <Text style={styles.duration}>{formatTime(song.duration)}</Text>
      )}

      <TouchableOpacity
        style={styles.moreButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => onOptionsPress?.(song)}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={dimensions.iconSmall}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const SongCard = memo(SongCardComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    height: dimensions.songCardHeight,
  },
  containerActive: {
    backgroundColor: colors.surface,
  },
  artContainer: {
    position: 'relative',
    width: dimensions.songCardArtSize,
    height: dimensions.songCardArtSize,
    marginRight: spacing.md,
  },
  artwork: {
    width: dimensions.songCardArtSize,
    height: dimensions.songCardArtSize,
    borderRadius: borderRadius.md,
  },
  artworkPlaceholder: {
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  titleActive: {
    color: colors.primary,
  },
  artist: {
    ...typography.small,
    color: colors.textSecondary,
  },
  duration: {
    ...typography.small,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  moreButton: {
    padding: spacing.xs,
  },
});

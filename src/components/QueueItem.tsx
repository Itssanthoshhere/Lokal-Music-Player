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

interface QueueItemProps {
  song: Song;
  index: number;
  isCurrentSong: boolean;
  onRemove: (index: number) => void;
  onPlay: (index: number) => void;
  drag?: () => void;
  isActive?: boolean;
}

const QueueItemComponent: React.FC<QueueItemProps> = ({
  song,
  index,
  isCurrentSong,
  onRemove,
  onPlay,
  drag,
  isActive = false,
}) => {
  const imageUrl = getImageUrl(song.image, '150x150');
  const artistName = getArtistNames(song.artists);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCurrentSong && styles.containerActive,
        isActive && styles.containerDragging,
      ]}
      onPress={() => onPlay(index)}
      onLongPress={drag}
      activeOpacity={0.7}
    >
      {/* Drag handle */}
      <TouchableOpacity
        onPressIn={drag}
        style={styles.dragHandle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="reorder-three" size={22} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Artwork */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.artworkPlaceholder]}>
          <Ionicons name="musical-note" size={16} color={colors.textMuted} />
        </View>
      )}

      {/* Song info */}
      <View style={styles.info}>
        <Text
          style={[styles.title, isCurrentSong && styles.titleActive]}
          numberOfLines={1}
        >
          {song.name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artistName}
        </Text>
      </View>

      {/* Duration */}
      {song.duration && (
        <Text style={styles.duration}>{formatTime(song.duration)}</Text>
      )}

      {/* Remove button */}
      <TouchableOpacity
        onPress={() => onRemove(index)}
        style={styles.removeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const QueueItem = memo(QueueItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    paddingLeft: spacing.xs,
    height: dimensions.songCardHeight,
  },
  containerActive: {
    backgroundColor: colors.surface,
  },
  containerDragging: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dragHandle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
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
    ...typography.caption,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
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
    marginRight: spacing.sm,
  },
  removeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

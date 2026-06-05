import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import { colors, typography, borderRadius, spacing, dimensions } from '../utils/theme';
import { getImageUrl } from '../utils/getImageUrl';

interface HorizontalCardProps {
  song: Song;
  onPress: (song: Song) => void;
  onOptionsPress?: (song: Song) => void;
}

export const HorizontalCard: React.FC<HorizontalCardProps> = ({ song, onPress, onOptionsPress }) => {
  const imageUrl = getImageUrl(song.image, '500x500') || 'https://via.placeholder.com/150';
  const artistNames = song.artists.primary.map(a => a.name).join(', ') || 'Unknown Artist';

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(song)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {onOptionsPress && (
          <TouchableOpacity
            style={styles.moreButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => onOptionsPress(song)}
          >
            <View style={styles.moreButtonInner}>
              <Ionicons name="ellipsis-vertical" size={16} color={colors.textPrimary} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {song.name}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {artistNames}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceElevated,
  },
  moreButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  moreButtonInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 4,
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

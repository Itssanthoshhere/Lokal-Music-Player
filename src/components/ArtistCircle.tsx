import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Artist } from '../types';
import { colors, typography, spacing } from '../utils/theme';
import { getImageUrl } from '../utils/getImageUrl';

interface ArtistCircleProps {
  artist: Artist;
  onPress?: (artist: Artist) => void;
}

export const ArtistCircle: React.FC<ArtistCircleProps> = ({ artist, onPress }) => {
  const imageUrl = getImageUrl(artist.image, '500x500') || 'https://placehold.co/150';

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(artist)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.name} numberOfLines={1}>
        {artist.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceElevated,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { getImageUrl, getArtistNames } from '../utils/getImageUrl';
import { usePlayerStore } from '../store/playerStore';

interface SongOptionsModalProps {
  song: Song | null;
  isVisible: boolean;
  onClose: () => void;
}

export const SongOptionsModal: React.FC<SongOptionsModalProps> = ({
  song,
  isVisible,
  onClose,
}) => {
  const insertNext = usePlayerStore((s) => s.insertNext);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const toggleFavorite = usePlayerStore((s) => s.toggleFavorite);
  const isFavorite = usePlayerStore((s) => 
    song ? s.favorites.some((f) => f.id === song.id) : false
  );
  const isDownloaded = usePlayerStore((s) => 
    song ? !!s.downloads[song.id] : false
  );
  const isDownloading = usePlayerStore((s) => 
    song ? !!s.isDownloading[song.id] : false
  );
  const downloadSong = usePlayerStore((s) => s.downloadSong);
  const removeDownload = usePlayerStore((s) => s.removeDownload);

  if (!song) return null;

  const imageUrl = getImageUrl(song.image, '150x150');
  const artistName = getArtistNames(song.artists);

  const handlePlayNext = () => {
    insertNext(song);
    onClose();
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    onClose();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(song);
    onClose();
  };

  const handleToggleDownload = () => {
    if (isDownloaded) {
      removeDownload(song);
    } else {
      downloadSong(song);
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.artwork} />
                ) : (
                  <View style={[styles.artwork, styles.artworkPlaceholder]}>
                    <Ionicons name="musical-note" size={24} color={colors.textMuted} />
                  </View>
                )}
                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={2}>
                    {song.name}
                  </Text>
                  <Text style={styles.artist} numberOfLines={1}>
                    {artistName}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Options */}
              <TouchableOpacity style={styles.optionRow} onPress={handlePlayNext}>
                <Ionicons name="play-forward-outline" size={24} color={colors.textPrimary} />
                <Text style={styles.optionText}>Play Next</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={handleAddToQueue}>
                <Ionicons name="list-outline" size={24} color={colors.textPrimary} />
                <Text style={styles.optionText}>Add to Queue</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={handleToggleFavorite}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? colors.primary : colors.textPrimary} 
                />
                <Text style={styles.optionText}>
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={handleToggleDownload} disabled={isDownloading}>
                <Ionicons 
                  name={isDownloaded ? "cloud-done" : "cloud-download-outline"} 
                  size={24} 
                  color={isDownloaded ? colors.success : colors.textPrimary} 
                />
                <Text style={styles.optionText}>
                  {isDownloading ? "Downloading..." : isDownloaded ? "Remove Download" : "Download Offline"}
                </Text>
              </TouchableOpacity>
              
              <View style={{ height: 34 }} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  artwork: {
    width: 56,
    height: 56,
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
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  artist: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
    marginLeft: spacing.lg,
  },
});

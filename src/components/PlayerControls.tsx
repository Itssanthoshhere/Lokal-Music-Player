import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, dimensions } from '../utils/theme';
import { RepeatMode } from '../types';

interface PlayerControlsProps {
  isPlaying: boolean;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  shuffleMode,
  repeatMode,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  const getRepeatIcon = (): keyof typeof Ionicons.glyphMap => {
    if (repeatMode === 'one') return 'repeat';
    return 'repeat';
  };

  return (
    <View style={styles.container}>
      {/* Shuffle */}
      <TouchableOpacity
        onPress={onToggleShuffle}
        style={styles.sideButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="shuffle"
          size={dimensions.iconLarge}
          color={shuffleMode ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Previous */}
      <TouchableOpacity
        onPress={onPrevious}
        style={styles.transportButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="play-skip-back"
          size={dimensions.iconXLarge}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      {/* Play/Pause */}
      <TouchableOpacity
        onPress={onPlayPause}
        style={styles.playButton}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={32}
          color={colors.background}
          style={!isPlaying && { marginLeft: 3 }}
        />
      </TouchableOpacity>

      {/* Next */}
      <TouchableOpacity
        onPress={onNext}
        style={styles.transportButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="play-skip-forward"
          size={dimensions.iconXLarge}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      {/* Repeat */}
      <TouchableOpacity
        onPress={onToggleRepeat}
        style={styles.sideButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View>
          <Ionicons
            name={getRepeatIcon()}
            size={dimensions.iconLarge}
            color={repeatMode !== 'off' ? colors.primary : colors.textSecondary}
          />
          {repeatMode === 'one' && (
            <View style={styles.repeatOneBadge}>
              <Ionicons name="ellipse" size={6} color={colors.primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  sideButton: {
    width: dimensions.controlButtonSmall,
    height: dimensions.controlButtonSmall,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transportButton: {
    width: dimensions.controlButtonMedium,
    height: dimensions.controlButtonMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: dimensions.controlButtonLarge,
    height: dimensions.controlButtonLarge,
    borderRadius: dimensions.controlButtonLarge / 2,
    backgroundColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatOneBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
});

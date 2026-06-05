import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { formatTimeMs } from '../utils/formatTime';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TRACK_HORIZONTAL_PADDING = 24;
const TRACK_WIDTH = SCREEN_WIDTH - TRACK_HORIZONTAL_PADDING * 2;
const THUMB_SIZE = 14;

interface SeekBarProps {
  currentPosition: number;
  duration: number;
  onSeek: (positionMs: number) => void;
}

export const SeekBar: React.FC<SeekBarProps> = ({
  currentPosition,
  duration,
  onSeek,
}) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const progress = duration > 0
    ? (isSeeking ? seekPosition : currentPosition) / duration
    : 0;

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsSeeking(true);
        const x = evt.nativeEvent.locationX;
        const ratio = Math.min(Math.max(x / TRACK_WIDTH, 0), 1);
        setSeekPosition(ratio * duration);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const ratio = Math.min(Math.max(x / TRACK_WIDTH, 0), 1);
        setSeekPosition(ratio * duration);
      },
      onPanResponderRelease: () => {
        setIsSeeking(false);
        onSeek(seekPosition);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.trackContainer} {...panResponder.panHandlers}>
        <View style={styles.track}>
          <View
            style={[
              styles.progress,
              { width: `${clampedProgress * 100}%` },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                left: clampedProgress * TRACK_WIDTH - THUMB_SIZE / 2,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.time}>
          {formatTimeMs(isSeeking ? seekPosition : currentPosition)}
        </Text>
        <Text style={styles.time}>{formatTimeMs(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: TRACK_HORIZONTAL_PADDING,
    marginBottom: spacing.lg,
  },
  trackContainer: {
    height: 30,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: colors.seekBarTrack,
    borderRadius: 2,
    overflow: 'visible',
    position: 'relative',
  },
  progress: {
    height: 4,
    backgroundColor: colors.seekBarProgress,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: -(THUMB_SIZE - 4) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.seekBarThumb,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  time: {
    ...typography.small,
    color: colors.textMuted,
  },
});

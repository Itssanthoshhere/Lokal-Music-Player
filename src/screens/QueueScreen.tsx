import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueueItem } from '../components/QueueItem';
import { EmptyState } from '../components/EmptyState';
import { usePlayerStore } from '../store/playerStore';
import { Song } from '../types';
import { colors, spacing, typography } from '../utils/theme';

type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Queue: undefined;
};

type QueueScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Queue'>;
};

export const QueueScreen: React.FC<QueueScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const queue = usePlayerStore((s) => s.queue);
  const currentSong = usePlayerStore((s) => s.currentSong);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const reorderQueue = usePlayerStore((s) => s.reorderQueue);
  const playFromQueue = usePlayerStore((s) => s.playFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);

  const handleRemove = useCallback(
    (index: number) => {
      removeFromQueue(index);
    },
    [removeFromQueue]
  );

  const handlePlay = useCallback(
    (index: number) => {
      playFromQueue(index);
    },
    [playFromQueue]
  );

  const handleDragEnd = useCallback(
    ({ from, to }: { from: number; to: number }) => {
      if (from !== to) {
        reorderQueue(from, to);
      }
    },
    [reorderQueue]
  );

  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Song>) => {
      const index = getIndex() ?? 0;
      return (
        <ScaleDecorator>
          <QueueItem
            song={item}
            index={index}
            isCurrentSong={currentSong?.id === item.id}
            onRemove={handleRemove}
            onPlay={handlePlay}
            drag={drag}
            isActive={isActive}
          />
        </ScaleDecorator>
      );
    },
    [currentSong?.id, handleRemove, handlePlay]
  );

  const keyExtractor = useCallback((item: Song) => item.id, []);

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
        <Text style={styles.headerTitle}>Queue</Text>
        {queue.length > 0 ? (
          <TouchableOpacity
            onPress={clearQueue}
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton} />
        )}
      </View>

      {/* Queue subtitle */}
      {queue.length > 0 && (
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>
            {queue.length} {queue.length === 1 ? 'song' : 'songs'}
          </Text>
        </View>
      )}

      {/* Queue List */}
      {queue.length === 0 ? (
        <EmptyState
          title="Queue is empty"
          subtitle="Play a song to add it to the queue"
          icon="list-outline"
        />
      ) : (
        <GestureHandlerRootView style={styles.listContainer}>
          <DraggableFlatList
            data={queue}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onDragEnd={handleDragEnd}
            containerStyle={styles.list}
            contentContainerStyle={{
              paddingBottom: insets.bottom + spacing.xxl,
            }}
          />
        </GestureHandlerRootView>
      )}
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
    width: 60,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  clearText: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'right',
  },
  subtitle: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  subtitleText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});

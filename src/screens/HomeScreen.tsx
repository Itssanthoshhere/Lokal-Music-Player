import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from '../components/SearchBar';
import { SongCard } from '../components/SongCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useDebounce } from '../hooks/useDebounce';
import { usePlayerStore } from '../store/playerStore';
import { Song } from '../types';
import { colors, spacing, typography, dimensions } from '../utils/theme';

type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Queue: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const searchQuery = usePlayerStore((s) => s.searchQuery);
  const searchResults = usePlayerStore((s) => s.searchResults);
  const isSearching = usePlayerStore((s) => s.isSearching);
  const hasMoreResults = usePlayerStore((s) => s.hasMoreResults);
  const currentSong = usePlayerStore((s) => s.currentSong);
  const setSearchQuery = usePlayerStore((s) => s.setSearchQuery);
  const searchSongs = usePlayerStore((s) => s.searchSongs);
  const loadMoreResults = usePlayerStore((s) => s.loadMoreResults);
  const playSong = usePlayerStore((s) => s.playSong);

  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchSongs(debouncedQuery, true);
    }
  }, [debouncedQuery]);

  const handleSongPress = useCallback((song: Song) => {
    playSong(song);
  }, [playSong]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreResults && !isSearching) {
      loadMoreResults();
    }
  }, [hasMoreResults, isSearching, loadMoreResults]);

  const renderSongItem = useCallback(
    ({ item }: { item: Song }) => (
      <SongCard song={item} onPress={handleSongPress} />
    ),
    [handleSongPress]
  );

  const renderFooter = useCallback(() => {
    if (!isSearching || searchResults.length === 0) return null;
    return <LoadingState size="small" />;
  }, [isSearching, searchResults.length]);

  const renderEmpty = useCallback(() => {
    if (isSearching && searchResults.length === 0) {
      return <LoadingState fullScreen />;
    }

    if (!searchQuery.trim()) {
      return (
        <EmptyState
          title="Discover Music"
          subtitle="Search for your favorite songs, artists, or albums"
          icon="search-outline"
        />
      );
    }

    if (searchResults.length === 0 && !isSearching) {
      return (
        <EmptyState
          title="No results found"
          subtitle={`We couldn't find anything for "${searchQuery}"`}
          icon="sad-outline"
        />
      );
    }

    return null;
  }, [isSearching, searchQuery, searchResults.length]);

  const keyExtractor = useCallback((item: Song) => item.id, []);

  const miniPlayerPadding = currentSong ? dimensions.miniPlayerHeight : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search songs, artists..."
      />

      <FlatList
        data={searchResults}
        renderItem={renderSongItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: miniPlayerPadding + insets.bottom + spacing.lg },
          searchResults.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyList: {
    flex: 1,
  },
});

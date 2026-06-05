import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader } from '../components/SectionHeader';
import { HorizontalCard } from '../components/HorizontalCard';
import { ArtistCircle } from '../components/ArtistCircle';
import { SongCard } from '../components/SongCard';
import { SearchBar } from '../components/SearchBar';
import { SongOptionsModal } from '../components/SongOptionsModal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useDebounce } from '../hooks/useDebounce';
import { usePlayerStore } from '../store/playerStore';
import { Song, Artist } from '../types';
import { colors, spacing, typography, dimensions } from '../utils/theme';

type RootStackParamList = {
  MainTabs: undefined;
  Player: undefined;
  Queue: undefined;
};

const TOP_TABS = ['Suggested', 'Favorites', 'Songs', 'Artists', 'Albums', 'Folders'] as const;
type TopTab = typeof TOP_TABS[number];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<TopTab>('Suggested');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const searchQuery = usePlayerStore((s) => s.searchQuery);
  const searchResults = usePlayerStore((s) => s.searchResults);
  const favorites = usePlayerStore((s) => s.favorites);
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

  const handleOptionsPress = useCallback((song: Song) => {
    setSelectedSong(song);
    setIsModalVisible(true);
  }, []);

  const handleSearchIconPress = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchActive(false);
    setSearchQuery('');
  }, [setSearchQuery]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreResults && !isSearching) {
      loadMoreResults();
    }
  }, [hasMoreResults, isSearching, loadMoreResults]);

  const renderSongItem = useCallback(
    ({ item }: { item: Song }) => (
      <SongCard 
        song={item} 
        onPress={handleSongPress} 
        onOptionsPress={handleOptionsPress} 
      />
    ),
    [handleSongPress, handleOptionsPress]
  );

  const keyExtractor = useCallback((item: Song) => item.id, []);

  // Extract unique artists from search results
  const uniqueArtists: Artist[] = React.useMemo(() => {
    const artistMap = new Map<string, Artist>();
    searchResults.forEach((song) => {
      song.artists.primary.forEach((artist) => {
        if (!artistMap.has(artist.id) && artist.image?.length > 0) {
          artistMap.set(artist.id, artist);
        }
      });
    });
    return Array.from(artistMap.values()).slice(0, 10);
  }, [searchResults]);

  const miniPlayerPadding = currentSong ? dimensions.miniPlayerHeight + 8 : 0;

  // --- Search Mode ---
  if (isSearchActive) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={handleSearchClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search songs, artists..."
            />
          </View>
        </View>

        <FlatList
          data={searchResults}
          renderItem={renderSongItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: miniPlayerPadding + insets.bottom + spacing.lg },
            searchResults.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={() => {
            if (isSearching) return <LoadingState fullScreen />;
            if (!searchQuery.trim()) {
              return (
                <EmptyState
                  title="Search Music"
                  subtitle="Search for your favorite songs, artists, or albums"
                  icon="search-outline"
                />
              );
            }
            return (
              <EmptyState
                title="No results found"
                subtitle={`We couldn't find anything for "${searchQuery}"`}
                icon="sad-outline"
              />
            );
          }}
          ListFooterComponent={() => {
            if (!isSearching || searchResults.length === 0) return null;
            return <LoadingState size="small" />;
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        <SongOptionsModal
          song={selectedSong}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </View>
    );
  }

  // --- Home / Suggested Mode ---
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Ionicons name="musical-notes" size={24} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>Lokal</Text>
        </View>
        <TouchableOpacity onPress={handleSearchIconPress} style={styles.searchIcon}>
          <Ionicons name="search-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Top Tab Bar */}
      <View style={styles.topTabBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.topTabBar}
          contentContainerStyle={styles.topTabBarContent}
        >
          {TOP_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.topTab, activeTab === tab && styles.topTabActive]}
            >
              <Text style={[styles.topTabText, activeTab === tab && styles.topTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: miniPlayerPadding + insets.bottom + spacing.xxxl }}
      >
        {/* Favorites View */}
        {activeTab === 'Favorites' && (
          <View>
            <SectionHeader title="Your Favorites" />
            {favorites.length > 0 ? (
              favorites.map((song) => (
                <SongCard 
                  key={`fav-${song.id}`} 
                  song={song} 
                  onPress={handleSongPress} 
                  onOptionsPress={handleOptionsPress} 
                />
              ))
            ) : (
              <EmptyState 
                title="No Favorites Yet" 
                subtitle="Tap the heart icon on any song to add it to your favorites." 
                icon="heart-outline"
              />
            )}
          </View>
        )}

        {/* Home View */}
        {activeTab === 'Suggested' && (
          <>
            {/* Recently Played */}
            <SectionHeader title="Recently Played" onSeeAllPress={() => {}} />
            {searchResults.length > 0 ? (
              <FlatList
                horizontal
                data={searchResults.slice(0, 6)}
                renderItem={({ item }) => (
                  <HorizontalCard 
                    song={item} 
                    onPress={handleSongPress} 
                    onOptionsPress={handleOptionsPress} 
                  />
                )}
                keyExtractor={(item) => `recent-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                scrollEnabled={true}
                nestedScrollEnabled={true}
              />
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>Search for songs to see them here</Text>
              </View>
            )}

            {/* Artists */}
            {uniqueArtists.length > 0 && (
              <>
                <SectionHeader title="Artists" onSeeAllPress={() => {}} />
                <FlatList
                  horizontal
                  data={uniqueArtists}
                  renderItem={({ item }) => <ArtistCircle artist={item} />}
                  keyExtractor={(item) => `artist-${item.id}`}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                />
              </>
            )}

            {/* Most Played */}
            {searchResults.length > 3 && (
              <>
                <SectionHeader title="Most Played" onSeeAllPress={() => {}} />
                <FlatList
                  horizontal
                  data={searchResults.slice(3, 9)}
                  renderItem={({ item }) => (
                    <HorizontalCard 
                      song={item} 
                      onPress={handleSongPress} 
                      onOptionsPress={handleOptionsPress} 
                    />
                  )}
                  keyExtractor={(item) => `most-${item.id}`}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                />
              </>
            )}

            {/* All Songs (vertical list) */}
            {searchResults.length > 0 && (
              <>
                <SectionHeader title="All Songs" />
                {searchResults.map((song) => (
                  <SongCard 
                    key={song.id} 
                    song={song} 
                    onPress={handleSongPress} 
                    onOptionsPress={handleOptionsPress} 
                  />
                ))}
              </>
            )}
          </>
        )}

        {/* Songs View */}
        {activeTab === 'Songs' && (
          <View>
            <SectionHeader title="All Songs" />
            {searchResults.length > 0 ? (
              searchResults.map((song) => (
                <SongCard 
                  key={song.id} 
                  song={song} 
                  onPress={handleSongPress} 
                  onOptionsPress={handleOptionsPress} 
                />
              ))
            ) : (
              <EmptyState 
                title="No Songs" 
                subtitle="We couldn't find any songs." 
                icon="musical-notes-outline"
              />
            )}
          </View>
        )}

        {/* Artists View */}
        {activeTab === 'Artists' && (
          <View>
            <SectionHeader title="Your Artists" />
            {uniqueArtists.length > 0 ? (
              <View style={styles.gridContainer}>
                {uniqueArtists.map((artist) => (
                  <View key={`artist-grid-${artist.id}`} style={styles.gridItem}>
                    <ArtistCircle artist={artist} />
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState 
                title="No Artists" 
                subtitle="We couldn't find any artists." 
                icon="person-outline"
              />
            )}
          </View>
        )}

        {/* Albums View */}
        {activeTab === 'Albums' && (
          <View style={{ marginTop: spacing.xxxl }}>
            <EmptyState 
              title="No Albums Yet" 
              subtitle="Albums will appear here once you add them." 
              icon="albums-outline"
            />
          </View>
        )}

        {/* Folders View */}
        {activeTab === 'Folders' && (
          <View style={{ marginTop: spacing.xxxl }}>
            <EmptyState 
              title="No Folders" 
              subtitle="Browse your local device folders here." 
              icon="folder-outline"
            />
          </View>
        )}
      </ScrollView>

      <SongOptionsModal
        song={selectedSong}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: spacing.sm,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Search Header ---
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
  },
  // --- Top Tab Bar ---
  topTabBarWrapper: {
    height: 48,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  topTabBar: {
    flexGrow: 0,
  },
  topTabBarContent: {
    paddingHorizontal: spacing.xl,
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  topTab: {
    marginRight: spacing.xl,
    paddingVertical: spacing.xs,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  topTabActive: {
    borderBottomColor: colors.primary,
  },
  topTabText: {
    ...typography.body,
    color: colors.textMuted,
  },
  topTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  // --- Horizontal Lists & Grids ---
  horizontalList: {
    paddingHorizontal: spacing.xl,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  // --- Empty Sections ---
  emptySection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptySectionText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  // --- Search Results ---
  listContent: {
    flexGrow: 1,
  },
  emptyList: {
    flex: 1,
  },
});

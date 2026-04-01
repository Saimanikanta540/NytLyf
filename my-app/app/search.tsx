// Search Screen - Simplified (hooks will be re-added later)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { useTheme } from '../src/contexts/ThemeContext';
import { useEvents } from '../hooks/useEvents';

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  // Simple client-side filtering of mock data
  const results = query.length >= 2
    ? events.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const renderEvent = ({ item }: { item: typeof filteredEvents[0] }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.background.secondary }]}
      onPress={() => router.push(`/event/${item._id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.coverImage }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <View style={[styles.smallBadge, { backgroundColor: item.category.color + '30' }]}>
          <Text style={[styles.smallBadgeText, { color: item.category.color }]}>
            {item.category.name}
          </Text>
        </View>
        <Text style={[styles.eventTitle, { color: colors.text.primary }]} numberOfLines={2}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="calendar-outline" size={12} color={colors.text.tertiary} />
          <Text style={[styles.eventMetaText, { color: colors.text.tertiary }]}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.eventMeta}>
          <Ionicons name="location-outline" size={12} color={colors.text.tertiary} />
          <Text style={[styles.eventMetaText, { color: colors.text.tertiary }]} numberOfLines={1}>{item.venue.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.background.secondary }]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={[styles.searchContainer, { backgroundColor: colors.background.secondary, borderColor: colors.border.subtle }]}>
            <Ionicons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search events, venues..."
              placeholderTextColor={colors.text.tertiary}
              style={[styles.searchInput, { color: colors.text.primary }]}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Search Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.resultsCount, { color: colors.text.tertiary }]}>
              {results.length} results for "{query}"
            </Text>
          }
        />
      ) : query.length >= 2 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={colors.text.muted} />
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No results found</Text>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            Try different keywords or check the spelling
          </Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={colors.text.muted} />
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>Search Events</Text>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            Type at least 2 characters to search
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.md,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  eventImage: {
    width: '100%',
    height: 140,
  },
  eventContent: {
    padding: 12,
  },
  smallBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  smallBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventMetaText: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

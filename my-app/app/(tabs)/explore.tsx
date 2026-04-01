// Explore Screen with Mock Data
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockAds } from '../../src/data/mockData';
import { useEvents } from '../../hooks/useEvents';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = ['All', 'Free', 'Today', 'Trending'];

  const { events } = useEvents();

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'Free') return event.pricing.isFree;
    if (activeFilter === 'Trending') return event.isTrending;
    if (searchQuery) {
      return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Get inline ads
  const inlineAds = mockAds.filter(a => a.placement === 'explore_inline' && a.isActive);

  // Insert ad after every 3 events
  const dataWithAds = filteredEvents.reduce((acc: any[], event, index) => {
    acc.push({ type: 'event', data: event });
    if ((index + 1) % 4 === 0 && inlineAds.length > 0) {
      // Rotate through available inline ads
      const adIndex = Math.floor(index / 4) % inlineAds.length;
      acc.push({ type: 'ad', data: inlineAds[adIndex] });
    }
    return acc;
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'ad') {
      return (
        <TouchableOpacity style={styles.inlineAd} activeOpacity={0.9}>
          <View style={[styles.adGradientBorder, { borderColor: colors.neon.pink + '50' }]}>
            <View style={[styles.adInner, { backgroundColor: colors.background.secondary }]}>
              <Image source={{ uri: item.data.imageUrl }} style={styles.adImage} />
              <View style={styles.adContent}>
                <View style={styles.sponsoredBadge}>
                  <Ionicons name="megaphone" size={10} color={colors.neon.orange} />
                  <Text style={[styles.sponsoredText, { color: colors.neon.orange }]}>Sponsored</Text>
                </View>
                <Text style={[styles.adTitle, { color: colors.text.primary }]} numberOfLines={2}>{item.data.title}</Text>
                <View style={styles.adCta}>
                  <Text style={[styles.ctaText, { color: colors.neon.pink }]}>Learn More</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.neon.pink} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    const event = item.data;
    return (
      <TouchableOpacity
        style={[styles.eventCard, { backgroundColor: colors.background.secondary }]}
        onPress={() => router.push(`/event/${event._id}`)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: event.coverImage }} style={styles.eventImage} />
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <View style={[styles.smallBadge, { backgroundColor: event.category.color + '30' }]}>
              <Text style={[styles.smallBadgeText, { color: event.category.color }]}>
                {event.category.name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {event.isPromoted && (
                <View style={[styles.promotedBadge, { backgroundColor: colors.neon.pink }]}>
                  <Text style={styles.promotedText}>PROMOTED</Text>
                </View>
              )}
              {event.isTrending && (
                <View style={[styles.hotBadge, { backgroundColor: colors.neon.orange + '20' }]}>
                  <Ionicons name="flame" size={10} color={colors.neon.orange} />
                </View>
              )}
            </View>
          </View>
          <Text style={[styles.eventTitle, { color: colors.text.primary }]} numberOfLines={2}>{event.title}</Text>
          <View style={styles.eventMeta}>
            <Ionicons name="calendar-outline" size={12} color={colors.text.tertiary} />
            <Text style={[styles.eventMetaText, { color: colors.text.tertiary }]}>{formatDate(event.date)}</Text>
          </View>
          <View style={styles.eventMeta}>
            <Ionicons name="location-outline" size={12} color={colors.text.tertiary} />
            <Text style={[styles.eventMetaText, { color: colors.text.tertiary }]} numberOfLines={1}>{event.venue.name}</Text>
          </View>
          <View style={styles.eventFooter}>
            {event.pricing.isFree ? (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
            ) : (
              <Text style={[styles.eventPrice, { color: colors.text.primary }]}>₹{event.pricing.startingPrice}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Explore</Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.background.secondary, borderColor: colors.border.subtle }]}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search events, venues..."
            placeholderTextColor={colors.text.tertiary}
            style={[styles.searchInput, { color: colors.text.primary }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Filters */}
        <View style={styles.quickFilters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(activeFilter === filter ? null : filter)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.subtle
                },
                activeFilter === filter && {
                  backgroundColor: colors.neon.pink,
                  borderColor: colors.neon.pink
                },
              ]}
            >
              {filter === 'Trending' && (
                <Ionicons
                  name="flame"
                  size={14}
                  color={activeFilter === filter ? colors.text.primary : colors.text.tertiary}
                />
              )}
              <Text style={[
                styles.filterChipText,
                { color: colors.text.secondary },
                activeFilter === filter && { color: colors.text.primary },
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      <FlatList
        data={dataWithAds}
        keyExtractor={(item, index) =>
          item.type === 'ad' ? `ad-${index}` : item.data._id
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.text.tertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No events found</Text>
            <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
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
  quickFilters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  smallBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hotBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  eventFooter: {
    marginTop: 8,
  },
  freeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#39FF1420',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#39FF14',
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  inlineAd: {
    marginBottom: 12,
  },
  adGradientBorder: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  adInner: {
    flexDirection: 'row',
  },
  adImage: {
    width: 100,
    height: 100,
  },
  adContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sponsoredText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  adTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  adCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 4,
  },
  promotedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promotedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});


// Category Events Screen with Mock Data
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { mockCategories } from '../../src/data/mockData';
import { useEvents } from '../../hooks/useEvents';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Event } from '../../src/types';

const getIconName = (slug: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    party: 'musical-notes',
    concert: 'mic',
    meetup: 'people',
    exclusive: 'diamond',
    festival: 'sparkles',
    clubbing: 'disc',
  };
  return iconMap[slug] || 'apps';
};

export default function CategoryEventsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { events } = useEvents();
  const category = mockCategories.find(c => c.slug === slug);
  const filteredEvents = events.filter(e => e.category.slug === slug || e.category.name.toLowerCase() === slug);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <LinearGradient
        colors={[`${category?.color || colors.neon.pink}30`, 'transparent']}
        style={styles.headerGradient}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${category?.color}20` }]}>
          <Ionicons
            name={getIconName(slug)}
            size={40}
            color={category?.color || colors.neon.pink}
          />
        </View>
        <Text style={[styles.categoryTitle, { color: colors.text.primary }]}>{category?.name || 'Category'}</Text>
        <Text style={[styles.eventCount, { color: colors.text.tertiary }]}>{filteredEvents.length} events</Text>
      </LinearGradient>
    </View>
  );

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.background.secondary }]}
      onPress={() => router.push(`/event/${item._id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.coverImage }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={[styles.smallBadge, { backgroundColor: item.category.color + '30' }]}>
            <Text style={[styles.smallBadgeText, { color: item.category.color }]}>
              {item.category.name}
            </Text>
          </View>
          {item.isTrending && (
            <View style={[styles.hotBadge, { backgroundColor: colors.neon.orange + '20' }]}>
              <Ionicons name="flame" size={10} color={colors.neon.orange} />
            </View>
          )}
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
        <View style={styles.eventFooter}>
          {item.pricing.isFree ? (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          ) : (
            <Text style={[styles.eventPrice, { color: colors.text.primary }]}>₹{item.pricing.startingPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={48} color={colors.text.tertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No events found</Text>
      <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>Check back later for events in this category</Text>
    </View>
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
          <Text style={[styles.headerTitle, { color: colors.text.primary }]} numberOfLines={1}>
            {category?.name || 'Category'}
          </Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={renderEvent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  placeholder: {
    width: 44,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 14,
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
  emptyContainer: {
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
    textAlign: 'center',
  },
});

// Home Screen with Mock Data
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { mockCategories, mockAds } from '../../src/data/mockData';
import { useEvents } from '../../hooks/useEvents';
import { useTheme } from '../../src/contexts/ThemeContext';
import { HeroAdCarousel } from '../../src/components/ads/HeroAdCarousel';
import { AdBanner } from '../../src/components/ads/AdBanner';

const { width } = Dimensions.get('window');

type DateFilter = 'today' | 'tomorrow' | 'weekend' | 'this_week';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<DateFilter>('today');

  const { events } = useEvents();
  const featuredEvents = events.filter(e => e.isFeatured);
  const trendingEvents = events.filter(e => e.isTrending);
  const heroAds = mockAds.filter(a => a.placement === 'home_hero' && a.isActive).sort((a, b) => b.priority - a.priority);
  const midGraphicAd = mockAds.find(a => a.placement === 'home_mid' && a.isActive);
  const topTextAd = mockAds.find(a => a.placement === 'home_top' && a.isActive);

  const dateFilters: { key: DateFilter; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'weekend', label: 'Weekend' },
    { key: 'this_week', label: 'This Week' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const renderFeaturedEvent = ({ item }: { item: typeof events[0] }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => router.push(`/event/${item._id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.coverImage }} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.featuredGradient}
      >
        {item.isTrending && (
          <View style={[styles.trendingBadge, { backgroundColor: colors.neon.pink }]}>
            <Ionicons name="flame" size={12} color={colors.text.primary} />
            <Text style={[styles.trendingText, { color: colors.text.primary }]}>Trending</Text>
          </View>
        )}
        <View style={styles.featuredContent}>
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryText, { color: colors.text.primary }]}>{item.category.name}</Text>
          </View>
          <Text style={[styles.featuredTitle, { color: colors.text.primary }]} numberOfLines={2}>{item.title}</Text>
          <View style={styles.featuredMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar" size={14} color={colors.neon.pink} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location" size={14} color={colors.neon.blue} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>{item.venue.name}</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            {item.pricing.isFree ? (
              <Text style={styles.freeText}>FREE</Text>
            ) : (
              <Text style={[styles.priceText, { color: colors.text.primary }]}>₹{item.pricing.startingPrice} onwards</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderEventCard = (event: typeof events[0]) => (
    <TouchableOpacity
      key={event._id}
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
          <View style={styles.eventStats}>
            <Ionicons name="eye-outline" size={12} color={colors.text.tertiary} />
            <Text style={[styles.statText, { color: colors.text.tertiary }]}>{event.viewCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAdBanner = () => {
    const ad = mockAds.find(a => a.placement === 'home_top');
    if (!ad) return null;

    return (
      <TouchableOpacity style={styles.adBanner} activeOpacity={0.9}>
        <Image source={{ uri: ad.imageUrl }} style={styles.adImage} />
        <View style={styles.adLabel}>
          <Text style={[styles.adLabelText, { color: colors.text.tertiary }]}>Ad</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text.primary }]}>Good evening</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={colors.neon.pink} />
              <Text style={[styles.location, { color: colors.text.secondary }]}>Hyderabad</Text>
              <Ionicons name="chevron-down" size={14} color={colors.text.tertiary} />
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push('/search')} style={styles.iconBtn}>
              <Ionicons name="search" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
              <View style={[styles.notificationDot, { backgroundColor: colors.neon.pink }]} />
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {mockCategories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryItem}
              onPress={() => router.push(`/category/${category.slug}`)}
            >
              <View style={[styles.categoryIconContainer, { backgroundColor: colors.background.tertiary }]}>
                {/* @ts-ignore */}
                <Ionicons name={category.icon} size={24} color={colors.neon.pink} />
              </View>
              <Text style={[styles.categoryItemText, { color: colors.text.secondary }]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hero Ad Carousel */}
        <HeroAdCarousel ads={heroAds} />

        {/* Top Text Ad (replacing previous banner if needed, or keep generic) */}
        {topTextAd && <AdBanner ad={topTextAd} />}

        {/* Featured Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Featured Events</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={[styles.seeAllText, { color: colors.neon.pink }]}>See all</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.neon.pink} />
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={featuredEvents}
            keyExtractor={(item) => item._id}
            renderItem={renderFeaturedEvent}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            snapToInterval={width - 32}
            decelerationRate="fast"
          />
        </View>

        {/* Date Filter */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Events by Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateFilter}
          >
            {dateFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedDate(filter.key)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.subtle
                  },
                  selectedDate === filter.key && {
                    backgroundColor: colors.neon.pink,
                    borderColor: colors.neon.pink
                  },
                ]}
              >
                <Text style={[
                  styles.dateChipText,
                  { color: colors.text.secondary },
                  selectedDate === filter.key && { color: colors.text.primary },
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Event Cards */}
          {events.slice(0, 3).map(renderEventCard)}
        </View>

        {/* Mid Page Graphic Ad */}
        {midGraphicAd && <AdBanner ad={midGraphicAd} />}

        {/* Trending Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.trendingHeader}>
              <Ionicons name="flame" size={20} color={colors.neon.orange} />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Trending Now</Text>
            </View>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={[styles.seeAllText, { color: colors.neon.pink }]}>See all</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.neon.pink} />
            </TouchableOpacity>
          </View>

          {trendingEvents.slice(0, 3).map(renderEventCard)}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20, // Increased gap for distinct items
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
    width: 60, // Fixed width for alignment
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryItemText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  adBanner: {
    marginHorizontal: 16,
    marginVertical: 12,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  adLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adLabelText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuredList: {
    paddingRight: 16,
  },
  featuredCard: {
    width: width - 48,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  trendingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  featuredContent: {
    gap: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  featuredMeta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  priceRow: {
    marginTop: 4,
  },
  freeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#39FF14', // Always green
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateFilter: {
    marginBottom: 12,
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '500',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  freeBadge: {
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
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
  },
  bottomSpacer: {
    height: 100,
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


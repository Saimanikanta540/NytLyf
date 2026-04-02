// Event Detail Screen with Mock Data
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockAds } from '../../src/data/mockData';
import { useEvent } from '../../hooks/useEvents';
import { useTheme } from '../../src/contexts/ThemeContext';
import { AdBanner } from '../../src/components/ads/AdBanner';
import { bookTickets, getProfile, toggleBookmark } from '../../src/api/client';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [isSaved, setIsSaved] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const { event } = useEvent(id);

  useEffect(() => {
    // Check if the event is already saved by the user
    const checkSavedStatus = async () => {
      try {
        const profileData = await getProfile();
        const bookmarks = profileData.data.bookmarks || [];
        const isBookmarked = bookmarks.some((b: any) => b._id === id || b === id);
        setIsSaved(isBookmarked);
      } catch (err) {
        console.error('Failed to fetch profile for bookmark status', err);
      }
    };
    if (id) {
      checkSavedStatus();
    }
  }, [id]);

  if (!event) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background.primary }]}>
        <Ionicons name="alert-circle" size={64} color={colors.text.tertiary} />
        <Text style={[styles.errorTitle, { color: colors.text.primary }]}>Event not found</Text>
        <TouchableOpacity
          style={[styles.backBtn, { borderColor: colors.neon.pink }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backBtnText, { color: colors.neon.pink }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleToggleBookmark = async () => {
    if (!id) return;
    try {
      const newState = !isSaved;
      setIsSaved(newState); // Optimistic UI update
      await toggleBookmark(id as string);
      
      Alert.alert(
        newState ? "Event Saved!" : "Event Removed",
        newState 
          ? "This event has been added to your saved list." 
          : "This event has been removed from your saved list.",
        [{ text: "OK" }]
      );
    } catch (error) {
      setIsSaved(!isSaved); // Revert on failure
      Alert.alert('Error', 'Failed to update saved events.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${event.title} on NYTLYF! ${event.venue.name} - ${formatDate(event.date)}`,
        title: event.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleBookTickets = async () => {
    if (!id) return;
    setIsBooking(true);
    try {
      await bookTickets(id as string, ticketCount);
      setIsBookingModalVisible(false);
      Alert.alert(
        "Booking Confirmed!",
        `Successfully booked ${ticketCount} ticket(s) for ${event.title}.`,
        [{ text: "OK", onPress: () => router.push('/profile') }]
      );
    } catch (error: any) {
      Alert.alert("Booking Failed", error.message || "Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const midAd = mockAds.find(a => a.placement === 'home_mid');

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header Image */}
        <View style={styles.headerImage}>
          <Image source={{ uri: event.coverImage }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', colors.background.primary]}
            style={styles.headerGradient}
          />

          {/* Top Actions Bar */}
          <View style={[styles.topActionBar, { top: Math.max(insets.top, 16) }]}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={handleToggleBookmark}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isSaved ? colors.neon.pink : "#FFFFFF"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Badges */}
          <View style={styles.badgesContainer}>
            {event.isTrending && (
              <View style={[styles.trendingBadge, { backgroundColor: colors.neon.pink }]}>
                <Ionicons name="flame" size={12} color="#FFFFFF" />
                <Text style={[styles.badgeText, { color: "#FFFFFF" }]}>Trending</Text>
              </View>
            )}
            {event.isExclusive && (
              <View style={[styles.trendingBadge, { backgroundColor: '#FFE500' }]}>
                <Ionicons name="diamond" size={12} color="#000" />
                <Text style={[styles.badgeText, { color: '#000' }]}>Exclusive</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Category */}
          <View style={[styles.categoryBadge, { backgroundColor: event.category.color + '30' }]}>
            <Text style={[styles.categoryText, { color: event.category.color }]}>
              {event.category.name}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text.primary }]}>{event.title}</Text>

          {/* Organizer */}
          <View style={styles.organizerRow}>
            <View style={[styles.organizerAvatar, { backgroundColor: colors.background.secondary }]}>
              <Ionicons name="business" size={16} color={colors.text.tertiary} />
            </View>
            <Text style={[styles.organizerName, { color: colors.text.secondary }]}>{event.organizer.name}</Text>
            {event.organizer.isVerified && (
              <Ionicons name="shield-checkmark" size={14} color={colors.neon.blue} />
            )}
          </View>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            {/* Date & Time */}
            <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
              <View style={[styles.infoIcon, { backgroundColor: colors.neon.pink + '20' }]}>
                <Ionicons name="calendar" size={20} color={colors.neon.pink} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>Date & Time</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{formatDate(event.date)}</Text>
                <Text style={[styles.infoSubvalue, { color: colors.text.secondary }]}>
                  {event.startTime} - {event.endTime}
                </Text>
              </View>
            </View>

            {/* Location */}
            <TouchableOpacity style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
              <View style={[styles.infoIcon, { backgroundColor: colors.neon.blue + '20' }]}>
                <Ionicons name="location" size={20} color={colors.neon.blue} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>Venue</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{event.venue.name}</Text>
                <Text style={[styles.infoSubvalue, { color: colors.text.secondary }]}>{event.venue.area}, {event.venue.city}</Text>
              </View>
              <Ionicons name="navigate-outline" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>

          {/* Mid Ad */}
          {midAd && <AdBanner ad={midAd} />}

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>About Event</Text>
            <Text style={[styles.description, { color: colors.text.secondary }]}>{event.description}</Text>
          </View>

          {/* Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Gallery</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.gallery}
              >
                {event.gallery.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Stats */}
          <View style={[styles.statsRow, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={18} color={colors.text.tertiary} />
              <Text style={[styles.statText, { color: colors.text.tertiary }]}>{event.viewCount} views</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="bookmark-outline" size={18} color={colors.text.tertiary} />
              <Text style={[styles.statText, { color: colors.text.tertiary }]}>{event.saveCount} saves</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="share-social-outline" size={18} color={colors.text.tertiary} />
              <Text style={[styles.statText, { color: colors.text.tertiary }]}>{event.shareCount} shares</Text>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={isBookingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismiss} 
            activeOpacity={1} 
            onPress={() => setIsBookingModalVisible(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Select Tickets</Text>
              <TouchableOpacity onPress={() => setIsBookingModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.bookingDetails}>
              <Text style={[styles.bookingEventTitle, { color: colors.text.primary }]}>{event.title}</Text>
              <Text style={[styles.bookingVenue, { color: colors.text.tertiary }]}>{event.venue.name}</Text>
              
              <View style={styles.counterRow}>
                <Text style={[styles.counterLabel, { color: colors.text.primary }]}>No. of Tickets</Text>
                <View style={styles.counter}>
                  <TouchableOpacity 
                    style={[styles.counterBtn, { borderColor: colors.border.subtle }]}
                    onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  >
                    <Ionicons name="remove" size={20} color={colors.text.primary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterText, { color: colors.text.primary }]}>{ticketCount}</Text>
                  <TouchableOpacity 
                    style={[styles.counterBtn, { borderColor: colors.border.subtle }]}
                    onPress={() => setTicketCount(ticketCount + 1)}
                  >
                    <Ionicons name="add" size={20} color={colors.text.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {!event.pricing.isFree && (
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.text.tertiary }]}>Total Price</Text>
                  <Text style={[styles.totalValue, { color: colors.neon.pink }]}>₹{event.pricing.startingPrice * ticketCount}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.confirmBtn, isBooking && { opacity: 0.7 }]} 
              onPress={handleBookTickets}
              disabled={isBooking}
            >
              <LinearGradient
                colors={[colors.neon.pink, colors.neon.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                {isBooking ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={[styles.ctaText, { color: '#FFFFFF' }]}>Confirm Booking</Text>
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CTA Footer */}
      <View style={[styles.ctaContainer, {
        paddingBottom: insets.bottom + 8,
        backgroundColor: colors.background.secondary,
        borderTopColor: colors.border.subtle
      }]}>
        <View style={styles.priceContainer}>
          {event.pricing.isFree ? (
            <Text style={[styles.freeText, { color: colors.neon.green }]}>FREE</Text>
          ) : (
            <>
              <Text style={[styles.priceLabel, { color: colors.text.tertiary }]}>From</Text>
              <Text style={[styles.priceValue, { color: colors.text.primary }]}>₹{event.pricing.startingPrice}</Text>
            </>
          )}
        </View>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => setIsBookingModalVisible(true)}
        >
          <LinearGradient
            colors={[colors.neon.pink, colors.neon.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={[styles.ctaText, { color: '#FFFFFF' }]}>Get Tickets</Text>
            <Ionicons name="ticket" size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topActionBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    marginTop: -24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 12,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  organizerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCards: {
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoSubvalue: {
    fontSize: 13,
    marginTop: 2,
  },
  adBanner: {
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  gallery: {
    gap: 12,
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  freeText: {
    fontSize: 20,
    fontWeight: '700',
  },
  ctaButton: {
    flex: 1,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  bookingDetails: {
    marginBottom: 32,
  },
  bookingEventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookingVenue: {
    fontSize: 14,
    marginBottom: 24,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  counterLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  confirmBtn: {
    width: '100%',
  },
});

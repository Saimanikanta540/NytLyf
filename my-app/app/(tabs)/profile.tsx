// Profile Screen connected to backend
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

// Conditional import for MapView to avoid web crashes
let MapView: any, Marker: any, PROVIDER_GOOGLE: any;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}
import { clearToken } from '../../src/api/authStorage';
import { getProfile, updateProfile } from '../../src/api/client';
import { useTheme } from '../../src/contexts/ThemeContext';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  iconColor?: string;
  showArrow?: boolean;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Location Map State
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [locationName, setLocationName] = useState('Hyderabad');
  const [selectedRegion, setSelectedRegion] = useState<Region>({
    latitude: 17.3850,
    longitude: 78.4867,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [tempRegion, setTempRegion] = useState<Region>(selectedRegion);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadProfile();
    // Request permissions for map functionality
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    })();
  }, []);

  async function loadProfile() {
    try {
      const res = await getProfile();
      setUser(res.data);
      setEditName(res.data.name);
      setEditEmail(res.data.email);
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setTempRegion(newRegion);
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverse.length > 0) {
          const city = reverse[0].city || reverse[0].district || reverse[0].name;
          if (city) setLocationName(city);
        }
      } else {
        Alert.alert('Not Found', 'Could not find the location you searched for.');
      }
    } catch (err) {
      Alert.alert('Error', 'An error occurred while searching.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Error', 'Name and Email are required.');
      return;
    }
    setIsUpdating(true);
    try {
      const res = await updateProfile({ name: editName, email: editEmail });
      setUser(res.data);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Something went wrong.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setTempRegion(newRegion);
      const reverse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      if (reverse.length > 0) {
        const city = reverse[0].city || reverse[0].region || reverse[0].name;
        if (city) setLocationName(city);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not get your current location.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleConfirmLocation = async () => {
    setSelectedRegion(tempRegion);
    setIsMapVisible(false);
    try {
      const reverse = await Location.reverseGeocodeAsync({
        latitude: tempRegion.latitude,
        longitude: tempRegion.longitude
      });
      if (reverse.length > 0) {
        const city = reverse[0].city || reverse[0].district || reverse[0].name;
        if (city) {
          setLocationName(city);
          Alert.alert('Location Updated', `Your location has been set to ${city}.`);
        }
      }
    } catch (err) {
      console.error('Reverse geocode error', err);
    }
  };

  const handleFeatureNotImplemented = (featureName: string) => {
    Alert.alert('Coming Soon', `${featureName} settings will be available in a future update.`);
  };

  const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    label,
    onPress,
    iconColor = colors.text.secondary,
    showArrow = true,
    danger = false,
    rightElement,
  }) => (
    <TouchableOpacity onPress={onPress} style={[styles.menuItem, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.menuIconContainer, danger && styles.menuIconDanger, { backgroundColor: colors.background.tertiary }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.status.error : iconColor} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text.primary }, danger && { color: colors.status.error }]}>{label}</Text>
      {rightElement}
      {showArrow && !rightElement && (
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.neon.pink} />
      </View>
    );
  }

  // Fallback in case user data fails to load but they are authenticated
  const displayUser = user || { name: 'User', email: 'Loading...', bookmarks: [] };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Profile</Text>
          <TouchableOpacity 
            style={[styles.settingsButton, { backgroundColor: colors.background.secondary }]}
            onPress={() => handleFeatureNotImplemented('General Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.background.secondary }]}>
          <LinearGradient
            colors={colors.gradients.primary as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {displayUser.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text.primary }]}>{displayUser.name}</Text>
            <Text style={[styles.profileEmail, { color: colors.text.tertiary }]}>{displayUser.email}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.neon.blue} />
              <Text style={[styles.verifiedText, { color: colors.neon.blue }]}>Verified User</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.background.tertiary }]}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Ionicons name="create-outline" size={20} color={colors.neon.pink} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{displayUser.bookings?.length || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>Bookings</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border.subtle }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{displayUser.attendedEvents?.length || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>Attended</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border.subtle }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{displayUser.upcomingEvents?.length || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>Upcoming</Text>
          </View>
        </View>

        {/* My Bookings Section */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>My Bookings</Text>
          {displayUser.bookings && displayUser.bookings.length > 0 ? (
            displayUser.bookings.map((booking: any, index: number) => {
              // Safety check in case the event was deleted from DB
              if (!booking.event) return null;
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.bookingItem, { backgroundColor: colors.background.secondary }]}
                  onPress={() => router.push(`/event/${booking.event._id || booking.event.id}`)}
                >
                  <View style={[styles.bookingCategory, { backgroundColor: (booking.event.category?.color || colors.neon.pink) + '20' }]}>
                    <Ionicons name="ticket" size={20} color={booking.event.category?.color || colors.neon.pink} />
                  </View>
                  <View style={styles.bookingInfo}>
                    <Text style={[styles.bookingTitle, { color: colors.text.primary }]} numberOfLines={1}>
                      {booking.event.title}
                    </Text>
                    <Text style={[styles.bookingDate, { color: colors.text.tertiary }]}>
                      {new Date(booking.event.date).toLocaleDateString()} • {booking.ticketCount} Ticket(s)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={[styles.emptySectionText, { color: colors.text.tertiary }]}>
              You haven't booked any events yet.
            </Text>
          )}
        </View>

        {/* Saved Events Section */}
        {displayUser.bookmarks && displayUser.bookmarks.length > 0 && (
          <View style={styles.menuSection}>
            <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>Saved Events</Text>
            {displayUser.bookmarks.map((event: any, index: number) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.bookingItem, { backgroundColor: colors.background.secondary }]}
                onPress={() => router.push(`/event/${event._id || event.id}`)}
              >
                <View style={[styles.bookingCategory, { backgroundColor: (event.category?.color || colors.neon.blue) + '20' }]}>
                  <Ionicons name="bookmark" size={20} color={event.category?.color || colors.neon.blue} />
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={[styles.bookingTitle, { color: colors.text.primary }]} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={[styles.bookingDate, { color: colors.text.tertiary }]}>
                    {new Date(event.eventDate || event.date).toLocaleDateString()} • {event.locationName || (event.venue && event.venue.name)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>Account</Text>
          <MenuItem
            icon={isDark ? "moon" : "sunny"}
            label="Dark Mode"
            showArrow={false}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border.subtle, true: colors.neon.purple }}
                thumbColor={colors.text.primary}
              />
            }
          />
          <MenuItem 
            icon="person-outline" 
            label="Edit Profile" 
            onPress={() => setIsEditModalVisible(true)} 
          />
          <MenuItem 
            icon="notifications-outline" 
            label="Notifications" 
            onPress={() => handleFeatureNotImplemented('Notifications')} 
          />
          <MenuItem 
            icon="location-outline" 
            label="Location Settings" 
            onPress={() => setIsMapVisible(true)} 
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>Support</Text>
          <MenuItem 
            icon="help-circle-outline" 
            label="Help & Support" 
            onPress={() => handleFeatureNotImplemented('Help & Support')} 
          />
          <MenuItem 
            icon="chatbubble-ellipses-outline" 
            label="Contact Us" 
            onPress={() => handleFeatureNotImplemented('Contact Us')} 
          />
          <MenuItem 
            icon="star-outline" 
            label="Rate the App" 
            onPress={() => Alert.alert('Rate NYTLYF', 'Would you like to rate us on the App Store?', [
              { text: 'Later', style: 'cancel' },
              { text: 'Sure!', onPress: () => {} }
            ])} 
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>Legal</Text>
          <MenuItem 
            icon="document-text-outline" 
            label="Terms of Service" 
            onPress={() => handleFeatureNotImplemented('Terms of Service')} 
          />
          <MenuItem 
            icon="shield-outline" 
            label="Privacy Policy" 
            onPress={() => handleFeatureNotImplemented('Privacy Policy')} 
          />
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            icon="log-out-outline"
            label="Log Out"
            danger
            showArrow={false}
            onPress={async () => {
              Alert.alert('Log Out', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Log Out', 
                  style: 'destructive',
                  onPress: async () => {
                    await clearToken();
                    router.replace('/(auth)/login');
                  }
                }
              ]);
            }}
          />
        </View>

        <Text style={[styles.version, { color: colors.text.tertiary }]}>NYTLYF v1.0.0</Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismiss} 
            activeOpacity={1} 
            onPress={() => setIsEditModalVisible(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.tertiary }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    borderColor: colors.border.subtle
                  }
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.tertiary }]}>Email Address</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    borderColor: colors.border.subtle
                  }
                ]}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, isUpdating && { opacity: 0.7 }]} 
              onPress={handleUpdateProfile}
              disabled={isUpdating}
            >
              <LinearGradient
                colors={[colors.neon.pink, colors.neon.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.saveText, { color: '#FFFFFF' }]}>Save Changes</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Picker Modal */}
      <Modal
        visible={isMapVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsMapVisible(false)}
      >
        <SafeAreaView style={[styles.mapModalContainer, { backgroundColor: colors.background.primary }]}>
          <View style={styles.mapModalHeader}>
            <TouchableOpacity 
              onPress={() => setIsMapVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Change Location</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={selectedRegion}
              onRegionChangeComplete={(region) => setTempRegion(region)}
            >
              <Marker
                coordinate={{
                  latitude: tempRegion.latitude,
                  longitude: tempRegion.longitude,
                }}
                pinColor={colors.neon.pink}
              />
            </MapView>

            <View style={styles.mapOverlay}>
              {/* Search Bar */}
              <View style={[styles.searchBar, { backgroundColor: colors.background.secondary }]}>
                <TextInput
                  style={[styles.searchInput, { color: colors.text.primary }]}
                  placeholder="Search for a location..."
                  placeholderTextColor={colors.text.tertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearchLocation}
                  returnKeyType="search"
                />
                <TouchableOpacity 
                  style={styles.searchBtn}
                  onPress={handleSearchLocation}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <ActivityIndicator size="small" color={colors.neon.pink} />
                  ) : (
                    <Ionicons name="search" size={20} color={colors.neon.pink} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.myLocationBtn, { backgroundColor: colors.background.secondary }]}
                onPress={handleGetCurrentLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <ActivityIndicator color={colors.neon.pink} />
                ) : (
                  <Ionicons name="locate" size={24} color={colors.neon.pink} />
                )}
              </TouchableOpacity>

              <View style={[styles.locationInfo, { backgroundColor: colors.background.secondary }]}>
                <Ionicons name="location" size={20} color={colors.neon.pink} />
                <Text style={[styles.locationInfoText, { color: colors.text.primary }]} numberOfLines={1}>
                  {locationName}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.confirmLocationBtn, { backgroundColor: colors.neon.pink }]}
              onPress={handleConfirmLocation}
            >
              <Text style={styles.confirmLocationText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF', // Always white on gradient
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '500',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconDanger: {
    backgroundColor: '#FF3B5C15', // Kept somewhat hardcoded for now or could use alpha util
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  bookingCategory: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 12,
  },
  emptySectionText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  bottomSpacer: {
    height: 100,
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
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 24,
    marginBottom: 32,
  },
  saveGradient: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Map Modal Styles
  mapModalContainer: {
    flex: 1,
  },
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    gap: 12,
  },
  myLocationBtn: {
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationInfoText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  modalFooter: {
    padding: 20,
  },
  confirmLocationBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLocationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  searchBtn: {
    padding: 8,
  },
});

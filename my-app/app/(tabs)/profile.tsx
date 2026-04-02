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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

  useEffect(() => {
    loadProfile();
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
        {displayUser.bookings && displayUser.bookings.length > 0 && (
          <View style={styles.menuSection}>
            <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>My Bookings</Text>
            {displayUser.bookings.map((booking: any, index: number) => (
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
            ))}
          </View>
        )}

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
            onPress={() => handleFeatureNotImplemented('Location')} 
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
});

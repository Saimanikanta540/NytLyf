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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { clearToken } from '../../src/api/authStorage';
import { getProfile } from '../../src/api/client';
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

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

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
          <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.background.secondary }]}>
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

          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.background.tertiary }]}>
            <Ionicons name="create-outline" size={20} color={colors.neon.pink} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{displayUser.bookmarks?.length || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>Saved</Text>
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
          <MenuItem icon="person-outline" label="Edit Profile" />
          <MenuItem icon="notifications-outline" label="Notifications" />
          <MenuItem icon="location-outline" label="Location Settings" />
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>Support</Text>
          <MenuItem icon="help-circle-outline" label="Help & Support" />
          <MenuItem icon="chatbubble-ellipses-outline" label="Contact Us" />
          <MenuItem icon="star-outline" label="Rate the App" />
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.menuSectionTitle, { color: colors.text.tertiary }]}>Legal</Text>
          <MenuItem icon="document-text-outline" label="Terms of Service" />
          <MenuItem icon="shield-outline" label="Privacy Policy" />
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            icon="log-out-outline"
            label="Log Out"
            danger
            showArrow={false}
            onPress={async () => {
              await clearToken();
              router.replace('/(auth)/login');
            }}
          />
        </View>

        <Text style={[styles.version, { color: colors.text.tertiary }]}>NYTLYF v1.0.0</Text>

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
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  bottomSpacer: {
    height: 100,
  },
});

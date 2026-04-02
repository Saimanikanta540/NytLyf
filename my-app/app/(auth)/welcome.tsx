import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Image - Using a placeholder until a local asset is preferred */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&q=80' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.appName}>NytLyf</Text>
              <View style={[styles.badge, { backgroundColor: colors.neon.pink }]}>
                <Text style={styles.badgeText}>Live the Night</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.title}>Discover the Heart of the City</Text>
              <Text style={styles.description}>
                NytLyf is your ultimate guide to the most happening events. 
                From exclusive clubbing and live concerts to cozy meetups and comedy shows, 
                discover experiences that make your nights unforgettable.
              </Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.neon.pink }]}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.outlineButton, { borderColor: colors.neon.blue }]}
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text style={[styles.buttonText, { color: colors.neon.blue }]}>Sign Up</Text>
              </TouchableOpacity>
              
              <Text style={styles.version}>Version 1.0.0</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 8,
    textShadowColor: 'rgba(255, 45, 146, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  footer: {
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 10,
  },
});

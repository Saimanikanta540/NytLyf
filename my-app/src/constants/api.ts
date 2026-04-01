import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * For Android developers:
 * 1. If using EMULATOR: Use 'http://10.0.2.2:3000'
 * 2. If using PHYSICAL DEVICE: Use your machine's IP (e.g., 'http://192.168.1.5:3000')
 *    Make sure your phone and computer are on the SAME WiFi network.
 */
const getBaseUrl = () => {
  // 1. Web always uses localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  // 2. Try automatic detection via Expo (Works during development)
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':').shift();

  if (localhost && !localhost.includes('127.0.0.1')) {
    return `http://${localhost}:3000`;
  }

  // 3. Fallbacks for Android
  if (Platform.OS === 'android') {
    // Standard Android Emulator host bridge
    // Replace '10.123.12.97' with your computer's actual IP if using a physical device
    return 'http://10.123.12.97:3000'; 
  }

  // 4. Default fallback
  return 'http://localhost:3000';
};

export const API_BASE_URL = getBaseUrl();
console.log('[API] Base URL initialized as:', API_BASE_URL);


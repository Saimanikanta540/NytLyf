import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from '../constants/auth';

export async function setToken(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

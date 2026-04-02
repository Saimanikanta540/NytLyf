import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';
import { AUTH_TOKEN_KEY } from '../constants/auth';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  
  try {
    const url = `${API_BASE_URL}${path}`;
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = (await res.json()) as ApiResponse<T>;
    } else {
      const text = await res.text();
      throw new Error(`Invalid server response (not JSON): ${text.substring(0, 100)}`);
    }

    if (!res.ok || !data.success) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error: any) {
    console.error(`[API Error] ${path}:`, error.message);
    // If it's a TypeError, it's likely a network/CORS issue
    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw new Error('Cannot connect to server. Check your internet and API URL.');
    }
    throw error;
  }
}

export async function getEvents(page = 1, limit = 50) {
  // The new backend returns data directly as the array of events
  return request<any[]>(`/api/events?page=${page}&limit=${limit}`);
}

export async function getEventById(id: string) {
  return request<any>(`/api/events/${id}`);
}

export async function getReviewsByEvent(eventId: string) {
  // Note: The new backend uses a different endpoint for user interactions, 
  // but let's assume we'll add reviews later or keep it for now.
  return request<any[]>(`/api/reviews/event/${eventId}`);
}

export async function login(email: string, password: string) {
  return request<any>(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  return request<any>(`/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getProfile() {
  return request<any>(`/api/users/profile`);
}

export async function updateProfile(data: { name?: string; email?: string; password?: string }) {
  return request<any>(`/api/users/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function bookTickets(eventId: string, ticketCount: number) {
  return request<any>(`/api/users/book/${eventId}`, {
    method: 'POST',
    body: JSON.stringify({ ticketCount }),
  });
}

export async function getBookmarks() {
  return request<any[]>(`/api/users/bookmarks`);
}

export async function toggleBookmark(eventId: string) {
  return request<string[]>(`/api/users/bookmark/${eventId}`, {
    method: 'POST',
  });
}


// NYTLYF Type Definitions

// ============================================
// USER TYPES
// ============================================
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  isGuest: boolean;
  preferences: UserPreferences;
  savedEvents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: {
    events: boolean;
    promotions: boolean;
    reminders: boolean;
  };
  location: {
    city: string;
    autoDetect: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

// ============================================
// EVENT TYPES
// ============================================
export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;

  // Media
  coverImage: string;
  gallery: string[];

  // Categorization
  category: Category;
  tags: string[];

  // Location
  venue: Venue;

  // Timing
  date: string;
  startTime: string;
  endTime: string;
  isMultiDay: boolean;
  endDate?: string;

  // Pricing
  pricing: EventPricing;

  // Status
  status: EventStatus;
  isFeatured: boolean;
  isTrending: boolean;
  isExclusive: boolean;
  isPromoted?: boolean;

  // Engagement
  viewCount: number;
  saveCount: number;
  shareCount: number;

  // Organizer
  organizer: Organizer;

  // Metadata
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface EventPricing {
  isFree: boolean;
  startingPrice?: number;
  maxPrice?: number;
  currency: string;
  ticketTypes?: TicketType[];
}

export interface TicketType {
  name: string;
  price: number;
  description?: string;
  available: boolean;
  quantity?: number;
}

export type EventStatus = 'draft' | 'pending' | 'approved' | 'published' | 'cancelled' | 'completed';

export interface Venue {
  _id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
}

export interface Organizer {
  _id: string;
  name: string;
  logo?: string;
  isVerified: boolean;
}

// ============================================
// CATEGORY TYPES
// ============================================
export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  eventCount: number;
  isActive: boolean;
  order: number;
}

// ============================================
// AD TYPES
// ============================================
export interface Ad {
  _id: string;
  title: string;
  type: AdType;
  placement: AdPlacement;

  // Creative
  imageUrl: string;
  imageUrlMobile?: string;
  targetUrl: string;

  // Scheduling
  startDate: string;
  endDate: string;
  isActive: boolean;

  // Targeting
  targetCategories?: string[];
  targetLocations?: string[];

  // Analytics
  impressions: number;
  clicks: number;
  ctr: number;

  // Priority
  priority: number;

  createdAt: string;
  updatedAt: string;
}

export type AdType = 'banner' | 'interstitial' | 'native';
export type AdPlacement =
  | 'home_hero'
  | 'home_top'
  | 'home_mid'
  | 'home_bottom'
  | 'explore_inline'
  | 'detail_mid'
  | 'detail_bottom'
  | 'categories_top';

// ============================================
// FILTER & SEARCH TYPES
// ============================================
export interface EventFilters {
  category?: string;
  location?: string;
  dateRange?: DateRange;
  priceRange?: PriceRange;
  isFree?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  search?: string;
}

export interface DateRange {
  type: 'today' | 'tomorrow' | 'weekend' | 'this_week' | 'this_month' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface SearchSuggestion {
  type: 'event' | 'venue' | 'category' | 'organizer';
  id: string;
  text: string;
  subtitle?: string;
  icon?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// ============================================
// NAVIGATION TYPES
// ============================================
export type RootStackParamList = {
  '(auth)/splash': undefined;
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  '(tabs)': undefined;
  'event/[id]': { id: string };
  'category/[slug]': { slug: string };
  'search': undefined;
  'settings': undefined;
};

export type TabParamList = {
  home: undefined;
  explore: undefined;
  categories: undefined;
  saved: undefined;
  profile: undefined;
};

// ============================================
// ANALYTICS TYPES
// ============================================
export interface AnalyticsEvent {
  eventType: 'view' | 'click' | 'save' | 'share' | 'impression';
  targetType: 'event' | 'ad' | 'category';
  targetId: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}


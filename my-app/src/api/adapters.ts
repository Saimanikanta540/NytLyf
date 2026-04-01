import { Event, Category, Venue, Organizer, EventPricing } from '../types';
import { mockCategories } from '../data/mockData';

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
  'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&q=80',
];

function pickCategory(raw: any): Category {
  if (!raw) return mockCategories[0];
  
  // If it's a populated Mongoose object
  if (typeof raw === 'object' && raw.name) {
    const slug = raw.name.toLowerCase().replace(/\s+/g, '-');
    return {
      _id: String(raw._id || '0'),
      name: raw.name,
      slug: slug,
      icon: raw.icon || 'pricetag',
      color: '#00D9FF', // Default fallback color
      description: raw.name,
      eventCount: 0,
      isActive: true,
      order: 1,
    };
  }

  // Fallback for string or unpopulated ID
  const normalized = String(raw).toLowerCase();
  const match = mockCategories.find(c => c.slug === normalized || c.name.toLowerCase() === normalized);
  if (match) return match;
  
  return {
    _id: '0',
    name: String(raw),
    slug: normalized.replace(/\s+/g, '-'),
    icon: 'pricetag',
    color: '#00D9FF',
    description: String(raw),
    eventCount: 0,
    isActive: true,
    order: 999,
  };
}

export function mapBackendEvent(raw: any): Event {
  const category = pickCategory(raw.category);
  const venue: Venue = {
    _id: `v-${raw.id || raw._id}`,
    name: raw.locationName || 'Venue',
    address: raw.locationName || 'Venue',
    area: raw.locationName || 'Venue',
    city: 'Hyderabad',
    coordinates: { lat: Number(raw.latitude || 0), lng: Number(raw.longitude || 0) },
    googleMapsUrl: 'https://maps.google.com',
  };

  const organizer: Organizer = {
    _id: raw.organizer?._id || raw.organizer?.id ? String(raw.organizer._id || raw.organizer.id) : 'org-1',
    name: raw.organizer?.name || 'NytLyf Organizer',
    isVerified: true,
  };

  const pricing: EventPricing = {
    isFree: Number(raw.price || 0) === 0,
    startingPrice: Number(raw.price || 0),
    maxPrice: Number(raw.price || 0),
    currency: 'INR',
  };

  const dateIso = raw.eventDate ? new Date(raw.eventDate).toISOString() : new Date().toISOString();
  
  // Use image from backend or fallback to gallery
  const coverImg = raw.image || DEFAULT_GALLERY[0];

  return {
    _id: String(raw.id || raw._id),
    title: raw.title || 'Event',
    slug: (raw.title || 'event').toLowerCase().replace(/\s+/g, '-'),
    description: raw.description || 'Event details coming soon.',
    shortDescription: raw.description || 'Event details coming soon.',
    coverImage: coverImg,
    gallery: [coverImg, ...DEFAULT_GALLERY.slice(1)],
    category,
    tags: [category.name],
    venue,
    date: dateIso,
    startTime: '8:00 PM',
    endTime: '11:00 PM',
    isMultiDay: false,
    pricing,
    status: 'published',
    isFeatured: pricing.isFree || pricing.startingPrice <= 1000,
    isTrending: Boolean(raw.isTrending),
    isExclusive: false,
    isPromoted: false,
    viewCount: 0,
    saveCount: 0,
    shareCount: 0,
    organizer,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

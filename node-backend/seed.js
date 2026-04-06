const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');

// Load env vars
dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data to prevent duplicates
    console.log('Destroying old data...');
    await Event.deleteMany();
    await Category.deleteMany();
    // Only delete our specific seed organizer to preserve other users you might have created
    await User.deleteMany({ email: 'organizer@nytlyf.com' });

    // 1. Create a default Organizer User
    const organizer = await User.create({
      name: 'NytLyf Official Organizer',
      email: 'organizer@nytlyf.com',
      password: 'password123', // Will be hashed by the pre-save hook in User model
    });
    
    // Create the requested Admin User
    await User.create({
      name: 'Super Admin',
      email: 'admin540@gmail.com',
      password: 'admin540',
      isAdmin: true
    });
    console.log('Created Seed Organizer & Admin');

    // 2. Define Categories
    const categoryData = [
      { name: 'Party', icon: 'partly-sunny' },
      { name: 'Concert', icon: 'musical-notes' },
      { name: 'Meetup', icon: 'people' },
      { name: 'Exclusive', icon: 'star' },
      { name: 'Festival', icon: 'color-palette' },
      { name: 'Clubbing', icon: 'beer' },
      { name: 'Comedy Shows', icon: 'happy' }
    ];

    const createdCategories = await Category.insertMany(categoryData);
    console.log(`Created ${createdCategories.length} Categories`);

    // 3. Define Cities and Venues
    const cities = [
      { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, areas: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Hitech City', 'Kondapur'] },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946, areas: ['Indiranagar', 'Koramangala', 'MG Road', 'Whitefield', 'HSR Layout'] },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777, areas: ['Bandra', 'Andheri', 'Colaba', 'Juhu', 'Worli'] },
      { name: 'Delhi', lat: 28.6139, lng: 77.2090, areas: ['CP', 'Hauz Khas', 'Saket', 'Gurgaon', 'Noida'] },
      { name: 'Goa', lat: 15.2993, lng: 74.1240, areas: ['Anjuna', 'Baga', 'Calangute', 'Panjim', 'Vagator'] }
    ];

    const venueSuffixes = ['Arena', 'Club', 'Lounge', 'Garden', 'Plaza', 'Stadium', 'Cafe', 'Resort'];

    // 4. Images
    const images = [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', // Party
      'https://images.unsplash.com/photo-1540039155732-61dd80bd3f18?w=800&q=80', // Concert
      'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&q=80', // Meetup
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', // Exclusive
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', // Festival
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',  // Clubbing
      'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80'   // Comedy Shows
    ];

    const eventTitles = {
      'Party': ['Summer Splash', 'Neon Night', 'Midnight Madness', 'House Party Vibes', 'Rooftop Revelry'],
      'Concert': ['Live & Loud', 'Acoustic Soul', 'Rock On!', 'Pop Sensation', 'Indie Night'],
      'Meetup': ['Tech Talk', 'Startup Mixer', 'Book Club', 'Networking Brunch', 'Photography Walk'],
      'Exclusive': ['VIP Gala', 'Black Tie Soiree', 'Luxury Yacht Party', 'Secret Underground', 'Invite Only'],
      'Festival': ['Color Carnival', 'Food Fiesta', 'Arts & Beats', 'Global Fusion', 'Harvest Jubilee'],
      'Clubbing': ['Techno Takeover', 'EDM Explosion', 'Hip Hop Heavyweights', 'Deep House session', 'Bass Drop'],
      'Comedy Shows': ['Laughter Therapy', 'Stand Up Special', 'Open Mic Night', 'Improv Chaos', 'Comic Relief']
    };

    const eventsToInsert = [];

    // Generate 150 events total (across all cities and categories)
    for (let i = 0; i < 150; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const area = city.areas[Math.floor(Math.random() * city.areas.length)];
      const catIndex = Math.floor(Math.random() * createdCategories.length);
      const category = createdCategories[catIndex];
      const titles = eventTitles[category.name];
      const title = titles[Math.floor(Math.random() * titles.length)] + ` ${Math.floor(Math.random() * 100)}`;
      const venue = `${area} ${venueSuffixes[Math.floor(Math.random() * venueSuffixes.length)]}`;
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90) + 1);
      futureDate.setHours(18 + Math.floor(Math.random() * 5), 0, 0, 0);

      eventsToInsert.push({
        title: title,
        description: `Experience the most talked about ${category.name.toLowerCase()} in ${city.name}! Join us at ${venue} for an evening of ${category.name.toLowerCase()}. Don't miss out on this incredible event in ${area}.`,
        category: category._id,
        locationName: `${venue}, ${city.name}`,
        latitude: city.lat + (Math.random() * 0.05 - 0.025),
        longitude: city.lng + (Math.random() * 0.05 - 0.025),
        eventDate: futureDate,
        price: Math.floor(Math.random() * 3000) + 200,
        availableTickets: Math.floor(Math.random() * 500) + 20,
        image: images[catIndex],
        organizer: organizer._id,
        isTrending: Math.random() > 0.8,
        isFeatured: Math.random() > 0.85
      });
    }

    await Event.insertMany(eventsToInsert);
    console.log(`Successfully seeded ${eventsToInsert.length} events across 5 cities!`);

    console.log('Database Seeding Complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
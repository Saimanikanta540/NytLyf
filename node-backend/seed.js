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
    console.log('Created Seed Organizer');

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

    // 3. Generate 10 Events for each Category
    const eventsToInsert = [];
    const images = [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', // Party
      'https://images.unsplash.com/photo-1540039155732-61dd80bd3f18?w=800&q=80', // Concert
      'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&q=80', // Meetup
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', // Exclusive
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', // Festival
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',  // Clubbing
      'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80'   // Comedy Shows
    ];

    createdCategories.forEach((category, catIndex) => {
      for (let i = 1; i <= 10; i++) {
        // Generate random future date within the next 3 months
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90) + 1);
        futureDate.setHours(18 + Math.floor(Math.random() * 5), 0, 0, 0); // Evening events

        eventsToInsert.push({
          title: `Amazing ${category.name} Experience ${i}`,
          description: `Join us for the best ${category.name.toLowerCase()} event in the city! Expect great vibes, amazing crowds, and unforgettable memories. Grab your tickets before they sell out!`,
          category: category._id,
          locationName: `Premium Venue ${i}, Hyderabad`,
          latitude: 17.3850 + (Math.random() * 0.1 - 0.05), // Around Hyderabad
          longitude: 78.4867 + (Math.random() * 0.1 - 0.05),
          eventDate: futureDate,
          price: Math.floor(Math.random() * 2000) + 500, // Price between 500 and 2500
          availableTickets: Math.floor(Math.random() * 300) + 50, // Between 50 and 350
          image: images[catIndex], // Assign image based on category
          organizer: organizer._id,
          isTrending: i <= 2 // The first 2 events in every category will be trending
        });
      }
    });

    await Event.insertMany(eventsToInsert);
    console.log(`Successfully seeded ${eventsToInsert.length} events! (10 per category)`);

    console.log('Database Seeding Complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
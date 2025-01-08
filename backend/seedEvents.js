import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Event Schema
const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  location: String,
  description: String,
  image: String,
  registrations: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const Event = mongoose.model('Event', eventSchema);

// Sample Events Data
const eventsData = [
  {
    title: 'Annual Alumni Meet 2024',
    date: new Date('2024-03-15'),
    location: 'NIE Main Campus Auditorium',
    description: 'Join us for our biggest alumni gathering of the year! Connect with old friends, make new connections, and hear inspiring success stories from our distinguished alumni. The event includes networking sessions, panel discussions, and a gala dinner.',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: 'Tech Innovation Summit',
    date: new Date('2024-04-20'),
    location: 'NIE Technology Center',
    description: 'Explore the latest trends in technology with industry experts. This summit features keynote speakers from leading tech companies, hands-on workshops, and opportunities to showcase your innovative projects.',
    image: 'https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: 'Career Development Workshop',
    date: new Date('2024-05-10'),
    location: 'Virtual Event',
    description: 'Enhance your professional skills with our comprehensive career development workshop. Topics include resume building, interview preparation, personal branding, and networking strategies.',
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: 'Entrepreneurship Bootcamp',
    date: new Date('2024-06-05'),
    location: 'NIE Business Innovation Hub',
    description: 'A five-day intensive bootcamp for aspiring entrepreneurs. Learn from successful founders, work on your business idea, and get mentorship from industry experts. Perfect for alumni looking to start their own venture.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: 'Global Alumni Network Launch',
    date: new Date('2024-07-15'),
    location: 'Hybrid Event (In-person & Virtual)',
    description: 'Be part of the historic launch of our Global Alumni Network. Connect with NIE alumni worldwide, participate in global mentorship programs, and access exclusive international opportunities.',
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedEvents();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed Events
async function seedEvents() {
  try {
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    const insertedEvents = await Event.insertMany(eventsData);
    console.log(`Successfully seeded ${insertedEvents.length} events`);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding events:', error);
    mongoose.connection.close();
  }
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'alumni'],
    required: true
  },
  name: String,
  graduationYear: Number,
  company: String,
  position: String,
  bio: String,
  avatar: String
});

const User = mongoose.model('User', userSchema);

// Sample Alumni Data
const alumniData = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'alumni',
    name: 'John Doe',
    graduationYear: 2020,
    company: 'Google',
    position: 'Senior Software Engineer',
    bio: 'Experienced software engineer specializing in cloud technologies and distributed systems.',
  },
  {
    email: 'sarah.smith@example.com',
    password: 'password123',
    role: 'alumni',
    name: 'Sarah Smith',
    graduationYear: 2019,
    company: 'Microsoft',
    position: 'Product Manager',
    bio: 'Product manager with a passion for user-centric design and agile methodologies.',
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    role: 'alumni',
    name: 'Mike Johnson',
    graduationYear: 2021,
    company: 'Amazon',
    position: 'Data Scientist',
    bio: 'Data scientist working on machine learning and AI solutions.',
  },
  {
    email: 'emily.brown@example.com',
    password: 'password123',
    role: 'alumni',
    name: 'Emily Brown',
    graduationYear: 2018,
    company: 'Apple',
    position: 'iOS Developer',
    bio: 'Mobile app developer with expertise in Swift and iOS development.',
  },
  {
    email: 'david.wilson@example.com',
    password: 'password123',
    role: 'alumni',
    name: 'David Wilson',
    graduationYear: 2022,
    company: 'Tesla',
    position: 'Machine Learning Engineer',
    bio: 'Working on autonomous driving systems and computer vision.',
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedAlumni();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed Alumni
async function seedAlumni() {
  try {
    // Clear existing alumni
    await User.deleteMany({ role: 'alumni' });
    console.log('Cleared existing alumni');

    // Hash passwords and add avatars
    const alumniWithHashedPasswords = await Promise.all(
      alumniData.map(async (alumni) => ({
        ...alumni,
        password: await bcrypt.hash(alumni.password, 10),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.name)}&background=random`
      }))
    );

    // Insert new alumni
    const insertedAlumni = await User.insertMany(alumniWithHashedPasswords);
    console.log(`Successfully seeded ${insertedAlumni.length} alumni`);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding alumni:', error);
    mongoose.connection.close();
  }
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const alumniData = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2018',
    branch: 'Computer Science',
    company: 'Google',
    linkedin: 'https://linkedin.com/in/rahul-sharma'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2017',
    branch: 'Information Science',
    company: 'Microsoft',
    linkedin: 'https://linkedin.com/in/priya-patel'
  },
  {
    name: 'Arun Kumar',
    email: 'arun.kumar@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2019',
    branch: 'Computer Science',
    company: 'Amazon',
    linkedin: 'https://linkedin.com/in/arun-kumar'
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2020',
    branch: 'Electronics',
    company: 'Apple',
    linkedin: 'https://linkedin.com/in/sneha-reddy'
  },
  {
    name: 'Karthik M',
    email: 'karthik.m@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2016',
    branch: 'Mechanical',
    company: 'Tesla',
    linkedin: 'https://linkedin.com/in/karthik-m'
  },
  {
    name: 'Divya Krishnan',
    email: 'divya.k@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2015',
    branch: 'Information Science',
    company: 'Facebook',
    linkedin: 'https://linkedin.com/in/divya-krishnan'
  },
  {
    name: 'Akash Singh',
    email: 'akash.singh@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2021',
    branch: 'Computer Science',
    company: 'Netflix',
    linkedin: 'https://linkedin.com/in/akash-singh'
  },
  {
    name: 'Meera Nair',
    email: 'meera.nair@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2018',
    branch: 'Electronics',
    company: 'Intel',
    linkedin: 'https://linkedin.com/in/meera-nair'
  },
  {
    name: 'Suresh Kumar',
    email: 'suresh.kumar@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2016',
    branch: 'Mechanical',
    company: 'Boeing',
    linkedin: 'https://linkedin.com/in/suresh-kumar'
  },
  {
    name: 'Anjali Menon',
    email: 'anjali.menon@gmail.com',
    password: 'alumni123',
    role: 'alumni',
    batch: '2019',
    branch: 'Information Science',
    company: 'Adobe',
    linkedin: 'https://linkedin.com/in/anjali-menon'
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing alumni
      await User.deleteMany({ role: 'alumni' });
      console.log('Cleared existing alumni');

      // Create new alumni users
      for (const alumni of alumniData) {
        const user = new User(alumni);
        await user.save();
      }
      console.log('Successfully seeded alumni data');
      
      mongoose.connection.close();
    } catch (error) {
      console.error('Error seeding alumni:', error);
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

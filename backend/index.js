import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Server } from 'socket.io';
import { createServer } from 'http';
import User from './models/User.js';
import Student from './models/Student.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add CORS preflight
app.options('*', cors());

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Schema Definitions
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
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

const alumniSchema = new mongoose.Schema({
  name: String,
  graduationYear: Number,
  currentStatus: {
    type: String,
    enum: ['Higher Studies', 'Jobs', 'Entrepreneurs', 'Others']
  },
  email: String
});

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage'
  }]
});

const Event = mongoose.model('Event', eventSchema);
const Alumni = mongoose.model('Alumni', alumniSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const Chat = mongoose.model('Chat', chatSchema);

// Register endpoint with detailed error handling
app.post('/api/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  try {
    const { email, password, name, bio } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log('Existing user check:', { exists: !!existingUser });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user object with required fields
    const userData = {
      email: email.toLowerCase(),
      password,
      name,
      role: 'student',
      bio: bio || ''
    };
    console.log('Creating user with data:', { ...userData, password: '[REDACTED]' });

    // Create and save new user
    const user = new User(userData);
    try {
      await user.save();
      console.log('User saved successfully:', { id: user._id, email: user.email });
      res.status(201).json({ message: 'Registration successful' });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      if (saveError.code === 11000) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      throw saveError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token and user data (excluding password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    };

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a private room for the user
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle private messages
  socket.on('private_message', async (data) => {
    try {
      const { sender, receiver, message } = data;
      
      // Save message to database
      const chatMessage = new ChatMessage({
        sender,
        receiver,
        message
      });
      await chatMessage.save();

      // Emit to both sender and receiver
      io.to(receiver).emit('new_message', {
        ...data,
        timestamp: chatMessage.timestamp
      });
      
      io.to(sender).emit('new_message', {
        ...data,
        timestamp: chatMessage.timestamp
      });
    } catch (error) {
      console.error('Error saving/sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/stats', async (req, res) => {
  try {
    const alumniCount = await Alumni.countDocuments();
    const statusCounts = await Alumni.aggregate([
      {
        $group: {
          _id: '$currentStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalAlumni: alumniCount,
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
app.get('/api/user/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
app.put('/api/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { name, graduationYear, company, position, bio } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow users to update their own profile
    if (user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    user.name = name || user.name;
    user.graduationYear = graduationYear || user.graduationYear;
    user.company = company || user.company;
    user.position = position || user.position;
    user.bio = bio || user.bio;
    user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || user.name)}&background=random`;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all alumni with pagination and search
app.get('/api/alumni', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = { 
      role: 'alumni',
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await User.countDocuments(query);
    const alumni = await User.find(query)
      .select('-password')
      .sort({ graduationYear: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      alumni,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat history
app.get('/api/chat/:userId1/:userId2', authenticateToken, async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar');
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Event Routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

app.post('/api/events/register/:eventId', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    const isRegistered = event.registrations.some(reg => 
      reg.userId.toString() === req.user.userId
    );

    if (isRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.registrations.push({ userId: req.user.userId });
    await event.save();

    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

// Add new student
app.post('/api/students', async (req, res) => {
  try {
    const { name, usn, branch, year, email, linkedin } = req.body;

    // Check if student with same USN or email exists
    const existingStudent = await Student.findOne({
      $or: [{ usn }, { email }]
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'A student with this USN or email already exists'
      });
    }

    const student = new Student({
      name,
      usn,
      branch,
      year,
      email,
      linkedin
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error while adding student' });
  }
});

// Profile Routes
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, bio, batch, branch, company, designation, linkedin } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    user.name = name;
    user.email = email;
    user.bio = bio;

    // Update profile fields
    user.profile = {
      batch,
      branch,
      company,
      designation,
      linkedin
    };

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Alumni Routes
app.get('/api/alumni', async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni' })
      .select('-password')
      .lean();
    
    console.log('Found alumni:', alumni); // Debug log
    res.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ message: 'Failed to fetch alumni' });
  }
});

app.post('/api/alumni', async (req, res) => {
  try {
    // Ensure required fields are present
    const { name, email, batch, branch, company, linkedin, password } = req.body;
    
    if (!name || !email || !batch || !branch || !company) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide name, email, batch, branch, and company.' 
      });
    }

    // Check if alumni already exists
    const existingAlumni = await User.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({ message: 'Alumni with this email already exists' });
    }

    // Create new alumni
    const newAlumni = new User({
      name,
      email,
      password: password || 'alumni123', // Default password if not provided
      role: 'alumni',
      batch,
      branch,
      company,
      linkedin: linkedin || ''
    });

    await newAlumni.save();
    
    // Remove password from response
    const alumniResponse = newAlumni.toObject();
    delete alumniResponse.password;

    console.log('Created new alumni:', alumniResponse); // Debug log
    res.status(201).json(alumniResponse);
  } catch (error) {
    console.error('Error creating alumni:', error);
    res.status(500).json({ 
      message: 'Failed to create alumni',
      error: error.message 
    });
  }
});

app.get('/api/alumni/:id', authenticateToken, async (req, res) => {
  try {
    const alumni = await User.findOne({ _id: req.params.id, role: 'alumni' })
      .select('-password')
      .lean();
    
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    
    res.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni profile:', error);
    res.status(500).json({ message: 'Error fetching alumni profile' });
  }
});

// Chat creation endpoint
app.post('/api/chat/create/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const otherUser = await User.findById(req.params.userId);

    if (!currentUser || !otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: {
        $all: [req.user.userId, req.params.userId]
      }
    });

    if (existingChat) {
      return res.json({ chatId: existingChat._id });
    }

    // Create new chat
    const newChat = new Chat({
      participants: [req.user.userId, req.params.userId],
      messages: []
    });

    await newChat.save();
    res.json({ chatId: newChat._id });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

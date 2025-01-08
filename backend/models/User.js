import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'alumni', 'admin'],
    default: 'student',
    required: true
  },
  batch: {
    type: String,
    required: function() {
      return this.role === 'alumni' || this.role === 'student';
    },
    trim: true
  },
  branch: {
    type: String,
    required: function() {
      return this.role === 'alumni' || this.role === 'student';
    },
    trim: true
  },
  company: {
    type: String,
    required: function() {
      return this.role === 'alumni';
    },
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

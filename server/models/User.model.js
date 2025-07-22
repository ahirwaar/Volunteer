import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      // Only require password for new users
      return this.isNew;
    },
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['volunteer', 'organization', 'admin'],
    default: 'volunteer'
  },
  phone: {
    type: String,
    trim: true
  },
  organizationName: {
    type: String,
    trim: true
  },
  organizationProfile: {
    website: String,
    description: String,
    mission: String,
    causes: [String]
  },
  volunteerProfile: {
    skills: [String],
    interests: [String],
    availability: {
      weekdays: Boolean,
      weekends: Boolean,
      evenings: Boolean
    },
    experience: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
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

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign(
      { 
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        organizationName: this.organizationName
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d',
        algorithm: 'HS256'
      }
    );
    return token;
  } catch (error) {
    throw new Error(`Error generating auth token: ${error.message}`);
  }
};

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return this.role === 'organization' ? this.organizationProfile : this.volunteerProfile;
});

// Create indexes
userSchema.index({ role: 1 });
userSchema.index({ 'organizationProfile.causes': 1 });
userSchema.index({ 'volunteerProfile.skills': 1 });

const User = mongoose.model('User', userSchema);

export default User; 
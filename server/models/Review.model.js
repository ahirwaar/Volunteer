import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Volunteer ID is required']
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organization ID is required']
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: [true, 'Opportunity ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  feedback: {
    type: String,
    required: [true, 'Feedback is required'],
    trim: true,
    minlength: [10, 'Feedback must be at least 10 characters long'],
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  completionDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Completion date cannot be in the future'
    }
  }
}, {
  timestamps: true
});

// Ensure one review per volunteer per opportunity
reviewSchema.index({ volunteer: 1, opportunity: 1 }, { unique: true });

// Pre-save middleware to validate user roles
reviewSchema.pre('save', async function(next) {
  try {
    const User = this.model('User');
    const volunteer = await User.findById(this.volunteer);
    const organization = await User.findById(this.organization);

    if (!volunteer || volunteer.role !== 'volunteer') {
      throw new Error('Invalid volunteer ID or user is not a volunteer');
    }
    if (!organization || organization.role !== 'organization') {
      throw new Error('Invalid organization ID or user is not an organization');
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review; 
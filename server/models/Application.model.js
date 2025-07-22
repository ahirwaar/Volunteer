import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'completed'],
    default: 'pending'
  },
  applicationMessage: {
    type: String,
    maxlength: [1000, 'Application message cannot be more than 1000 characters']
  },
  experience: {
    relevantExperience: String,
    whyInterested: String,
    additionalInfo: String
  },
  organizationNotes: {
    type: String,
    maxlength: [1000, 'Organization notes cannot be more than 1000 characters']
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: Date,
  rating: {
    volunteerRating: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String
    },
    organizationRating: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String
    }
  },
  communicationPreference: {
    type: String,
    enum: ['platform', 'email', 'phone', 'sms'],
    default: 'platform'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate applications
applicationSchema.index({ opportunity: 1, volunteer: 1 }, { unique: true });

// Index for queries
applicationSchema.index({ status: 1 });
applicationSchema.index({ organization: 1, status: 1 });
applicationSchema.index({ volunteer: 1, status: 1 });

// Add helper methods
applicationSchema.methods.canWithdraw = function() {
  return ['pending', 'accepted'].includes(this.status);
};

applicationSchema.methods.canUpdate = function(userId, userRole) {
  if (userRole === 'admin') return true;
  if (userRole === 'organization' && this.organization.toString() === userId.toString()) return true;
  if (userRole === 'volunteer' && this.volunteer.toString() === userId.toString()) {
    return this.canWithdraw();
  }
  return false;
};

// Add virtual for application age
applicationSchema.virtual('applicationAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Enable virtuals in JSON
applicationSchema.set('toJSON', { virtuals: true });
applicationSchema.set('toObject', { virtuals: true });

// Middleware to check if opportunity is still open before saving
applicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Opportunity = this.model('Opportunity');
    const opportunity = await Opportunity.findById(this.opportunity);
    if (!opportunity) {
      return next(new Error('Opportunity not found'));
    }
    if (!opportunity.isOpen()) {
      return next(new Error('This opportunity is no longer accepting applications'));
    }
  }
  this.updatedAt = Date.now();
  next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
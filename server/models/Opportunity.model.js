import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['in-person', 'virtual', 'hybrid', 'remote'],
      required: true
    },
    address: {
      street: String,
      city: {
        type: String,
        required: false // We'll handle conditional requirement in pre-save middleware
      },
      state: {
        type: String,
        required: false // We'll handle conditional requirement in pre-save middleware
      },
      zipCode: String
    }
  },
  schedule: {
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(v) {
          if (!v) return false;
          // Compare only the date part (ignore time)
          const inputDate = new Date(v.getFullYear(), v.getMonth(), v.getDate());
          const today = new Date();
          const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return inputDate >= todayDate;
        },
        message: 'Start date must be today or in the future (date only, time ignored)'
      }
    },
    timeCommitment: {
      hoursPerWeek: {
        type: Number,
        required: false,
        min: 1,
        default: 1
      },
      duration: {
        type: String,
        enum: ['one-time', 'short-term', 'long-term', 'ongoing'],
        required: false,
        default: 'one-time'
      },
      availabilityRequired: {
        weekdays: {
          type: Boolean,
          default: false
        },
        weekends: {
          type: Boolean,
          default: false
        },
        evenings: {
          type: Boolean,
          default: false
        },
        mornings: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'active'
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  volunteersNeeded: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true;
        // Compare only the date part (ignore time)
        const deadlineDate = new Date(v.getFullYear(), v.getMonth(), v.getDate());
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let startDate = this.schedule && this.schedule.startDate ? new Date(this.schedule.startDate) : null;
        if (startDate) {
          startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        }
        return deadlineDate >= todayDate && (!startDate || deadlineDate <= startDate);
      },
      message: 'Application deadline must be today or in the future and before or on the start date (date only, time ignored)'
    }
  },
  ageRequirement: {
    minimum: {
      type: Number,
      min: 0,
      default: 18
    },
    maximum: {
      type: Number,
      min: 0,
      default: null,
      validate: {
        validator: function(v) {
          // If minimum is set, maximum must be >= minimum
          if (v == null) return true;
          return v >= (this.minimum || 0);
        },
        message: 'Maximum age must be greater than or equal to minimum age.'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for faster queries
opportunitySchema.index({ status: 1, 'schedule.startDate': 1 });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ organization: 1 });
opportunitySchema.index({ urgency: 1 });
opportunitySchema.index({ 'location.address.city': 1, 'location.address.state': 1 });
opportunitySchema.index({ skills: 1 });

// Add virtual field to calculate spots left
opportunitySchema.virtual('spotsLeft').get(function() {
  return Math.max(0, this.volunteersNeeded - (this.acceptedCount || 0));
});

// Add virtual field to calculate total applications
opportunitySchema.virtual('totalApplications').get(function() {
  return (this.pendingCount || 0) + (this.acceptedCount || 0);
});

// Add method to check if opportunity is open for applications
opportunitySchema.methods.isOpen = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.schedule.startDate > now &&
    this.spotsLeft > 0
  );
};

// Pre-save middleware to validate organization and location
opportunitySchema.pre('save', async function(next) {
  try {
    // Validate organization
    if (this.isNew || this.isModified('organization')) {
      const User = this.model('User');
      const organization = await User.findById(this.organization);
      
      if (!organization || organization.role !== 'organization') {
        throw new Error('Invalid organization ID or user is not an organization');
      }
    }

    // Validate location requirements for non-virtual opportunities
    if (this.isNew || this.isModified('location')) {
      if (this.location && this.location.type !== 'virtual') {
        if (!this.location.address || !this.location.address.city || !this.location.address.state) {
          throw new Error('City and state are required for non-virtual opportunities');
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity; 
import Opportunity from '../models/Opportunity.model.js';
import User from '../models/User.model.js';
import mongoose from 'mongoose';

// Add sample opportunities if none exist
const addSampleOpportunities = async () => {
  const count = await Opportunity.countDocuments();
  if (count === 0) {
    // Find or create a sample organization
    let organization = await User.findOne({ role: 'organization' });
    if (!organization) {
      organization = await User.create({
        name: 'Sample Organization',
        email: 'sample@org.com',
        password: 'password123',
        role: 'organization',
        organizationProfile: {
          organizationName: 'Sample Organization',
          verificationStatus: 'verified'
        }
      });
    }

    // Find or create second organization
    let organization2 = await User.findOne({ email: 'eldercare@center.com' });
    if (!organization2) {
      organization2 = await User.create({
        name: 'Elder Care Center',
        email: 'eldercare@center.com',
        password: 'password123',
        role: 'organization',
        organizationProfile: {
          organizationName: 'Elder Care Center',
          verificationStatus: 'verified'
        }
      });
    }

    // Find or create third organization
    let organization3 = await User.findOne({ email: 'support@community.org' });
    if (!organization3) {
      organization3 = await User.create({
        name: 'Community Support Network',
        email: 'support@community.org',
        password: 'password123',
        role: 'organization',
        organizationProfile: {
          organizationName: 'Community Support Network',
          verificationStatus: 'verified'
        }
      });
    }

    // Sample opportunities
    const opportunities = [
      {
        title: 'Senior Companion Program',
        description: 'Spend time with elderly individuals, providing companionship and basic assistance. Share stories, play games, or simply enjoy conversations together.',
        organization: organization._id,
        category: 'companionship',
        location: {
          type: 'in-person',
          address: {
            city: 'New York',
            state: 'NY'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['monday', 'wednesday']
          }
        },
        urgency: 'medium',
        status: 'active'
      },
      {
        title: 'Tech Support for Seniors',
        description: 'Help seniors learn to use computers, smartphones, and other technology. Teach basic skills like email, video calls, and online shopping.',
        organization: organization._id,
        category: 'technology-assistance',
        location: {
          type: 'hybrid',
          address: {
            city: 'Los Angeles',
            state: 'CA'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['tuesday', 'thursday']
          }
        },
        urgency: 'high',
        status: 'active'
      },
      {
        title: 'Emergency Food Delivery',
        description: 'Deliver groceries and essential items to elderly individuals who cannot leave their homes. Help with basic grocery organization.',
        organization: organization._id,
        category: 'grocery-shopping',
        location: {
          type: 'in-person',
          address: {
            city: 'Chicago',
            state: 'IL'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          isRecurring: false
        },
        urgency: 'urgent',
        status: 'active'
      },
      {
        title: 'Medical Appointment Transportation',
        description: 'Provide transportation for seniors to and from medical appointments. Must have a valid driver\'s license and clean driving record.',
        organization: organization2._id,
        category: 'transportation',
        location: {
          type: 'in-person',
          address: {
            city: 'Boston',
            state: 'MA'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['monday', 'wednesday', 'friday']
          }
        },
        urgency: 'high',
        status: 'active'
      },
      {
        title: 'Home Safety Assessment Helper',
        description: 'Assist in conducting home safety assessments for elderly residents. Help identify potential hazards and recommend safety improvements.',
        organization: organization2._id,
        category: 'household-help',
        location: {
          type: 'in-person',
          address: {
            city: 'Seattle',
            state: 'WA'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
          isRecurring: false
        },
        urgency: 'medium',
        status: 'active'
      },
      {
        title: 'Virtual Story Time Host',
        description: 'Host virtual story time sessions for elderly individuals in assisted living facilities. Share books, poems, and facilitate discussions.',
        organization: organization2._id,
        category: 'companionship',
        location: {
          type: 'remote',
          address: {
            city: 'Remote',
            state: 'Any'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['tuesday', 'thursday']
          }
        },
        urgency: 'low',
        status: 'active'
      },
      {
        title: 'Medicare Navigation Assistant',
        description: 'Help seniors understand and navigate Medicare options and paperwork. Training will be provided.',
        organization: organization3._id,
        category: 'administrative-help',
        location: {
          type: 'hybrid',
          address: {
            city: 'Miami',
            state: 'FL'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['wednesday']
          }
        },
        urgency: 'medium',
        status: 'active'
      },
      {
        title: 'Emergency Response Team Member',
        description: 'Join our emergency response team to assist elderly residents during weather emergencies or natural disasters.',
        organization: organization3._id,
        category: 'emergency-response',
        location: {
          type: 'in-person',
          address: {
            city: 'Houston',
            state: 'TX'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          isRecurring: false
        },
        urgency: 'urgent',
        status: 'active'
      },
      {
        title: 'Senior Exercise Buddy',
        description: 'Lead gentle exercise sessions for seniors. Experience in senior fitness or physical therapy preferred.',
        organization: organization3._id,
        category: 'elderly-care',
        location: {
          type: 'in-person',
          address: {
            city: 'Denver',
            state: 'CO'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['monday', 'friday']
          }
        },
        urgency: 'medium',
        status: 'active'
      },
      {
        title: 'Tech Workshop Instructor',
        description: 'Lead workshops teaching seniors how to use smartphones, tablets, and computers safely. Focus on internet safety and avoiding scams.',
        organization: organization._id,
        category: 'technology-assistance',
        location: {
          type: 'in-person',
          address: {
            city: 'San Francisco',
            state: 'CA'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'monthly',
            daysOfWeek: ['saturday']
          }
        },
        urgency: 'low',
        status: 'active'
      },
      {
        title: 'Digital Health Records Assistant',
        description: 'Help organize and digitize health records for elderly residents. Training on HIPAA compliance and medical record systems will be provided.',
        organization: organization3._id,
        category: 'administrative-help',
        location: {
          type: 'in-person',
          address: {
            city: 'Portland',
            state: 'OR'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['monday', 'wednesday', 'friday']
          }
        },
        urgency: 'high',
        status: 'active',
        requirements: {
          backgroundCheck: true,
          training: {
            required: true,
            description: 'HIPAA compliance training provided'
          }
        }
      },
      {
        title: 'Emergency Response Team Member',
        description: 'Join our emergency response team to assist elderly residents during natural disasters or emergencies. First aid certification required.',
        organization: organization3._id,
        category: 'emergency-response',
        location: {
          type: 'in-person',
          address: {
            city: 'Houston',
            state: 'TX'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'monthly',
            daysOfWeek: ['saturday']
          }
        },
        urgency: 'medium',
        status: 'active',
        requirements: {
          minAge: 21,
          backgroundCheck: true,
          physicalRequirements: 'Must be able to lift 25 lbs'
        }
      },
      {
        title: 'Remote Tech Support Specialist',
        description: 'Provide remote technical support to seniors struggling with devices and applications. Help troubleshoot common issues and teach basic cybersecurity.',
        organization: organization._id,
        category: 'technology-assistance',
        location: {
          type: 'remote',
          address: {
            city: 'Remote',
            state: 'Any'
          }
        },
        schedule: {
          startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['tuesday', 'thursday', 'saturday']
          }
        },
        urgency: 'medium',
        status: 'active',
        skillsRequired: ['IT Support', 'Patient Communication', 'Problem Solving']
      },
      {
        title: 'Meal Preparation Assistant',
        description: 'Help prepare and package nutritious meals for elderly community members. Knowledge of dietary restrictions and food safety required.',
        organization: organization2._id,
        category: 'household-help',
        location: {
          type: 'in-person',
          address: {
            city: 'Denver',
            state: 'CO'
          }
        },
        schedule: {
          startDate: new Date(),
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['monday', 'wednesday', 'friday']
          }
        },
        urgency: 'high',
        status: 'active',
        requirements: {
          training: {
            required: true,
            description: 'Food safety training provided'
          }
        }
      },
      {
        title: 'Social Media Engagement Coordinator',
        description: 'Help seniors connect with family and friends through social media. Create engaging content and teach safe social media practices.',
        organization: organization._id,
        category: 'technology-assistance',
        location: {
          type: 'hybrid',
          address: {
            city: 'San Francisco',
            state: 'CA'
          }
        },
        schedule: {
          startDate: new Date(),
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: ['tuesday', 'thursday']
          }
        },
        urgency: 'low',
        status: 'active',
        skillsRequired: ['Social Media Management', 'Content Creation', 'Teaching']
      },
      {
        title: 'Wellness Check Caller',
        description: 'Conduct regular wellness check calls with elderly community members. Monitor their well-being and report any concerns to care coordinators.',
        organization: organization3._id,
        category: 'medical-support',
        location: {
          type: 'remote',
          address: {
            city: 'Remote',
            state: 'Any'
          }
        },
        schedule: {
          startDate: new Date(),
          isRecurring: true,
          recurringPattern: {
            frequency: 'daily',
            timeSlots: ['morning', 'evening']
          }
        },
        urgency: 'high',
        status: 'active',
        requirements: {
          training: {
            required: true,
            description: 'Crisis response and communication training provided'
          }
        }
      }
    ];

    await Opportunity.insertMany(opportunities);
  }
};

// Call this function when the server starts (only if no opportunities exist)
Opportunity.countDocuments().then(count => {
  if (count === 0) {
    addSampleOpportunities();
  }
});

// @desc    Create new opportunity
// @route   POST /api/opportunities
// @access  Private (Organizations only)
export const createOpportunity = async (req, res) => {
  try {
    // Check if user is an organization
    if (req.user.role !== 'organization') {
      return res.status(403).json({
        success: false,
        message: 'Only organizations can create opportunities'
      });
    }

    // Validate required fields
    const { title, category, location, schedule } = req.body;
    if (!title || !category || !location || !schedule) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate location data
    if (location.type === 'in-person' && (!location.address.city || !location.address.state)) {
      return res.status(400).json({
        success: false,
        message: 'City and state are required for in-person opportunities'
      });
    }

    // Validate schedule data
    if (!schedule.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date is required'
      });
    }

    // Create opportunity with organization ID
    const opportunityData = {
      ...req.body,
      organization: req.user._id,
      status: req.body.status || 'active' // Set status to active by default
    };

    const opportunity = await Opportunity.create(opportunityData);
    
    // Populate organization details
    await opportunity.populate('organization', 'name email organizationProfile');

    res.status(201).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Server error while creating opportunity'
    });
  }
};

// @desc    Get all opportunities with filtering and search
// @route   GET /api/opportunities
// @access  Public
export const getOpportunities = async (req, res) => {
  try {
    const {
      category,
      city,
      state,
      urgency,
      status = 'active',
      search,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Status filter (only if explicitly provided)
    if (status) {
      query.status = status;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Location filters
    if (city) {
      query['location.address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['location.address.state'] = new RegExp(state, 'i');
    }

    // Urgency filter
    if (urgency) {
      query.urgency = urgency;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Calculate skip value for pagination (convert to numbers)
    const limitNum = parseInt(limit);
    const skipNum = (parseInt(page) - 1) * limitNum;

    // Create sort object
    const sort = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };

    // Use aggregation to include application counts
    const opportunitiesWithCounts = await Opportunity.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'opportunity',
          as: 'applications'
        }
      },
      {
        $addFields: {
          pendingCount: {
            $size: {
              $filter: {
                input: '$applications',
                cond: { $eq: ['$$this.status', 'pending'] }
              }
            }
          },
          acceptedCount: {
            $size: {
              $filter: {
                input: '$applications',
                cond: { $eq: ['$$this.status', 'accepted'] }
              }
            }
          }
        }
      },
      { $project: { applications: 0 } }, // Remove applications array from output
      { $sort: sort },
      { $skip: skipNum },
      { $limit: limitNum }
    ]);

    // Populate organization details for the aggregated results
    const opportunities = await Opportunity.populate(opportunitiesWithCounts, {
      path: 'organization',
      select: 'name email organizationProfile'
    });

    const total = await Opportunity.countDocuments(query);

    // Calculate total pages
    const pages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: opportunities,
      pagination: {
        current: parseInt(page),
        pages,
        total,
        limit: limitNum
      }
    });
  } catch (err) {
    console.error('Get opportunities error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching opportunities'
    });
  }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Public
export const getOpportunity = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID format'
      });
    }

    // Use aggregation to include application counts
    const opportunityWithCounts = await Opportunity.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'opportunity',
          as: 'applications'
        }
      },
      {
        $addFields: {
          pendingCount: {
            $size: {
              $filter: {
                input: '$applications',
                cond: { $eq: ['$$this.status', 'pending'] }
              }
            }
          },
          acceptedCount: {
            $size: {
              $filter: {
                input: '$applications',
                cond: { $eq: ['$$this.status', 'accepted'] }
              }
            }
          }
        }
      }
    ]);

    if (!opportunityWithCounts.length) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Populate organization details
    const opportunity = await Opportunity.populate(opportunityWithCounts[0], {
      path: 'organization',
      select: 'name email phone organizationProfile'
    });

    // Only populate applications if user is logged in and is the organization owner
    if (req.user && req.user.role === 'organization' && 
        opportunity.organization._id.toString() === req.user._id.toString() && 
        opportunity.applications?.length > 0) {
      await opportunity.populate({
        path: 'applications',
        populate: {
          path: 'volunteer',
          select: 'name email phone profile'
        }
      });
    }

    res.json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching opportunity details'
    });
  }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Organization owner only)
export const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if user owns this opportunity
    if (opportunity.organization.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this opportunity'
      });
    }

    // Additional validation for location data
    if (req.body.location && req.body.location.type !== 'virtual') {
      if (!req.body.location.address || !req.body.location.address.city || !req.body.location.address.state) {
        return res.status(400).json({
          success: false,
          message: 'City and state are required for non-virtual opportunities'
        });
      }
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organization', 'name email organizationProfile');

    res.json({
      success: true,
      data: updatedOpportunity
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Organization owner only)
export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if user owns this opportunity
    if (opportunity.organization.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this opportunity'
      });
    }

    await Opportunity.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get opportunities by organization
// @route   GET /api/opportunities/organization/:id
// @access  Public
export const getOpportunitiesByOrganization = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      organization: req.params.id,
      status: 'active'
    }).populate('organization', 'name email organizationProfile');

    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    console.error('Get opportunities by organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get my opportunities (for logged-in organization)
// @route   GET /api/opportunities/my
// @access  Private (Organizations only)
export const getMyOpportunities = async (req, res) => {
  try {
    if (req.user.role !== 'organization') {
      return res.status(403).json({
        success: false,
        message: 'Only organizations can access this endpoint'
      });
    }

    // Use aggregation to include application counts
    const opportunitiesWithCounts = await Opportunity.aggregate([
      { $match: { organization: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'opportunity',
          as: 'applications'
        }
      },
      {
        $addFields: {
          pendingCount: {
            $size: {
              $filter: {
                input: '$applications',
                cond: { $eq: ['$$this.status', 'pending'] }
              }
            }
          },
          acceptedCount: {
            $size: {
              $filter: {
                input: '$applications',
                cond: { $eq: ['$$this.status', 'accepted'] }
              }
            }
          }
        }
      },
      { $project: { applications: 0 } }, // Remove applications array from output
      { $sort: { createdAt: -1 } }
    ]);

    // Populate organization details
    const opportunities = await Opportunity.populate(opportunitiesWithCounts, {
      path: 'organization',
      select: 'name email organizationProfile'
    });

    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    console.error('Get my opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 
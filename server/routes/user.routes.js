import express from 'express';
import { body } from 'express-validator';
import { 
  getAllUsers, 
  getUserById, 
  updateProfile, 
  deleteUser,
  updatePassword 
} from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import Application from '../models/Application.model.js';

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Protected routes
router.use(protect);

// User routes
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/password', updatePasswordValidation, updatePassword);

// Get volunteer stats
router.get('/volunteer-stats', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get completed applications
    const completedApplications = await Application.find({
      volunteer: userId,
      status: 'completed'
    });

    // Calculate total hours (assuming each opportunity takes 1 hour for now)
    const totalHours = completedApplications.length;

    // Get upcoming applications
    const upcomingApplications = await Application.find({
      volunteer: userId,
      status: 'accepted'
    });

    // Get all applications to calculate favorite categories
    const allApplications = await Application.find({
      volunteer: userId
    }).populate('opportunity', 'category');

    // Calculate favorite categories
    const categoryCount = {};
    allApplications.forEach(app => {
      if (app.opportunity?.category) {
        categoryCount[app.opportunity.category] = (categoryCount[app.opportunity.category] || 0) + 1;
      }
    });

    const favoriteCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    res.json({
      success: true,
      data: {
        totalHours,
        completedOpportunities: completedApplications.length,
        upcomingOpportunities: upcomingApplications.length,
        favoriteCategories
      }
    });
  } catch (error) {
    console.error('Error fetching volunteer stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching volunteer stats'
    });
  }
});

// Get volunteer history
router.get('/volunteer-history', async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({
      volunteer: userId,
      status: 'completed'
    })
    .populate('opportunity', 'title organization')
    .populate('organization', 'name')
    .sort('-completedAt');

    const history = applications.map(app => ({
      title: app.opportunity.title,
      organization: app.organization.name,
      date: app.completedAt,
      hours: 1 // For now, assuming each opportunity takes 1 hour
    }));

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching volunteer history'
    });
  }
});

// Get upcoming opportunities
router.get('/upcoming-opportunities', async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({
      volunteer: userId,
      status: 'accepted'
    })
    .populate('opportunity')
    .populate('organization', 'name')
    .sort('opportunity.startDate');

    const opportunities = applications.map(app => ({
      title: app.opportunity.title,
      organization: app.organization.name,
      startDate: app.opportunity.startDate,
      location: app.opportunity.location
    }));

    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    console.error('Error fetching upcoming opportunities:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching upcoming opportunities'
    });
  }
});

// Admin only routes
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id', protect, admin, deleteUser);

export default router; 
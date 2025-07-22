import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import {
  createApplication,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication,
  getOrganizationApplications,
  getAllApplications,
  rateApplication,
  updateCommunicationPreference
} from '../controllers/application.controller.js';
import Application from '../models/Application.model.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Application routes
router.post('/', createApplication);
router.get('/my', getMyApplications);
router.get('/organization', getOrganizationApplications);
router.get('/all', getAllApplications);

// Ratings routes (must be before parameterized routes)
router.get('/ratings', async (req, res) => {
  try {
    const userId = req.user._id;

    // Initialize empty ratings object
    const ratings = {
      received: [],
      given: []
    };

    // Find all completed applications where the user is either the volunteer or organization
    const applications = await Application.find({
      $or: [
        { volunteer: userId },
        { organization: userId }
      ],
      status: 'completed',
      'rating': { $exists: true, $ne: null } // Only get applications with ratings
    })
    .populate('opportunity', 'title')
    .populate('volunteer', 'name')
    .populate('organization', 'name')
    .lean();

    if (!applications || applications.length === 0) {
      return res.json({
        success: true,
        data: ratings
      });
    }

    // Process each application
    applications.forEach(app => {
      if (app.rating) {
        // If user is the volunteer and has received a rating
        if (app.volunteer._id.toString() === userId.toString() && app.rating.volunteerRating) {
          ratings.received.push({
            opportunity: app.opportunity,
            organization: app.organization,
            score: app.rating.volunteerRating.score,
            feedback: app.rating.volunteerRating.feedback,
            date: app.updatedAt
          });
        }
        
        // If user is the organization and has received a rating
        if (app.organization._id.toString() === userId.toString() && app.rating.organizationRating) {
          ratings.received.push({
            opportunity: app.opportunity,
            volunteer: app.volunteer,
            score: app.rating.organizationRating.score,
            feedback: app.rating.organizationRating.feedback,
            date: app.updatedAt
          });
        }

        // If user is the volunteer and has given a rating
        if (app.volunteer._id.toString() === userId.toString() && app.rating.organizationRating) {
          ratings.given.push({
            opportunity: app.opportunity,
            organization: app.organization,
            score: app.rating.organizationRating.score,
            feedback: app.rating.organizationRating.feedback,
            date: app.updatedAt
          });
        }

        // If user is the organization and has given a rating
        if (app.organization._id.toString() === userId.toString() && app.rating.volunteerRating) {
          ratings.given.push({
            opportunity: app.opportunity,
            volunteer: app.volunteer,
            score: app.rating.volunteerRating.score,
            feedback: app.rating.volunteerRating.feedback,
            date: app.updatedAt
          });
        }
      }
    });

    // Sort ratings by date
    ratings.received.sort((a, b) => new Date(b.date) - new Date(a.date));
    ratings.given.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: ratings
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching ratings'
    });
  }
});

router.get('/ratings/all', protect, admin, async (req, res) => {
  try {
    // Find all completed applications with ratings
    const applications = await Application.find({
      status: 'completed',
      'rating': { $exists: true, $ne: null }
    })
    .populate('opportunity', 'title')
    .populate('volunteer', 'name')
    .populate('organization', 'name')
    .lean();

    // Format ratings
    const allRatings = [];

    applications.forEach(app => {
      if (app.rating) {
        // Add volunteer rating if it exists
        if (app.rating.volunteerRating) {
          allRatings.push({
            opportunity: app.opportunity,
            volunteer: app.volunteer,
            organization: app.organization,
            score: app.rating.volunteerRating.score,
            feedback: app.rating.volunteerRating.feedback,
            date: app.updatedAt,
            type: 'Organization to Volunteer'
          });
        }

        // Add organization rating if it exists
        if (app.rating.organizationRating) {
          allRatings.push({
            opportunity: app.opportunity,
            volunteer: app.volunteer,
            organization: app.organization,
            score: app.rating.organizationRating.score,
            feedback: app.rating.organizationRating.feedback,
            date: app.updatedAt,
            type: 'Volunteer to Organization'
          });
        }
      }
    });

    // Sort ratings by date (newest first)
    allRatings.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: allRatings
    });
  } catch (error) {
    console.error('Error fetching all ratings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all ratings'
    });
  }
});

// Parameterized routes
router.get('/:id', getApplication);
router.put('/:id/status', updateApplicationStatus);
router.put('/:id/withdraw', withdrawApplication);
router.put('/:id/rate', rateApplication);
router.put('/:id/communication', updateCommunicationPreference);

export default router; 
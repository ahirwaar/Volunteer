import express from 'express';
import { protect, organization } from '../middleware/auth.middleware.js';
import Review from '../models/Review.model.js';
import Opportunity from '../models/Opportunity.model.js';

const router = express.Router();

// Create a review for a volunteer (organization only)
router.post('/', [protect, organization], async (req, res) => {
  try {
    const { volunteerId, opportunityId, rating, feedback } = req.body;

    // Validate required fields
    if (!volunteerId || !opportunityId || !rating || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: volunteerId, opportunityId, rating, feedback'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if the opportunity exists and belongs to the organization
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    if (opportunity.organization.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review volunteers for this opportunity'
      });
    }

    // Create the review
    const review = new Review({
      volunteer: volunteerId,
      organization: req.user.id,
      opportunity: opportunityId,
      rating,
      feedback
    });

    await review.save();

    // Populate the review with volunteer and organization details
    await review.populate([
      { path: 'volunteer', select: 'name email' },
      { path: 'organization', select: 'name email' },
      { path: 'opportunity', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this volunteer for this opportunity'
      });
    }

    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get reviews given by the organization
router.get('/my-reviews', [protect, organization], async (req, res) => {
  try {
    const reviews = await Review.find({ organization: req.user.id })
      .populate('volunteer', 'name email')
      .populate('opportunity', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get reviews for a specific opportunity
router.get('/opportunity/:opportunityId', [protect], async (req, res) => {
  try {
    const reviews = await Review.find({ opportunity: req.params.opportunityId })
      .populate('volunteer', 'name')
      .populate('organization', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching opportunity reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update a review (organization only)
router.put('/:id', [protect, organization], async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if the review belongs to the organization
    if (review.organization.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Update the review
    if (rating) review.rating = rating;
    if (feedback) review.feedback = feedback;
    await review.save();

    // Populate the updated review
    await review.populate([
      { path: 'volunteer', select: 'name email' },
      { path: 'organization', select: 'name email' },
      { path: 'opportunity', select: 'title' }
    ]);

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete a review (organization only)
router.delete('/:id', [protect, organization], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if the review belongs to the organization
    if (review.organization.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 
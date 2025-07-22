import express from 'express';
import { protect, organization } from '../middleware/auth.middleware.js';
import {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunitiesByOrganization,
  getMyOpportunities
} from '../controllers/opportunity.controller.js';

const router = express.Router();

// Public routes
router.get('/organization/:id', getOpportunitiesByOrganization);
router.get('/', getOpportunities);

// Protected organization routes
router.get('/my', protect, organization, getMyOpportunities);
router.post('/', protect, organization, createOpportunity);
router.put('/:id', protect, organization, updateOpportunity);
router.delete('/:id', protect, organization, deleteOpportunity);

// Public route for getting single opportunity
// Must be last to prevent conflicts with other routes
router.get('/:id', getOpportunity);

export default router;
import express from 'express';
import { body } from 'express-validator';
import { submitContactForm } from '../controllers/contact.controller.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('subject').trim().isLength({ min: 3 }).withMessage('Subject must be at least 3 characters'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    body('userType').isIn(['volunteer', 'organization', 'other']).withMessage('Invalid user type')
  ],
  submitContactForm
);

export default router; 
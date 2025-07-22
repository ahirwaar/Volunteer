import { validationResult } from 'express-validator';
import Application from '../models/Application.model.js';
import Opportunity from '../models/Opportunity.model.js';
import User from '../models/User.model.js';
import sendEmail from '../utils/sendEmail.js';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create new application
// @route   POST /api/applications
// @access  Private (Volunteers only)
export const createApplication = async (req, res) => {
  try {
    // Check if user is a volunteer
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteers can apply for opportunities'
      });
    }

    const { opportunity: opportunityId, applicationMessage } = req.body;

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if opportunity is still open
    if (!opportunity.isOpen()) {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is no longer accepting applications'
      });
    }

    // Get application counts for this opportunity
    const [pendingCount, acceptedCount] = await Promise.all([
      Application.countDocuments({
        opportunity: opportunityId,
        status: 'pending'
      }),
      Application.countDocuments({
        opportunity: opportunityId,
        status: 'accepted'
      })
    ]);

    const totalApplications = pendingCount + acceptedCount;
    const spotsLeft = opportunity.volunteersNeeded - acceptedCount;

    // Check if maximum volunteers limit is reached (including pending applications)
    if (totalApplications >= opportunity.volunteersNeeded) {
      return res.status(400).json({
        success: false,
        message: `This opportunity has reached its maximum limit of ${opportunity.volunteersNeeded} volunteer${opportunity.volunteersNeeded > 1 ? 's' : ''}`
      });
    }

    // Additional check for spots left (excluding pending)
    if (spotsLeft <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No spots available for this opportunity'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      opportunity: opportunityId,
      volunteer: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this opportunity'
      });
    }

    // Create application with simplified fields
    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: req.user._id,
      organization: opportunity.organization,
      applicationMessage,
      status: 'pending'
    });

    // Populate application with opportunity and user details
    await application.populate([
      { path: 'opportunity', select: 'title organization' },
      { path: 'volunteer', select: 'name email phone' },
      { path: 'organization', select: 'name email' }
    ]);

    // Send notification email to organization
    try {
      // Send to organization
      await sendEmail({
        to: application.organization.email,
        subject: 'New Volunteer Application',
        text: `
Dear ${application.organization.name},

A new volunteer has applied for your opportunity "${application.opportunity.title}".

Volunteer Details:
- Name: ${application.volunteer.name}
- Email: ${application.volunteer.email}
- Phone: ${application.volunteer.phone || 'Not provided'}

${applicationMessage ? `\nMessage from volunteer:\n${applicationMessage}` : ''}

You can review this application in your organization dashboard.

Best regards,
The Volunteer Connect Team
        `
      });

      // Send to admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL, // Make sure to add ADMIN_EMAIL to your .env file
        subject: 'New Application Notification - Admin',
        text: `
New Application Details:

Opportunity: ${application.opportunity.title}
Organization: ${application.organization.name}
Volunteer: ${application.volunteer.name} (${application.volunteer.email})
Status: ${application.status}

${applicationMessage ? `\nVolunteer's Message:\n${applicationMessage}` : ''}

You can review this application in the admin dashboard.

Best regards,
The Volunteer Connect Team
        `
      });
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating application'
    });
  }
};

// @desc    Get all applications for logged in user
// @route   GET /api/applications
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const query = req.user.role === 'volunteer' 
      ? { volunteer: req.user._id }
      : { organization: req.user._id };

    const applications = await Application.find(query)
      .populate('opportunity', 'title organization')
      .populate('volunteer', 'name email phone')
      .populate('organization', 'name email organizationProfile')
      .sort('-createdAt');

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching applications'
    });
  }
};

// @desc    Get applications for organization
// @route   GET /api/applications/organization
// @access  Private (Organizations only)
export const getOrganizationApplications = async (req, res) => {
  try {
    // Check if user is authenticated and is an organization
    if (!req.user || req.user.role !== 'organization') {
      return res.status(403).json({
        success: false,
        message: 'Only organizations can access this endpoint'
      });
    }

    const { status, opportunityId } = req.query;
    let query = { organization: req.user._id }; // Use the authenticated user's ID

    if (status) {
      query.status = status;
    }

    if (opportunityId) {
      // Validate opportunityId if provided
      if (!isValidObjectId(opportunityId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid opportunity ID format'
        });
      }
      query.opportunity = opportunityId;
    }

    const applications = await Application.find(query)
      .populate('opportunity', 'title category location schedule')
      .populate('volunteer', 'name email phone volunteerProfile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get organization applications error:', error);
    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format in query parameters'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications. Please try again later.'
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private (Application owner or organization)
export const getApplication = async (req, res) => {
  try {
    // Validate ID format first
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID format'
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('opportunity')
      .populate('volunteer', 'name email phone volunteerProfile')
      .populate('organization', 'name email organizationProfile');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user has access to this application
    const hasAccess = 
      application.volunteer._id.toString() === req.user._id.toString() ||
      application.organization._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application. Please try again later.'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin or Organization)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const application = await Application.findById(req.params.id)
      .populate('opportunity')
      .populate('volunteer', 'name email phone')
      .populate('organization', 'name email');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user has permission to update
    const hasPermission = 
      req.user.role === 'admin' || 
      (req.user.role === 'organization' && application.organization._id.toString() === req.user._id.toString());

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application status
    application.status = status;
    application.reviewedAt = Date.now();
    application.reviewedBy = req.user._id;

    await application.save();

    // Try to send email notification if SMTP is configured
    if (process.env.SMTP_HOST || process.env.NODE_ENV !== 'production') {
      try {
        await sendEmail({
          to: application.volunteer.email,
          subject: `Your application for ${application.opportunity.title} has been ${status}`,
          text: `Dear ${application.volunteer.name},

Your application for the volunteer opportunity "${application.opportunity.title}" has been ${status} by ${application.organization.name}.

${status === 'accepted' 
  ? `We're excited to inform you that your application for the volunteer opportunity has been accepted!

Thank you for your willingness to contribute—your support means a lot. We'll be sharing further details soon, including the schedule and next steps. Check the website.

If you have any questions in the meantime, feel free to reach out.`
  : status === 'completed'
  ? 'Thank you for your valuable contribution! You can now rate your experience with the organization.'
  : 'Thank you for your interest. We encourage you to apply for other opportunities that match your skills and interests.'
}

Best regards,
The Volunteer Connect Team`
        });

        // If status is completed, also notify organization about rating
        if (status === 'completed') {
          await sendEmail({
            to: application.organization.email,
            subject: `Volunteer work completed for ${application.opportunity.title}`,
            text: `Dear ${application.organization.name},

The volunteer work for "${application.opportunity.title}" has been marked as completed.

You can now rate your experience with the volunteer ${application.volunteer.name}.
Please log in to your dashboard to provide your feedback.

Best regards,
The Volunteer Connect Team`
          });
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating application status'
    });
  }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Volunteers only)
export const withdrawApplication = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteers can withdraw applications'
      });
    }

    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if volunteer owns this application
    if (application.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Can only withdraw pending applications
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending applications'
      });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Rate application (after completion)
// @route   PUT /api/applications/:id/rate
// @access  Private (Volunteer or Organization)
export const rateApplication = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if application is completed
    if (application.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed applications'
      });
    }

    // Check user authorization and determine rating type
    let ratingField;
    if (application.volunteer.toString() === req.user._id.toString()) {
      ratingField = 'rating.organizationRating';
    } else if (application.organization.toString() === req.user._id.toString()) {
      ratingField = 'rating.volunteerRating';
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this application'
      });
    }

    // Update rating
    const updateData = {};
    updateData[`${ratingField}.score`] = score;
    updateData[`${ratingField}.feedback`] = feedback;

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedApplication
    });
  } catch (error) {
    console.error('Rate application error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Application owner only)
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns this application
    if (application.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    // Only allow deletion of pending applications
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending applications'
      });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications/all
// @access  Private (Admin only)
export const getAllApplications = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only endpoint'
      });
    }

    const applications = await Application.find()
      .populate('opportunity', 'title category status')
      .populate('volunteer', 'name email phone')
      .populate('organization', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching applications'
    });
  }
};

// @desc    Update communication preference
// @route   PUT /api/applications/:id/communication
// @access  Private (Volunteer or Organization)
export const updateCommunicationPreference = async (req, res) => {
  try {
    const { communicationPreference } = req.body;

    // Validate preference
    if (!['email', 'phone', 'platform', 'sms'].includes(communicationPreference)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid communication preference'
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('volunteer', 'name email phone')
      .populate('organization', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user has permission to update
    const isVolunteer = application.volunteer._id.toString() === req.user._id.toString();
    const isOrganization = application.organization._id.toString() === req.user._id.toString();

    if (!isVolunteer && !isOrganization) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update communication preference
    application.communicationPreference = communicationPreference;
    await application.save();

    // Send email notification about communication preference change
    try {
      await sendEmail({
        to: isVolunteer ? application.organization.email : application.volunteer.email,
        subject: 'Communication Preference Updated',
        text: `
Dear ${isVolunteer ? application.organization.name : application.volunteer.name},

The preferred communication method for the volunteer opportunity "${application.opportunity.title}" has been updated to ${communicationPreference}.

Please use this method for future communications.

Best regards,
The Volunteer Connect Team
        `
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Update communication preference error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating communication preference'
    });
  }
}; 
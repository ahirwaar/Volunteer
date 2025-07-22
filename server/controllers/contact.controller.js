import { validationResult } from 'express-validator';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message, userType } = req.body;

    // Send email to the specified admin email
    try {
      await sendEmail({
        to: 'pankajahirwar571@gmail.com',
        subject: `Contact Form: ${subject}`,
        text: `
New Contact Form Submission

From: ${name} (${email})
User Type: ${userType}
Subject: ${subject}

Message:
${message}

---
This message was sent from the Volunteer Connect contact form.
Reply directly to this email to respond to the sender.
        `
      });

      // Also send a confirmation email to the sender
      await sendEmail({
        to: email,
        subject: 'Thank you for contacting us!',
        text: `
Dear ${name},

Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.

Your message:
Subject: ${subject}
Message: ${message}

We typically respond within 24-48 hours. If you have an urgent matter, please feel free to reach out to us directly.

Best regards,
The Volunteer Connect Team
        `
      });

      res.json({
        success: true,
        message: 'Message sent successfully! We will get back to you soon.'
      });

    } catch (emailError) {
      console.error('Error sending contact email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
}; 
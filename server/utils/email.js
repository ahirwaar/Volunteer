import nodemailer from 'nodemailer';

/**
 * Send an email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email text content
 * @param {string} [options.html] - Optional HTML content
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create a test account if we're in development
    let testAccount;
    if (process.env.NODE_ENV !== 'production') {
      testAccount = await nodemailer.createTestAccount();
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || testAccount?.user,
        pass: process.env.SMTP_PASS || testAccount?.pass
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Volunteer Connect" <noreply@volunteerconnect.com>',
      to,
      subject,
      text,
      html: html || text
    });

    // Log email URL in development
    if (process.env.NODE_ENV !== 'production' && testAccount) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
}; 
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    let transporter;

    // Check if we have Gmail credentials
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('Using Gmail SMTP with user:', process.env.EMAIL_USER);
      // Gmail configuration
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else if (process.env.NODE_ENV === 'development') {
      // Create a test account
      const testAccount = await nodemailer.createTestAccount();
      
      // Create transporter with test credentials
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('Test email account created:', testAccount.user);
    }

    // Fallback if no transporter was created
    if (!transporter) {
      throw new Error('Email transporter not configured. Please check your environment variables.');
    }

    // Prepare email data
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"MERN Auth" <noreply@mernauth.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasText: !!mailOptions.text,
      hasHtml: !!mailOptions.html,
      textLength: mailOptions.text ? mailOptions.text.length : 0
    });

    // Send mail
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    
    // Preview URL for Ethereal (test emails only)
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } else {
      console.log('Real email sent to:', options.to);
    }

    return info;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
};

export default sendEmail; 
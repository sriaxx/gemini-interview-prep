
const nodemailer = require('nodemailer');

// In a production environment, you would use a real email service
// For development, we'll create a simple implementation
const sendConfirmationEmail = async (email, token) => {
  try {
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_SERVICE) {
      // In development, just log instead of sending email
      console.log(`
        =============== CONFIRMATION EMAIL ===============
        To: ${email}
        Subject: Confirm your email address
        Body: 
          Please confirm your email address by clicking this link:
          ${process.env.CLIENT_URL || 'http://localhost:5173'}/confirm-email/${token}
        =================================================
      `);
      return;
    }

    // Real implementation would go here
    // Using a service like SendGrid, AWS SES, etc.
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

module.exports = { sendConfirmationEmail };

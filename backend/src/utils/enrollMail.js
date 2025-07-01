import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // Use service instead of host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Additional security options
  tls: {
    rejectUnauthorized: false
  }
});

// Test connection function
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server connection successful');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return false;
  }
};
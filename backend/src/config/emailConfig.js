import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Debug: Log environment variables
console.log('Email Config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD ? 'Password is set' : 'Password is missing'
});

// Create reusable transporter
export const createTransporter = () => {
  const config = {
    service: 'gmail',  // Use Gmail service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  console.log('Creating transporter with config:', {
    ...config,
    auth: {
      ...config.auth,
      pass: config.auth.pass ? 'Password is set' : 'Password is missing'
    }
  });

  return nodemailer.createTransport(config);
};
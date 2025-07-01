import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

class EmailService {
  /**
   * Send candidate registration email
   */
  async sendCandidateRegistrationEmail(candidate) {
    const mailOptions = {
      from: "V-Accel IRMS <noreply@v-accel.com>",
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Candidate Registration Successful',
      html: this.generateRegistrationEmailTemplate(candidate)
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Registration email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Registration email failed:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: "V-Accel IRMS <noreply@v-accel.com>",
      to: user.email,
      subject: 'Password Reset Request',
      html: this.generatePasswordResetTemplate(user.name, resetUrl)
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Password reset email failed:', error);
      throw error;
    }
  }

  /**
   * Send interview reminder email
   */
  async sendInterviewReminder(candidate, interview) {
    const mailOptions = {
      from: "V-Accel IRMS <noreply@v-accel.com>",
      to: candidate.email,
      subject: 'Interview Reminder',
      html: this.generateInterviewReminderTemplate(candidate, interview)
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Interview reminder sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Interview reminder failed:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder email
   */
  async sendPaymentReminder(candidate, paymentDetails) {
    const mailOptions = {
      from: "V-Accel IRMS <noreply@v-accel.com>",
      to: candidate.email,
      subject: 'Payment Reminder',
      html: this.generatePaymentReminderTemplate(candidate, paymentDetails)
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Payment reminder sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Payment reminder failed:', error);
      throw error;
    }
  }

  /**
   * Generate registration email template
   */
  generateRegistrationEmailTemplate(candidate) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 15px;">🎉 Candidate Registration Successful</h2>
          <p style="color: #34495e; line-height: 1.6;">Dear Admin,</p>
          <p style="color: #34495e; line-height: 1.6;">A new candidate has been successfully registered in the IRMS system.</p>
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Candidate Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Candidate ID:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${candidate.candidateId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Full Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${candidate.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${candidate.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Phone:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${candidate.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Category:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${candidate.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Joining Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${new Date(candidate.joiningDate).toLocaleDateString('en-GB')}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #2d5a2d; margin: 0; font-weight: bold;">✅ Registration completed successfully!</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            This is an automated message from V-Accel IRMS. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Generate password reset email template
   */
  generatePasswordResetTemplate(userName, resetUrl) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 15px;">🔐 Password Reset Request</h2>
          <p style="color: #34495e; line-height: 1.6;">Dear ${userName},</p>
          <p style="color: #34495e; line-height: 1.6;">We received a request to reset your password for your V-Accel IRMS account.</p>
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
          <p style="color: #6c757d; font-size: 14px; margin-top: 15px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            ⚠️ This link will expire in 1 hour for security reasons.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Generate interview reminder template
   */
  generateInterviewReminderTemplate(candidate, interview) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 15px;">📅 Interview Reminder</h2>
          <p style="color: #34495e; line-height: 1.6;">Dear ${candidate.fullName},</p>
          <p style="color: #34495e; line-height: 1.6;">This is a reminder about your upcoming interview.</p>
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Interview Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Company:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${interview.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Date & Time:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${new Date(interview.interviewDateTime).toLocaleString('en-GB')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Domain:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${interview.domain}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Level:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${interview.interviewLevel}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #2d5a2d; margin: 0; font-weight: bold;">🎯 Good luck with your interview!</p>
        </div>
      </div>
    `;
  }

  /**
   * Generate payment reminder template
   */
  generatePaymentReminderTemplate(candidate, paymentDetails) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 15px;">💰 Payment Reminder</h2>
          <p style="color: #34495e; line-height: 1.6;">Dear ${candidate.fullName},</p>
          <p style="color: #34495e; line-height: 1.6;">This is a friendly reminder about your pending payment.</p>
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">📊 Payment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Amount Due:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">₹${paymentDetails.amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Due Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${new Date(paymentDetails.dueDate).toLocaleDateString('en-GB')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">Payment Type:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #495057;">${paymentDetails.type}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #856404; margin: 0; font-weight: bold;">⚠️ Please ensure timely payment to avoid any service interruptions.</p>
        </div>
      </div>
    `;
  }
}

// Export singleton instance
const emailService = new EmailService();

// Export individual functions for backward compatibility
export const sendCandidateRegistrationEmail = (candidate) => 
  emailService.sendCandidateRegistrationEmail(candidate);

export const sendPasswordResetEmail = (user, resetToken) => 
  emailService.sendPasswordResetEmail(user, resetToken);

export const sendInterviewReminder = (candidate, interview) => 
  emailService.sendInterviewReminder(candidate, interview);

export const sendPaymentReminder = (candidate, paymentDetails) => 
  emailService.sendPaymentReminder(candidate, paymentDetails);

export default emailService; 
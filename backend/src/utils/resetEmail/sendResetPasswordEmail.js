// import { createTransporter } from '../../config/emailConfig.js';
// import crypto from 'crypto';
// import User from '../../models/auth.model.js';
// import bcryptjs from 'bcryptjs';

// export const sendResetPasswordEmail = async (email, otp) => {
//   try {
//     console.log('Attempting to send login OTP to:', email);
//     console.log('OTP:', otp);
    
//     const transporter = createTransporter();
//     console.log('Transporter created successfully');

//     const mailOptions = {
//       from: `"${process.env.COMPANY_NAME}">`,
//       to: `${process.env.EMAIL_USER}`,
//       subject: 'Login OTP', 
//       html: getLoginOTPTemplate(otp),
//     };

//     console.log('Mail options:', {
//       ...mailOptions,
//       from: mailOptions.from,
//       to: mailOptions.to
//     });

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully:', info);
//     return info;
//   } catch (error) {
//     console.error('Detailed error in sendResetPasswordEmail:', error);
//     throw new Error('Failed to send login OTP email');
//   }
// };

// // Email Templates
// const getLoginOTPTemplate = (otp) => {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <style>
//         .email-container {
//           max-width: 600px;
//           margin: 0 auto;
//           font-family: Arial, sans-serif;
//           line-height: 1.6;
//           color: #333333;
//         }
//         .header {
//           background-color: #f8f9fa;
//           padding: 20px;
//           text-align: center;
//           border-bottom: 3px solid #dee2e6;
//         }
//         .content {
//           padding: 20px;
//           background-color: #ffffff;
//         }
//         .otp-box {
//           background-color: #f8f9fa;
//           padding: 15px;
//           border-radius: 5px;
//           text-align: center;
//           font-size: 24px;
//           font-weight: bold;
//           margin: 20px 0;
//           letter-spacing: 5px;
//         }
//         .footer {
//           text-align: center;
//           padding: 20px;
//           font-size: 12px;
//           color: #6c757d;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="email-container">
//         <div class="header">
//           <h2>${process.env.COMPANY_NAME || 'Company'} Login OTP</h2>
//         </div>
//         <div class="content">
//           <p>Hello,</p>
//           <p>We received a login request for your account. If you didn't make this request, you can ignore this email.</p>
//           <p>Your One-Time Password (OTP) for login is:</p>
//           <div class="otp-box">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes for security reasons.</p>
//           <p>Best regards,<br>The ${process.env.COMPANY_NAME || 'Company'} Team</p>
//         </div>
//         <div class="footer">
//           <p>This is an automated message, please do not reply to this email.</p>
//           <p>&copy; ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'Company'}. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// export const forgetPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(404).json({ message: "No user found with this email address" });
//       return;
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // Save OTP to user
//     user.resetOTP = otp;
//     user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
//     await user.save();

//     // Send email with OTP
//     await sendResetPasswordEmail(user.email, otp);
  
//     res.json({
//       message: "Password reset OTP sent to email",
//       ...(process.env.NODE_ENV === "development" && { otp }),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     const { email, otp, password } = req.body;

//     const user = await User.findOne({
//       email,
//       resetOTP: otp,
//       resetOTPExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     // Hash new password & update
//     user.password = await bcryptjs.hash(password, 10);
//     user.resetOTP = undefined;
//     user.resetOTPExpires = undefined;

//     await user.save();

//     res.json({ success: true, message: "Password updated successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
import { createTransporter } from '../../config/emailConfig.js';
import crypto from 'crypto';
import User from '../../models/auth.model.js';
import bcryptjs from 'bcryptjs';

// Send email with reset link
export const sendResetPasswordEmail = async (email, resetToken, userName) => {
  try {
    console.log('Attempting to send password reset email to:', email);
    console.log('Reset token:', resetToken);

    const transporter = createTransporter();
    console.log('Transporter created successfully');

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'IRMS'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: getPasswordResetTemplate(resetUrl, userName),
    };

    console.log('Mail options:', {
      ...mailOptions,
      from: mailOptions.from,
      to: mailOptions.to
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Detailed error in sendResetPasswordEmail:', error);
    throw new Error('Failed to send password reset email');
  }
};

// HTML Email Template for Password Reset
const getPasswordResetTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
          color: white;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 30px;
          background-color: #ffffff;
          border: 1px solid #e9ecef;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .reset-link {
          word-break: break-all;
          color: #667eea;
          text-decoration: none;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #6c757d;
          background-color: #f8f9fa;
          border-radius: 0 0 8px 8px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>🔐 Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Hello ${userName || 'there'},</p>
          <p>We received a request to reset your password for your IRMS account. If you didn't make this request, you can safely ignore this email.</p>
          
          <p>To reset your password, click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">
              Reset Password
            </a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}" class="reset-link">${resetUrl}</a></p>
          
          <div class="warning">
            <p><strong>⚠️ Security Notice:</strong></p>
            <ul>
              <li>This link will expire in 1 hour for security reasons</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>Best regards,<br>The IRMS Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} IRMS. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};



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

// Send email with OTP
export const sendResetPasswordEmail = async (email, otp, userName) => {
  try {
    console.log('Attempting to send login OTP to:', email);
    console.log('OTP:', otp);

    const transporter = createTransporter();
    console.log('Transporter created successfully');

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER || email, // Send to admin or fallback to user email
      subject: 'Super Admin OTP for Password Reset',
      html: getLoginOTPTemplate(otp, userName, email),
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
    throw new Error('Failed to send login OTP email');
  }
};

// HTML Email Template
const getLoginOTPTemplate = (otp, userName, userEmail) => {
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
      background-color: #f0f4f8;
      padding: 20px;
      text-align: center;
      border-bottom: 3px solid #dee2e6;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .otp-box {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      margin: 20px 0;
      letter-spacing: 5px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #6c757d;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>V-ACCEL AI DYNAMIC - Password Reset Request</h2>
    </div>
    <div class="content">
      <p>Hello Super Admin,</p>
      <p>A user has requested a password reset through the V-ACCEL AI DYNAMIC system. Below are the details:</p>

      <ul>
       
        <li><strong>User Email:</strong> ${userEmail}</li>
        <li><strong>Request Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</li>
      </ul>

      <p>To process this request, please use the OTP provided below to log in as Super Admin and reset the password manually:</p>

      <div class="otp-box">
        ${otp}
      </div>

      <p>This OTP is valid for the next <strong>10 minutes</strong>.</p>

      <p>Best regards,<br/>V-ACCEL AI DYNAMIC System</p>
    </div>
    <div class="footer">
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} V-ACCEL AI DYNAMIC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Controller to initiate password reset
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "No user found with this email address" });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendResetPasswordEmail(user.email, otp, user.name);

    res.json({
      message: "Password reset OTP sent to email",
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    next(error);
  }
};

// Controller to reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = await bcryptjs.hash(password, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

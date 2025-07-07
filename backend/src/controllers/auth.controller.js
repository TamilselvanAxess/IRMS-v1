import bcryptjs from 'bcryptjs';
import User from '../models/auth.model.js';
import { storeToken } from '../config/calendarConfig.js';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../utils/resetEmail/sendResetPasswordEmail.js';






// const COOKIE_OPTIONS = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
// };

// const COOKIE_OPTIONS = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production", // true in prod, false in dev
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   domain: process.env.NODE_ENV === "production" ? "bd-candidates-frontend-wx2e.onrender.com" : undefined,
//   path: "/",
//   maxAge: 24 * 60 * 60 * 1000, // 1 day
// };

// register

// export const addUser = async (req, res, next) => {
//   try {
//     const {fullName, email, password,role,isActive,isVerified } = req.body;

//     console.log("req.body",req.body);
    
//     // Check if email already exists
//     const existingUser = await User.findOne({ email }); 
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email already registered" });
//     }
//     const newUser = new User({ fullName, email, password,role,isActive,isVerified });
//     await newUser.save();
//     res.status(201).json({ message: 'User added successfully' });
//   } catch (error) {
//     next(error);
//   }
// };


export const addUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role, isActive, isVerified } = req.body;
    const currentUser = req.user; // from authenticate middleware

    const emailLower = email.toLowerCase();
    console.log("req.body", req.body);
    console.log("currentUser", currentUser);

    // Check if the current user is not a superadmin and trying to create an admin or superadmin
    if (
      currentUser.role !== 'superadmin' &&
      (role === 'admin' || role === 'superadmin')
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const newUser = new User({ fullName, email: emailLower, password, role, isActive, isVerified });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully' });

  } catch (error) {
    next(error);
  }
};


//login


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();
    console.log('email', emailLower);
    console.log('password', password);
    const user = await User.findOne({ email: emailLower });
    console.log('user', user);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'User is inactive. Please contact administrator.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = user.generateAuthToken();
    // res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ message: 'Login successful', user, token });
  } catch (error) {
    next(error);
  }
};

//register

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role, isActive, isVerified } = req.body;
    const emailLower = email.toLowerCase();
        // Check if email already exists
        const existingUser = await User.findOne({ email: emailLower });
        if (existingUser) {
          return res.status(400).json({ success: false, message: "Email already registered" });
        }
    const newUser = new User({ fullName, email: emailLower, password, role, isActive, isVerified });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
    try {
        // Clear the token cookie
        // res.cookie("token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
        res.json({ message: "Logged out successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error logging out" });
      }
};

// OTP Login
export const loginWithOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const emailLower = email.toLowerCase();
    console.log('OTP login attempt:', { email, otp });

    // First check if user exists
    const userByEmail = await User.findOne({ email: emailLower });
    if (!userByEmail) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Then check OTP
    const user = await User.findOne({
      email: emailLower,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'User is inactive. Please contact administrator.' });
    }

    // Generate token without clearing OTP
    const token = user.generateAuthToken();
    res.json({ message: 'Login successful', user, token });
  } catch (error) {
    next(error);
  }
};

// Forget Password (Send Reset Token)
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailLower = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      res.status(404).json({ message: "No user found with this email address" });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Save hashed token to user
    await User.findOneAndUpdate(
      { email: emailLower },
      {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      },
      { new: true }
    );

    // Send email with reset link
    await sendResetPasswordEmail(user.email, resetToken, user.fullName);
  
    res.json({
      message: "Password reset link sent to email",
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    next(error);
  }
};

//current user

export const currentUser = async (req, res,next) => {
  try {
    const userId = req.user.id;
    console.log("userId",userId);
    const user = await User.findById(userId);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};


// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the received token and match with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash new password & update
    const hashedPassword = await bcryptjs.hash(password, 10);
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordTokenExpires: undefined
      }
    );

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//

export const changePassword = async (req, res,next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id; // Extracted from the authentication middleware
  
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Compare old password
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Incorrect old password" });
      }
  
      // Hash & update new password
      user.password = newPassword;
      await user.save();
  
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  };


  //delete user

  // export const deleteUser = async (req, res, next) => {
  //   try {
  //     const { userId } = req.params;
  
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(400).json({ success: false, message: "User not found" });
  //     }
  
  //     if (user.isActive) {
  //       return res.status(403).json({ success: false, message: "Active users cannot be deleted" });
  //     }
  
  //     await User.findByIdAndDelete(userId);
  //     res.json({ success: true, message: "User deleted successfully" });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  

  export const deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const currentUser = req.user; // from authenticate middleware
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      // Prevent deletion of active users
      if (user.isActive) {
        return res.status(403).json({ success: false, message: "Active users cannot be deleted" });
      }
  
      // Admin cannot delete other admins or superadmins
      if (
        currentUser.role !== 'superadmin' &&
        (user.role === 'admin' || user.role === 'superadmin')
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
  
      await User.findByIdAndDelete(userId);
      res.json({ success: true, message: "User deleted successfully" });
  
    } catch (error) {
      next(error);
    }
  };
  

  //get all users

  export const getAllUsers = async (req, res,next) => {
    try {
      const users = await User.find();
      res.json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };



  //get user by id  

  export const getUserById = async (req, res,next) => {
    try {
      const { userId } = req.params;    

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, user });    
    } catch (error) {
      next(error);
    }
  };

  //update user
  

  // export const updateUser = async (req, res, next) => {
  //   try {
  //     const { userId } = req.params;    
  //     const { fullName, role, isActive } = req.body;
  
  //     const updatedFields = { fullName, role, isActive };

  //       // Prevent superAdmin from deactivating themselves
  //   if (req.user.id === userId && isActive === false) {
  //     return res.json({
  //       success: false,
  //       message: "SuperAdmin cannot deactivate their own account",
  //     });
  //   }
  
  //     const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
  
  //     if (!user) {
  //       return res.status(400).json({ success: false, message: "User not found" });
  //     }
  
  //     res.json({ success: true, message: "User updated successfully", user });
  //   } catch (error) {
  //     next(error);
  //   }
  // };


  export const updateUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { fullName, role, isActive } = req.body;
      const currentUser = req.user; // from authenticate middleware
  
      // Fetch target user from DB
      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      // Prevent users from deactivating themselves
      if (currentUser.id === userId && isActive === false) {
        return res.status(403).json({
          success: false,
          message: "You cannot deactivate your own account",
        });
      }
  
      // Admins cannot update users with role admin or superadmin
      if (
        currentUser.role !== 'superadmin' &&
        (targetUser.role === 'admin' || targetUser.role === 'superadmin')
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
  
      // Proceed to update
      const updatedFields = { fullName, role, isActive };
      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
  
      res.json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  };
  


  //change user status

  export const changeUserStatus = async (req, res,next) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;    

      const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      } 

      res.json({ success: true, message: "User status changed successfully" });
    } catch (error) {
      next(error);
    }
  };    

  //change user password

  export const changeUserPassword = async (req, res,next) => {
    try {
      const { userId } = req.params;
      const { password } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
      console.log('password',password);
      
       if(password){
        user.password = password;
        await user.save();
       }
    
      res.json({ success: true, message: "User password changed successfully" , user });
    }
    catch (error) {
      next(error);
    }
  }

  //verify email

  export const verifyEmail = async (req, res,next) => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
      }

      user.isVerified = true;
      await user.save();    

      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  };

  //resend verification email

  export const resendVerificationEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const emailLower = email.toLowerCase();
      const user = await User.findOne({ email: emailLower });
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }     

      if (user.isVerified) {
        return res.status(400).json({ success: false, message: "User already verified" });
      }

      const verificationToken = crypto.randomBytes(32).toString("hex"); 
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      let verificationURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;  
      
      if(process.env.NODE_ENV === 'production' ){
        verificationURL = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;
      }

      await sendVerificationEmail(user.email, verificationURL);

      res.json({ success: true, message: "Verification email sent" });
    } catch (error) {
        next(error);
    }
  };






export const googleRedirect = async (req, res) => {
  try {
    const { code } = req.query;

    console.log("code",code);
    
    if (!code) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Authorization code is missing' 
      });
    }
    
    // Store the token
    await storeToken(code);
    
    // Return success response
    return res.status(200).json({ 
      status: 'success', 
      message: 'Google Calendar authorization successful! You can now close this window.' 
    });
  } catch (error) {
    console.error('Error handling Google redirect:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to process authentication' 
    });
  }
};




        

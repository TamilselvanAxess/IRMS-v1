import express from 'express';
import { 
  login, 
  register, 
  logout, 
  forgetPassword, 
  resetPassword,
  loginWithOTP,
  currentUser,
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  changeUserStatus,
  changeUserPassword,
  verifyEmail,
  resendVerificationEmail,
  googleRedirect
} from '../controllers/auth.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/login-with-otp', loginWithOTP);
router.post('/register', register);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/current-user', authenticate, currentUser);

// User management routes
router.post('/add-user', authenticate, authorizeRoles('superadmin', 'admin'), addUser);
router.delete('/delete-user/:userId', authenticate, authorizeRoles('superadmin', 'admin'), deleteUser);
router.get('/get-all-users', authenticate, getAllUsers);
router.get('/get-user/:userId', authenticate, getUserById);
router.put('/update-user/:userId', authenticate, updateUser);
router.put('/change-user-status/:userId', authenticate, authorizeRoles('superadmin', 'admin'), changeUserStatus);
router.put('/change-user-password/:userId', authenticate, changeUserPassword);

// Email verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);

// Google Calendar routes
router.get('/google/redirect', googleRedirect);

export default router;
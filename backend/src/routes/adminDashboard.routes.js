import { Router } from 'express';
import verifyToken, { authorizeRoles } from '../middlewares/authMiddleware.js';
import { 
  getDashboardSummary, 
  getDailyAnalytics, 
  getCategoryStats, 
  getCourseStats 
} from '../controllers/analyticsController.js';

const router = Router();

// Analytics routes
router.get('/dashboard-summary', verifyToken, getDashboardSummary);
router.get('/daily', verifyToken, getDailyAnalytics);
router.get('/categories', verifyToken, getCategoryStats);
router.get('/courses', verifyToken, getCourseStats);

export default router;

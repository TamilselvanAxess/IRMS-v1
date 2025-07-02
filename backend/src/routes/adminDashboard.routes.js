import { Router } from 'express';
import verifyToken, { authorizeRoles } from '../middlewares/authMiddleware.js';
import { 
  getDashboardSummary, 
  getDailyAnalytics, 
  getCategoryStats, 
  getCourseStats, 
  getWeeklyAnalytics 
} from '../controllers/analyticsController.js';

const router = Router();

// Analytics routes
router.get('/dashboard-summary', verifyToken, getDashboardSummary);
router.get('/daily', verifyToken, getDailyAnalytics);
router.get('/categories', verifyToken, getCategoryStats);
router.get('/courses', verifyToken, getCourseStats);
router.get('/weekly', verifyToken, getWeeklyAnalytics);

export default router;

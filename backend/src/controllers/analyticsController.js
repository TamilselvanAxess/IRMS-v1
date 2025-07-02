import analyticsService from '../services/analyticsService.js';

/**
 * @desc    Get dashboard summary
 * @route   GET /api/analytics/dashboard-summary
 * @access  Private
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await analyticsService.getDashboardSummary();

    res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get daily analytics
 * @route   GET /api/analytics/daily
 * @access  Private
 */
export const getDailyAnalytics = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    
    const analytics = await analyticsService.getDailyAnalytics(parseInt(days));

    res.status(200).json({
      success: true,
      message: 'Daily analytics retrieved successfully',
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category statistics
 * @route   GET /api/analytics/categories
 * @access  Private
 */
export const getCategoryStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getCategoryStats();

    res.status(200).json({
      success: true,
      message: 'Category statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get course statistics
 * @route   GET /api/analytics/courses
 * @access  Private
 */
export const getCourseStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getCourseStats();

    res.status(200).json({
      success: true,
      message: 'Course statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get weekly analytics
 * @route   GET /api/analytics/weekly
 * @access  Private
 */
export const getWeeklyAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getWeeklyAnalytics();
    res.status(200).json({
      success: true,
      message: 'Weekly analytics retrieved successfully',
      weeklyData: analytics
    });
  } catch (error) {
    next(error);
  }
}; 
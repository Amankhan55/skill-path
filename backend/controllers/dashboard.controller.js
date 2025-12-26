const { getDashboardMetrics } = require('../services/dashboard.service');

/**
 * @desc    Get dashboard metrics
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const targetRoleId = req.user.targetRoleId;

    if (!targetRoleId) {
      return res.status(400).json({
        success: false,
        message: 'Please set a target role first to view dashboard'
      });
    }

    const metrics = await getDashboardMetrics(userId, targetRoleId);

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard
};


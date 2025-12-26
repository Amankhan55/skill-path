const { calculateReadinessScore, calculateProgressVelocity } = require('../services/readinessScore.service');
const Role = require('../models/Role');

/**
 * @desc    Get readiness score for current user
 * @route   GET /api/readiness
 * @access  Private
 */
const getReadinessScore = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const targetRoleId = req.params.roleId || req.user.targetRoleId;

    if (!targetRoleId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a role ID or set a target role first'
      });
    }

    // Get role info
    const role = await Role.findById(targetRoleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Target role not found'
      });
    }

    // Calculate readiness
    const readiness = await calculateReadinessScore(userId, targetRoleId);

    // Calculate progress velocity
    const velocity = await calculateProgressVelocity(userId, 3);

    res.json({
      success: true,
      data: {
        userId,
        targetRole: role,
        ...readiness,
        progressVelocity: velocity
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReadinessScore
};


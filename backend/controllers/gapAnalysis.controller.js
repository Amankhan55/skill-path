const { calculateGapAnalysis } = require('../services/gapCalculation.service');
const Role = require('../models/Role');

/**
 * @desc    Get skill gap analysis for current user
 * @route   GET /api/gap-analysis
 * @access  Private
 */
const getGapAnalysis = async (req, res, next) => {
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

    // Calculate gaps
    const analysis = await calculateGapAnalysis(userId, targetRoleId);

    res.json({
      success: true,
      data: {
        userId,
        targetRole: role,
        gaps: analysis.gaps,
        summary: analysis.summary
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGapAnalysis
};


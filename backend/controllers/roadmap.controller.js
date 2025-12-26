const { generateRoadmap, getNextSkill } = require('../services/roadmapGeneration.service');
const Role = require('../models/Role');

/**
 * @desc    Get learning roadmap for current user
 * @route   GET /api/roadmap
 * @access  Private
 */
const getRoadmap = async (req, res, next) => {
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

    // Generate roadmap
    const roadmap = await generateRoadmap(userId, targetRoleId);

    res.json({
      success: true,
      data: {
        userId,
        targetRole: role,
        ...roadmap
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get next recommended skill
 * @route   GET /api/roadmap/next-skill
 * @access  Private
 */
const getNextRecommendedSkill = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const targetRoleId = req.user.targetRoleId;

    if (!targetRoleId) {
      return res.status(400).json({
        success: false,
        message: 'Please set a target role first'
      });
    }

    const nextSkill = await getNextSkill(userId, targetRoleId);

    if (!nextSkill) {
      return res.json({
        success: true,
        message: 'No skill gaps found. You meet all requirements!',
        data: null
      });
    }

    res.json({
      success: true,
      data: nextSkill
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
  getNextRecommendedSkill
};


const Role = require('../models/Role');
const RoleSkillMap = require('../models/RoleSkillMap');
const UserSkill = require('../models/UserSkill');
const Skill = require('../models/Skill');
const { calculateReadinessScore } = require('../services/readinessScore.service');

/**
 * @desc    Compare user skills against multiple roles
 * @route   POST /api/analysis/compare-roles
 * @access  Private
 */
exports.compareRoles = async (req, res) => {
  try {
    const { roleIds } = req.body;

    if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of role IDs'
      });
    }

    // Get all roles
    const roles = await Role.find({ roleId: { $in: roleIds } });

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No roles found'
      });
    }

    // Get user's current skills
    const userSkills = await UserSkill.find({ userId: req.user._id });
    const userSkillMap = new Map(
      userSkills.map(us => [us.skillId, us.currentLevel])
    );

    // Calculate readiness for each role
    const comparisons = [];

    for (const role of roles) {
      // Get required skills for this role
      const roleSkillMaps = await RoleSkillMap.find({ roleId: role.roleId });
      
      const skillIds = roleSkillMaps.map(rsm => rsm.skillId);
      const skills = await Skill.find({ skillId: { $in: skillIds } });
      const skillMap = new Map(skills.map(s => [s.skillId, s]));

      // Calculate readiness
      let totalRequiredScore = 0;
      let achievedScore = 0;
      let readySkillsCount = 0;
      const skillBreakdown = [];

      for (const rsm of roleSkillMaps) {
        const requiredLevel = rsm.requiredLevel;
        const currentLevel = userSkillMap.get(rsm.skillId) || 0;
        const weight = rsm.weight;
        const skill = skillMap.get(rsm.skillId);

        totalRequiredScore += requiredLevel * weight;
        achievedScore += Math.min(currentLevel, requiredLevel) * weight;

        if (currentLevel >= requiredLevel) {
          readySkillsCount++;
        }

        skillBreakdown.push({
          skillId: rsm.skillId,
          skillName: skill ? skill.name : rsm.skillId,
          currentLevel,
          requiredLevel,
          gap: Math.max(0, requiredLevel - currentLevel),
          isReady: currentLevel >= requiredLevel,
          isMandatory: rsm.isMandatory
        });
      }

      const readinessPercentage = totalRequiredScore > 0
        ? Math.round((achievedScore / totalRequiredScore) * 100)
        : 0;

      comparisons.push({
        roleId: role.roleId,
        roleName: role.name,
        category: role.category,
        readinessPercentage,
        readySkillsCount,
        totalRequiredSkillsCount: roleSkillMaps.length,
        achievedScore: Math.round(achievedScore),
        totalRequiredScore: Math.round(totalRequiredScore),
        mandatorySkillsReady: skillBreakdown.filter(s => s.isMandatory && s.isReady).length,
        mandatorySkillsTotal: skillBreakdown.filter(s => s.isMandatory).length,
        skillBreakdown
      });
    }

    // Sort by readiness percentage (highest first)
    comparisons.sort((a, b) => b.readinessPercentage - a.readinessPercentage);

    res.json({
      success: true,
      comparisons,
      bestMatch: comparisons[0]
    });
  } catch (error) {
    console.error('Role comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


const RoleSkillMap = require('../models/RoleSkillMap');
const UserSkill = require('../models/UserSkill');
const Skill = require('../models/Skill');

/**
 * Calculate skill gaps for a user based on their target role
 */
const calculateGapAnalysis = async (userId, targetRoleId) => {
  try {
    // Get required skills for the target role
    const requiredSkills = await RoleSkillMap.find({ roleId: targetRoleId })
      .populate('skillId', 'name category description')
      .lean();

    if (requiredSkills.length === 0) {
      throw new Error('No skills found for this role');
    }

    // Get user's current skills
    const userSkills = await UserSkill.find({ userId })
      .lean();

    // Create a map for quick lookup
    const userSkillMap = {};
    userSkills.forEach(us => {
      userSkillMap[us.skillId.toString()] = us;
    });

    // Calculate gaps for each required skill
    const gaps = [];
    let totalSkills = 0;
    let skillsWithGaps = 0;
    let criticalGaps = 0;

    requiredSkills.forEach(req => {
      const skillIdStr = req.skillId._id.toString();
      const userSkill = userSkillMap[skillIdStr];
      const currentLevel = userSkill ? userSkill.currentLevel : 0;
      
      const gap = req.requiredLevel - currentLevel;
      const priority = gap > 0 ? gap * req.weight : 0;

      totalSkills++;
      if (gap > 0) {
        skillsWithGaps++;
        if (req.mandatory && gap >= 2) {
          criticalGaps++;
        }
      }

      gaps.push({
        skillId: skillIdStr,
        skillName: req.skillId.name,
        skillCategory: req.skillId.category,
        skillDescription: req.skillId.description,
        skill: req.skillId, // Keep the full object for backward compatibility
        requiredLevel: req.requiredLevel,
        currentLevel,
        gap,
        priority,
        weight: req.weight,
        mandatory: req.mandatory,
        isMandatory: req.mandatory, // Add frontend-friendly property name
        hasGap: gap > 0,
        isCritical: req.mandatory && gap >= 2
      });
    });

    // Sort by priority (highest first), then by mandatory
    gaps.sort((a, b) => {
      if (a.mandatory !== b.mandatory) {
        return b.mandatory - a.mandatory;
      }
      return b.priority - a.priority;
    });

    return {
      gaps,
      summary: {
        totalSkills,
        skillsWithGaps,
        criticalGaps,
        skillsMet: totalSkills - skillsWithGaps
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate gap for a single skill
 */
const calculateSingleGap = (requiredLevel, currentLevel, weight) => {
  const gap = requiredLevel - currentLevel;
  const priority = gap > 0 ? gap * weight : 0;
  
  return {
    gap,
    priority,
    hasGap: gap > 0
  };
};

/**
 * Get skills with gaps only
 */
const getSkillsWithGaps = async (userId, targetRoleId) => {
  const analysis = await calculateGapAnalysis(userId, targetRoleId);
  return analysis.gaps.filter(g => g.hasGap);
};

module.exports = {
  calculateGapAnalysis,
  calculateSingleGap,
  getSkillsWithGaps
};


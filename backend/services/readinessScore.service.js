const RoleSkillMap = require('../models/RoleSkillMap');
const UserSkill = require('../models/UserSkill');
const Skill = require('../models/Skill');

/**
 * Calculate readiness score for a user based on their target role
 */
const calculateReadinessScore = async (userId, targetRoleId) => {
  try {
    // Get required skills for the target role
    const requiredSkills = await RoleSkillMap.find({ roleId: targetRoleId })
      .populate('skillId', 'name category')
      .lean();

    if (requiredSkills.length === 0) {
      throw new Error('No skills found for this role');
    }

    // Get user's current skills
    const userSkills = await UserSkill.find({ userId }).lean();
    const userSkillMap = {};
    userSkills.forEach(us => {
      userSkillMap[us.skillId.toString()] = us.currentLevel;
    });

    // Calculate scores
    let achievedScore = 0;
    let totalScore = 0;
    let readySkillsCount = 0;
    const categoryScores = {};
    const skillBreakdown = [];

    requiredSkills.forEach(req => {
      const skillIdStr = req.skillId._id.toString();
      const userLevel = userSkillMap[skillIdStr] || 0;
      const category = req.skillId.category;
      const gap = req.requiredLevel - userLevel;
      const isReady = userLevel >= req.requiredLevel;

      // Calculate weighted scores
      const userScore = userLevel * req.weight;
      const maxScore = req.requiredLevel * req.weight;

      achievedScore += userScore;
      totalScore += maxScore;

      if (isReady) {
        readySkillsCount++;
      }

      // Track by category
      if (!categoryScores[category]) {
        categoryScores[category] = {
          achieved: 0,
          total: 0,
          skills: 0
        };
      }
      categoryScores[category].achieved += userScore;
      categoryScores[category].total += maxScore;
      categoryScores[category].skills++;

      // Add to skill breakdown
      skillBreakdown.push({
        skillId: skillIdStr,
        skillName: req.skillId.name,
        currentLevel: userLevel,
        requiredLevel: req.requiredLevel,
        gap: gap > 0 ? gap : 0,
        isReady: isReady
      });
    });

    // Calculate overall percentage
    const readinessPercentage = totalScore > 0 
      ? Math.round((achievedScore / totalScore) * 100) 
      : 0;

    // Calculate category breakdown
    const categoryBreakdown = Object.keys(categoryScores).map(category => ({
      category,
      readiness: categoryScores[category].total > 0
        ? Math.round((categoryScores[category].achieved / categoryScores[category].total) * 100)
        : 0,
      skillCount: categoryScores[category].skills
    })).sort((a, b) => b.readiness - a.readiness);

    return {
      readinessPercentage,
      achievedScore: Math.round(achievedScore),
      totalRequiredScore: Math.round(totalScore),
      totalScore: Math.round(totalScore), // Keep for backward compatibility
      readySkillsCount,
      totalRequiredSkillsCount: requiredSkills.length,
      skillBreakdown,
      categoryBreakdown,
      interpretation: getInterpretation(readinessPercentage)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get interpretation of readiness score
 */
const getInterpretation = (percentage) => {
  if (percentage >= 90) {
    return {
      level: 'Excellent',
      message: 'You are highly qualified for this role!',
      color: 'green'
    };
  } else if (percentage >= 75) {
    return {
      level: 'Good',
      message: 'You are close to meeting the requirements. Focus on critical gaps.',
      color: 'blue'
    };
  } else if (percentage >= 60) {
    return {
      level: 'Fair',
      message: 'You have a solid foundation but need to develop several skills.',
      color: 'yellow'
    };
  } else if (percentage >= 40) {
    return {
      level: 'Developing',
      message: 'Focus on building fundamental skills for this role.',
      color: 'orange'
    };
  } else {
    return {
      level: 'Beginning',
      message: 'Start with the mandatory skills and work through the roadmap.',
      color: 'red'
    };
  }
};

/**
 * Calculate progress velocity (skills improved per month)
 */
const calculateProgressVelocity = async (userId, months = 3) => {
  const SkillHistory = require('../models/SkillHistory');
  
  try {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    const improvements = await SkillHistory.find({
      userId,
      changedAt: { $gte: cutoffDate },
      $expr: { $gt: ['$level', '$changedFrom'] }
    }).countDocuments();

    const velocity = improvements / months;

    return {
      improvements,
      months,
      velocity: Math.round(velocity * 10) / 10,
      interpretation: velocity >= 2 ? 'Excellent pace' : velocity >= 1 ? 'Good pace' : 'Slow pace'
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  calculateReadinessScore,
  getInterpretation,
  calculateProgressVelocity
};


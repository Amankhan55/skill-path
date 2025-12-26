const { calculateGapAnalysis } = require('./gapCalculation.service');
const { calculateReadinessScore } = require('./readinessScore.service');
const { getNextSkill } = require('./roadmapGeneration.service');
const UserProgress = require('../models/UserProgress');
const SkillHistory = require('../models/SkillHistory');

/**
 * Get dashboard metrics for a user
 */
const getDashboardMetrics = async (userId, targetRoleId) => {
  try {
    // Get gap analysis
    const gapAnalysis = await calculateGapAnalysis(userId, targetRoleId);

    // Get readiness score
    const readiness = await calculateReadinessScore(userId, targetRoleId);

    // Get next recommended skill
    const nextSkill = await getNextSkill(userId, targetRoleId);

    // Get recent progress
    const recentProgress = await getRecentProgress(userId, 10);

    // Get progress stats
    const progressStats = await getProgressStats(userId);

    return {
      summary: {
        totalSkills: gapAnalysis.summary.totalSkills,
        skillsWithGaps: gapAnalysis.summary.skillsWithGaps,
        criticalGaps: gapAnalysis.summary.criticalGaps,
        skillsMet: gapAnalysis.summary.skillsMet,
        readinessPercentage: readiness.readinessPercentage
      },
      readiness: {
        percentage: readiness.readinessPercentage,
        interpretation: readiness.interpretation,
        categoryBreakdown: readiness.categoryBreakdown
      },
      nextSkill: nextSkill ? {
        name: nextSkill.skill.name,
        category: nextSkill.skill.category,
        gap: nextSkill.gap,
        priority: nextSkill.priority,
        estimatedHours: nextSkill.estimatedHours,
        topicCount: nextSkill.topicCount,
        mandatory: nextSkill.mandatory
      } : null,
      recentProgress,
      progressStats
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get recent progress activities
 */
const getRecentProgress = async (userId, limit = 10) => {
  try {
    const recentActivities = await UserProgress.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('skillId', 'name category')
      .populate('topicId', 'name difficulty')
      .lean();

    return recentActivities.map(activity => ({
      topic: activity.topicId?.name || 'Unknown',
      skill: activity.skillId?.name || 'Unknown',
      status: activity.status,
      timeSpent: activity.timeSpent,
      completedAt: activity.completedAt,
      updatedAt: activity.updatedAt
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Get progress statistics
 */
const getProgressStats = async (userId) => {
  try {
    const [completed, inProgress, total] = await Promise.all([
      UserProgress.countDocuments({ userId, status: 'completed' }),
      UserProgress.countDocuments({ userId, status: 'in-progress' }),
      UserProgress.countDocuments({ userId })
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get skill improvements in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentImprovements = await SkillHistory.countDocuments({
      userId,
      changedAt: { $gte: thirtyDaysAgo },
      $expr: { $gt: ['$level', '$changedFrom'] }
    });

    return {
      topicsCompleted: completed,
      topicsInProgress: inProgress,
      totalTopics: total,
      completionRate,
      recentImprovements
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardMetrics,
  getRecentProgress,
  getProgressStats
};


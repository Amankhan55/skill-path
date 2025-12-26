const UserProgress = require('../models/UserProgress');
const SkillHistory = require('../models/SkillHistory');

/**
 * @desc    Save/Update topic progress
 * @route   POST /api/progress
 * @access  Private
 */
const saveProgress = async (req, res, next) => {
  try {
    const { topicId, skillId, status, timeSpent, notes } = req.body;
    const userId = req.user._id;

    if (!topicId || !skillId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Topic ID, Skill ID, and status are required'
      });
    }

    // Check if progress record exists
    let progress = await UserProgress.findOne({ userId, topicId });

    if (progress) {
      // Update existing
      progress.status = status;
      if (timeSpent !== undefined) progress.timeSpent = timeSpent;
      if (notes !== undefined) progress.notes = notes;
      
      if (status === 'in-progress' && !progress.startedAt) {
        progress.startedAt = new Date();
      }
      
      if (status === 'completed' && !progress.completedAt) {
        progress.completedAt = new Date();
      }

      await progress.save();
    } else {
      // Create new progress record
      progress = await UserProgress.create({
        userId,
        topicId,
        skillId,
        status,
        timeSpent: timeSpent || 0,
        notes: notes || '',
        startedAt: status === 'in-progress' ? new Date() : null,
        completedAt: status === 'completed' ? new Date() : null
      });
    }

    await progress.populate(['skillId', 'topicId']);

    res.json({
      success: true,
      message: 'Progress saved successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user progress
 * @route   GET /api/progress
 * @access  Private
 */
const getUserProgress = async (req, res, next) => {
  try {
    const { skillId, status } = req.query;
    const userId = req.user._id;

    const filter = { userId };
    if (skillId) filter.skillId = skillId;
    if (status) filter.status = status;

    const progress = await UserProgress.find(filter)
      .populate('skillId', 'name category')
      .populate('topicId', 'name order difficulty estimatedHours')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get skill history
 * @route   GET /api/progress/history
 * @access  Private
 */
const getSkillHistory = async (req, res, next) => {
  try {
    const { skillId, limit = 50 } = req.query;
    const userId = req.user._id;

    const filter = { userId };
    if (skillId) filter.skillId = skillId;

    const history = await SkillHistory.find(filter)
      .populate('skillId', 'name category')
      .sort({ changedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveProgress,
  getUserProgress,
  getSkillHistory
};


const UserSkill = require('../models/UserSkill');
const SkillHistory = require('../models/SkillHistory');

/**
 * @desc    Save/Update skill assessment
 * @route   POST /api/user-skills
 * @access  Private
 */
const saveSkillAssessment = async (req, res, next) => {
  try {
    const { skillId, currentLevel, usedInProduction, recentUsage, yearsOfExperience, notes } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!skillId || !currentLevel) {
      return res.status(400).json({
        success: false,
        message: 'Skill ID and current level are required'
      });
    }

    // Check if assessment already exists
    let userSkill = await UserSkill.findOne({ userId, skillId });

    if (userSkill) {
      // Record history if level changed
      if (userSkill.currentLevel !== currentLevel) {
        await SkillHistory.create({
          userId,
          skillId,
          level: currentLevel,
          changedFrom: userSkill.currentLevel,
          reason: 're-assessment',
          notes: notes || 'User re-assessed skill level'
        });
      }

      // Update existing
      userSkill.currentLevel = currentLevel;
      userSkill.usedInProduction = usedInProduction !== undefined ? usedInProduction : userSkill.usedInProduction;
      userSkill.recentUsage = recentUsage !== undefined ? recentUsage : userSkill.recentUsage;
      userSkill.yearsOfExperience = yearsOfExperience !== undefined ? yearsOfExperience : userSkill.yearsOfExperience;
      userSkill.notes = notes !== undefined ? notes : userSkill.notes;
      userSkill.assessedAt = new Date();

      await userSkill.save();
    } else {
      // Create new assessment
      userSkill = await UserSkill.create({
        userId,
        skillId,
        currentLevel,
        usedInProduction: usedInProduction || false,
        recentUsage: recentUsage || false,
        yearsOfExperience: yearsOfExperience || 0,
        notes: notes || ''
      });

      // Record in history
      await SkillHistory.create({
        userId,
        skillId,
        level: currentLevel,
        changedFrom: 0,
        reason: 'initial-assessment',
        notes: 'Initial skill assessment'
      });
    }

    // Populate skill info
    await userSkill.populate('skillId', 'name category');

    res.status(userSkill ? 200 : 201).json({
      success: true,
      message: userSkill ? 'Skill assessment updated' : 'Skill assessment saved',
      data: userSkill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all user skills
 * @route   GET /api/user-skills
 * @access  Private
 */
const getUserSkills = async (req, res, next) => {
  try {
    const userSkills = await UserSkill.find({ userId: req.user._id })
      .populate('skillId', 'name category description')
      .sort({ 'skillId.category': 1, 'skillId.name': 1 });

    res.json({
      success: true,
      count: userSkills.length,
      data: userSkills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user skill by ID
 * @route   GET /api/user-skills/:id
 * @access  Private
 */
const getUserSkillById = async (req, res, next) => {
  try {
    const userSkill = await UserSkill.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('skillId');

    if (!userSkill) {
      return res.status(404).json({
        success: false,
        message: 'Skill assessment not found'
      });
    }

    res.json({
      success: true,
      data: userSkill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete skill assessment
 * @route   DELETE /api/user-skills/:id
 * @access  Private
 */
const deleteSkillAssessment = async (req, res, next) => {
  try {
    const userSkill = await UserSkill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!userSkill) {
      return res.status(404).json({
        success: false,
        message: 'Skill assessment not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill assessment deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk save/update skill assessments
 * @route   POST /api/user-skills/bulk-assess
 * @access  Private
 */
const bulkSaveSkillAssessments = async (req, res, next) => {
  try {
    const { assessments } = req.body;
    const userId = req.user._id;

    if (!assessments || !Array.isArray(assessments) || assessments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Assessments array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const assessment of assessments) {
      try {
        const { skillId, currentLevel, confidenceScore } = assessment;

        if (!skillId || !currentLevel) {
          errors.push({ skillId, error: 'Skill ID and current level are required' });
          continue;
        }

        // Check if assessment already exists
        let userSkill = await UserSkill.findOne({ userId, skillId });

        if (userSkill) {
          // Record history if level changed
          if (userSkill.currentLevel !== currentLevel) {
            await SkillHistory.create({
              userId,
              skillId,
              level: currentLevel,
              changedFrom: userSkill.currentLevel,
              reason: 're-assessment',
              notes: 'Bulk skill assessment update'
            });
          }

          // Update existing
          userSkill.currentLevel = currentLevel;
          if (confidenceScore !== undefined) {
            userSkill.confidenceScore = confidenceScore;
          }
          userSkill.lastAssessedAt = Date.now();
          await userSkill.save();
          results.push(userSkill);
        } else {
          // Create new
          userSkill = await UserSkill.create({
            userId,
            skillId,
            currentLevel,
            confidenceScore: confidenceScore || 50,
            usedInProduction: false,
            recentUsage: false,
            yearsOfExperience: 0
          });

          // Record in history
          await SkillHistory.create({
            userId,
            skillId,
            level: currentLevel,
            changedFrom: 0,
            reason: 'initial-assessment',
            notes: 'Initial skill assessment'
          });

          results.push(userSkill);
        }
      } catch (err) {
        errors.push({ skillId: assessment.skillId, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `${results.length} skill(s) saved successfully`,
      count: results.length,
      data: results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveSkillAssessment,
  getUserSkills,
  getUserSkillById,
  deleteSkillAssessment,
  bulkSaveSkillAssessments
};


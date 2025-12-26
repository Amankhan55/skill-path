const Skill = require('../models/Skill');
const SkillLevel = require('../models/SkillLevel');
const SkillTopic = require('../models/SkillTopic');
const RoleSkillMap = require('../models/RoleSkillMap');

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Public
 */
const getAllSkills = async (req, res, next) => {
  try {
    const { category, isActive = true } = req.query;

    const filter = { isActive };
    if (category) filter.category = category;

    const skills = await Skill.find(filter).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get skill by ID
 * @route   GET /api/skills/:id
 * @access  Public
 */
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get skills by role
 * @route   GET /api/skills/by-role/:roleId
 * @access  Public
 */
const getSkillsByRole = async (req, res, next) => {
  try {
    const roleSkills = await RoleSkillMap.find({ roleId: req.params.roleId })
      .populate('skillId')
      .sort({ mandatory: -1, weight: -1 });

    const skills = roleSkills.map(rs => ({
      ...rs.skillId.toObject(),
      requiredLevel: rs.requiredLevel,
      weight: rs.weight,
      mandatory: rs.mandatory
    }));

    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all skill levels
 * @route   GET /api/skills/levels
 * @access  Public
 */
const getSkillLevels = async (req, res, next) => {
  try {
    const levels = await SkillLevel.find().sort({ level: 1 });

    res.json({
      success: true,
      data: levels
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get topics for a skill
 * @route   GET /api/skills/:id/topics
 * @access  Public
 */
const getSkillTopics = async (req, res, next) => {
  try {
    const topics = await SkillTopic.find({ skillId: req.params.id })
      .sort({ order: 1 });

    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkills,
  getSkillById,
  getSkillsByRole,
  getSkillLevels,
  getSkillTopics
};


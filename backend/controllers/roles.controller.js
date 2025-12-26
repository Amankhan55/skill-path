const Role = require('../models/Role');
const RoleSkillMap = require('../models/RoleSkillMap');

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Public
 */
const getAllRoles = async (req, res, next) => {
  try {
    const { level, category, isActive = true } = req.query;

    const filter = { isActive };
    if (level) filter.level = level;
    if (category) filter.category = category;

    const roles = await Role.find(filter).sort({ level: 1, name: 1 });

    res.json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get role by ID
 * @route   GET /api/roles/:id
 * @access  Public
 */
const getRoleById = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get skills required for a role
 * @route   GET /api/roles/:id/skills
 * @access  Public
 */
const getRoleSkills = async (req, res, next) => {
  try {
    const skills = await RoleSkillMap.find({ roleId: req.params.id })
      .populate('skillId', 'name category description officialUrl')
      .sort({ mandatory: -1, weight: -1 });

    res.json({
      success: true,
      count: skills.length,
      data: skills.map(s => ({
        skill: s.skillId,
        requiredLevel: s.requiredLevel,
        weight: s.weight,
        mandatory: s.mandatory,
        notes: s.notes
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  getRoleSkills
};


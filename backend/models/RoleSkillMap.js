const mongoose = require('mongoose');

const roleSkillMapSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Role ID is required'],
    index: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill ID is required'],
    index: true
  },
  requiredLevel: {
    type: Number,
    required: [true, 'Required level is required'],
    min: [1, 'Level must be between 1 and 5'],
    max: [5, 'Level must be between 1 and 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Required level must be an integer'
    }
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [1, 'Weight must be between 1 and 100'],
    max: [100, 'Weight must be between 1 and 100']
  },
  mandatory: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index: One mapping per role-skill pair
roleSkillMapSchema.index({ roleId: 1, skillId: 1 }, { unique: true });

// Index for fetching skills by importance
roleSkillMapSchema.index({ roleId: 1, weight: -1 });

module.exports = mongoose.model('RoleSkillMap', roleSkillMapSchema);


const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill ID is required'],
    index: true
  },
  currentLevel: {
    type: Number,
    required: [true, 'Current level is required'],
    min: [1, 'Level must be between 1 and 5'],
    max: [5, 'Level must be between 1 and 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Skill level must be an integer'
    }
  },
  usedInProduction: {
    type: Boolean,
    default: false
  },
  recentUsage: {
    type: Boolean,
    default: false
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years'],
    default: 0
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  assessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index: One assessment per user-skill pair
userSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });

// Index for filtering by level
userSkillSchema.index({ userId: 1, currentLevel: 1 });

module.exports = mongoose.model('UserSkill', userSkillSchema);


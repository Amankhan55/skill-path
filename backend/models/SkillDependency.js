const mongoose = require('mongoose');

const skillDependencySchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill ID is required'],
    index: true
  },
  dependsOnSkillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Depends on skill ID is required'],
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['must-have', 'recommended', 'helpful'],
      message: '{VALUE} is not a valid dependency type'
    },
    default: 'must-have'
  },
  minimumLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 2
  },
  reason: {
    type: String,
    maxlength: [300, 'Reason cannot exceed 300 characters']
  }
}, {
  timestamps: true
});

// Compound index: Prevent duplicate dependencies
skillDependencySchema.index({ skillId: 1, dependsOnSkillId: 1 }, { unique: true });

// Validation: Skill cannot depend on itself
skillDependencySchema.pre('validate', function(next) {
  if (this.skillId.equals(this.dependsOnSkillId)) {
    next(new Error('Skill cannot depend on itself'));
  } else {
    next();
  }
});

module.exports = mongoose.model('SkillDependency', skillDependencySchema);


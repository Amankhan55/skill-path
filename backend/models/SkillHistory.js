const mongoose = require('mongoose');

const skillHistorySchema = new mongoose.Schema({
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
  level: {
    type: Number,
    required: [true, 'Level is required'],
    min: [1, 'Level must be between 1 and 5'],
    max: [5, 'Level must be between 1 and 5']
  },
  changedFrom: {
    type: Number,
    min: [0, 'Changed from cannot be negative'],
    max: [5, 'Changed from must be between 0 and 5'],
    default: 0
  },
  reason: {
    type: String,
    enum: {
      values: ['initial-assessment', 're-assessment', 'progress-update', 'correction'],
      message: '{VALUE} is not a valid reason'
    },
    default: 'progress-update'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  changedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for chronological skill history
skillHistorySchema.index({ userId: 1, skillId: 1, changedAt: -1 });

// Index for user's overall progress timeline
skillHistorySchema.index({ userId: 1, changedAt: -1 });

module.exports = mongoose.model('SkillHistory', skillHistorySchema);


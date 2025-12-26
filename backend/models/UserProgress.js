const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillTopic',
    required: [true, 'Topic ID is required'],
    index: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill ID is required'],
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['not-started', 'in-progress', 'completed', 'skipped'],
      message: '{VALUE} is not a valid status'
    },
    default: 'not-started',
    index: true
  },
  timeSpent: {
    type: Number,
    min: [0, 'Time spent cannot be negative'],
    default: 0
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index: One progress record per user-topic pair
userProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

// Index for filtering by status
userProgressSchema.index({ userId: 1, status: 1 });

// Index for skill-level progress queries
userProgressSchema.index({ userId: 1, skillId: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);


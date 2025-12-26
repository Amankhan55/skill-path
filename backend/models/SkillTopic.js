const mongoose = require('mongoose');

const skillTopicSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true,
    maxlength: [200, 'Topic name cannot exceed 200 characters']
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    min: [1, 'Order must be at least 1']
  },
  difficulty: {
    type: String,
    required: true,
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: '{VALUE} is not a valid difficulty'
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  estimatedHours: {
    type: Number,
    required: [true, 'Estimated hours is required'],
    min: [1, 'Hours must be at least 1'],
    max: [100, 'Hours cannot exceed 100']
  },
  resourceLinks: [{
    title: {
      type: String,
      required: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Must be a valid URL'
      }
    },
    type: {
      type: String,
      enum: ['docs', 'article', 'video', 'tutorial', 'book'],
      default: 'docs'
    }
  }],
  prerequisites: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Compound index for ordered topic retrieval
skillTopicSchema.index({ skillId: 1, order: 1 });

module.exports = mongoose.model('SkillTopic', skillTopicSchema);


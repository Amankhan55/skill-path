const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: {
      values: [
        'Language',
        'Framework',
        'Library',
        'Tool',
        'Concept',
        'Database',
        'Cloud',
        'DevOps',
        'Testing',
        'Design',
        'Soft Skill'
      ],
      message: '{VALUE} is not a valid category'
    },
    index: true
  },
  description: {
    type: String,
    required: [true, 'Skill description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tags: {
    type: [String],
    default: []
  },
  officialUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Must be a valid URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for tag-based searches
skillSchema.index({ tags: 1 });

module.exports = mongoose.model('Skill', skillSchema);


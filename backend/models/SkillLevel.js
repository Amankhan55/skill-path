const mongoose = require('mongoose');

const skillLevelSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 5
  },
  label: {
    type: String,
    required: true,
    enum: ['Awareness', 'Novice', 'Intermediate', 'Advanced', 'Expert']
  },
  definition: {
    type: String,
    required: true,
    maxlength: 500
  },
  examples: {
    type: [String],
    default: []
  },
  estimatedHours: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('SkillLevel', skillLevelSchema);


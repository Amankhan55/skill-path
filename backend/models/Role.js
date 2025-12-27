const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Role name must be at least 3 characters'],
    maxlength: [100, 'Role name cannot exceed 100 characters'],
    index: true
  },
  level: {
    type: String,
    required: [true, 'Role level is required'],
    enum: {
      values: ['Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Staff'],
      message: '{VALUE} is not a valid level'
    },
    index: true
  },
  category: {
    type: String,
    required: [true, 'Role category is required'],
    enum: {
      values: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data'],
      message: '{VALUE} is not a valid category'
    },
    index: true
  },
  description: {
    type: String,
    required: [true, 'Role description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  experienceYears: {
    min: {
      type: Number,
      required: [true, 'Minimum experience years is required'],
      min: [0, 'Experience cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum experience years is required'],
      min: [0, 'Experience cannot be negative']
    }
  },
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Validation: min experience < max experience
roleSchema.pre('validate', function(next) {
  // Guard against undefined experienceYears object
  if (!this.experienceYears || typeof this.experienceYears !== 'object') {
    return next(); // Let schema validation handle missing required field
  }
  
  if (this.experienceYears.min >= this.experienceYears.max) {
    next(new Error('Minimum experience must be less than maximum experience'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Role', roleSchema);


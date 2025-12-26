const mongoose = require('mongoose');

const roleComparisonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  roleIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Role',
    required: [true, 'Role IDs are required'],
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 3;
      },
      message: 'Must compare 2-3 roles'
    }
  },
  comparisonData: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Comparison data is required']
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for fetching user's comparisons
roleComparisonSchema.index({ userId: 1, createdAt: -1 });

// TTL index for automatic deletion
roleComparisonSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RoleComparison', roleComparisonSchema);


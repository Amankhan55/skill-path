require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Models
const Role = require('../models/Role');
const Skill = require('../models/Skill');
const SkillLevel = require('../models/SkillLevel');
const RoleSkillMap = require('../models/RoleSkillMap');
const SkillDependency = require('../models/SkillDependency');
const SkillTopic = require('../models/SkillTopic');
const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const UserProgress = require('../models/UserProgress');
const SkillHistory = require('../models/SkillHistory');
const RoleComparison = require('../models/RoleComparison');

const clearData = async () => {
  try {
    await connectDB();

    console.log('\n🗑️  Clearing all data from database...\n');

    await Promise.all([
      Role.deleteMany({}),
      Skill.deleteMany({}),
      SkillLevel.deleteMany({}),
      RoleSkillMap.deleteMany({}),
      SkillDependency.deleteMany({}),
      SkillTopic.deleteMany({}),
      User.deleteMany({}),
      UserSkill.deleteMany({}),
      UserProgress.deleteMany({}),
      SkillHistory.deleteMany({}),
      RoleComparison.deleteMany({})
    ]);

    console.log('✅ All data cleared successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearData();


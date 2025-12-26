const { getSkillsWithGaps } = require('./gapCalculation.service');
const { orderSkillsByDependencies, getPrerequisites } = require('./dependencyResolver.service');
const SkillTopic = require('../models/SkillTopic');
const User = require('../models/User');

/**
 * Generate learning roadmap for a user
 */
const generateRoadmap = async (userId, targetRoleId) => {
  try {
    // Get user info for experience-based adjustments
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get skills with gaps
    const skillsWithGaps = await getSkillsWithGaps(userId, targetRoleId);

    if (skillsWithGaps.length === 0) {
      return {
        skills: [],
        totalEstimatedHours: 0,
        message: 'No skill gaps found. You meet all requirements for this role!'
      };
    }

    // Separate mandatory and optional skills
    const mandatorySkills = skillsWithGaps.filter(s => s.mandatory);
    const optionalSkills = skillsWithGaps.filter(s => !s.mandatory);

    // Sort each group by priority
    mandatorySkills.sort((a, b) => b.priority - a.priority);
    optionalSkills.sort((a, b) => b.priority - a.priority);

    // Apply dependency ordering within each group
    const orderedMandatory = await orderSkillsByDependencies(mandatorySkills);
    const orderedOptional = await orderSkillsByDependencies(optionalSkills);

    // Combine: mandatory first, then optional
    const orderedSkills = [...orderedMandatory, ...orderedOptional];

    // Fetch topics and prerequisites for each skill
    const roadmap = [];
    let totalHours = 0;

    for (const skillGap of orderedSkills) {
      const skillId = skillGap.skill._id;

      // Get topics for this skill
      const topics = await SkillTopic.find({ skillId })
        .sort({ order: 1 })
        .lean();

      // Get prerequisites
      const prerequisites = await getPrerequisites(skillId);

      // Calculate estimated hours (adjust based on experience)
      const baseHours = topics.reduce((sum, topic) => sum + topic.estimatedHours, 0);
      const experienceMultiplier = getExperienceMultiplier(user.experienceYears);
      const estimatedHours = Math.round(baseHours * experienceMultiplier);

      totalHours += estimatedHours;

      roadmap.push({
        skillId: skillId.toString(),
        skillName: skillGap.skill.name,
        skillCategory: skillGap.skill.category,
        skill: skillGap.skill, // Keep full object for backward compatibility
        gap: skillGap.gap,
        priority: skillGap.priority,
        weight: skillGap.weight,
        mandatory: skillGap.mandatory,
        isMandatory: skillGap.mandatory, // Add frontend-friendly property
        isCritical: skillGap.isCritical,
        requiredLevel: skillGap.requiredLevel,
        currentLevel: skillGap.currentLevel,
        topics: topics.map(t => ({
          topicId: t._id.toString(),
          _id: t._id,
          title: t.name, // Frontend uses 'title'
          name: t.name,
          order: t.order,
          difficulty: t.difficulty,
          description: t.description,
          estimatedHours: t.estimatedHours,
          resources: t.resourceLinks, // Frontend uses 'resources'
          resourceLinks: t.resourceLinks,
          prerequisites: t.prerequisites
        })),
        dependencies: prerequisites
          .filter(p => p.skill && p.skill._id) // Filter out invalid prerequisites
          .map(p => ({
            skillId: p.skill._id.toString(),
            skillName: p.skill.name || 'Unknown Skill',
            type: p.type,
            minimumLevel: p.minimumLevel,
            reason: p.reason
          })),
        prerequisites: prerequisites.map(p => ({
          skill: p.skill,
          type: p.type,
          minimumLevel: p.minimumLevel,
          reason: p.reason
        })),
        estimatedHours,
        topicCount: topics.length,
        order: roadmap.length + 1
      });
    }

    return {
      roadmap: roadmap,
      skills: roadmap, // Keep for backward compatibility
      totalEstimatedHours: totalHours,
      summary: {
        totalSkills: roadmap.length,
        mandatorySkills: mandatorySkills.length,
        optionalSkills: optionalSkills.length,
        estimatedWeeks: Math.ceil(totalHours / 40) // Assuming 40 hours per week
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get experience multiplier for time estimates
 */
const getExperienceMultiplier = (experienceYears) => {
  if (experienceYears <= 2) return 1.2;  // Junior: +20%
  if (experienceYears <= 5) return 1.0;  // Mid: baseline
  return 0.8;  // Senior: -20%
};

/**
 * Get next recommended skill to learn
 */
const getNextSkill = async (userId, targetRoleId) => {
  try {
    const roadmap = await generateRoadmap(userId, targetRoleId);
    
    if (roadmap.skills.length === 0) {
      return null;
    }

    // Return the first skill in the roadmap (highest priority with dependencies satisfied)
    return roadmap.skills[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateRoadmap,
  getNextSkill,
  getExperienceMultiplier
};


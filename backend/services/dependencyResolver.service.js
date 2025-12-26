const SkillDependency = require('../models/SkillDependency');
const UserSkill = require('../models/UserSkill');

/**
 * Check if all dependencies for a skill are satisfied
 */
const areDependenciesSatisfied = async (skillId, userId) => {
  try {
    // Get all dependencies for this skill
    const dependencies = await SkillDependency.find({ skillId })
      .populate('dependsOnSkillId', 'name')
      .lean();

    if (dependencies.length === 0) {
      return { satisfied: true, unsatisfied: [] };
    }

    // Get user's current skills
    const userSkills = await UserSkill.find({ userId }).lean();
    const userSkillMap = {};
    userSkills.forEach(us => {
      userSkillMap[us.skillId.toString()] = us.currentLevel;
    });

    // Check each dependency
    const unsatisfied = [];
    for (const dep of dependencies) {
      const depSkillId = dep.dependsOnSkillId._id.toString();
      const userLevel = userSkillMap[depSkillId] || 0;

      // Only enforce "must-have" dependencies strictly
      if (dep.type === 'must-have' && userLevel < dep.minimumLevel) {
        unsatisfied.push({
          skill: dep.dependsOnSkillId,
          required: dep.minimumLevel,
          current: userLevel,
          reason: dep.reason
        });
      }
    }

    return {
      satisfied: unsatisfied.length === 0,
      unsatisfied
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get all prerequisites for a skill
 */
const getPrerequisites = async (skillId) => {
  try {
    const dependencies = await SkillDependency.find({ skillId })
      .populate('dependsOnSkillId', 'name category')
      .lean();

    return dependencies.map(dep => ({
      skill: dep.dependsOnSkillId,
      type: dep.type,
      minimumLevel: dep.minimumLevel,
      reason: dep.reason
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Topological sort for skill ordering based on dependencies
 * Returns skills in learning order (prerequisites first)
 */
const topologicalSort = async (skillIds) => {
  try {
    // Get all dependencies for the given skills
    const dependencies = await SkillDependency.find({
      skillId: { $in: skillIds },
      type: 'must-have'
    }).lean();

    // Build adjacency list
    const graph = {};
    const inDegree = {};
    
    skillIds.forEach(id => {
      const idStr = id.toString();
      graph[idStr] = [];
      inDegree[idStr] = 0;
    });

    dependencies.forEach(dep => {
      const fromId = dep.dependsOnSkillId.toString();
      const toId = dep.skillId.toString();
      
      // Only add edge if both skills are in our list
      if (graph[fromId] !== undefined && graph[toId] !== undefined) {
        graph[fromId].push(toId);
        inDegree[toId]++;
      }
    });

    // Kahn's algorithm for topological sort
    const queue = [];
    const sorted = [];

    // Find all nodes with no incoming edges
    Object.keys(inDegree).forEach(id => {
      if (inDegree[id] === 0) {
        queue.push(id);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift();
      sorted.push(current);

      // For each neighbor, reduce in-degree
      graph[current].forEach(neighbor => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      });
    }

    // Check for cycles (if sorted length < input length, there's a cycle)
    if (sorted.length !== skillIds.length) {
      // Return original order if cycle detected
      console.warn('Circular dependency detected, using original order');
      return skillIds.map(id => id.toString());
    }

    return sorted;
  } catch (error) {
    throw error;
  }
};

/**
 * Order skills respecting dependencies
 */
const orderSkillsByDependencies = async (skills) => {
  try {
    const skillIds = skills.map(s => s.skill._id);
    const sorted = await topologicalSort(skillIds);

    // Create a map for quick lookup
    const skillMap = {};
    skills.forEach(s => {
      skillMap[s.skill._id.toString()] = s;
    });

    // Reorder skills based on topological sort
    return sorted.map(id => skillMap[id]).filter(s => s !== undefined);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  areDependenciesSatisfied,
  getPrerequisites,
  topologicalSort,
  orderSkillsByDependencies
};


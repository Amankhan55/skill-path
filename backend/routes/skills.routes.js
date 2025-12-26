const express = require('express');
const router = express.Router();
const { getAllSkills, getSkillById, getSkillsByRole, getSkillLevels, getSkillTopics } = require('../controllers/skills.controller');

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of skills
 */
router.get('/', getAllSkills);

/**
 * @swagger
 * /api/skills/levels:
 *   get:
 *     summary: Get all skill levels (1-5 scale)
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of skill levels
 */
router.get('/levels', getSkillLevels);

/**
 * @swagger
 * /api/skills/by-role/{roleId}:
 *   get:
 *     summary: Get skills required for a specific role
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of skills for the role
 */
router.get('/by-role/:roleId', getSkillsByRole);

/**
 * @swagger
 * /api/skills/{id}:
 *   get:
 *     summary: Get skill by ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill details
 */
router.get('/:id', getSkillById);

/**
 * @swagger
 * /api/skills/{id}/topics:
 *   get:
 *     summary: Get topics for a skill
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of topics
 */
router.get('/:id/topics', getSkillTopics);

module.exports = router;


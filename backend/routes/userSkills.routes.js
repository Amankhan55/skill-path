const express = require('express');
const router = express.Router();
const { saveSkillAssessment, getUserSkills, getUserSkillById, deleteSkillAssessment, bulkSaveSkillAssessments } = require('../controllers/userSkills.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/user-skills:
 *   get:
 *     summary: Get all user skill assessments
 *     tags: [User Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user skills
 *   post:
 *     summary: Save/Update skill assessment
 *     tags: [User Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillId
 *               - currentLevel
 *             properties:
 *               skillId:
 *                 type: string
 *               currentLevel:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               usedInProduction:
 *                 type: boolean
 *               recentUsage:
 *                 type: boolean
 *               yearsOfExperience:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill assessment saved
 */
router.route('/')
  .get(getUserSkills)
  .post(saveSkillAssessment);

/**
 * @swagger
 * /api/user-skills/bulk-assess:
 *   post:
 *     summary: Bulk save/update skill assessments
 *     tags: [User Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assessments
 *             properties:
 *               assessments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - skillId
 *                     - currentLevel
 *                   properties:
 *                     skillId:
 *                       type: string
 *                     currentLevel:
 *                       type: number
 *                       minimum: 1
 *                       maximum: 5
 *                     confidenceScore:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *     responses:
 *       200:
 *         description: Skills saved successfully
 */
router.post('/bulk-assess', bulkSaveSkillAssessments);

/**
 * @swagger
 * /api/user-skills/{id}:
 *   get:
 *     summary: Get user skill assessment by ID
 *     tags: [User Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill assessment details
 *   delete:
 *     summary: Delete skill assessment
 *     tags: [User Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill assessment deleted
 */
router.route('/:id')
  .get(getUserSkillById)
  .delete(deleteSkillAssessment);

module.exports = router;


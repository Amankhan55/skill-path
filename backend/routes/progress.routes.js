const express = require('express');
const router = express.Router();
const { saveProgress, getUserProgress, getSkillHistory } = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Get user progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skillId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [not-started, in-progress, completed, skipped]
 *     responses:
 *       200:
 *         description: User progress records
 *   post:
 *     summary: Save/Update topic progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topicId
 *               - skillId
 *               - status
 *             properties:
 *               topicId:
 *                 type: string
 *               skillId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [not-started, in-progress, completed, skipped]
 *               timeSpent:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Progress saved
 */
router.route('/')
  .get(getUserProgress)
  .post(saveProgress);

/**
 * @swagger
 * /api/progress/history:
 *   get:
 *     summary: Get skill level change history
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skillId
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 50
 *     responses:
 *       200:
 *         description: Skill history records
 */
router.get('/history', getSkillHistory);

module.exports = router;


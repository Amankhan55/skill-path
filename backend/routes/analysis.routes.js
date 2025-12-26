const express = require('express');
const router = express.Router();
const { getGapAnalysis } = require('../controllers/gapAnalysis.controller');
const { getRoadmap, getNextRecommendedSkill } = require('../controllers/roadmap.controller');
const { getReadinessScore } = require('../controllers/readiness.controller');
const { compareRoles } = require('../controllers/roleComparison.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/analysis/gap/{roleId}:
 *   get:
 *     summary: Get skill gap analysis
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gap analysis results
 *       400:
 *         description: No target role set
 */
router.get('/gap/:roleId', getGapAnalysis);

/**
 * @swagger
 * /api/analysis/roadmap/{roleId}:
 *   get:
 *     summary: Get learning roadmap
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Learning roadmap with ordered skills
 */
router.get('/roadmap/:roleId', getRoadmap);

/**
 * @swagger
 * /api/analysis/roadmap/next:
 *   get:
 *     summary: Get next recommended skill to learn
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next recommended skill
 */
router.get('/roadmap/next', getNextRecommendedSkill);

/**
 * @swagger
 * /api/analysis/readiness/{roleId}:
 *   get:
 *     summary: Get readiness score for target role
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Readiness score with breakdown
 */
router.get('/readiness/:roleId', getReadinessScore);

/**
 * @swagger
 * /api/analysis/compare-roles:
 *   post:
 *     summary: Compare user readiness across multiple roles
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleIds
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Role comparison successful
 *       401:
 *         description: Unauthorized
 */
router.post('/compare-roles', compareRoles);

module.exports = router;


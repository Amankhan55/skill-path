const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard metrics and overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with metrics
 *       400:
 *         description: No target role set
 */
router.get('/', getDashboard);

module.exports = router;


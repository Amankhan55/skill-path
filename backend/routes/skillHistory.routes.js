const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const SkillHistory = require('../models/SkillHistory');
const Skill = require('../models/Skill');

/**
 * @swagger
 * /api/skills/history:
 *   get:
 *     summary: Get skill update history for the authenticated user
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skill history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/history', protect, async (req, res) => {
  try {
    const history = await SkillHistory.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .lean();

    // Enrich with skill names
    const enrichedHistory = await Promise.all(
      history.map(async (entry) => {
        const skill = await Skill.findOne({ skillId: entry.skillId });
        return {
          ...entry,
          skillName: skill ? skill.name : entry.skillId
        };
      })
    );

    res.json(enrichedHistory);
  } catch (error) {
    console.error('Skill history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


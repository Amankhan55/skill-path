const express = require('express');
const router = express.Router();
const { getAllRoles, getRoleById, getRoleSkills } = require('../controllers/roles.controller');

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [Junior, Mid, Senior, Lead, Principal]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Frontend, Backend, Full Stack, Mobile, DevOps, Data]
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/', getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role details
 *       404:
 *         description: Role not found
 */
router.get('/:id', getRoleById);

/**
 * @swagger
 * /api/roles/{id}/skills:
 *   get:
 *     summary: Get skills required for a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of required skills
 */
router.get('/:id/skills', getRoleSkills);

module.exports = router;


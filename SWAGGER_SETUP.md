# Swagger/OpenAPI Setup Guide
## SkillPath API Documentation

---

## Overview

Swagger UI provides interactive API documentation where you can:
- View all API endpoints
- See request/response schemas
- Test endpoints directly in the browser
- Authenticate with JWT tokens
- Export OpenAPI specification

**Access:** http://localhost:3000/api-docs

---

## Dependencies

```json
{
  "dependencies": {
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8"
  }
}
```

---

## Configuration

### File: `backend/config/swagger.js`

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillPath API',
      version: '1.0.0',
      description: 'Career Growth & Skill Gap Analysis Platform API',
      contact: {
        name: 'SkillPath Team',
        email: 'support@skillpath.io'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.skillpath.io',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /api/auth/login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'object'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '6501234567890abcdef12345'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com'
            },
            experienceYears: {
              type: 'number',
              example: 5
            },
            targetRoleId: {
              type: 'string',
              example: '6501234567890abcdef67890'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '6501234567890abcdef12345'
            },
            name: {
              type: 'string',
              example: 'Senior UI Developer'
            },
            level: {
              type: 'string',
              enum: ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'],
              example: 'Senior'
            },
            category: {
              type: 'string',
              example: 'Frontend'
            },
            description: {
              type: 'string',
              example: 'Lead the design and development of complex user interfaces'
            },
            experienceYears: {
              type: 'object',
              properties: {
                min: { type: 'number', example: 5 },
                max: { type: 'number', example: 8 }
              }
            }
          }
        },
        Skill: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string',
              example: 'Angular'
            },
            category: {
              type: 'string',
              example: 'Framework'
            },
            description: {
              type: 'string',
              example: 'TypeScript-based web application framework'
            },
            officialUrl: {
              type: 'string',
              example: 'https://angular.io'
            }
          }
        },
        UserSkill: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            userId: {
              type: 'string'
            },
            skillId: {
              type: 'string'
            },
            currentLevel: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              example: 3
            },
            usedInProduction: {
              type: 'boolean',
              example: true
            },
            recentUsage: {
              type: 'boolean',
              example: true
            },
            assessedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        GapAnalysis: {
          type: 'object',
          properties: {
            userId: {
              type: 'string'
            },
            targetRole: {
              $ref: '#/components/schemas/Role'
            },
            gaps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  skill: {
                    $ref: '#/components/schemas/Skill'
                  },
                  requiredLevel: {
                    type: 'number',
                    example: 4
                  },
                  currentLevel: {
                    type: 'number',
                    example: 3
                  },
                  gap: {
                    type: 'number',
                    example: 1
                  },
                  priority: {
                    type: 'number',
                    example: 85
                  },
                  mandatory: {
                    type: 'boolean',
                    example: true
                  }
                }
              }
            },
            summary: {
              type: 'object',
              properties: {
                totalSkills: { type: 'number', example: 15 },
                skillsWithGaps: { type: 'number', example: 8 },
                criticalGaps: { type: 'number', example: 3 }
              }
            }
          }
        },
        Roadmap: {
          type: 'object',
          properties: {
            userId: {
              type: 'string'
            },
            skills: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  skill: {
                    $ref: '#/components/schemas/Skill'
                  },
                  gap: {
                    type: 'number',
                    example: 2
                  },
                  priority: {
                    type: 'number',
                    example: 170
                  },
                  mandatory: {
                    type: 'boolean',
                    example: true
                  },
                  topics: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Change Detection' },
                        order: { type: 'number', example: 1 },
                        difficulty: { type: 'string', example: 'Medium' },
                        estimatedHours: { type: 'number', example: 6 },
                        resourceLinks: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              title: { type: 'string' },
                              url: { type: 'string' },
                              type: { type: 'string', example: 'docs' }
                            }
                          }
                        }
                      }
                    }
                  },
                  estimatedHours: {
                    type: 'number',
                    example: 45
                  }
                }
              }
            },
            totalEstimatedHours: {
              type: 'number',
              example: 240
            }
          }
        },
        ReadinessScore: {
          type: 'object',
          properties: {
            userId: {
              type: 'string'
            },
            targetRole: {
              $ref: '#/components/schemas/Role'
            },
            readinessPercentage: {
              type: 'number',
              example: 68.5
            },
            achievedScore: {
              type: 'number',
              example: 1370
            },
            totalScore: {
              type: 'number',
              example: 2000
            },
            categoryBreakdown: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string', example: 'Framework' },
                  readiness: { type: 'number', example: 75 }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

module.exports = swaggerJsdoc(options);
```

---

## Integration in Server

### File: `backend/server.js`

```javascript
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// ... other middleware ...

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SkillPath API Documentation'
}));

// Export OpenAPI spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ... routes ...
```

---

## JSDoc Comments for Routes

### Example: Authentication Routes

```javascript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123!
 *               experienceYears:
 *                 type: number
 *                 minimum: 0
 *                 example: 5
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/me', authMiddleware, authController.getCurrentUser);
```

---

### Example: Protected Routes

```javascript
/**
 * @swagger
 * /api/gap-analysis:
 *   get:
 *     summary: Get skill gap analysis for current user
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gap analysis results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GapAnalysis'
 *       400:
 *         description: No target role set
 *       401:
 *         description: Unauthorized
 */
router.get('/gap-analysis', authMiddleware, gapAnalysisController.getGapAnalysis);

/**
 * @swagger
 * /api/roadmap:
 *   get:
 *     summary: Get learning roadmap for current user
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning roadmap
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Roadmap'
 *       401:
 *         description: Unauthorized
 */
router.get('/roadmap', authMiddleware, roadmapController.getRoadmap);
```

---

## Using Swagger UI

### 1. Authentication

1. Go to http://localhost:3000/api-docs
2. Click "Authorize" button at the top
3. Login via `/api/auth/login` endpoint first
4. Copy the JWT token from response
5. Click "Authorize" and paste: `Bearer YOUR_TOKEN_HERE`
6. Click "Authorize" and "Close"
7. Now all protected endpoints will include the token

### 2. Testing Endpoints

1. Click on any endpoint to expand
2. Click "Try it out"
3. Fill in the parameters/body
4. Click "Execute"
5. View response below

### 3. Schemas

- Click "Schemas" at the bottom to see all data models
- Each schema shows the structure of requests/responses

---

## Benefits

✅ **Interactive Testing:** Test APIs without Postman  
✅ **Auto-Documentation:** Docs stay in sync with code  
✅ **Team Collaboration:** Share API specs easily  
✅ **Client Generation:** Export OpenAPI spec for code generation  
✅ **Authentication:** Built-in JWT token management  
✅ **Validation:** See required fields and types  
✅ **Examples:** Clear request/response examples  

---

## Best Practices

1. **Document All Endpoints:** Every route should have JSDoc comments
2. **Use Schemas:** Reference reusable schemas
3. **Add Examples:** Include realistic example data
4. **Group by Tags:** Organize endpoints (Authentication, Analysis, Progress, etc.)
5. **Document Errors:** Include all possible error responses
6. **Keep Updated:** Update docs when changing APIs
7. **Use Descriptions:** Add clear descriptions for complex parameters

---

## Production Considerations

1. **Disable in Production (Optional):**
```javascript
if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

2. **Or Protect with Authentication:**
```javascript
app.use('/api-docs', basicAuth({ 
  users: { 'admin': 'password' },
  challenge: true 
}), swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

3. **CORS Configuration:**
```javascript
// Allow Swagger UI to make requests
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## Export & Import

### Export OpenAPI Spec
```bash
curl http://localhost:3000/api-docs.json > openapi.json
```

### Import to Postman
1. Open Postman
2. Import → Link → Paste: http://localhost:3000/api-docs.json
3. All endpoints imported automatically

---

## Summary

- **URL:** http://localhost:3000/api-docs
- **Spec Export:** http://localhost:3000/api-docs.json
- **Dependencies:** swagger-ui-express, swagger-jsdoc
- **Documentation:** JSDoc comments in route files
- **Authentication:** JWT Bearer token support
- **Testing:** Try-it-out functionality for all endpoints

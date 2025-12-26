const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillPath API',
      version: '1.0.0',
      description: 'Career Growth & Skill Gap Analysis Platform API - Your career roadmap, data-driven',
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
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'object' }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6501234567890abcdef12345' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            experienceYears: { type: 'number', example: 5 },
            targetRoleId: { type: 'string', example: '6501234567890abcdef67890' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Role: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Senior UI Developer' },
            level: { type: 'string', enum: ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'], example: 'Senior' },
            category: { type: 'string', example: 'Frontend' },
            description: { type: 'string' },
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
            _id: { type: 'string' },
            name: { type: 'string', example: 'Angular' },
            category: { type: 'string', example: 'Framework' },
            description: { type: 'string' },
            officialUrl: { type: 'string', example: 'https://angular.io' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Roles', description: 'Career roles endpoints' },
      { name: 'Skills', description: 'Skills management endpoints' },
      { name: 'Analysis', description: 'Gap analysis and roadmap endpoints' },
      { name: 'Progress', description: 'User progress tracking endpoints' },
      { name: 'Dashboard', description: 'Dashboard metrics endpoints' }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

module.exports = swaggerJsdoc(options);


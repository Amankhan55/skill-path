# SkillPath Backend - Setup & Run Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Create .env file
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillpath
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:4200
```

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or using mongod directly
mongod --dbpath /path/to/data
```

### 4. Seed Database
```bash
npm run seed
```

Expected output:
```
✅ MongoDB Connected
🌱 Starting database seeding...
✅ Created 5 skill levels
✅ Created 20 skills
✅ Created 3 roles
✅ Created 39 role-skill mappings
✅ Created 17 skill dependencies
✅ Created 21 skill topics
🎉 Database seeding completed successfully!
```

### 5. Start Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Expected output:
```
🚀 SkillPath API Server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
🏥 Health Check: http://localhost:3000/health
🌍 Environment: development
✅ MongoDB Connected: localhost
📊 Database: skillpath
```

## Verify Installation

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. View Swagger Documentation
Open browser: http://localhost:3000/api-docs

### 3. Test API Endpoints

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "experienceYears": 5
  }'
```

**Get All Roles:**
```bash
curl http://localhost:3000/api/roles
```

## API Endpoints Summary

### Authentication (Public)
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user (Protected)

### Roles & Skills (Public)
- GET `/api/roles` - List roles
- GET `/api/roles/:id` - Get role
- GET `/api/roles/:id/skills` - Role skills
- GET `/api/skills` - List skills
- GET `/api/skills/levels` - Skill levels (1-5)

### User Skills (Protected)
- POST `/api/user-skills` - Save assessment
- GET `/api/user-skills` - Get assessments

### Analysis (Protected)
- GET `/api/analysis/gap` - Gap analysis
- GET `/api/analysis/roadmap` - Roadmap
- GET `/api/analysis/readiness` - Readiness score

### Progress (Protected)
- POST `/api/progress` - Mark progress
- GET `/api/progress` - Get progress
- GET `/api/progress/history` - Skill history

### Dashboard (Protected)
- GET `/api/dashboard` - Dashboard metrics

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── swagger.js        # Swagger/OpenAPI config
├── controllers/          # Request handlers (8)
│   ├── auth.controller.js
│   ├── roles.controller.js
│   ├── skills.controller.js
│   ├── userSkills.controller.js
│   ├── gapAnalysis.controller.js
│   ├── roadmap.controller.js
│   ├── readiness.controller.js
│   ├── progress.controller.js
│   └── dashboard.controller.js
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   └── errorHandler.js       # Global error handler
├── models/                   # MongoDB schemas (11)
│   ├── Role.js
│   ├── Skill.js
│   ├── SkillLevel.js
│   ├── RoleSkillMap.js       # CORE intelligence
│   ├── SkillDependency.js
│   ├── SkillTopic.js
│   ├── User.js
│   ├── UserSkill.js
│   ├── UserProgress.js
│   ├── SkillHistory.js
│   └── RoleComparison.js
├── routes/                   # API routes (7)
│   ├── auth.routes.js
│   ├── roles.routes.js
│   ├── skills.routes.js
│   ├── userSkills.routes.js
│   ├── analysis.routes.js
│   ├── progress.routes.js
│   └── dashboard.routes.js
├── services/                 # Business logic (5)
│   ├── gapCalculation.service.js
│   ├── dependencyResolver.service.js
│   ├── roadmapGeneration.service.js
│   ├── readinessScore.service.js
│   └── dashboard.service.js
├── scripts/
│   ├── seedData.js          # Seed real-world data
│   └── clearData.js         # Clear database
├── utils/
│   └── generateToken.js     # JWT token utility
├── server.js                # Express app entry
├── package.json
└── .env
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify database permissions

### Port Already in Use
- Change PORT in .env
- Kill process using port 3000:
  ```bash
  lsof -ti:3000 | xargs kill
  ```

### JWT Token Error
- Ensure JWT_SECRET is set in .env
- Token expires after 7 days by default

## Clear Database
```bash
npm run seed:clear
```

## Next Steps

1. ✅ Backend complete and running
2. ⏳ Build Angular frontend
3. ⏳ Connect frontend to APIs
4. ⏳ Test complete flow

## Tech Stack

- **Node.js** 18+
- **Express** 4.x
- **MongoDB** 6+
- **Mongoose** 8.x
- **JWT** (jsonwebtoken)
- **bcryptjs** for password hashing
- **Swagger** for API docs

## Support

For issues, refer to:
- Main documentation: `../APP_DOCUMENTATION.md`
- Database architecture: `../DATABASE_ARCHITECTURE.md`
- Development plan: `../DEVELOPMENT_PLAN.md`

# SkillPath Backend

Backend API for SkillPath - Career Growth & Skill Gap Analysis Platform

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with real-world data
- `npm run seed:clear` - Clear all data from database

## API Endpoints

Access Swagger documentation at: http://localhost:3000/api-docs

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (Protected)

### Roles
- GET `/api/roles` - List all roles
- GET `/api/roles/:id` - Get role by ID

### Skills
- GET `/api/skills` - List all skills
- GET `/api/skills/by-role/:roleId` - Get skills for a role

### Analysis (Protected)
- GET `/api/gap-analysis` - Get skill gap analysis
- GET `/api/roadmap` - Get learning roadmap
- GET `/api/readiness` - Get readiness score

### Progress (Protected)
- POST `/api/user-skills` - Save skill assessment
- POST `/api/progress` - Mark topic complete
- GET `/api/progress` - Get user progress

## Project Structure

```
backend/
├── config/          # Configuration files
├── models/          # MongoDB schemas (11 collections)
├── controllers/     # Request handlers
├── routes/          # API routes
├── services/        # Business logic
├── middleware/      # Auth, error handling
├── utils/           # Helper functions
├── scripts/         # Seed data scripts
└── server.js        # Entry point
```

## Environment Variables

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillpath
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:4200
```

## Database Collections

1. roles - Career roles/positions
2. skills - Master skill vocabulary
3. skillLevels - Universal 1-5 proficiency scale
4. roleSkillMap - Role requirements (CORE)
5. skillDependencies - Learning prerequisites
6. skillTopics - Granular learning units
7. users - User accounts
8. userSkills - Skill assessments
9. userProgress - Topic completion tracking
10. skillHistory - Skill level audit trail
11. roleComparison - Cached comparisons

## API Documentation

Interactive API documentation available at `/api-docs` when server is running.

## Data

All seed data is based on real job descriptions from top tech companies (Google, Meta, Amazon, etc.) and industry standards. See `/scripts/seedData.js` for complete data.

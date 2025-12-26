# SkillPath
## Career Growth & Skill Gap Analysis Platform
### Technical Documentation

**Tagline:** Your career roadmap, data-driven

---

## Features Overview

### 1. Authentication & User Management
- User registration with email/password
- Secure login with JWT tokens
- Password encryption (bcrypt)
- Protected routes and API endpoints
- User session management
- Logout functionality

### 2. Role Selection & Goal Setting
- Browse available career roles
- Select target role
- Set experience level

### 3. Skill Self-Assessment
- Assess current skill levels (1-5 scale)
- Mark production usage and recent usage
- Incremental assessment support

### 4. Skill Gap Analysis Dashboard
- Visual gap matrix (required vs current)
- Priority scores (gap × weight)
- Mandatory vs optional indicators
- Summary metrics

### 5. Learning Roadmap Generator
- Ordered skill list (mandatory → priority → dependencies)
- Topic breakdown per skill
- Prerequisites visualization
- Current vs target levels

### 6. Progress Tracking
- Mark topics/skills as completed
- Visual progress indicators
- Historical timeline

### 7. Readiness Score Calculator
- Real-time readiness percentage (0-100%)
- Category breakdown
- Achievement tracking

### 8. Dashboard & Overview
- Summary metrics (total skills, gaps, readiness %)
- Next recommended skill to learn
- Recent progress timeline
- Quick actions (assess skill, mark progress)
- Visual progress charts

### 9. Role Comparison
- Compare 2-3 roles side-by-side
- Skill overlap visualization
- Gap differences
- Career path exploration
- "What if" scenarios

### 10. Learning Time Estimates
- Estimated hours per skill level
- Total roadmap time estimate
- Time to readiness calculation
- Adjusted for experience level

### 11. Skill History Tracking
- Timeline of skill level changes
- Progress velocity (skills improved per month)
- Historical readiness score
- Achievement milestones

### 12. Resource Links
- Curated learning resource links per skill/topic
- External documentation references
- Not courses - just official docs, guides, articles
- Admin-curated, quality-controlled

### 13. Export & Reporting
- Export roadmap as PDF/JSON
- Gap analysis report
- Progress summary
- Shareable format for managers/mentors

---

## Architecture

### Frontend (Angular 19)
```
Structure:
├── core/              # Singleton services (API, auth, theme)
│   ├── api.service.ts
│   ├── auth.service.ts         # JWT token management
│   ├── auth.guard.ts           # Route protection
│   └── theme.service.ts
├── features/          
│   ├── auth/                   # Login, Register components
│   ├── role-selection/
│   ├── skill-assessment/
│   ├── gap-analysis/
│   ├── roadmap/
│   └── progress/
├── shared/            # Reusable components (badges, progress bars, modals)
└── layouts/           # App shell

Tech Stack:
- Angular 19
- Tailwind CSS v3+ (no Angular Material)
- RxJS for state
- JWT for authentication
- HTTP Interceptors for auth headers
- Dark/Light mode (Tailwind's dark mode class strategy)
- Responsive design (mobile-first)
- Compact UI (minimal white space)
```

### Backend (Node.js + Express)
```
Structure:
├── models/            # MongoDB schemas (9 collections)
├── services/          # Business logic
│   ├── auth.service.js         # JWT generation, password hashing
│   ├── gapCalculation.service.js
│   ├── roadmapGeneration.service.js
│   └── readinessScore.service.js
├── controllers/       
│   ├── auth.controller.js      # Login, Register, Logout
│   ├── roles.controller.js
│   ├── skills.controller.js
│   └── ...
├── routes/            # API endpoints
├── middleware/        
│   ├── auth.middleware.js      # JWT verification
│   └── errorHandler.js
├── config/            # Database connection
└── scripts/           # Seed data

Key Services:
- AuthService: JWT generation, password hashing (bcrypt), token verification
- GapCalculationService: gap = requiredLevel - currentLevel
- RoadmapGenerationService: Ordering (mandatory → priority → dependencies)
- ReadinessScoreService: (achievedScore / totalScore) × 100
```

### Database (MongoDB)
```
Collections:
1. roles               # Career destinations
2. skills              # Master skill vocabulary
3. skillLevels         # Universal 1-5 scale
4. roleSkillMap        # Role requirements (CORE intelligence)
5. skillDependencies   # Learning order constraints
6. skillTopics         # Granular learning units
7. users               # User identity & goals
8. userSkills          # Current skill assessments
9. userProgress        # Topic completion tracking
```

---

## API Endpoints

```
Authentication (Public):
  POST   /api/auth/register        # Create new user account
  POST   /api/auth/login           # Login and get JWT token
  POST   /api/auth/logout          # Logout (optional - token cleanup)
  GET    /api/auth/me              # Get current user profile (Protected)

Roles (Public):
  GET    /api/roles
  GET    /api/roles/:id

Skills (Public):
  GET    /api/skills
  GET    /api/skills/by-role/:roleId
  GET    /api/skill-levels

Users (Protected):
  GET    /api/users/profile        # Get current user profile
  PUT    /api/users/profile        # Update profile
  PUT    /api/users/target-role    # Set target role

User Skills (Protected):
  POST   /api/user-skills          # Save skill assessment (uses token userId)
  GET    /api/user-skills          # Get current user's skills
  PUT    /api/user-skills/:id      # Update skill level

Analysis (Protected):
  GET    /api/gap-analysis         # Calculate gaps for current user
  GET    /api/roadmap              # Generate roadmap for current user
  GET    /api/readiness            # Calculate readiness for current user
  GET    /api/roadmap/time-estimate # Get estimated time to complete roadmap

Progress (Protected):
  POST   /api/progress             # Mark topic complete
  GET    /api/progress             # Get current user progress
  PUT    /api/progress/:id         # Update progress
  GET    /api/progress/history     # Get skill level history

Dashboard (Protected):
  GET    /api/dashboard            # Get dashboard metrics and overview
  GET    /api/dashboard/next-skill # Get next recommended skill

Role Comparison (Protected):
  POST   /api/role-comparison      # Compare multiple roles
  GET    /api/role-comparison/:id  # Get saved comparison

Export (Protected):
  GET    /api/export/roadmap       # Export roadmap (JSON/PDF)
  GET    /api/export/gap-analysis  # Export gap analysis
  GET    /api/export/progress      # Export progress report

Resources (Public):
  GET    /api/resources/:skillId   # Get resource links for skill
  GET    /api/resources/topic/:topicId # Get resources for topic

Note: Protected routes require JWT token in Authorization header: "Bearer <token>"
```

---

## Authentication Flow

### Registration
```
1. User submits name, email, password
2. Backend validates email uniqueness
3. Password hashed with bcrypt (salt rounds: 10)
4. User record created in database
5. JWT token generated (expires in 7 days)
6. Token returned to frontend
7. Frontend stores token in localStorage
```

### Login
```
1. User submits email, password
2. Backend finds user by email
3. Password verified with bcrypt.compare()
4. JWT token generated with payload: { userId, email }
5. lastLogin timestamp updated
6. Token returned to frontend
7. Frontend stores token and redirects to dashboard
```

### Protected Routes
```
1. Frontend sends request with Authorization header: "Bearer <token>"
2. auth.middleware.js verifies token
3. If valid: userId extracted and attached to req.user
4. If invalid/expired: 401 Unauthorized response
5. Controller uses req.user.userId for data access
```

### Token Structure
```javascript
{
  userId: ObjectId,
  email: String,
  iat: Number,    // Issued at
  exp: Number     // Expiration (7 days)
}
```

### Security Measures
- Passwords never stored in plain text
- Passwords hashed with bcrypt (10 salt rounds)
- JWT secret stored in environment variables
- Token expiration enforced (7 days)
- Password field excluded from API responses
- User can only access their own data

---

## Business Logic Rules

### Gap Calculation
```
gap = requiredLevel - currentLevel
If gap ≤ 0 → skill is sufficient
```

### Priority Calculation
```
priority = gap × weight (only if gap > 0)
Higher priority = learn earlier
```

### Roadmap Ordering
```
1. Mandatory skills first
2. Higher priority score next
3. Dependency order enforced (prerequisites before dependents)
4. Topics ordered by 'order' field
```

### Readiness Score
```
readiness = (achievedSkillScore / totalRequiredSkillScore) × 100
achievedScore = sum(userSkill.level × weight for each skill)
totalScore = sum(required.level × weight for each skill)
```

### Learning Time Estimation
```
Base time per level:
  Level 1 (Awareness): 10 hours
  Level 2 (Novice): 30 hours
  Level 3 (Intermediate): 60 hours
  Level 4 (Advanced): 100 hours
  Level 5 (Expert): 150 hours

Calculation:
  timeNeeded = sum(topicEstimatedHours) for all topics in skill gap
  OR
  timeNeeded = baseLevelTime[targetLevel] - baseLevelTime[currentLevel]

Experience modifier:
  Junior (0-2 years): 1.2x multiplier
  Mid (3-5 years): 1.0x multiplier
  Senior (6+ years): 0.8x multiplier
```

### Next Skill Recommendation
```
Logic:
1. Get all skills with gaps > 0
2. Filter by:
   - Dependencies satisfied (prerequisites met)
   - Mandatory first
   - Highest priority score
3. Return top skill with topics list
```

---

## Database Schema

### Role
```javascript
{
  name: String (unique),
  level: String (Junior|Mid|Senior|Lead|Principal),
  category: String,
  description: String,
  version: Number
}
```

### Skill
```javascript
{
  name: String,
  category: String,
  description: String
}
```

### SkillLevel
```javascript
{
  level: Number (1-5),
  label: String,
  definition: String
}
```

### RoleSkillMap (Core Intelligence)
```javascript
{
  roleId: ObjectId,
  skillId: ObjectId,
  requiredLevel: Number (1-5),
  weight: Number (1-100),
  mandatory: Boolean
}
```

### SkillDependency
```javascript
{
  skillId: ObjectId,
  dependsOnSkillId: ObjectId,
  type: String (must-have|recommended)
}
```

### SkillTopic
```javascript
{
  skillId: ObjectId,
  name: String,
  order: Number,
  difficulty: String (Easy|Medium|Hard),
  description: String,
  estimatedHours: Number,      // Time to learn this topic
  resourceLinks: [{
    title: String,
    url: String,
    type: String (docs|article|video)
  }]
}
```

### User
```javascript
{
  name: String,
  email: String (unique, required),
  password: String (hashed with bcrypt),
  experienceYears: Number,
  targetRoleId: ObjectId,
  createdAt: Date,
  lastLogin: Date
}
```

### UserSkill
```javascript
{
  userId: ObjectId,
  skillId: ObjectId,
  currentLevel: Number (1-5),
  usedInProduction: Boolean,
  recentUsage: Boolean
}
```

### UserProgress
```javascript
{
  userId: ObjectId,
  topicId: ObjectId,
  skillId: ObjectId,
  status: String (completed|in-progress|not-started),
  completedAt: Date,
  timeSpent: Number            // Hours spent (optional, user-reported)
}
```

### SkillHistory (New Collection)
```javascript
{
  userId: ObjectId,
  skillId: ObjectId,
  level: Number,
  changedAt: Date,
  changedFrom: Number          // Previous level
}
```

### RoleComparison (New Collection - Cache)
```javascript
{
  userId: ObjectId,
  roleIds: [ObjectId],         // Up to 3 roles
  comparisonData: Object,      // Cached comparison result
  createdAt: Date
}
```

---

## Data Strategy

### MVP (Real-World Data Sources)

**Data Collection Methodology:**
1. Analyze 50+ real job descriptions from top companies (Google, Meta, Microsoft, Amazon, Airbnb, etc.)
2. Extract common skill requirements and their frequency
3. Map skills to realistic proficiency levels based on role seniority
4. Validate dependencies based on technical prerequisites
5. Curate official documentation links (MDN, Angular.io, TypeScript docs, etc.)

**Seed Data Includes:**
- 3-4 roles (Junior UI Dev, Senior UI Dev, Full Stack Dev)
- ~25-30 real skills (HTML, CSS, JavaScript, TypeScript, Angular, React, Node.js, Git, etc.)
- Skill levels based on actual job requirements
- Real dependencies (e.g., Angular requires TypeScript, React requires JavaScript)
- 3-7 topics per skill from official documentation
- Learning time estimates from industry surveys
- Curated resource links (official docs only)
- Run: `npm run seed`

**Data Sources:**
- Job postings from LinkedIn, Indeed, Glassdoor
- Stack Overflow Developer Survey 2024
- State of JavaScript 2024 survey
- Official technology roadmaps (roadmap.sh)
- Company engineering blogs
- Industry skill frameworks (SFIA)

**See:** `REAL_WORLD_DATA_RESEARCH.md` for detailed skill breakdown

### Production (Future)
- Admin UI for data management
- Quarterly updates based on job market trends
- Community-contributed skill matrices (verified)
- Integration with labor market analytics APIs
- Version control for role definitions

### Data Quality Principles
- No fictional/random data - all based on real job requirements
- Cross-referenced with multiple job postings (minimum 10 per role)
- Skill weights based on frequency in job descriptions
- Mandatory flags based on "must-have" vs "nice-to-have" analysis
- Dependencies validated by technical experts
- Time estimates from learning platform data (Udemy, Coursera, Pluralsight)

---

## Data Flow

```
1. User registers → POST /api/auth/register → Returns JWT token
2. User logs in → POST /api/auth/login → Returns JWT token
3. Frontend stores JWT in localStorage/sessionStorage
4. All subsequent requests include JWT in Authorization header
5. User selects role → GET /api/roles/:id
6. User assesses skills → POST /api/user-skills (JWT identifies user)
7. View gaps → GET /api/gap-analysis (backend calculates for authenticated user)
8. View roadmap → GET /api/roadmap (backend orders for authenticated user)
9. Mark progress → POST /api/progress (backend updates for authenticated user)
10. View readiness → GET /api/readiness (backend calculates for authenticated user)
```

**Key Principles**: 
- All business logic lives in backend. Frontend only displays.
- User identity extracted from JWT token, not from request body
- Protected routes validate JWT before processing

---

## Development Order

1. ✅ Create MongoDB schemas
2. ✅ Seed roles, skills, matrices
3. ✅ Build gap calculation service
4. ✅ Build roadmap generation service
5. ✅ Build readiness score service
6. ✅ Create API endpoints
7. ✅ Build Angular UI components
8. ✅ Connect APIs
9. ✅ Add progress tracking

---

## Technology Stack

- **Frontend**: Angular 19, Tailwind CSS v3+, RxJS
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Swagger/OpenAPI
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger UI (Interactive API testing)
- **Architecture**: RESTful API, MVC pattern, Token-based auth

---

## UI/UX Design Principles

### Styling
- **Tailwind CSS only** - No Angular Material, no Bootstrap
- Custom CSS for specific needs only
- Utility-first approach
- Compact design with minimal white space
- Consistent spacing scale (Tailwind's default)

### Dark/Light Mode
```
Implementation:
1. Tailwind's class-based dark mode (darkMode: 'class')
2. ThemeService toggles 'dark' class on <html> element
3. All colors use Tailwind's dark: variant
4. Theme preference saved in localStorage
5. System preference detection on first load
6. Theme toggle in app header

Color Strategy:
- Light mode: bg-white, bg-gray-50, text-gray-900
- Dark mode: bg-gray-900, bg-gray-800, text-gray-100
- Accent colors: Same across both themes for consistency
- Use Tailwind's opacity variants for subtle effects
```

### Responsive Design
```
Breakpoints (Tailwind defaults):
- sm: 640px   (Mobile landscape)
- md: 768px   (Tablet)
- lg: 1024px  (Desktop)
- xl: 1280px  (Large desktop)

Strategy:
- Mobile-first approach
- Single column on mobile
- Two/three columns on desktop
- Collapsible navigation on mobile
- Touch-friendly tap targets (min 44px)
```

### Component Design
```
Cards: Compact with subtle shadows
Buttons: Solid with hover states, clear CTAs
Forms: Inline validation, minimal borders
Tables: Striped rows, sticky headers
Modals: Center-aligned, no backdrop click close
Charts/Graphs: Color-blind friendly palette
Progress Bars: Gradient fills, percentage labels
```

### Accessibility
- WCAG 2.1 AA compliant color contrast
- Keyboard navigation support
- Focus indicators visible
- ARIA labels where needed
- Semantic HTML structure

---

## Key Design Rules

1. **Backend = Single Source of Truth** - All logic in Node/Express
2. **Frontend = Display Layer** - Angular only renders
3. **Data-Driven Logic** - No AI guessing, all from DB
4. **Rule-Based Calculations** - Defined formulas, not ML
5. **Manual Curation** - Skill matrices curated by experts

---

## MVP Scope

**Included:**
- User authentication (register, login, JWT)
- 3-4 roles (Junior UI Dev, Senior UI Dev, Full Stack Dev, + 1 more)
- Skill matrix
- Gap analysis
- Roadmap generation
- Progress tracking
- Readiness scoring
- User-specific data isolation
- Dashboard with overview metrics
- Role comparison (side-by-side)
- Learning time estimates per skill
- Skill history tracking
- Resource links (curated, not courses)
- Export roadmap/report (JSON/text)

**Excluded:**
- AI suggestions
- Resume parsing
- External integrations
- Payments
- Course content delivery
- Password reset/forgot password
- OAuth/Social login
- Email verification
- Community features
- Peer comparison

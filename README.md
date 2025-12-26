# SkillPath

**Your career roadmap, data-driven**

---

## What is SkillPath?

SkillPath is a career intelligence system that helps developers gain clarity on their career growth journey. It's not a course platform or job portal—it's a decision-making tool that tells you WHAT to learn, WHY, and IN WHAT ORDER.

### The Problem We Solve

Developers don't fail because of lack of content. They fail because of lack of clarity.

**SkillPath answers:**
- Where do I stand today?
- What does my target role require?
- What skills am I missing?
- What should I learn next?
- How do I measure my readiness?

---

## Key Features

### 🎯 Role Selection & Goal Setting
Select your target role from industry-standard positions (Junior UI Developer, Senior UI Developer, Full Stack Developer, etc.)

### 📊 Skill Self-Assessment
Assess your current skill levels on a universal 1-5 scale based on real-world proficiency definitions.

### 🔍 Gap Analysis
Visual gap matrix showing exactly where you stand vs. where you need to be, with priority scores based on real job requirements.

### 🗺️ Learning Roadmap
Ordered, dependency-aware roadmap that respects prerequisites and prioritizes mandatory skills first.

### 📈 Progress Tracking
Track your learning progress topic-by-topic, with skill history and velocity metrics.

### 💯 Readiness Score
Real-time percentage showing how ready you are for your target role.

### 🔄 Role Comparison
Compare multiple roles side-by-side to explore career options and understand skill overlap.

### ⏱️ Time Estimates
Realistic learning time estimates based on industry data and your experience level.

---

## Tech Stack

### Frontend
- **Framework:** Angular 19
- **Styling:** Tailwind CSS v3+
- **State Management:** RxJS
- **Features:** Dark/Light mode, Responsive design, Compact UI

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **Database:** MongoDB 6+ with Mongoose 8.x
- **Authentication:** JWT + bcrypt
- **API Documentation:** Swagger UI / OpenAPI 3.0
- **Architecture:** RESTful API, MVC pattern

---

## Project Structure

```
SkillPath/
├── backend/                    # Node.js + Express backend
│   ├── models/                 # MongoDB schemas (11 collections)
│   ├── services/               # Business logic (gap, roadmap, readiness)
│   ├── controllers/            # Request handlers
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Auth, validation, error handling
│   ├── config/                 # Database connection
│   ├── scripts/                # Seed data with real-world info
│   └── server.js               # Entry point
├── frontend/                   # Angular 19 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Services, guards, interceptors
│   │   │   ├── features/       # Feature modules (dashboard, assessment, etc.)
│   │   │   ├── shared/         # Reusable components
│   │   │   └── layouts/        # App shell
│   │   └── styles/             # Tailwind CSS
│   └── tailwind.config.js
└── docs/                       # Documentation
    ├── APP_DOCUMENTATION.md
    ├── DATABASE_ARCHITECTURE.md
    ├── DEVELOPMENT_PLAN.md
    └── REAL_WORLD_DATA_RESEARCH.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn
- Angular CLI 19

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed        # Seed database with real-world data
npm run dev         # Start development server
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve            # Start development server
```

### Access the App
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

---

## Core Concepts

### 1. Data-Driven Intelligence
All career insights come from real job descriptions (Google, Meta, Amazon, etc.), not AI guessing.

### 2. Rule-Based Calculations
- **Gap:** `requiredLevel - currentLevel`
- **Priority:** `gap × weight`
- **Readiness:** `(achievedScore / totalScore) × 100`

### 3. Dependency-Aware Roadmap
Learning order respects technical prerequisites (e.g., learn TypeScript before Angular).

### 4. Backend = Single Source of Truth
All business logic lives in the backend. Frontend only displays.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and get JWT
- `GET /api/auth/me` - Get current user

### Roles & Skills
- `GET /api/roles` - List all roles
- `GET /api/skills` - List all skills
- `GET /api/skills/by-role/:roleId` - Skills for a role

### Analysis (Protected)
- `GET /api/gap-analysis` - Calculate skill gaps
- `GET /api/roadmap` - Generate learning roadmap
- `GET /api/readiness` - Calculate readiness score

### Progress (Protected)
- `POST /api/user-skills` - Save skill assessment
- `POST /api/progress` - Mark topic complete
- `GET /api/progress` - Get progress history

---

## Design Philosophy

### What SkillPath IS
✅ A career decision system  
✅ A clarity tool  
✅ A roadmap generator  
✅ A progress tracker  

### What SkillPath IS NOT
❌ A course platform  
❌ A job portal  
❌ A task manager  
❌ LinkedIn  

**SkillPath doesn't teach. It tells you WHAT to learn, WHY, and IN WHAT ORDER.**

---

## Development Timeline

**Total:** 12 weeks (full-time) or 24 weeks (part-time)

- **Phase 1:** Backend Core (2 weeks)
- **Phase 2:** Business Logic & APIs (2 weeks)
- **Phase 3:** Frontend Foundation (2 weeks)
- **Phase 4:** Feature Components (3 weeks)
- **Phase 5:** Integration & Polish (2 weeks)
- **Phase 6:** Deployment (1 week)

---

## Documentation

- **[APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md)** - Complete system architecture
- **[DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)** - Database design & schemas
- **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** - 12-week implementation plan
- **[REAL_WORLD_DATA_RESEARCH.md](./REAL_WORLD_DATA_RESEARCH.md)** - Real job requirements data

---

## License

[Choose appropriate license - MIT, Apache 2.0, etc.]

---

## Contact

**Project:** SkillPath  
**Tagline:** Your career roadmap, data-driven  
**Repository:** [Add GitHub URL]  
**Website:** [Add website URL]

---

**Built with clarity in mind. Powered by data, not guesswork.**

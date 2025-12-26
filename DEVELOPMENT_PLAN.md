# Development Plan
## SkillPath - Career Growth & Skill Gap Analysis Platform

---

## Project Overview

**Tech Stack:**
- Frontend: Angular 19 + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT + bcrypt

**Target MVP:** 3-4 roles, 25-30 skills, full gap analysis & roadmap system

---

## Phase 1: Foundation & Backend Core (Week 1-2)

### 1.1 Project Setup (2 days)
- [x] Create project structure
- [ ] Initialize Git repository
- [ ] Set up backend folder structure
- [ ] Set up frontend folder structure
- [ ] Configure environment variables (.env)
- [ ] Install dependencies (backend & frontend)
- [ ] Set up MongoDB connection
- [ ] Create README and documentation

**Deliverables:**
- Working project structure
- MongoDB connected
- Basic Express server running
- Angular app scaffolded

---

### 1.2 Database Schema & Models (3 days)

**Priority Order:**
1. Core collections first (roles, skills, skillLevels)
2. Mapping collections (roleSkillMap, skillDependencies)
3. User collections (users, userSkills, userProgress)
4. Enhancement collections (skillTopics, skillHistory, roleComparison)

**Tasks:**
- [ ] Create `models/Role.js`
- [ ] Create `models/Skill.js`
- [ ] Create `models/SkillLevel.js`
- [ ] Create `models/RoleSkillMap.js`
- [ ] Create `models/SkillDependency.js`
- [ ] Create `models/SkillTopic.js`
- [ ] Create `models/User.js` (with password hashing)
- [ ] Create `models/UserSkill.js`
- [ ] Create `models/UserProgress.js`
- [ ] Create `models/SkillHistory.js`
- [ ] Create `models/RoleComparison.js`
- [ ] Add validation rules to all schemas
- [ ] Add indexes for performance

**Deliverables:**
- 11 MongoDB schemas with validation
- Indexed fields for queries
- Schema documentation

---

### 1.3 Seed Data with Real-World Information (4 days)

**Data Collection:**
- [ ] Analyze 50+ job descriptions (saved from web search)
- [ ] Extract skill requirements and frequencies
- [ ] Map skill levels to job requirements
- [ ] Identify skill dependencies
- [ ] Curate official documentation links

**Data Creation:**
- [ ] Define 5 skill levels with clear definitions
- [ ] Create 3-4 roles:
  - Junior UI Developer
  - Senior UI Developer
  - Full Stack Developer
  - (Optional: Frontend Lead)
- [ ] Create 25-30 skills with categories
- [ ] Create roleSkillMap entries (role requirements)
- [ ] Create skillDependencies (learning order)
- [ ] Create 3-7 topics per skill with:
  - Estimated learning hours
  - Difficulty levels
  - Resource links (official docs)
- [ ] Create seed script `scripts/seedData.js`
- [ ] Test seed script multiple times

**Deliverables:**
- `scripts/seedData.js` with real-world data
- `data/` folder with JSON source files
- Seed data documentation
- Successfully seeded database

---

## Phase 2: Backend Business Logic & APIs (Week 3-4)

### 2.1 Authentication System (3 days)

**Tasks:**
- [ ] Create `services/auth.service.js`
  - Password hashing (bcrypt)
  - JWT token generation
  - Token verification
  - Token expiration handling
- [ ] Create `middleware/auth.middleware.js`
  - Token validation
  - User extraction from token
  - Route protection
- [ ] Create `controllers/auth.controller.js`
  - Register endpoint logic
  - Login endpoint logic
  - Get current user logic
- [ ] Create `routes/auth.routes.js`
- [ ] Test authentication flow

**Deliverables:**
- Working registration
- Working login with JWT
- Protected route middleware
- Authentication tests

---

### 2.2 Core Business Logic Services (5 days)

**Priority Order:**

**Day 1-2: Gap Calculation Service**
- [ ] Create `services/gapCalculation.service.js`
  - Calculate gap: `requiredLevel - currentLevel`
  - Calculate priority: `gap × weight`
  - Identify mandatory gaps
  - Calculate category-wise gaps
  - Return structured gap data
- [ ] Write unit tests for gap calculations

**Day 3: Readiness Score Service**
- [ ] Create `services/readinessScore.service.js`
  - Calculate achieved score: `sum(userLevel × weight)`
  - Calculate total score: `sum(requiredLevel × weight)`
  - Calculate readiness: `(achieved / total) × 100`
  - Calculate category-wise readiness
- [ ] Write unit tests

**Day 4-5: Roadmap Generation Service**
- [ ] Create `services/roadmapGeneration.service.js`
  - Fetch skills with gaps > 0
  - Apply ordering logic:
    1. Mandatory first
    2. Sort by priority score
    3. Enforce dependencies
  - Fetch topics for each skill
  - Calculate time estimates
  - Return ordered roadmap
- [ ] Create `services/dependencyResolver.service.js`
  - Topological sort for dependencies
  - Validate circular dependencies
  - Resolve prerequisite chains
- [ ] Write unit tests

**Deliverables:**
- 4 core service files
- Unit tests for all calculations
- Service documentation

---

### 2.3 Additional Services (2 days)

- [ ] Create `services/timeEstimate.service.js`
  - Calculate learning time per skill
  - Apply experience multipliers
  - Calculate total roadmap time
- [ ] Create `services/nextSkill.service.js`
  - Recommend next skill to learn
  - Check dependencies satisfied
  - Priority-based recommendation
- [ ] Create `services/skillHistory.service.js`
  - Track skill level changes
  - Calculate progress velocity
- [ ] Create `services/dashboard.service.js`
  - Aggregate dashboard metrics
  - Recent progress
  - Quick stats

**Deliverables:**
- 4 helper services
- Tested and documented

---

### 2.4 API Controllers & Routes (4 days)

**Day 1: Auth & User Routes**
- [ ] `controllers/auth.controller.js` (register, login, me)
- [ ] `controllers/users.controller.js` (profile, update, set target role)
- [ ] `routes/auth.routes.js`
- [ ] `routes/users.routes.js`

**Day 2: Roles & Skills Routes**
- [ ] `controllers/roles.controller.js` (list, get by id)
- [ ] `controllers/skills.controller.js` (list, by role, skill levels)
- [ ] `routes/roles.routes.js`
- [ ] `routes/skills.routes.js`

**Day 3: Analysis Routes**
- [ ] `controllers/gapAnalysis.controller.js`
- [ ] `controllers/roadmap.controller.js`
- [ ] `controllers/readiness.controller.js`
- [ ] `routes/analysis.routes.js`

**Day 4: Progress, Dashboard & Export**
- [ ] `controllers/progress.controller.js`
- [ ] `controllers/dashboard.controller.js`
- [ ] `controllers/roleComparison.controller.js`
- [ ] `controllers/export.controller.js`
- [ ] Respective route files

**Deliverables:**
- 10+ API endpoints
- All routes protected appropriately
- API documentation (Postman collection or Swagger)

---

### 2.5 Error Handling & Validation (1 day)

- [ ] Create `middleware/errorHandler.js`
  - Global error handler
  - Structured error responses
- [ ] Create `middleware/validation.js`
  - Request validation
  - Schema validation
- [ ] Add try-catch to all controllers
- [ ] Test error scenarios

**Deliverables:**
- Centralized error handling
- Validation middleware
- Error documentation

---

### 2.6 API Documentation with Swagger (1 day)

- [ ] Install swagger-ui-express and swagger-jsdoc
- [ ] Create `config/swagger.js` configuration
- [ ] Add JSDoc comments to all routes
- [ ] Document request/response schemas
- [ ] Add authentication documentation
- [ ] Configure Swagger UI endpoint (/api-docs)
- [ ] Add example requests/responses
- [ ] Test all endpoints via Swagger UI

**Deliverables:**
- Interactive API documentation at /api-docs
- Complete OpenAPI 3.0 specification
- Example requests for all endpoints
- Try-it-out functionality working

---

## Phase 3: Frontend Foundation (Week 5-6)

### 3.1 Angular Project Setup (2 days)

- [ ] Create Angular 19 project
- [ ] Install Tailwind CSS
- [ ] Configure Tailwind (tailwind.config.js)
  - Enable dark mode (class strategy)
  - Configure content paths
  - Custom theme colors
- [ ] Set up folder structure:
  - `core/` - Services, guards, interceptors
  - `features/` - Feature modules
  - `shared/` - Shared components
  - `layouts/` - App layout
- [ ] Configure routing
- [ ] Set up environment files

**Deliverables:**
- Angular app with Tailwind CSS
- Configured dark mode support
- Project structure ready

---

### 3.2 Core Services & Guards (2 days)

- [ ] Create `core/services/api.service.ts`
  - HTTP client wrapper
  - Base URL configuration
  - Error handling
- [ ] Create `core/services/auth.service.ts`
  - Login/register methods
  - Token storage (localStorage)
  - Token retrieval
  - Logout
  - Current user state (BehaviorSubject)
- [ ] Create `core/services/theme.service.ts`
  - Toggle dark/light mode
  - Save preference to localStorage
  - Apply theme on init
- [ ] Create `core/guards/auth.guard.ts`
  - Route protection
  - Redirect to login if not authenticated
- [ ] Create `core/interceptors/auth.interceptor.ts`
  - Attach JWT token to requests
  - Handle 401 errors

**Deliverables:**
- 3 core services
- 1 guard
- 1 interceptor
- Authentication flow ready

---

### 3.3 Shared Components (3 days)

**Reusable UI Components:**
- [ ] `shared/components/button/` - Tailwind-styled buttons
- [ ] `shared/components/modal/` - Modal with close button only
- [ ] `shared/components/card/` - Compact card component
- [ ] `shared/components/badge/` - Skill level badges
- [ ] `shared/components/progress-bar/` - Progress visualization
- [ ] `shared/components/skill-level-indicator/` - 1-5 level display
- [ ] `shared/components/loading-spinner/` - Loading state
- [ ] `shared/components/chart/` - Simple bar/line charts
- [ ] `shared/components/toast/` - Notifications (errors only)

**Deliverables:**
- 9 reusable components
- Tailwind-styled, dark mode compatible
- Compact design with minimal white space

---

### 3.4 Layout & Navigation (2 days)

- [ ] Create `layouts/main-layout/`
  - Header with navigation
  - Theme toggle button
  - User menu (logout)
  - Sidebar (collapsible on mobile)
  - Main content area
  - Footer (optional)
- [ ] Create navigation structure
  - Dashboard
  - Role Selection
  - Skill Assessment
  - Gap Analysis
  - Roadmap
  - Progress
- [ ] Implement responsive design
- [ ] Add dark/light mode toggle

**Deliverables:**
- Main layout with navigation
- Responsive sidebar
- Theme toggle working
- Dark/light mode applied

---

## Phase 4: Feature Components (Week 7-9)

### 4.1 Authentication Pages (2 days)

- [ ] Create `features/auth/login/`
  - Login form (email, password)
  - Form validation
  - Error handling
  - Redirect on success
- [ ] Create `features/auth/register/`
  - Registration form (name, email, password)
  - Password confirmation
  - Form validation
  - Auto-login on success
- [ ] Style with Tailwind (compact, modern)

**Deliverables:**
- Login page
- Register page
- Working authentication flow

---

### 4.2 Dashboard (3 days)

- [ ] Create `features/dashboard/`
  - Summary cards:
    - Total skills assessed
    - Skills with gaps
    - Current readiness %
    - Time to readiness
  - Next recommended skill card
  - Recent progress timeline
  - Quick actions (assess skill, mark progress)
  - Visual charts (readiness, progress)
- [ ] Create dashboard service
- [ ] Integrate with backend API
- [ ] Add loading states

**Deliverables:**
- Dashboard with overview metrics
- Charts and visualizations
- Responsive design

---

### 4.3 Role Selection (2 days)

- [ ] Create `features/role-selection/`
  - List all available roles
  - Role cards with descriptions
  - Skill requirements preview
  - Select target role button
  - Current target role indicator
- [ ] Integrate with roles API
- [ ] Update user's target role

**Deliverables:**
- Role selection page
- Role cards
- Target role setting

---

### 4.4 Skill Assessment (4 days)

- [ ] Create `features/skill-assessment/`
  - List skills for target role
  - Skill assessment form:
    - Current level (1-5 radio/slider)
    - Used in production (checkbox)
    - Recent usage (checkbox)
  - Save individual skill assessment
  - Batch save all assessments
  - Progress indicator (X of Y assessed)
  - Skill details modal
- [ ] Create skill assessment service
- [ ] Integrate with API
- [ ] Add validation

**Deliverables:**
- Skill assessment interface
- Individual & batch save
- Progress tracking

---

### 4.5 Gap Analysis (3 days)

- [ ] Create `features/gap-analysis/`
  - Gap matrix table:
    - Skill name
    - Required level
    - Current level
    - Gap
    - Priority score
    - Mandatory indicator
  - Category filters
  - Sort by priority/gap
  - Color-coded gaps (red = critical, yellow = medium, green = sufficient)
  - Summary statistics
  - Export option
- [ ] Integrate with gap analysis API
- [ ] Add visualizations

**Deliverables:**
- Gap analysis dashboard
- Interactive table
- Visual indicators

---

### 4.6 Roadmap (4 days)

- [ ] Create `features/roadmap/`
  - Ordered skill list
  - For each skill:
    - Skill name & gap
    - Priority score
    - Mandatory indicator
    - Prerequisites (dependencies)
    - Topics to learn (expandable)
    - Estimated time
    - Resource links
    - Mark as in-progress/completed
  - Timeline view (optional)
  - Progress tracking
  - Time to completion estimate
- [ ] Integrate with roadmap API
- [ ] Add topic expansion
- [ ] Add resource links

**Deliverables:**
- Roadmap page
- Ordered learning path
- Topic details
- Resource links

---

### 4.7 Progress Tracking (3 days)

- [ ] Create `features/progress/`
  - List of skills/topics
  - Mark topic as completed
  - Progress percentage per skill
  - Overall progress
  - Historical progress chart
  - Skill level change history
  - Progress velocity metrics
- [ ] Integrate with progress API
- [ ] Add skill history visualization

**Deliverables:**
- Progress tracking page
- Mark completion
- Historical view

---

### 4.8 Role Comparison (3 days)

- [ ] Create `features/role-comparison/`
  - Select 2-3 roles to compare
  - Side-by-side comparison table
  - Skill overlap visualization
  - Gap differences
  - Time estimate comparison
  - Save comparison
- [ ] Integrate with comparison API
- [ ] Add visual comparison

**Deliverables:**
- Role comparison page
- Side-by-side view
- Visual comparisons

---

### 4.9 Export & Reports (2 days)

- [ ] Create `features/export/`
  - Export roadmap (JSON/text)
  - Export gap analysis
  - Export progress report
  - Download functionality
  - Print-friendly view
- [ ] Integrate with export API

**Deliverables:**
- Export functionality
- Downloadable reports

---

## Phase 5: Integration & Polish (Week 10-11)

### 5.1 Full Integration Testing (3 days)

- [ ] Test complete user flow:
  1. Register
  2. Select role
  3. Assess skills
  4. View gap analysis
  5. View roadmap
  6. Mark progress
  7. View readiness
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test error scenarios
- [ ] Test responsive design
- [ ] Test dark/light mode

**Deliverables:**
- Fully integrated app
- Bug fixes
- Test documentation

---

### 5.2 UI/UX Polish (3 days)

- [ ] Review all pages for consistency
- [ ] Optimize spacing (compact design)
- [ ] Improve transitions and animations
- [ ] Add loading states everywhere
- [ ] Add empty states
- [ ] Improve error messages
- [ ] Add helpful tooltips
- [ ] Optimize mobile experience
- [ ] Accessibility improvements

**Deliverables:**
- Polished UI
- Consistent design
- Improved UX

---

### 5.3 Performance Optimization (2 days)

**Backend:**
- [ ] Add MongoDB indexes
- [ ] Optimize queries
- [ ] Add response caching (Redis optional)
- [ ] Compress responses

**Frontend:**
- [ ] Lazy load feature modules
- [ ] Optimize bundle size
- [ ] Add service worker (optional)
- [ ] Optimize images

**Deliverables:**
- Faster load times
- Optimized queries
- Better performance

---

### 5.4 Documentation & Deployment Prep (2 days)

- [ ] Complete API documentation
- [ ] Update README files
- [ ] Create user guide
- [ ] Create deployment guide
- [ ] Set up environment variables
- [ ] Prepare for deployment:
  - Backend (Heroku, Railway, or VPS)
  - Frontend (Vercel, Netlify)
  - Database (MongoDB Atlas)

**Deliverables:**
- Complete documentation
- Deployment-ready app
- User guide

---

## Phase 6: Deployment & Testing (Week 12)

### 6.1 Deployment (3 days)

- [ ] Set up MongoDB Atlas
- [ ] Deploy backend to cloud
- [ ] Deploy frontend to cloud
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Test production deployment
- [ ] Seed production database

**Deliverables:**
- Live application
- Production database
- Working authentication

---

### 6.2 User Acceptance Testing (2 days)

- [ ] Test with real users
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Make UI adjustments

**Deliverables:**
- Tested application
- User feedback
- Bug fixes

---

### 6.3 Final Polish & Launch (2 days)

- [ ] Final bug fixes
- [ ] Final UI polish
- [ ] Create demo account
- [ ] Create landing page (optional)
- [ ] Prepare launch materials

**Deliverables:**
- Production-ready app
- Demo account
- Launch-ready

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Backend Core | 2 weeks | Database, schemas, seed data |
| Phase 2: Business Logic & APIs | 2 weeks | Services, controllers, API endpoints |
| Phase 3: Frontend Foundation | 2 weeks | Angular setup, core services, shared components |
| Phase 4: Feature Components | 3 weeks | All feature pages and components |
| Phase 5: Integration & Polish | 2 weeks | Testing, optimization, documentation |
| Phase 6: Deployment | 1 week | Production deployment, UAT |
| **Total** | **12 weeks** | **Complete MVP** |

---

## Development Priorities

### Must Have (MVP)
- ✅ Authentication (register, login)
- ✅ Role selection
- ✅ Skill assessment
- ✅ Gap analysis
- ✅ Roadmap generation
- ✅ Progress tracking
- ✅ Readiness score
- ✅ Dashboard
- ✅ Dark/light mode

### Should Have (MVP+)
- ✅ Role comparison
- ✅ Learning time estimates
- ✅ Skill history
- ✅ Resource links
- ✅ Export functionality

### Nice to Have (Future)
- Admin panel for data management
- Password reset
- Email notifications
- Social login (OAuth)
- Mobile app
- AI recommendations
- Peer comparison

---

## Risk Management

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex dependency resolution | High | Build and test early, use well-tested algorithms |
| Performance with large datasets | Medium | Add indexes, optimize queries, add caching |
| Authentication security | High | Use industry-standard JWT, bcrypt, follow best practices |
| Frontend bundle size | Medium | Lazy loading, tree-shaking, code splitting |

### Project Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | High | Stick to MVP, defer nice-to-haves |
| Data quality issues | High | Validate seed data thoroughly, use real job descriptions |
| Timeline overruns | Medium | Buffer time, prioritize features |

---

## Success Criteria

### MVP Launch Criteria
- [ ] User can register and login
- [ ] User can select a target role
- [ ] User can assess their skills
- [ ] System calculates gaps accurately
- [ ] System generates ordered roadmap
- [ ] User can track progress
- [ ] Readiness score calculates correctly
- [ ] Dark/light mode works
- [ ] Mobile responsive
- [ ] No critical bugs
- [ ] API documentation complete
- [ ] Deployed to production

### Post-Launch Metrics
- User registration rate
- Skill assessment completion rate
- Roadmap generation success rate
- User retention (return visits)
- Average readiness improvement over time

---

## Next Steps

1. **Review this plan** and approve/adjust
2. **Set up development environment** (Phase 1.1)
3. **Start with backend foundation** (Phase 1.2)
4. **Weekly progress reviews**
5. **Iterate based on feedback**

---

## Notes

- This is an aggressive but achievable 12-week timeline
- Each phase builds on the previous
- Testing is continuous, not just at the end
- Documentation is created alongside code
- Regular commits to Git throughout
- Weekly demos to stakeholders (if applicable)

---

**Total Estimated Effort:** 12 weeks (full-time) or 24 weeks (part-time)

**Team Size:** 1 full-stack developer

**Technologies Confirmed:**
- Backend: Node.js 18+, Express 4.x, MongoDB 6+, Mongoose 8.x, JWT, bcrypt
- Frontend: Angular 19, Tailwind CSS 3+, RxJS
- Tools: Git, Postman, VS Code

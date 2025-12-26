# SkillPath - Complete User Flow Analysis

## Overview
SkillPath is a Career Growth & Skill Gap Analysis Platform that helps users identify skill gaps, create personalized learning roadmaps, and track progress toward their career goals.

---

## 🎯 High-Level User Journey Flowchart

```mermaid
flowchart TD
    A[Visit SkillPath] --> B{Authenticated?}
    B -->|No| C[Landing Page]
    C --> D[Register/Login]
    D --> E[Dashboard]
    B -->|Yes| E
    
    E --> F{Has Target Role?}
    F -->|No| G[Select Target Role]
    G --> H[Choose from 3 Roles]
    H --> I[Save to Database]
    I --> J[Skill Assessment]
    
    F -->|Yes| K{Skills Assessed?}
    K -->|No| J
    K -->|Yes| L[View Dashboard Stats]
    
    J --> M[Rate 12 Skills 1-5]
    M --> N[Save Assessments]
    N --> O[Create Skill History]
    O --> P[Gap Analysis]
    
    P --> Q[Calculate Gaps]
    Q --> R[Learning Roadmap]
    R --> S[Ordered Topics + Resources]
    S --> T[Track Progress]
    
    T --> U{Learning Complete?}
    U -->|No| V[Study Resources]
    V --> W[Mark Topics Complete]
    W --> T
    
    U -->|Yes| X[Reassess Skills]
    X --> M
    
    L --> Y[Role Comparison]
    L --> Z[Skill History]
    L --> AA[Profile Management]
    
    style A fill:#e1f5ff
    style E fill:#fff4e1
    style P fill:#ffe1e1
    style R fill:#e1ffe1
    style T fill:#f0e1ff
```

---

## 🎯 Application Architecture

### Frontend (Angular 19)
- **Port**: http://localhost:4200
- **Styling**: Tailwind CSS with dark/light mode
- **State Management**: Angular Signals
- **HTTP**: HttpClient with interceptors
- **Authentication**: JWT with localStorage

### Backend (Node.js + Express)
- **Port**: http://localhost:3000
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcrypt
- **API Docs**: Swagger UI at http://localhost:3000/api-docs

---

## 🔄 System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend - Angular 19"
        A[User Browser] --> B[Angular Components]
        B --> C[Services & Guards]
        C --> D[HTTP Interceptor]
        D --> E[API Calls with JWT]
    end
    
    subgraph "Backend - Node.js + Express"
        F[Express Server :3000] --> G[Auth Middleware]
        G --> H[Controllers]
        H --> I[Services Business Logic]
        I --> J[Mongoose Models]
    end
    
    subgraph "Database - MongoDB"
        K[(11 Collections)]
        K --> L[users]
        K --> M[roles]
        K --> N[skills]
        K --> O[userSkills]
        K --> P[skillHistory]
        K --> Q[userProgress]
        K --> R[+ 5 more]
    end
    
    E -->|HTTP Requests| F
    F -->|Response| E
    J -->|CRUD Operations| K
    K -->|Data| J
    
    style A fill:#e1f5ff
    style F fill:#fff4e1
    style K fill:#ffe1e1
```

---

## 📱 Complete User Journey

### **Phase 1: Landing & Authentication**

#### 1.1 Landing Page (`/`)
**Frontend**: `LandingComponent` (MainLayoutComponent)
**Route**: Public (no auth required)

**User sees**:
- Hero section explaining SkillPath
- Feature cards (Skill Assessment, Gap Analysis, Learning Roadmap, Progress Tracking)
- Call-to-action buttons
- Header with Login/Register buttons and theme toggle

**Actions available**:
- Click "Get Started" → Redirects to `/register`
- Click "Login" → Redirects to `/login`
- Click "Register" → Redirects to `/register`
- Toggle dark/light mode

---

#### 1.2 Registration (`/register`)
**Frontend**: `RegisterComponent`
**Backend**: `POST /api/auth/register`
**Guard**: `guestGuard` (prevents authenticated users)

**User Flow**:
1. User fills form:
   - Name (required, 2-100 chars)
   - Email (required, unique, valid format)
   - Password (required, min 8 chars)
   - Experience Years (optional, 0-50)

2. Frontend submits to backend
3. Backend:
   - Validates input
   - Checks if email exists
   - Hashes password with bcrypt
   - Creates user in MongoDB
   - Generates JWT token
   - Returns token + user object

4. Frontend:
   - Stores JWT in localStorage (`skillpath_token`)
   - Stores user in localStorage (`skillpath_user`)
   - Updates `AuthService.currentUser` signal
   - Redirects to `/dashboard`

**Backend Controller**: `auth.controller.js::register`
**Database**: Creates document in `users` collection

---

#### 1.3 Login (`/login`)
**Frontend**: `LoginComponent`
**Backend**: `POST /api/auth/login`
**Guard**: `guestGuard`

**User Flow**:
1. User enters:
   - Email
   - Password

2. Backend:
   - Finds user by email
   - Compares password with bcrypt
   - Updates `lastLogin` field
   - Generates JWT token
   - Returns token + user object (with `targetRoleId`)

3. Frontend:
   - Stores token and user in localStorage
   - Maps `targetRoleId` to `targetRole` for frontend compatibility
   - Redirects to `/dashboard`

**Backend Controller**: `auth.controller.js::login`

---

## 🔐 Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant DB as MongoDB
    
    Note over U,DB: Registration Flow
    U->>F: Fill registration form
    F->>B: POST /api/auth/register
    B->>DB: Check if email exists
    DB-->>B: Email available
    B->>B: Hash password with bcrypt
    B->>DB: Create user document
    DB-->>B: User created
    B->>B: Generate JWT token
    B-->>F: {token, user}
    F->>F: Store in localStorage
    F->>F: Update AuthService signal
    F-->>U: Redirect to /dashboard
    
    Note over U,DB: Login Flow
    U->>F: Enter email & password
    F->>B: POST /api/auth/login
    B->>DB: Find user by email
    DB-->>B: User found
    B->>B: Compare password with bcrypt
    B->>DB: Update lastLogin
    B->>B: Generate JWT token
    B-->>F: {token, user}
    F->>F: Store token & user
    F-->>U: Redirect to /dashboard
    
    Note over U,DB: Protected Route Access
    U->>F: Navigate to /dashboard/*
    F->>F: AuthGuard checks token
    F->>B: GET /api/* (with JWT header)
    B->>B: Verify JWT in middleware
    B->>DB: Fetch protected data
    DB-->>B: Data returned
    B-->>F: Response
    F-->>U: Display data
```

---

### **Phase 2: Dashboard & Setup**

#### 2.1 Dashboard Home (`/dashboard`)
**Frontend**: `DashboardComponent` (DashboardLayoutComponent)
**Guard**: `authGuard` (requires authentication)
**Backend**: Multiple API calls

**On Load**:
1. Check if user has `targetRole` set
2. If yes, fetch:
   - `GET /api/analysis/readiness/{roleId}` → Readiness score
   - `GET /api/analysis/roadmap/{roleId}` → Roadmap count
   - `GET /api/dashboard` → Dashboard stats

**User sees**:
- Welcome message with first name
- Target role name (if set)
- Readiness score with circular progress (if available)
- Quick action cards:
  - Select/Change Target Role
  - Assess Skills
  - View Gap Analysis
  - View Learning Roadmap
  - Compare Roles
  - View Progress History
- Getting Started Guide (if new user)

**Navigation Menu** (Desktop & Mobile):
- Dashboard
- Skills
- Roadmap
- Compare
- Profile (in dropdown)
- Sign Out (in dropdown)

---

#### 2.2 Role Selection (`/dashboard/role-selection`)
**Frontend**: `RoleSelectionComponent`
**Backend**: `GET /api/roles`, `PUT /api/auth/target-role`

**User Flow**:
1. **Load Roles**:
   - Frontend calls `GET /api/roles`
   - Backend returns all active roles from seed data:
     - Junior UI Developer (0-2 years, Frontend)
     - Senior UI Developer (5-8 years, Frontend)
     - Full Stack Developer (3-6 years, Full Stack)

2. **User sees**:
   - Current target role (if already set)
   - Grid of role cards with:
     - Role name and level badge
     - Category (Frontend/Full Stack)
     - Description
     - Average salary range (₹ INR)
     - Selection indicator

3. **User selects a role**:
   - Clicks on role card
   - Card shows blue ring and checkmark
   - "Confirm Selection" button appears

4. **Confirmation**:
   - Frontend calls `PUT /api/auth/target-role` with roleId
   - Backend updates `user.targetRoleId` in MongoDB
   - Backend returns updated user object
   - Frontend updates localStorage and signal
   - Redirects to `/dashboard/skills`

**Backend Controllers**:
- `roles.controller.js::getAllRoles`
- `auth.controller.js::setTargetRole`

**Database**: Updates `users` collection (`targetRoleId` field)

---

## 🎯 Role Selection Flow

```mermaid
flowchart TD
    A[User clicks Select Target Role] --> B[Load Roles]
    B --> C[GET /api/roles]
    C --> D[Display 3 Role Cards]
    
    D --> E[Junior UI Developer<br/>0-2 years, Frontend]
    D --> F[Senior UI Developer<br/>5-8 years, Frontend]
    D --> G[Full Stack Developer<br/>3-6 years, Full Stack]
    
    E --> H{User Clicks Role}
    F --> H
    G --> H
    
    H --> I[Highlight Selected Role]
    I --> J[Show Confirm Button]
    J --> K{User Confirms?}
    
    K -->|No| L[Click Cancel]
    L --> M[Return to Dashboard]
    
    K -->|Yes| N[PUT /api/auth/target-role]
    N --> O[Update user.targetRoleId in DB]
    O --> P[Return updated user]
    P --> Q[Update localStorage]
    Q --> R[Update currentUser signal]
    R --> S[Redirect to /dashboard/skills]
    
    style H fill:#e1f5ff
    style N fill:#fff4e1
    style O fill:#ffe1e1
    style S fill:#e1ffe1
```

---

#### 2.3 Skill Assessment (`/dashboard/skills`)
**Frontend**: `SkillAssessmentComponent`
**Backend**: `GET /api/skills`, `GET /api/skills/levels`, `POST /api/user-skills/bulk-assess`

**User Flow**:
1. **Check Prerequisites**:
   - If no `targetRole`, show warning and "Select Target Role" button
   - If `targetRole` exists, proceed

2. **Load Data**:
   - `GET /api/skills` → All 12 core skills from seed data
   - `GET /api/skills/levels` → 5 level definitions (Beginner to Expert)
   - Load existing user skill assessments if any

3. **User sees**:
   - Skill Level Reference card at top:
     - Level 1: Beginner
     - Level 2: Basic
     - Level 3: Intermediate
     - Level 4: Advanced
     - Level 5: Expert
   
   - Skill cards for each skill (e.g., HTML/CSS, JavaScript, TypeScript, etc.):
     - Skill name and category badge
     - Description
     - 5 level selector buttons (1-5)
     - Confidence slider (0-100%) - appears after level selection

4. **User Assessment**:
   - Clicks level buttons for each skill (1-5)
   - Optionally adjusts confidence slider
   - Can assess all 12 skills or just relevant ones

5. **Save**:
   - Clicks "Save & Continue"
   - Frontend calls `POST /api/user-skills/bulk-assess` with array:
     ```json
     {
       "assessments": [
         { "skillId": "...", "currentLevel": 3, "confidenceScore": 75 },
         ...
       ]
     }
     ```
   - Backend:
     - Creates or updates `userSkills` documents
     - Records in `skillHistory` for tracking
     - Updates `lastAssessed` timestamp
   - Redirects to `/dashboard/gap-analysis`

**Backend Controllers**:
- `skills.controller.js::getAllSkills`
- `userSkills.controller.js::bulkAssess`

**Database**: 
- Reads from: `skills`, `skillLevels`
- Writes to: `userSkills`, `skillHistory`

---

## 📊 Skill Assessment Flow

```mermaid
flowchart TD
    A[Navigate to /dashboard/skills] --> B{Has Target Role?}
    B -->|No| C[Show Warning Message]
    C --> D[Select Target Role Button]
    D --> E[Redirect to Role Selection]
    
    B -->|Yes| F[Load Skills & Levels]
    F --> G[GET /api/skills]
    F --> H[GET /api/skills/levels]
    G --> I[Display 12 Skill Cards]
    H --> I
    
    I --> J[User Clicks Level 1-5]
    J --> K[Show Confidence Slider]
    K --> L[User Adjusts Confidence 0-100%]
    
    L --> M{More Skills?}
    M -->|Yes| J
    M -->|No| N[Click Save & Continue]
    
    N --> O[POST /api/user-skills/bulk-assess]
    O --> P{Skills Array}
    
    P --> Q[Create/Update userSkills]
    P --> R[Create skillHistory entries]
    P --> S[Update lastAssessed timestamp]
    
    Q --> T[Success Response]
    R --> T
    S --> T
    
    T --> U[Show Success Message]
    U --> V[Redirect to /dashboard/gap-analysis]
    
    style B fill:#fff4e1
    style O fill:#ffe1e1
    style Q fill:#e1ffe1
    style V fill:#e1f5ff
```

---

### **Phase 3: Analysis & Planning**

#### 3.1 Gap Analysis (`/dashboard/gap-analysis`)
**Frontend**: `GapAnalysisComponent`
**Backend**: `GET /api/analysis/gap/{roleId}`

**User Flow**:
1. **Load Gap Analysis**:
   - Frontend calls `GET /api/analysis/gap/{targetRoleId}`
   - Backend service (`gapCalculation.service.js`):
     - Fetches required skills for target role from `roleSkillMap`
     - Fetches user's current skill levels from `userSkills`
     - Calculates gaps: `gap = requiredLevel - currentLevel`
     - Calculates priority: `priority = gap × weight`
     - Sorts by mandatory first, then priority

2. **User sees**:
   - Target role name
   - Summary statistics:
     - Total skills analyzed
     - Skills mastered (gap ≤ 0)
     - Skills with gaps (gap > 0)
   
   - Skill gap cards:
     - Skill name and category
     - Current level vs Required level
     - Visual gap indicator (colored bar)
     - Gap size (1-5 levels)
     - Priority score
     - "Mandatory" badge (if applicable)
     - Color coding:
       - Red: Large gaps (3+ levels)
       - Yellow: Medium gaps (1-2 levels)
       - Green: Proficient (no gap)

3. **Actions**:
   - Click "View Roadmap" → Navigate to `/dashboard/roadmap`
   - Click "Reassess Skills" → Navigate to `/dashboard/skills`

**Backend Service**: `gapCalculation.service.js`
**Business Logic**:
```javascript
gap = requiredLevel - currentLevel
priority = gap × weight
isMet = currentLevel >= requiredLevel
```

**Database Reads**: `roleSkillMap`, `userSkills`, `skills`, `roles`

---

## 🔍 Gap Analysis Flow

```mermaid
flowchart TD
    A[Navigate to /dashboard/gap-analysis] --> B[GET /api/analysis/gap/roleId]
    
    B --> C[Backend: Gap Calculation Service]
    C --> D[Fetch roleSkillMap for target role]
    C --> E[Fetch userSkills for user]
    
    D --> F[Calculate Gaps]
    E --> F
    
    F --> G[For each skill:<br/>gap = requiredLevel - currentLevel<br/>priority = gap × weight]
    
    G --> H{Is Mandatory?}
    H -->|Yes| I[Mark as Mandatory]
    H -->|No| J[Calculate Priority]
    
    I --> K[Sort Results]
    J --> K
    
    K --> L[Order by:<br/>1. Mandatory first<br/>2. Priority descending<br/>3. Gap size]
    
    L --> M[Return Gap Analysis]
    M --> N[Frontend Displays]
    
    N --> O[Summary Stats:<br/>- Total skills<br/>- Skills mastered<br/>- Skills with gaps]
    
    N --> P[Skill Gap Cards:<br/>- Current vs Required<br/>- Gap indicator<br/>- Priority score<br/>- Color coding]
    
    P --> Q{User Action}
    Q -->|View Roadmap| R[Redirect to /dashboard/roadmap]
    Q -->|Reassess Skills| S[Redirect to /dashboard/skills]
    Q -->|Stay| T[Review gaps]
    
    style C fill:#fff4e1
    style G fill:#ffe1e1
    style P fill:#e1ffe1
```

---

#### 3.2 Learning Roadmap (`/dashboard/roadmap`)
**Frontend**: `RoadmapComponent`
**Backend**: `GET /api/analysis/roadmap/{roleId}`, `POST /api/progress/topic/{skillId}/{topicId}`

**User Flow**:
1. **Load Roadmap**:
   - Frontend calls `GET /api/analysis/roadmap/{targetRoleId}`
   - Backend services:
     - `gapCalculation.service.js` → Calculate gaps
     - `dependencyResolver.service.js` → Resolve dependencies
     - `roadmapGeneration.service.js` → Generate ordered roadmap

2. **Roadmap Generation Logic**:
   ```
   1. Identify skills with gaps (requiredLevel > currentLevel)
   2. Resolve dependencies (prerequisite skills)
   3. Order by:
      - Mandatory skills first
      - High priority (largest gaps × weights)
      - Dependencies (prerequisites before dependents)
      - Skill category grouping
   4. Attach learning topics and resources
   ```

3. **User sees**:
   - Summary:
     - Total skills to learn
     - Mandatory skills count
     - Estimated total hours
   
   - Ordered skill cards (expandable):
     - Skill name and level target
     - Mandatory badge
     - Estimated hours
     - Priority score
     - Progress bar (% topics completed)
     - "Dependencies Required" section (if any)
     
     **Expanded view**:
     - Ordered learning topics (1, 2, 3...)
     - Topic name and order
     - Checkboxes to mark complete
     - Topic duration estimates
     - Resource links (official documentation only)
     - Dependency warnings

4. **Progress Tracking**:
   - User clicks checkbox next to topic
   - Frontend calls `POST /api/progress/topic/{skillId}/{topicId}`
   - Backend:
     - Creates/updates `userProgress` document
     - Updates completion status
     - Records timestamp
   - Checkbox turns green with checkmark
   - Progress bar updates

5. **Navigation**:
   - Click "View Gap Analysis" → `/dashboard/gap-analysis`
   - Click "Update Skills" → `/dashboard/skills`

**Backend Services**:
- `roadmapGeneration.service.js` → Main orchestrator
- `dependencyResolver.service.js` → Dependency resolution
- `gapCalculation.service.js` → Gap calculation

**Backend Controller**: `roadmap.controller.js`

**Database**:
- Reads: `roleSkillMap`, `userSkills`, `skillDependencies`, `skillTopics`
- Writes: `userProgress`

---

## 🗺️ Roadmap Generation Flow

```mermaid
flowchart TD
    A[Navigate to /dashboard/roadmap] --> B[GET /api/analysis/roadmap/roleId]
    
    B --> C[Backend: Roadmap Generation Service]
    
    C --> D[Step 1: Gap Calculation]
    D --> E[Identify skills with gaps]
    
    E --> F[Step 2: Dependency Resolution]
    F --> G{Has Dependencies?}
    G -->|Yes| H[Check if dependencies met]
    G -->|No| I[Add to roadmap]
    
    H --> J{Dependencies Met?}
    J -->|No| K[Add dependencies first]
    J -->|Yes| I
    
    K --> L[Mark as blocked]
    L --> I
    
    I --> M[Step 3: Prioritization]
    M --> N[Sort by:<br/>1. Mandatory<br/>2. Priority<br/>3. Dependencies<br/>4. Category]
    
    N --> O[Step 4: Add Topics]
    O --> P[Fetch skillTopics for each skill]
    P --> Q[Order topics by sequence]
    Q --> R[Attach resource links]
    
    R --> S[Step 5: Calculate Estimates]
    S --> T[Sum estimated hours]
    T --> U[Count mandatory skills]
    
    U --> V[Return Complete Roadmap]
    V --> W[Frontend Displays]
    
    W --> X[Summary:<br/>- Total skills<br/>- Mandatory count<br/>- Total hours]
    
    W --> Y[Expandable Skill Cards:<br/>- Topics ordered<br/>- Checkboxes<br/>- Dependencies<br/>- Resources]
    
    Y --> Z{User Clicks Checkbox}
    Z --> AA[POST /api/progress/topic/skillId/topicId]
    AA --> AB[Update userProgress]
    AB --> AC[Show checkmark]
    AC --> AD[Update progress bar]
    
    style C fill:#fff4e1
    style F fill:#ffe1e1
    style M fill:#e1f5ff
    style AA fill:#e1ffe1
```

---

#### 3.3 Readiness Score
**Displayed on**: Dashboard, Profile
**Backend**: `GET /api/analysis/readiness/{roleId}`

**Calculation Logic** (`readinessScore.service.js`):
```javascript
For each required skill:
  if (currentLevel >= requiredLevel) {
    achievedScore += (currentLevel × weight)
  } else {
    achievedScore += (currentLevel × weight)
  }
  totalRequiredScore += (requiredLevel × weight)

readinessPercentage = (achievedScore / totalRequiredScore) × 100

Categories:
- 0-30%: Beginner (red)
- 31-60%: Learning (yellow)
- 61-85%: Proficient (blue)
- 86-100%: Expert (green)
```

**User sees**:
- Circular progress indicator
- Percentage score (0-100%)
- Category label
- Skills breakdown:
  - Ready skills (met requirements)
  - Skills in progress
  - Skills to learn

---

### **Phase 4: Advanced Features**

#### 4.1 Role Comparison (`/dashboard/role-comparison`)
**Frontend**: `RoleComparisonComponent`
**Backend**: `GET /api/roles`, `GET /api/analysis/readiness/{roleId}` (for each role)

**User Flow**:
1. **Load All Roles**:
   - Fetches all 3 roles
   - Calculates readiness for each role in parallel

2. **User sees**:
   - 3 role cards with:
     - Role name
     - "TARGET" badge (if current target)
     - Circular readiness progress
     - Percentage score
     - Skills ready count / Total skills
     - Color-coded by readiness level

3. **Click on role card**:
   - Expands to show detailed breakdown:
     - Overall readiness
     - Ready skills (green check)
     - Skills to improve (red warning)
     - Gap details for each skill

4. **Best Fit Recommendation**:
   - Highlights role with highest readiness
   - Shows which role matches skills best

5. **Actions**:
   - Click "Set as Target" → Updates target role via API
   - Automatically updates dashboard

**Backend**: Multiple `readinessScore.service.js` calls

---

## 📊 Readiness Score Calculation Flow

```mermaid
flowchart TD
    A[GET /api/analysis/readiness/roleId] --> B[Backend: Readiness Score Service]
    
    B --> C[Fetch roleSkillMap for role]
    B --> D[Fetch userSkills for user]
    
    C --> E[Initialize Counters:<br/>achievedScore = 0<br/>totalRequiredScore = 0]
    D --> E
    
    E --> F[For Each Required Skill]
    
    F --> G{currentLevel >= requiredLevel?}
    
    G -->|Yes| H[achievedScore += currentLevel × weight<br/>readySkills++]
    G -->|No| I[achievedScore += currentLevel × weight<br/>gapSkills++]
    
    H --> J[totalRequiredScore += requiredLevel × weight]
    I --> J
    
    J --> K{More Skills?}
    K -->|Yes| F
    K -->|No| L[Calculate Percentage]
    
    L --> M[readinessPercentage = <br/>achievedScore / totalRequiredScore × 100]
    
    M --> N{Categorize}
    N -->|0-30%| O[Beginner - Red]
    N -->|31-60%| P[Learning - Yellow]
    N -->|61-85%| Q[Proficient - Blue]
    N -->|86-100%| R[Expert - Green]
    
    O --> S[Return Readiness Object]
    P --> S
    Q --> S
    R --> S
    
    S --> T[Display on Frontend:<br/>- Circular progress<br/>- Percentage<br/>- Category<br/>- Breakdown]
    
    style B fill:#fff4e1
    style M fill:#ffe1e1
    style T fill:#e1ffe1
```

---

## 🔄 Role Comparison Flow

```mermaid
flowchart TD
    A[Navigate to /dashboard/role-comparison] --> B[GET /api/roles]
    B --> C[Get all 3 roles]
    
    C --> D[For Each Role]
    D --> E[GET /api/analysis/readiness/roleId]
    
    E --> F[Calculate readiness in parallel]
    
    F --> G[Role 1: Junior UI Developer]
    F --> H[Role 2: Senior UI Developer]
    F --> I[Role 3: Full Stack Developer]
    
    G --> J[Display Readiness Card:<br/>- Percentage<br/>- Skills ready/total<br/>- Circular progress]
    H --> J
    I --> J
    
    J --> K{User Clicks Card}
    K --> L[Expand Details:<br/>- Ready skills list<br/>- Missing skills list<br/>- Gap details]
    
    L --> M[Show Best Fit Recommendation:<br/>- Highlight highest readiness<br/>- Show match percentage]
    
    M --> N{User Action}
    N -->|Set as Target| O[PUT /api/auth/target-role]
    O --> P[Update database]
    P --> Q[Refresh dashboard]
    
    N -->|Compare More| L
    N -->|Back| R[Return to dashboard]
    
    style F fill:#fff4e1
    style M fill:#e1ffe1
    style O fill:#ffe1e1
```

---

#### 4.2 Skill History (`/dashboard/history`)
**Frontend**: `SkillHistoryComponent`
**Backend**: `GET /api/skills/history`

**User Flow**:
1. **Load History**:
   - Backend queries `skillHistory` collection
   - Returns chronological list of all skill assessments

2. **User sees**:
   - Timeline of skill updates:
     - Skill name
     - Old level → New level
     - Change indicator (↑ improved, ↓ reassessed lower)
     - Timestamp
     - Confidence score
   
   - Filters/sorting:
     - By skill
     - By date
     - By improvement type

3. **Visual Progress**:
   - Chart showing skill growth over time
   - Skill-by-skill progress lines

**Database**: Reads from `skillHistory`

---

#### 4.3 User Profile (`/dashboard/profile`)
**Frontend**: `ProfileComponent`
**Backend**: `PUT /api/auth/profile`

**User Flow**:
1. **View Profile**:
   - Name
   - Email (read-only)
   - Experience years
   - Current role
   - Account statistics:
     - Member since
     - Skills assessed
     - Target role
     - Readiness score

2. **Edit Profile**:
   - Update name
   - Update experience years
   - Update current role

3. **Save**:
   - Frontend calls `PUT /api/auth/profile`
   - Backend updates user document
   - Updates localStorage and signal

**Backend Controller**: `auth.controller.js::updateProfile`
**Database**: Updates `users` collection

---

### **Phase 5: Continuous Usage**

#### 5.1 Dashboard Loop
Users typically follow this cycle:

```
1. Dashboard → View readiness
2. Roadmap → Check topics to learn
3. Study/practice → External resources
4. Skills → Reassess proficiency
5. Gap Analysis → See improvements
6. Roadmap → Updated priorities
7. Track progress → Mark topics complete
8. Repeat
```

#### 5.2 Progress Tracking
- Checkbox system on roadmap
- `userProgress` collection tracks completion
- Real-time progress bars update
- History shows all changes

#### 5.3 Skill Reassessment
- User can reassess skills anytime
- New assessment creates `skillHistory` entry
- Gap analysis updates automatically
- Roadmap recalculates priorities

---

## 🔐 Security & Authentication

## 🔐 JWT Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant I as AuthInterceptor
    participant B as Backend
    participant M as Auth Middleware
    participant DB as MongoDB
    
    Note over U,DB: Login/Register
    U->>F: Submit credentials
    F->>B: POST /api/auth/login
    B->>DB: Verify user
    DB-->>B: User valid
    B->>B: Generate JWT with user._id
    B-->>F: {token, user}
    F->>F: localStorage.setItem('skillpath_token', token)
    F->>F: localStorage.setItem('skillpath_user', user)
    
    Note over U,DB: Protected Request
    U->>F: Click on /dashboard/roadmap
    F->>F: AuthGuard checks token
    F->>I: HTTP request triggered
    I->>I: Get token from localStorage
    I->>I: Add header: Authorization: Bearer <token>
    I->>B: Request with JWT
    B->>M: Middleware intercepts
    M->>M: Verify JWT signature
    M->>M: Decode payload → user._id
    M->>DB: Find user by _id
    DB-->>M: User found
    M->>M: Attach req.user
    M-->>B: Continue to route handler
    B->>DB: Fetch protected data
    DB-->>B: Data returned
    B-->>F: Response
    F-->>U: Display data
    
    Note over U,DB: Invalid Token
    U->>F: Expired/invalid token
    F->>B: Request with bad token
    B->>M: Verify fails
    M-->>B: 401 Unauthorized
    B-->>F: Error response
    F->>F: Clear localStorage
    F-->>U: Redirect to /login
```

---

### JWT Flow Details
1. Login/Register → Backend generates JWT
2. Token stored in localStorage (`skillpath_token`)
3. `AuthInterceptor` adds token to all HTTP requests:
   ```
   Authorization: Bearer <token>
   ```
4. Backend `auth.middleware.js` validates token
5. Protected routes require valid token

### Protected Routes (Frontend)
- All `/dashboard/*` routes use `authGuard`
- Checks for token and valid user in localStorage
- Redirects to `/login` if unauthenticated

### Protected Routes (Backend)
- All routes except `/auth/register`, `/auth/login`, `/roles`, `/skills` require `protect` middleware
- Middleware verifies JWT
- Attaches `req.user` to request
- Returns 401 if invalid

---

## 📊 Database Schema Summary

### Collections (11 total)

1. **users** - User accounts
2. **roles** - Job roles (Junior/Senior UI, Full Stack)
3. **skills** - 12 core technical skills
4. **skillLevels** - 5 proficiency levels (Beginner-Expert)
5. **roleSkillMap** - Required skills per role (with weights, mandatory flags)
6. **skillDependencies** - Prerequisite relationships
7. **skillTopics** - Learning topics per skill (ordered, with resources)
8. **userSkills** - User's current skill assessments
9. **userProgress** - Topic completion tracking
10. **skillHistory** - Skill assessment timeline
11. **roleComparison** - Role readiness comparisons

---

## 🎨 UI/UX Features

### Theme Support
- Light/Dark mode toggle
- Persisted in localStorage
- `ThemeService` manages state
- Tailwind `dark:` classes

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Touch-friendly buttons
- Responsive grids

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators

### Visual Feedback
- Loading spinners
- Success/error messages
- Color-coded progress (red/yellow/green)
- Animated transitions
- Hover states

---

## 🚀 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/target-role` - Set target role

### Roles & Skills
- `GET /api/roles` - List all roles
- `GET /api/roles/{id}` - Get role details
- `GET /api/roles/{id}/skills` - Get required skills for role
- `GET /api/skills` - List all skills
- `GET /api/skills/levels` - Get skill level definitions

### User Skills
- `GET /api/user-skills` - Get user's skill assessments
- `POST /api/user-skills/assess` - Assess single skill
- `POST /api/user-skills/bulk-assess` - Assess multiple skills

### Analysis
- `GET /api/analysis/gap/{roleId}` - Calculate skill gaps
- `GET /api/analysis/roadmap/{roleId}` - Generate learning roadmap
- `GET /api/analysis/readiness/{roleId}` - Calculate readiness score

### Progress
- `POST /api/progress/topic/{skillId}/{topicId}` - Mark topic complete
- `GET /api/skills/history` - Get skill assessment history

### Dashboard
- `GET /api/dashboard` - Get dashboard summary stats

---

## 💡 Key Business Logic

### Gap Calculation
```
gap = requiredLevel - currentLevel
priority = gap × weight
isMandatory = roleSkillMap.mandatory
```

### Roadmap Ordering
```
1. Mandatory skills first
2. Sort by priority (gap × weight) descending
3. Respect dependencies (prerequisites first)
4. Group by skill category
5. Order topics within each skill
```

### Readiness Score
```
achievedScore = Σ(min(currentLevel, requiredLevel) × weight)
totalRequiredScore = Σ(requiredLevel × weight)
readinessPercentage = (achievedScore / totalRequiredScore) × 100
```

### Dependency Resolution
```
if skill has dependencies:
  ensure dependencies have no gaps
  if dependency has gap:
    add dependency to roadmap first
    mark current skill as "blocked"
```

---

## 🎯 Success Metrics

### User Onboarding
- Account creation → 1 step
- Role selection → 1 step
- Skill assessment → 1 step
- First roadmap → Automatic

### Engagement
- Users can see progress immediately
- Clear actionable steps
- Real-time feedback
- Motivational UI

### Data Quality
- Real-world job description data
- Industry-standard frameworks
- Official documentation links only
- Curated by research

---

## 📝 Notes

### Frontend Data Flow

```mermaid
flowchart LR
    A[User Action] --> B[Component]
    B --> C[ApiService]
    C --> D[HttpClient]
    D --> E[AuthInterceptor<br/>Add JWT]
    E --> F[Backend API]
    
    F --> G[Response]
    G --> H[ApiService<br/>Map Data]
    H --> I[Component]
    I --> J[Update Signal]
    J --> K[Angular Change Detection]
    K --> L[UI Renders]
    
    style A fill:#e1f5ff
    style E fill:#fff4e1
    style F fill:#ffe1e1
    style J fill:#e1ffe1
    style L fill:#f0e1ff
```

**Detailed Flow:**
```
Component → ApiService → HttpClient → Interceptor (adds JWT) → Backend
Backend Response → ApiService (maps data) → Component → Signals update → UI renders
```

### State Management
- Angular Signals for reactive state
- localStorage for persistence
- No external state library needed
- Automatic UI updates on signal changes

### Error Handling
- Backend: Centralized `errorHandler` middleware
- Frontend: Try-catch in components, error signals
- User-friendly error messages
- Console logging for debugging

---

## 🔄 Typical User Session Flow

```mermaid
flowchart TD
    A[Visit http://localhost:4200] --> B[Landing Page]
    B --> C[Click Get Started]
    C --> D[Register Form]
    
    D --> E[Fill Details:<br/>Name, Email, Password<br/>Experience Years]
    E --> F[Submit Registration]
    F --> G[Auto-login with JWT]
    G --> H[Redirect to /dashboard]
    
    H --> I{Has Target Role?}
    I -->|No| J[See Select Target Role Card]
    J --> K[Click Select Role]
    K --> L[Choose Senior UI Developer]
    L --> M[Confirm Selection]
    M --> N[Role saved to DB]
    
    I -->|Yes| O[See Dashboard Stats]
    
    N --> P[Redirect to /dashboard/skills]
    P --> Q[Rate 12 Skills:<br/>HTML: 4, CSS: 4<br/>JavaScript: 3, TypeScript: 2<br/>React: 2, etc.]
    
    Q --> R[Click Save & Continue]
    R --> S[Skills saved to userSkills]
    S --> T[Redirect to /dashboard/gap-analysis]
    
    T --> U[View Gaps:<br/>TypeScript: +2 levels<br/>React: +1 level<br/>Node.js: +2 levels]
    
    U --> V[Click View Roadmap]
    V --> W[See Ordered Learning Path:<br/>1. TypeScript Fundamentals 4h<br/>2. React Basics 6h<br/>3. Node.js Core 5h]
    
    W --> X[Study External Resources]
    X --> Y[Check off Topics as Learned]
    Y --> Z[Progress saved to userProgress]
    
    Z --> AA[Return to Dashboard]
    AA --> AB[See Readiness Increase<br/>45% → 62%]
    
    AB --> AC[Continue Learning]
    AC --> X
    
    AB --> AD[Reassess Skills After Learning]
    AD --> P
    
    AB --> AE[Compare with Other Roles]
    AE --> AF[View Role Comparison]
    
    AB --> AG[View Skill History]
    AG --> AH[See Progress Timeline]
    
    style H fill:#fff4e1
    style N fill:#ffe1e1
    style S fill:#e1ffe1
    style W fill:#e1f5ff
    style AB fill:#f0e1ff
```

**Step-by-Step Journey:**
```
1. Visit http://localhost:4200
2. Click "Get Started" → Register
3. Fill form → Auto-login → Redirect to dashboard
4. See "Select Target Role" card → Click
5. Choose "Senior UI Developer" → Confirm
6. Redirect to skills assessment
7. Rate 12 skills (HTML: 4, CSS: 4, JS: 3, etc.)
8. Click "Save & Continue" → Redirect to gap analysis
9. See gaps: TypeScript (need +2), React (+1), etc.
10. Click "View Roadmap"
11. See ordered learning path:
    - TypeScript Fundamentals (4h)
    - React Basics (6h)
    - Advanced CSS (3h)
12. Check off topics as learned
13. Return to dashboard → See readiness increase
14. Reassess skills after learning
15. Repeat cycle
```

---

## 📊 Database Schema Relationships

```mermaid
erDiagram
    users ||--o{ userSkills : "has many"
    users ||--o{ skillHistory : "tracks"
    users ||--o{ userProgress : "tracks"
    users ||--o| roles : "targets"
    
    roles ||--o{ roleSkillMap : "requires"
    roleSkillMap }o--|| skills : "references"
    
    skills ||--o{ skillTopics : "has"
    skills ||--o{ skillDependencies : "depends on"
    skills ||--o{ userSkills : "assessed"
    
    skillLevels ||--o{ roleSkillMap : "defines level"
    
    users {
        string _id PK
        string name
        string email UK
        string password
        number experienceYears
        ObjectId targetRoleId FK
        date lastLogin
        object settings
    }
    
    roles {
        string _id PK
        string name UK
        string level
        string category
        string description
        object experienceYears
        boolean isActive
    }
    
    skills {
        string _id PK
        string name UK
        string category
        string description
        string officialUrl
    }
    
    userSkills {
        string _id PK
        ObjectId userId FK
        ObjectId skillId FK
        number currentLevel
        number confidenceScore
        date lastAssessed
    }
    
    skillHistory {
        string _id PK
        ObjectId userId FK
        ObjectId skillId FK
        number oldLevel
        number newLevel
        date assessedAt
    }
    
    userProgress {
        string _id PK
        ObjectId userId FK
        ObjectId skillId FK
        string topicId
        boolean completed
        date completedAt
    }
```

---

## 🎊 Conclusion

SkillPath provides a complete, data-driven career development platform with:
- ✅ Personalized skill gap analysis
- ✅ Intelligent learning roadmaps
- ✅ Progress tracking
- ✅ Role comparisons
- ✅ Real-world data
- ✅ Beautiful, accessible UI
- ✅ Secure authentication
- ✅ Comprehensive API

**Tech Stack**: Angular 19 + Node.js + Express + MongoDB + Tailwind CSS
**Status**: Fully functional MVP with 3 roles, 12 skills, complete user flow

---

## 📈 Visual Summary

```mermaid
mindmap
  root((SkillPath))
    Authentication
      Register
      Login
      JWT Tokens
      Protected Routes
    Role Management
      3 Roles Available
      Role Selection
      Target Role Setting
      Role Comparison
    Skill Assessment
      12 Core Skills
      5 Level Rating
      Confidence Scoring
      Bulk Save
    Analysis
      Gap Calculation
        Required vs Current
        Priority Scoring
        Mandatory Flags
      Readiness Score
        Weighted Calculation
        Percentage 0-100
        Category Labels
    Learning
      Roadmap Generation
        Ordered Topics
        Dependencies
        Time Estimates
      Progress Tracking
        Topic Checkboxes
        Completion Status
        History Timeline
    UI/UX
      Dark/Light Mode
      Responsive Design
      Tailwind CSS
      Angular Signals
    Backend
      Express API
      MongoDB
      Swagger Docs
      11 Collections
```


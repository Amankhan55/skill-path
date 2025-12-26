# Database Architecture
## SkillPath - Career Growth & Skill Gap Analysis Platform

---

## Overview

**Database:** MongoDB (NoSQL Document Database)  
**ODM:** Mongoose  
**Total Collections:** 11  
**Design Philosophy:** Data-driven, normalized where needed, denormalized for performance

---

## Database Design Principles

1. **Separation of Concerns:** Core data (roles, skills) separated from user data
2. **Referential Integrity:** ObjectId references with validation
3. **Performance First:** Indexes on frequently queried fields
4. **Data Quality:** Validation rules at schema level
5. **Scalability:** Designed to handle 1000+ users, 100+ skills, 50+ roles
6. **Audit Trail:** Timestamps on all collections
7. **Flexibility:** Schema allows for future extensions

---

## Collections Overview

| Collection | Purpose | Documents (Est.) | Relationships |
|------------|---------|------------------|---------------|
| `roles` | Career destinations | 3-10 | → roleSkillMap |
| `skills` | Master skill vocabulary | 25-100 | → roleSkillMap, skillDependencies, skillTopics |
| `skillLevels` | Universal proficiency scale | 5 (fixed) | Referenced everywhere |
| `roleSkillMap` | Role requirements (CORE) | 100-500 | roles ← → skills |
| `skillDependencies` | Learning prerequisites | 50-200 | skills ← → skills |
| `skillTopics` | Granular learning units | 200-500 | → skills |
| `users` | User accounts | 1000+ | → roles |
| `userSkills` | User skill assessments | 10,000+ | → users, skills |
| `userProgress` | Topic completion tracking | 50,000+ | → users, skillTopics |
| `skillHistory` | Skill level change tracking | 50,000+ | → users, skills |
| `roleComparison` | Cached role comparisons | 5,000+ | → users, roles |

---

## Collection Schemas

### 1. roles Collection

**Purpose:** Defines career roles/positions that users can target

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
    index: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Staff'],
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data'],
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  experienceYears: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `name`: Unique index for fast lookup by name
- `level`: For filtering by seniority
- `category`: For filtering by role type
- `isActive`: For filtering active roles only

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef12345"),
  name: "Senior UI Developer",
  level: "Senior",
  category: "Frontend",
  description: "Lead the design and development of complex user interfaces. Mentor junior developers and ensure code quality.",
  experienceYears: { min: 5, max: 8 },
  version: 1,
  isActive: true,
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}
```

**Validation Rules:**
- Name must be unique across all roles
- Experience years: min < max
- Level and category from predefined enums only

---

### 2. skills Collection

**Purpose:** Master vocabulary of all skills in the system

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Language',
      'Framework',
      'Library',
      'Tool',
      'Concept',
      'Database',
      'Cloud',
      'DevOps',
      'Testing',
      'Design',
      'Soft Skill'
    ],
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  tags: {
    type: [String],
    default: []
  },
  officialUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Must be a valid URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `name`: Unique index for fast lookup
- `category`: For filtering by skill type
- `isActive`: For filtering active skills
- `tags`: Multi-key index for tag-based search

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef22222"),
  name: "Angular",
  category: "Framework",
  description: "TypeScript-based open-source web application framework led by the Angular Team at Google",
  tags: ["frontend", "spa", "typescript", "google"],
  officialUrl: "https://angular.io",
  isActive: true,
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}
```

---

### 3. skillLevels Collection

**Purpose:** Universal 1-5 proficiency scale (Fixed, rarely changes)

```javascript
{
  _id: ObjectId,
  level: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 5
  },
  label: {
    type: String,
    required: true,
    enum: ['Awareness', 'Novice', 'Intermediate', 'Advanced', 'Expert']
  },
  definition: {
    type: String,
    required: true,
    maxlength: 500
  },
  examples: {
    type: [String],
    default: []
  },
  estimatedHours: {
    type: Number,
    required: true,
    comment: 'Estimated hours to reach this level from zero'
  }
}
```

**Sample Documents:**
```javascript
[
  {
    level: 1,
    label: "Awareness",
    definition: "Basic understanding of concepts. Can recognize and explain fundamentals.",
    examples: [
      "Read documentation or tutorials",
      "Understand basic syntax",
      "Know what the technology does"
    ],
    estimatedHours: 10
  },
  {
    level: 2,
    label: "Novice",
    definition: "Can follow tutorials and make simple modifications. Needs guidance.",
    examples: [
      "Complete basic tutorials",
      "Modify existing code",
      "Build simple projects with help"
    ],
    estimatedHours: 40
  },
  {
    level: 3,
    label: "Intermediate",
    definition: "Can work independently on common tasks. Understands core concepts.",
    examples: [
      "Build features independently",
      "Debug common issues",
      "Apply best practices",
      "Used in production projects"
    ],
    estimatedHours: 100
  },
  {
    level: 4,
    label: "Advanced",
    definition: "Can solve complex problems and optimize solutions. Mentor others.",
    examples: [
      "Design architecture",
      "Solve complex problems",
      "Optimize performance",
      "Mentor junior developers",
      "Lead technical discussions"
    ],
    estimatedHours: 200
  },
  {
    level: 5,
    label: "Expert",
    definition: "Deep mastery. Can teach, architect, and contribute to the ecosystem.",
    examples: [
      "Contribute to open source",
      "Write technical articles/books",
      "Architect complex systems",
      "Recognized expert in community",
      "Make strategic technical decisions"
    ],
    estimatedHours: 350
  }
]
```

---

### 4. roleSkillMap Collection

**Purpose:** THE CORE - Defines what each role actually requires

```javascript
{
  _id: ObjectId,
  roleId: {
    type: ObjectId,
    ref: 'Role',
    required: true,
    index: true
  },
  skillId: {
    type: ObjectId,
    ref: 'Skill',
    required: true,
    index: true
  },
  requiredLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Required level must be an integer'
    }
  },
  weight: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    comment: 'Importance score (1-100). Higher = more critical'
  },
  mandatory: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Compound Indexes:**
- `{ roleId: 1, skillId: 1 }`: Unique compound index (one mapping per role-skill pair)
- `{ roleId: 1, mandatory: 1 }`: For fetching mandatory skills per role
- `{ roleId: 1, weight: -1 }`: For fetching skills by importance

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef33333"),
  roleId: ObjectId("6501234567890abcdef12345"), // Senior UI Developer
  skillId: ObjectId("6501234567890abcdef22222"), // Angular
  requiredLevel: 4,
  weight: 85,
  mandatory: true,
  notes: "Deep Angular knowledge required for leading complex SPA development",
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}
```

**Business Logic:**
- Weight determines priority: gap × weight = priority score
- Mandatory skills appear first in roadmap
- Required level defines target proficiency

---

### 5. skillDependencies Collection

**Purpose:** Controls learning order (prerequisites)

```javascript
{
  _id: ObjectId,
  skillId: {
    type: ObjectId,
    ref: 'Skill',
    required: true,
    index: true,
    comment: 'The skill that depends on another'
  },
  dependsOnSkillId: {
    type: ObjectId,
    ref: 'Skill',
    required: true,
    index: true,
    comment: 'The prerequisite skill'
  },
  type: {
    type: String,
    required: true,
    enum: ['must-have', 'recommended', 'helpful'],
    default: 'must-have'
  },
  minimumLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 2,
    comment: 'Minimum level of prerequisite needed'
  },
  reason: {
    type: String,
    maxlength: 300
  },
  createdAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `skillId`: For finding all prerequisites of a skill
- `dependsOnSkillId`: For finding what depends on a skill
- `{ skillId: 1, dependsOnSkillId: 1 }`: Prevent duplicate dependencies

**Sample Documents:**
```javascript
[
  {
    skillId: ObjectId("angular_id"),
    dependsOnSkillId: ObjectId("typescript_id"),
    type: "must-have",
    minimumLevel: 2,
    reason: "Angular is written in TypeScript. Basic TypeScript knowledge is essential."
  },
  {
    skillId: ObjectId("rxjs_id"),
    dependsOnSkillId: ObjectId("javascript_id"),
    type: "must-have",
    minimumLevel: 3,
    reason: "RxJS requires solid JavaScript understanding, especially async patterns."
  },
  {
    skillId: ObjectId("angular_id"),
    dependsOnSkillId: ObjectId("javascript_id"),
    type: "must-have",
    minimumLevel: 3,
    reason: "Strong JavaScript foundation needed before learning Angular."
  }
]
```

**Validation:**
- Circular dependencies prevented at application level
- Skill cannot depend on itself
- Dependency type determines roadmap ordering strictness

---

### 6. skillTopics Collection

**Purpose:** Granular learning units within each skill

```javascript
{
  _id: ObjectId,
  skillId: {
    type: ObjectId,
    ref: 'Skill',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  order: {
    type: Number,
    required: true,
    min: 1,
    comment: 'Learning sequence within the skill'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  description: {
    type: String,
    maxlength: 1000
  },
  estimatedHours: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    comment: 'Hours to master this topic'
  },
  resourceLinks: [{
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Must be a valid URL'
      }
    },
    type: {
      type: String,
      enum: ['docs', 'article', 'video', 'tutorial', 'book'],
      default: 'docs'
    }
  }],
  prerequisites: {
    type: [String],
    default: [],
    comment: 'List of topic names that should be completed first'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `{ skillId: 1, order: 1 }`: For ordered topic retrieval
- `skillId`: For finding all topics of a skill

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef44444"),
  skillId: ObjectId("angular_id"),
  name: "Change Detection Strategy",
  order: 8,
  difficulty: "Medium",
  description: "Understanding Angular's change detection mechanism, OnPush vs Default strategies, and performance optimization",
  estimatedHours: 6,
  resourceLinks: [
    {
      title: "Angular Change Detection Official Guide",
      url: "https://angular.io/guide/change-detection",
      type: "docs"
    },
    {
      title: "Change Detection Explained",
      url: "https://blog.angular.io/change-detection-explained",
      type: "article"
    }
  ],
  prerequisites: ["Components and Templates", "Lifecycle Hooks"],
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}
```

---

### 7. users Collection

**Purpose:** User accounts and authentication

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 60,
    select: false,
    comment: 'bcrypt hash (always 60 chars)'
  },
  experienceYears: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  targetRoleId: {
    type: ObjectId,
    ref: 'Role',
    default: null,
    index: true
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    emailNotifications: {
      type: Boolean,
      default: false
    }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `email`: Unique index for login
- `targetRoleId`: For filtering users by target role
- `isActive`: For filtering active users

**Security:**
- Password field excluded from queries by default (`select: false`)
- Password hashed with bcrypt (10 salt rounds) before saving
- Email stored in lowercase for case-insensitive lookup

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef55555"),
  name: "John Doe",
  email: "john.doe@example.com",
  password: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO", // bcrypt hash
  experienceYears: 8,
  targetRoleId: ObjectId("senior_ui_dev_id"),
  settings: {
    theme: "dark",
    emailNotifications: false
  },
  lastLogin: ISODate("2024-12-25T15:30:00Z"),
  isActive: true,
  createdAt: ISODate("2024-01-10T09:00:00Z"),
  updatedAt: ISODate("2024-12-25T15:30:00Z")
}
```

---

### 8. userSkills Collection

**Purpose:** User's self-assessed skill levels

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skillId: {
    type: ObjectId,
    ref: 'Skill',
    required: true,
    index: true
  },
  currentLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Skill level must be an integer'
    }
  },
  usedInProduction: {
    type: Boolean,
    default: false,
    comment: 'Has user used this skill in real projects?'
  },
  recentUsage: {
    type: Boolean,
    default: false,
    comment: 'Used in last 6 months?'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 500
  },
  assessedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `{ userId: 1, skillId: 1 }`: Unique compound index (one assessment per user-skill)
- `userId`: For fetching all user's skills
- `{ userId: 1, currentLevel: 1 }`: For filtering by skill level

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef66666"),
  userId: ObjectId("john_doe_id"),
  skillId: ObjectId("angular_id"),
  currentLevel: 3,
  usedInProduction: true,
  recentUsage: true,
  yearsOfExperience: 2,
  notes: "Used Angular in 3 production projects. Comfortable with basics but need to learn advanced patterns.",
  assessedAt: ISODate("2024-12-20T10:00:00Z"),
  createdAt: ISODate("2024-12-20T10:00:00Z"),
  updatedAt: ISODate("2024-12-20T10:00:00Z")
}
```

---

### 9. userProgress Collection

**Purpose:** Track completion of individual topics

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  topicId: {
    type: ObjectId,
    ref: 'SkillTopic',
    required: true,
    index: true
  },
  skillId: {
    type: ObjectId,
    ref: 'Skill',
    required: true,
    index: true,
    comment: 'Denormalized for faster queries'
  },
  status: {
    type: String,
    required: true,
    enum: ['not-started', 'in-progress', 'completed', 'skipped'],
    default: 'not-started',
    index: true
  },
  timeSpent: {
    type: Number,
    min: 0,
    default: 0,
    comment: 'Hours spent (user-reported or tracked)'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `{ userId: 1, topicId: 1 }`: Unique compound index
- `{ userId: 1, status: 1 }`: For filtering by status
- `{ userId: 1, skillId: 1 }`: For skill-level progress queries

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef77777"),
  userId: ObjectId("john_doe_id"),
  topicId: ObjectId("change_detection_topic_id"),
  skillId: ObjectId("angular_id"),
  status: "completed",
  timeSpent: 5,
  notes: "Implemented OnPush strategy in our app. Saw significant performance improvement.",
  startedAt: ISODate("2024-12-15T09:00:00Z"),
  completedAt: ISODate("2024-12-18T17:00:00Z"),
  createdAt: ISODate("2024-12-15T09:00:00Z"),
  updatedAt: ISODate("2024-12-18T17:00:00Z")
}
```

---

### 10. skillHistory Collection

**Purpose:** Audit trail of skill level changes

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skillId: {
    type: ObjectId,
    ref: 'Skill',
    required: true,
    index: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  changedFrom: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    comment: '0 means first assessment'
  },
  reason: {
    type: String,
    enum: ['initial-assessment', 're-assessment', 'progress-update', 'correction'],
    default: 'progress-update'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  changedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}
```

**Indexes:**
- `{ userId: 1, skillId: 1, changedAt: -1 }`: For chronological skill history
- `{ userId: 1, changedAt: -1 }`: For user's overall progress timeline

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef88888"),
  userId: ObjectId("john_doe_id"),
  skillId: ObjectId("angular_id"),
  level: 4,
  changedFrom: 3,
  reason: "progress-update",
  notes: "Completed advanced Angular topics. Now comfortable with performance optimization and advanced patterns.",
  changedAt: ISODate("2024-12-20T14:00:00Z")
}
```

**Usage:**
- Created automatically when userSkills.currentLevel changes
- Used for progress velocity calculations
- Used for historical charts
- Never deleted (audit trail)

---

### 11. roleComparison Collection

**Purpose:** Cache expensive role comparison calculations

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  roleIds: {
    type: [ObjectId],
    ref: 'Role',
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 3;
      },
      message: 'Must compare 2-3 roles'
    }
  },
  comparisonData: {
    type: Object,
    required: true,
    comment: 'Cached comparison result (flexible structure)'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
    comment: 'TTL for cache invalidation'
  },
  createdAt: { type: Date, default: Date.now }
}
```

**Indexes:**
- `userId`: For fetching user's comparisons
- `expiresAt`: TTL index for automatic deletion
- `{ userId: 1, createdAt: -1 }`: For recent comparisons

**Sample Document:**
```javascript
{
  _id: ObjectId("6501234567890abcdef99999"),
  userId: ObjectId("john_doe_id"),
  roleIds: [
    ObjectId("senior_ui_dev_id"),
    ObjectId("full_stack_dev_id")
  ],
  comparisonData: {
    roles: [
      { roleId: "...", name: "Senior UI Developer", ... },
      { roleId: "...", name: "Full Stack Developer", ... }
    ],
    skillOverlap: {
      common: ["JavaScript", "TypeScript", "Git"],
      uniqueToRole1: ["Angular", "RxJS"],
      uniqueToRole2: ["Node.js", "MongoDB"]
    },
    gapComparison: {
      role1TotalGap: 15,
      role2TotalGap: 28
    },
    timeEstimate: {
      role1Hours: 120,
      role2Hours: 240
    }
  },
  expiresAt: ISODate("2024-12-27T10:00:00Z"), // 7 days from creation
  createdAt: ISODate("2024-12-20T10:00:00Z")
}
```

**TTL Strategy:**
- Automatically deleted after 7 days
- Regenerated on demand if expired
- Improves performance for repeated comparisons

---

## Relationships & Data Flow

### Relationship Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      CORE DATA                               │
│                                                              │
│   ┌─────────┐         ┌────────────────┐        ┌────────┐ │
│   │  roles  │────────▶│ roleSkillMap   │◀───────│ skills │ │
│   └─────────┘         └────────────────┘        └────────┘ │
│                              │                       │       │
│                              │                       │       │
│                              │                       ▼       │
│                              │              ┌─────────────┐  │
│                              │              │skillDepen-  │  │
│                              │              │dencies      │  │
│                              │              └─────────────┘  │
│                              │                       │       │
│                              │                       ▼       │
│                              │              ┌─────────────┐  │
│                              │              │skillTopics  │  │
│                              │              └─────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                      USER DATA                               │
│                                                              │
│   ┌─────────┐                                               │
│   │  users  │──────┬──────────────────┬────────────────┐   │
│   └─────────┘      │                  │                │   │
│        │           ▼                  ▼                ▼   │
│        │    ┌────────────┐    ┌─────────────┐  ┌─────────┐│
│        │    │ userSkills │    │userProgress │  │  skill  ││
│        │    └────────────┘    └─────────────┘  │ History ││
│        │                                        └─────────┘│
│        ▼                                                    │
│   ┌─────────────┐                                          │
│   │    role     │                                          │
│   │ Comparison  │                                          │
│   └─────────────┘                                          │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow: Gap Calculation

```
1. User assesses skills → userSkills collection
2. User selects target role → users.targetRoleId
3. Gap calculation triggered:
   a. Fetch roleSkillMap for targetRoleId
   b. Fetch userSkills for userId
   c. For each required skill:
      - gap = required.level - current.level
      - priority = gap × weight
   d. Return gaps sorted by priority
```

### Data Flow: Roadmap Generation

```
1. Get gap analysis results
2. Filter skills with gap > 0
3. Apply ordering:
   a. Mandatory skills (mandatory: true)
   b. Sort by priority score (gap × weight)
   c. Resolve dependencies:
      - Fetch skillDependencies
      - Topological sort
      - Ensure prerequisites come first
4. For each skill:
   - Fetch skillTopics (ordered by 'order' field)
   - Calculate time estimate
   - Include resource links
5. Return ordered roadmap
```

### Data Flow: Progress Update

```
1. User marks topic complete → userProgress
2. Trigger skill history check:
   - Count completed topics for skill
   - If significant progress → suggest level increase
3. User updates skill level → userSkills
4. Create skillHistory record (audit trail)
5. Recalculate:
   - Gap analysis
   - Readiness score
   - Roadmap order (if dependencies now satisfied)
```

---

## Query Patterns & Performance

### Common Queries

#### 1. Get All Skills Required for a Role
```javascript
db.roleSkillMap.aggregate([
  { $match: { roleId: ObjectId("role_id") } },
  {
    $lookup: {
      from: "skills",
      localField: "skillId",
      foreignField: "_id",
      as: "skill"
    }
  },
  { $unwind: "$skill" },
  { $sort: { mandatory: -1, weight: -1 } }
]);
```
**Indexes Used:** `roleSkillMap.roleId`, `skills._id`

---

#### 2. Get User's Gap Analysis
```javascript
// Step 1: Get required skills for role
const requiredSkills = await roleSkillMap.find({ roleId: user.targetRoleId });

// Step 2: Get user's current skills
const userSkills = await UserSkill.find({ userId: user._id });

// Step 3: Calculate gaps (in application code)
const gaps = requiredSkills.map(req => {
  const userSkill = userSkills.find(us => us.skillId.equals(req.skillId));
  const currentLevel = userSkill ? userSkill.currentLevel : 0;
  const gap = req.requiredLevel - currentLevel;
  const priority = gap > 0 ? gap * req.weight : 0;
  
  return {
    skillId: req.skillId,
    requiredLevel: req.requiredLevel,
    currentLevel,
    gap,
    priority,
    mandatory: req.mandatory
  };
});
```
**Indexes Used:** `roleSkillMap.roleId`, `userSkills.userId`

---

#### 3. Get Roadmap with Dependencies
```javascript
db.skillDependencies.aggregate([
  { $match: { skillId: { $in: skillsWithGaps } } },
  {
    $lookup: {
      from: "skills",
      localField: "dependsOnSkillId",
      foreignField: "_id",
      as: "prerequisite"
    }
  },
  {
    $lookup: {
      from: "skillTopics",
      localField: "skillId",
      foreignField: "skillId",
      as: "topics"
    }
  },
  { $sort: { "topics.order": 1 } }
]);
```
**Indexes Used:** `skillDependencies.skillId`, `skillTopics.skillId`

---

#### 4. Get User's Progress for a Skill
```javascript
db.userProgress.aggregate([
  {
    $match: {
      userId: ObjectId("user_id"),
      skillId: ObjectId("skill_id")
    }
  },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);
```
**Indexes Used:** `userProgress.{userId, skillId}`

---

#### 5. Get Skill History Timeline
```javascript
db.skillHistory.find({
  userId: ObjectId("user_id")
})
.sort({ changedAt: -1 })
.limit(50)
.populate('skillId', 'name category');
```
**Indexes Used:** `skillHistory.{userId, changedAt}`

---

## Data Integrity Rules

### Application-Level Validations

1. **Circular Dependency Check:**
   - Before inserting skillDependency
   - Use DFS to detect cycles
   - Reject if cycle found

2. **Valid Skill Level Range:**
   - Always 1-5
   - Validate on insert/update

3. **Unique User-Skill Assessment:**
   - One userSkill record per user-skill pair
   - Enforced by compound unique index

4. **Dependency Satisfaction:**
   - Before recommending a skill
   - Check all prerequisites are met (level >= minimumLevel)

5. **Role-Skill Mapping Integrity:**
   - Weight must be 1-100
   - Required level must be 1-5
   - One mapping per role-skill pair

### Database-Level Constraints

1. **Unique Indexes:**
   - `users.email`
   - `roles.name`
   - `skills.name`
   - `{userId, skillId}` in userSkills
   - `{roleId, skillId}` in roleSkillMap

2. **TTL Index:**
   - `roleComparison.expiresAt` (automatic cleanup)

3. **Enum Constraints:**
   - All enum fields validated at schema level

---

## Scalability Considerations

### Current Design Supports:

- **Users:** 10,000+ concurrent users
- **Roles:** 100+ roles
- **Skills:** 500+ skills
- **Assessments:** 100,000+ user skill assessments
- **Progress Records:** 1,000,000+ topic completions

### Performance Optimizations:

1. **Indexes on Hot Paths:**
   - All foreign keys indexed
   - Compound indexes for common queries
   - Sort fields indexed

2. **Denormalization:**
   - `skillId` in userProgress (avoid extra lookup)
   - Common query results cached in roleComparison

3. **TTL Indexes:**
   - Auto-cleanup of expired cache data

4. **Query Optimization:**
   - Use aggregation pipelines for complex queries
   - Limit result sets
   - Project only needed fields

### Future Optimizations:

1. **Sharding Strategy:**
   - Shard users by `_id` (horizontal scaling)
   - Shard userSkills by `userId`
   - Shard userProgress by `userId`

2. **Read Replicas:**
   - Separate read and write operations
   - Read-heavy queries to replicas

3. **Caching Layer:**
   - Redis for frequently accessed data
   - Cache skill lists, role requirements

---

## Backup & Migration Strategy

### Backup

1. **Daily Automated Backups:**
   - Full database backup
   - Retention: 30 days

2. **Critical Collections (Extra Backup):**
   - users (authentication data)
   - roleSkillMap (core intelligence)

### Migration

1. **Version Control:**
   - `version` field in roles
   - Track schema changes

2. **Seed Data Updates:**
   - Separate scripts for updates
   - Never delete old data, mark inactive

3. **Schema Evolution:**
   - Additive changes only (backward compatible)
   - Use default values for new fields

---

## Summary

- **11 Collections** with clear separation of concerns
- **Comprehensive Indexes** for performance
- **Strong Validation** at schema level
- **Audit Trail** via skillHistory
- **Scalable Design** supporting growth
- **Data-Driven Intelligence** via roleSkillMap
- **Performance-First** with caching and denormalization

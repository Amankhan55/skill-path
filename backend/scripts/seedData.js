require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Models
const Role = require('../models/Role');
const Skill = require('../models/Skill');
const SkillLevel = require('../models/SkillLevel');
const RoleSkillMap = require('../models/RoleSkillMap');
const SkillDependency = require('../models/SkillDependency');
const SkillTopic = require('../models/SkillTopic');

// Real-world seed data based on job descriptions analysis
const seedData = async () => {
  try {
    await connectDB();

    console.log('\n🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Role.deleteMany({}),
      Skill.deleteMany({}),
      SkillLevel.deleteMany({}),
      RoleSkillMap.deleteMany({}),
      SkillDependency.deleteMany({}),
      SkillTopic.deleteMany({})
    ]);
    console.log('✅ Existing data cleared\n');

    // 1. Seed Skill Levels (Universal 1-5 scale)
    console.log('📊 Seeding skill levels...');
    const skillLevels = await SkillLevel.insertMany([
      {
        level: 1,
        label: 'Awareness',
        definition: 'Basic understanding of concepts. Can recognize and explain fundamentals.',
        examples: ['Read documentation or tutorials', 'Understand basic syntax', 'Know what the technology does'],
        estimatedHours: 10
      },
      {
        level: 2,
        label: 'Novice',
        definition: 'Can follow tutorials and make simple modifications. Needs guidance.',
        examples: ['Complete basic tutorials', 'Modify existing code', 'Build simple projects with help'],
        estimatedHours: 40
      },
      {
        level: 3,
        label: 'Intermediate',
        definition: 'Can work independently on common tasks. Understands core concepts.',
        examples: ['Build features independently', 'Debug common issues', 'Apply best practices', 'Used in production projects'],
        estimatedHours: 100
      },
      {
        level: 4,
        label: 'Advanced',
        definition: 'Can solve complex problems and optimize solutions. Mentor others.',
        examples: ['Design architecture', 'Solve complex problems', 'Optimize performance', 'Mentor junior developers', 'Lead technical discussions'],
        estimatedHours: 200
      },
      {
        level: 5,
        label: 'Expert',
        definition: 'Deep mastery. Can teach, architect, and contribute to the ecosystem.',
        examples: ['Contribute to open source', 'Write technical articles/books', 'Architect complex systems', 'Recognized expert in community', 'Make strategic technical decisions'],
        estimatedHours: 350
      }
    ]);
    console.log(`✅ Created ${skillLevels.length} skill levels\n`);

    // 2. Seed Skills (Based on real job requirements)
    console.log('🎯 Seeding skills...');
    const skillsData = [
      // Core Frontend
      { name: 'HTML5', category: 'Language', description: 'Semantic HTML markup language for structuring web content', tags: ['frontend', 'web', 'fundamentals'], officialUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'CSS3', category: 'Language', description: 'Cascading Style Sheets for styling web applications', tags: ['frontend', 'styling', 'design'], officialUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
      { name: 'JavaScript', category: 'Language', description: 'Core programming language for web development', tags: ['frontend', 'backend', 'essential'], officialUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'TypeScript', category: 'Language', description: 'Typed superset of JavaScript for large-scale applications', tags: ['frontend', 'backend', 'typed'], officialUrl: 'https://www.typescriptlang.org' },
      
      // Frontend Frameworks
      { name: 'Angular', category: 'Framework', description: 'TypeScript-based web application framework by Google', tags: ['frontend', 'spa', 'google'], officialUrl: 'https://angular.io' },
      { name: 'React', category: 'Library', description: 'JavaScript library for building user interfaces by Meta', tags: ['frontend', 'spa', 'meta'], officialUrl: 'https://react.dev' },
      { name: 'RxJS', category: 'Library', description: 'Reactive Extensions library for composing asynchronous programs', tags: ['reactive', 'angular', 'async'], officialUrl: 'https://rxjs.dev' },
      
      // Frontend Tools
      { name: 'Responsive Design', category: 'Concept', description: 'Creating web interfaces that adapt to different screen sizes', tags: ['frontend', 'mobile-first', 'ux'], officialUrl: 'https://web.dev/responsive-web-design-basics' },
      { name: 'CSS Frameworks', category: 'Tool', description: 'Utility frameworks like Tailwind CSS or Bootstrap for rapid UI development', tags: ['frontend', 'styling', 'productivity'], officialUrl: 'https://tailwindcss.com' },
      { name: 'Web Performance', category: 'Concept', description: 'Optimizing web applications for speed and Core Web Vitals', tags: ['frontend', 'optimization', 'seo'], officialUrl: 'https://web.dev/vitals' },
      { name: 'Accessibility', category: 'Concept', description: 'WCAG standards and inclusive web design practices', tags: ['frontend', 'a11y', 'wcag'], officialUrl: 'https://www.w3.org/WAI' },
      
      // Backend
      { name: 'Node.js', category: 'Framework', description: 'JavaScript runtime for building scalable server-side applications', tags: ['backend', 'javascript', 'runtime'], officialUrl: 'https://nodejs.org' },
      { name: 'Express.js', category: 'Framework', description: 'Minimal and flexible Node.js web application framework', tags: ['backend', 'api', 'node'], officialUrl: 'https://expressjs.com' },
      { name: 'RESTful APIs', category: 'Concept', description: 'Architectural style for designing networked applications', tags: ['backend', 'api', 'http'], officialUrl: 'https://restfulapi.net' },
      { name: 'MongoDB', category: 'Database', description: 'NoSQL document database for modern applications', tags: ['backend', 'database', 'nosql'], officialUrl: 'https://www.mongodb.com' },
      { name: 'Authentication & Security', category: 'Concept', description: 'JWT, OAuth, and security best practices', tags: ['backend', 'security', 'auth'], officialUrl: 'https://jwt.io' },
      
      // Tools & Testing
      { name: 'Git', category: 'Tool', description: 'Version control system for tracking code changes', tags: ['devops', 'essential', 'collaboration'], officialUrl: 'https://git-scm.com' },
      { name: 'Testing', category: 'Tool', description: 'Unit, integration, and E2E testing frameworks', tags: ['quality', 'testing', 'ci'], officialUrl: 'https://jestjs.io' },
      { name: 'Build Tools', category: 'Tool', description: 'Webpack, Vite, or Angular CLI for building applications', tags: ['frontend', 'tooling', 'build'], officialUrl: 'https://vitejs.dev' },
      { name: 'Browser DevTools', category: 'Tool', description: 'Chrome/Firefox DevTools for debugging and profiling', tags: ['frontend', 'debugging', 'performance'], officialUrl: 'https://developer.chrome.com/docs/devtools' }
    ];

    const skills = await Skill.insertMany(skillsData);
    const skillMap = {};
    skills.forEach(skill => {
      skillMap[skill.name] = skill._id;
    });
    console.log(`✅ Created ${skills.length} skills\n`);

    // 3. Seed Roles (Based on real job postings)
    console.log('👔 Seeding roles...');
    const rolesData = [
      {
        name: 'Junior UI Developer',
        level: 'Junior',
        category: 'Frontend',
        description: 'Assist in designing and implementing user interfaces. Collaborate with designers and backend developers to create responsive, accessible web applications.',
        experienceYears: { min: 0, max: 2 }
      },
      {
        name: 'Senior UI Developer',
        level: 'Senior',
        category: 'Frontend',
        description: 'Lead the design and development of complex user interfaces. Mentor junior developers, optimize application performance, and ensure code quality and best practices.',
        experienceYears: { min: 5, max: 8 }
      },
      {
        name: 'Full Stack Developer',
        level: 'Mid',
        category: 'Full Stack',
        description: 'Develop and maintain both frontend and backend components. Design RESTful APIs, manage databases, and ensure seamless integration between client and server.',
        experienceYears: { min: 3, max: 6 }
      }
    ];

    const roles = await Role.insertMany(rolesData);
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role._id;
    });
    console.log(`✅ Created ${roles.length} roles\n`);

    // 4. Seed Role-Skill Mappings (THE CORE - Real job requirements)
    console.log('🎯 Seeding role-skill mappings...');
    
    const roleSkillMappings = [
      // Junior UI Developer Requirements
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['HTML5'], requiredLevel: 3, weight: 90, mandatory: true, notes: 'Essential for structuring web content' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['CSS3'], requiredLevel: 3, weight: 90, mandatory: true, notes: 'Core styling skills required' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['JavaScript'], requiredLevel: 3, weight: 85, mandatory: true, notes: 'Solid JS fundamentals needed' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['TypeScript'], requiredLevel: 2, weight: 60, mandatory: false, notes: 'Basic TypeScript helpful' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['Angular'], requiredLevel: 2, weight: 70, mandatory: true, notes: 'Framework basics required' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['Responsive Design'], requiredLevel: 3, weight: 80, mandatory: true, notes: 'Mobile-first approach essential' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['Git'], requiredLevel: 2, weight: 75, mandatory: true, notes: 'Version control basics' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['Browser DevTools'], requiredLevel: 2, weight: 50, mandatory: false, notes: 'Debugging skills helpful' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['CSS Frameworks'], requiredLevel: 2, weight: 55, mandatory: false, notes: 'Tailwind or Bootstrap basics' },
      { roleId: roleMap['Junior UI Developer'], skillId: skillMap['Accessibility'], requiredLevel: 2, weight: 60, mandatory: false, notes: 'Basic WCAG awareness' },

      // Senior UI Developer Requirements  
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['HTML5'], requiredLevel: 4, weight: 85, mandatory: true, notes: 'Advanced semantic HTML' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['CSS3'], requiredLevel: 4, weight: 85, mandatory: true, notes: 'Advanced CSS and architecture' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['JavaScript'], requiredLevel: 5, weight: 95, mandatory: true, notes: 'Expert-level JS required' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['TypeScript'], requiredLevel: 4, weight: 90, mandatory: true, notes: 'Strong TypeScript skills' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Angular'], requiredLevel: 4, weight: 95, mandatory: true, notes: 'Deep Angular expertise required' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['RxJS'], requiredLevel: 4, weight: 85, mandatory: true, notes: 'Advanced reactive programming' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Responsive Design'], requiredLevel: 4, weight: 80, mandatory: true, notes: 'Expert responsive design' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Web Performance'], requiredLevel: 4, weight: 85, mandatory: true, notes: 'Performance optimization critical' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Accessibility'], requiredLevel: 4, weight: 80, mandatory: true, notes: 'WCAG AA compliance' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Testing'], requiredLevel: 4, weight: 80, mandatory: true, notes: 'Unit and E2E testing' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Build Tools'], requiredLevel: 3, weight: 65, mandatory: false, notes: 'Webpack/Vite knowledge' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Git'], requiredLevel: 4, weight: 75, mandatory: true, notes: 'Advanced Git workflows' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['CSS Frameworks'], requiredLevel: 4, weight: 70, mandatory: false, notes: 'Master utility frameworks' },
      { roleId: roleMap['Senior UI Developer'], skillId: skillMap['Browser DevTools'], requiredLevel: 4, weight: 70, mandatory: true, notes: 'Advanced debugging and profiling' },

      // Full Stack Developer Requirements
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['HTML5'], requiredLevel: 3, weight: 70, mandatory: true, notes: 'Solid HTML skills' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['CSS3'], requiredLevel: 3, weight: 65, mandatory: true, notes: 'Good CSS knowledge' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['JavaScript'], requiredLevel: 4, weight: 90, mandatory: true, notes: 'Advanced JS for both sides' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['TypeScript'], requiredLevel: 3, weight: 80, mandatory: true, notes: 'TypeScript for full stack' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['React'], requiredLevel: 3, weight: 75, mandatory: true, notes: 'React or Angular required' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Node.js'], requiredLevel: 4, weight: 90, mandatory: true, notes: 'Strong Node.js skills' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Express.js'], requiredLevel: 3, weight: 85, mandatory: true, notes: 'API development essential' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['RESTful APIs'], requiredLevel: 4, weight: 90, mandatory: true, notes: 'API design expertise' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['MongoDB'], requiredLevel: 3, weight: 80, mandatory: true, notes: 'Database management' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Authentication & Security'], requiredLevel: 3, weight: 85, mandatory: true, notes: 'Security best practices' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Git'], requiredLevel: 3, weight: 75, mandatory: true, notes: 'Version control proficiency' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Testing'], requiredLevel: 3, weight: 70, mandatory: false, notes: 'Testing both frontend and backend' },
      { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Responsive Design'], requiredLevel: 3, weight: 65, mandatory: false, notes: 'Responsive UI skills' }
    ];

    await RoleSkillMap.insertMany(roleSkillMappings);
    console.log(`✅ Created ${roleSkillMappings.length} role-skill mappings\n`);

    // 5. Seed Skill Dependencies (Learning order)
    console.log('🔗 Seeding skill dependencies...');
    
    const dependencies = [
      // CSS depends on HTML
      { skillId: skillMap['CSS3'], dependsOnSkillId: skillMap['HTML5'], type: 'must-have', minimumLevel: 2, reason: 'HTML structure needed before styling' },
      
      // JavaScript dependencies
      { skillId: skillMap['TypeScript'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 3, reason: 'TypeScript builds on JavaScript fundamentals' },
      
      // Framework dependencies
      { skillId: skillMap['Angular'], dependsOnSkillId: skillMap['TypeScript'], type: 'must-have', minimumLevel: 2, reason: 'Angular is built with TypeScript' },
      { skillId: skillMap['Angular'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 3, reason: 'Strong JS foundation needed' },
      { skillId: skillMap['Angular'], dependsOnSkillId: skillMap['HTML5'], type: 'must-have', minimumLevel: 2, reason: 'Templates use HTML' },
      { skillId: skillMap['Angular'], dependsOnSkillId: skillMap['CSS3'], type: 'must-have', minimumLevel: 2, reason: 'Styling components' },
      
      { skillId: skillMap['React'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 3, reason: 'React requires solid JS knowledge' },
      { skillId: skillMap['React'], dependsOnSkillId: skillMap['HTML5'], type: 'must-have', minimumLevel: 2, reason: 'JSX based on HTML' },
      { skillId: skillMap['React'], dependsOnSkillId: skillMap['CSS3'], type: 'must-have', minimumLevel: 2, reason: 'Component styling' },
      
      // RxJS depends on JavaScript
      { skillId: skillMap['RxJS'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 3, reason: 'Async JS patterns essential' },
      
      // Backend dependencies
      { skillId: skillMap['Node.js'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 3, reason: 'Node.js runs JavaScript' },
      { skillId: skillMap['Express.js'], dependsOnSkillId: skillMap['Node.js'], type: 'must-have', minimumLevel: 2, reason: 'Express is a Node.js framework' },
      { skillId: skillMap['RESTful APIs'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 2, reason: 'Understanding async operations' },
      
      // Advanced frontend depends on basics
      { skillId: skillMap['Responsive Design'], dependsOnSkillId: skillMap['CSS3'], type: 'must-have', minimumLevel: 2, reason: 'CSS knowledge required for responsive design' },
      { skillId: skillMap['Web Performance'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 3, reason: 'Understanding JS performance' },
      { skillId: skillMap['Accessibility'], dependsOnSkillId: skillMap['HTML5'], type: 'must-have', minimumLevel: 2, reason: 'Semantic HTML for accessibility' },
      
      // Testing depends on the technology being tested
      { skillId: skillMap['Testing'], dependsOnSkillId: skillMap['JavaScript'], type: 'must-have', minimumLevel: 3, reason: 'Testing JS code' }
    ];

    await SkillDependency.insertMany(dependencies);
    console.log(`✅ Created ${dependencies.length} skill dependencies\n`);

    // 6. Seed Skill Topics (Sample topics for key skills)
    console.log('📚 Seeding skill topics...');
    
    const topics = [
      // Angular Topics
      { skillId: skillMap['Angular'], name: 'Components & Templates', order: 1, difficulty: 'Easy', description: 'Creating components and template syntax', estimatedHours: 8, resourceLinks: [{ title: 'Angular Components Guide', url: 'https://angular.io/guide/component-overview', type: 'docs' }] },
      { skillId: skillMap['Angular'], name: 'Data Binding & Directives', order: 2, difficulty: 'Easy', description: 'Property binding, event binding, and built-in directives', estimatedHours: 6, resourceLinks: [{ title: 'Angular Template Syntax', url: 'https://angular.io/guide/template-syntax', type: 'docs' }] },
      { skillId: skillMap['Angular'], name: 'Services & Dependency Injection', order: 3, difficulty: 'Medium', description: 'Creating services and understanding DI', estimatedHours: 10, resourceLinks: [{ title: 'Angular Services', url: 'https://angular.io/guide/architecture-services', type: 'docs' }] },
      { skillId: skillMap['Angular'], name: 'Routing & Navigation', order: 4, difficulty: 'Medium', description: 'Setting up routes and navigation', estimatedHours: 8, resourceLinks: [{ title: 'Angular Router', url: 'https://angular.io/guide/router', type: 'docs' }] },
      { skillId: skillMap['Angular'], name: 'Forms (Template & Reactive)', order: 5, difficulty: 'Medium', description: 'Building forms with validation', estimatedHours: 12, resourceLinks: [{ title: 'Angular Forms', url: 'https://angular.io/guide/forms-overview', type: 'docs' }] },
      { skillId: skillMap['Angular'], name: 'HTTP & Observables', order: 6, difficulty: 'Medium', description: 'Making HTTP requests with HttpClient', estimatedHours: 10, resourceLinks: [{ title: 'Angular HTTP', url: 'https://angular.io/guide/http', type: 'docs' }] },
      { skillId: skillMap['Angular'], name: 'Change Detection Strategy', order: 7, difficulty: 'Hard', description: 'Understanding and optimizing change detection', estimatedHours: 8, resourceLinks: [{ title: 'Change Detection', url: 'https://angular.io/guide/change-detection', type: 'docs' }], prerequisites: ['Components & Templates'] },
      
      // JavaScript Topics
      { skillId: skillMap['JavaScript'], name: 'Variables & Data Types', order: 1, difficulty: 'Easy', description: 'let, const, primitive and reference types', estimatedHours: 6, resourceLinks: [{ title: 'MDN JavaScript Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript', type: 'docs' }] },
      { skillId: skillMap['JavaScript'], name: 'Functions & Arrow Functions', order: 2, difficulty: 'Easy', description: 'Function declarations, expressions, and ES6 arrows', estimatedHours: 8, resourceLinks: [{ title: 'MDN Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions', type: 'docs' }] },
      { skillId: skillMap['JavaScript'], name: 'DOM Manipulation', order: 3, difficulty: 'Easy', description: 'Selecting and modifying DOM elements', estimatedHours: 10, resourceLinks: [{ title: 'MDN DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model', type: 'docs' }] },
      { skillId: skillMap['JavaScript'], name: 'Promises & Async/Await', order: 4, difficulty: 'Medium', description: 'Asynchronous JavaScript programming', estimatedHours: 12, resourceLinks: [{ title: 'MDN Async', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous', type: 'docs' }] },
      { skillId: skillMap['JavaScript'], name: 'ES6+ Features', order: 5, difficulty: 'Medium', description: 'Destructuring, spread, modules, etc.', estimatedHours: 10, resourceLinks: [{ title: 'ES6 Features', url: 'https://javascript.info/es-modern', type: 'docs' }] },
      
      // TypeScript Topics
      { skillId: skillMap['TypeScript'], name: 'Basic Types & Interfaces', order: 1, difficulty: 'Easy', description: 'Type annotations and interface definitions', estimatedHours: 6, resourceLinks: [{ title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'docs' }] },
      { skillId: skillMap['TypeScript'], name: 'Generics', order: 2, difficulty: 'Medium', description: 'Writing reusable, type-safe code', estimatedHours: 8, resourceLinks: [{ title: 'TypeScript Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html', type: 'docs' }] },
      { skillId: skillMap['TypeScript'], name: 'Advanced Types', order: 3, difficulty: 'Hard', description: 'Union, intersection, conditional types', estimatedHours: 10, resourceLinks: [{ title: 'Advanced Types', url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html', type: 'docs' }], prerequisites: ['Basic Types & Interfaces'] },
      
      // Node.js Topics
      { skillId: skillMap['Node.js'], name: 'Node.js Fundamentals', order: 1, difficulty: 'Easy', description: 'Modules, npm, and basic server', estimatedHours: 8, resourceLinks: [{ title: 'Node.js Docs', url: 'https://nodejs.org/docs/', type: 'docs' }] },
      { skillId: skillMap['Node.js'], name: 'Async Patterns', order: 2, difficulty: 'Medium', description: 'Callbacks, promises, async/await in Node', estimatedHours: 10, resourceLinks: [{ title: 'Node.js Async', url: 'https://nodejs.org/en/learn/asynchronous-work', type: 'docs' }] },
      { skillId: skillMap['Node.js'], name: 'File System & Streams', order: 3, difficulty: 'Medium', description: 'Working with files and streams', estimatedHours: 8, resourceLinks: [{ title: 'Node.js FS', url: 'https://nodejs.org/api/fs.html', type: 'docs' }] },
      
      // CSS Topics
      { skillId: skillMap['CSS3'], name: 'Flexbox', order: 1, difficulty: 'Easy', description: 'Flexible box layout', estimatedHours: 6, resourceLinks: [{ title: 'CSS Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article' }] },
      { skillId: skillMap['CSS3'], name: 'CSS Grid', order: 2, difficulty: 'Medium', description: 'Two-dimensional grid layout', estimatedHours: 8, resourceLinks: [{ title: 'CSS Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', type: 'article' }] },
      { skillId: skillMap['CSS3'], name: 'Animations & Transitions', order: 3, difficulty: 'Medium', description: 'Creating smooth animations', estimatedHours: 6, resourceLinks: [{ title: 'CSS Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations', type: 'docs' }] }
    ];

    await SkillTopic.insertMany(topics);
    console.log(`✅ Created ${topics.length} skill topics\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${skillLevels.length} skill levels`);
    console.log(`   - ${skills.length} skills`);
    console.log(`   - ${roles.length} roles`);
    console.log(`   - ${roleSkillMappings.length} role-skill mappings`);
    console.log(`   - ${dependencies.length} skill dependencies`);
    console.log(`   - ${topics.length} skill topics\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();


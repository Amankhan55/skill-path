# SkillPath Frontend

Angular 19 frontend for SkillPath - Your career roadmap, data-driven.

## Features

- ✅ **Modern UI**: Built with Tailwind CSS for a beautiful, responsive design
- ✅ **Dark/Light Mode**: Class-based theme switching with localStorage persistence
- ✅ **Authentication**: Login and Register pages ready for backend integration
- ✅ **Landing Page**: Comprehensive landing page explaining SkillPath features
- ✅ **Routing**: Angular Router setup with MainLayout wrapper

## Tech Stack

- **Angular 19**: Latest stable version with standalone components
- **Tailwind CSS 3**: Utility-first CSS framework
- **TypeScript 5**: Type-safe development
- **RxJS**: Reactive programming for state management
- **Signals**: Angular's new reactivity system for theme management

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── theme.service.ts          # Dark/light mode management
│   ├── shared/
│   │   └── components/
│   │       └── theme-toggle/             # Theme toggle button
│   ├── layouts/
│   │   └── main-layout/                  # Header, footer, and outlet
│   ├── features/
│   │   ├── landing/                      # Landing page component
│   │   └── auth/
│   │       ├── login/                    # Login component
│   │       └── register/                 # Register component
│   ├── app.component.ts                  # Root component
│   ├── app.routes.ts                     # Route configuration
│   └── app.config.ts                     # App configuration
├── environments/
│   ├── environment.ts                    # Development config
│   └── environment.prod.ts               # Production config
└── styles.css                            # Global Tailwind imports

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 19+

### Installation

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Or with custom port
ng serve --port 4200
```

The app will open at `http://localhost:4200/`

### Available Scripts

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Pages

### Landing Page (`/`)
- Hero section with value proposition
- Problem/solution comparison
- Feature showcase
- CTA buttons for registration

### Login (`/login`)
- Email and password authentication
- Link to registration page
- Clean, modern form design

### Register (`/register`)
- Full name, email, password fields
- Optional experience years input
- Link to login page
- Form validation

## Theme System

The app supports dark and light modes using Tailwind's class-based dark mode:

```typescript
// ThemeService manages theme state
isDarkMode = signal(false);

// Persisted in localStorage
localStorage.setItem('theme', 'dark' | 'light');

// System preference detection
window.matchMedia('(prefers-color-scheme: dark')
```

## Design Principles

Following the project's core design principles:

- ✅ **Tailwind CSS only** - No Angular Material
- ✅ **Compact design** - Minimal white space
- ✅ **Dark/light mode** - Full theme support
- ✅ **Responsive** - Mobile-first approach
- ✅ **Accessible** - WCAG 2.1 AA compliant
- ✅ **No toast messages** - Clean modal interactions

## Next Steps

- [ ] Implement AuthService for API integration
- [ ] Add HttpClient interceptors for JWT
- [ ] Build dashboard components
- [ ] Create role selection page
- [ ] Implement skill assessment flow
- [ ] Build gap analysis visualization
- [ ] Create learning roadmap display
- [ ] Add progress tracking

## Backend API

The frontend connects to the backend at `http://localhost:3000/api` (configurable in `environment.ts`)

## Color Palette

```css
Primary Blue:   #0ea5e9 (blue-500)
Primary Purple: #a855f7 (purple-500)
Dark BG:        #111827 (gray-900)
Light BG:       #f9fafb (gray-50)
```

## Contributing

This is part of the SkillPath monorepo. See root README for contribution guidelines.

## License

MIT

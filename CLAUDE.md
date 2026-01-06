# CaosEngine Frontend - Technical Guidelines

CaosEngine is a Randomization as a Service (RaaS) platform delivering cryptographically secure random numbers through computational energy. This React + TypeScript frontend provides an interactive interface for true randomness generation, Bitcoin mining simulations, and real-time blockchain visualizations.

**Business Context**: See @README.md for project overview, features, and user documentation.

## Quick Reference

- **README.md**: Business context and user documentation
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Dev Server**: `npm run dev` (Vite dev server on port 5173)
- **Type Check**: `tsc --noEmit` (inferred from tsconfig.json)
- **Lint**: `npm run lint` (ESLint with TypeScript support)
- **Code Quality**: `npm run code-quality` (lint + dead code detection)
- **Package Manager**: pnpm (enforced via preinstall hook)

## Technology Stack

### Core Framework

- **React 19.1.1** with **TypeScript 5.9.2**
- **Vite 7.1.6** for build tooling and development
- **React Router DOM 7.9.1** for client-side routing

### Styling & Animation

- **Tailwind CSS 3.4.17** - utility-first styling with Prettier plugin
- **Framer Motion 12.23** - smooth animations and transitions
- **Three.js 0.180** - 3D graphics and visualizations
- **Styled Components 6.1.19** - CSS-in-JS for complex styling
- **Sass 1.93** - SCSS preprocessing

### State Management & Data

- **React Hook Form 7.63** - performant form handling
- **Custom React Hooks** - reusable state logic (see `/src/hooks/`)
- **React Context API** - global state (see `/src/context/DataContext.tsx`)
- **Axios 1.12.2** - HTTP client for API communication
- **Socket.io Client 4.8.1** - real-time bidirectional communication

### UI Components & Libraries

- **Headless UI 2.2.8** - unstyled, accessible UI components
- **Heroicons 2.2.0** - SVG icon library
- **React Icons 5.5.0** - popular icon packs
- **Recharts 3.2.1** - composable charting library
- **React Hot Toast 2.6.0** + **React Toastify 11.0.5** - notification systems

### Authentication & Payments

- **Google OAuth** via `@react-oauth/google 0.12.2`
- **JWT Decode 4.0.0** for token handling
- **@taloon/nowpayments-components 1.0.7** - custom payment components

### Code Quality & Developer Tools

- **ESLint 9.36** with TypeScript plugin and custom rules
- **Prettier 3.6.2** with Tailwind CSS plugin
- **Husky 9.1.7** - Git hooks automation
- **Knip 5.63.1** - dead code detection with auto-fix
- **TypeScript** strict mode with path aliases (`@/*` → `src/*`)

## Code Standards

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard/      # Bitcoin/blockchain dashboards
│   ├── modals/         # Modal components
│   ├── ui/             # Base UI components
│   └── [FeatureName]/  # Feature-specific components
├── pages/              # Route-level page components
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── services/           # API service functions
├── utils/              # Utility functions and constants
└── assets/             # Static assets
```

### Naming Conventions

**Components**: PascalCase with descriptive names

- `PokerCard.tsx`, `BitcoinNetworkSection.tsx`, `ConnectionStatus.tsx`

**Files & Directories**: PascalCase for components, camelCase for utilities

- Components: `MagicBall.tsx`, `TransactionsSection.tsx`
- Utilities: `Utils.ts`, `AutomaticConversion.jsx`

**Functions**: camelCase describing action

- `useBitcoinChipsContext()`, `convert()`, `DATA` (constants in CAPS)

**Types & Interfaces**: PascalCase with descriptive suffixes

- `BitcoinChipsContextType`, `interface` for object shapes

### Code Patterns

**React Patterns**:

- Functional components with TypeScript interfaces
- Custom hooks for stateful logic (`useMiningPool`, `useLogInHook`)
- Context providers for global state (`BitcoinChipsProvider`)
- Proper error boundaries and error handling

**Import Organization** (enforced by ESLint):

```typescript
import React, { useState, useEffect } from 'react';

import { ExternalLibrary } from 'external-library';

import { InternalComponent } from '@/components/InternalComponent';
import { useCustomHook } from '@/hooks/useCustomHook';
```

**State Management**:

- React Hook Form for complex forms
- Custom hooks for feature-specific state
- Context API for cross-component shared state
- Local state for component-specific data

### TypeScript Configuration

- **Strict mode enabled** with `noUnusedLocals` and `noUnusedParameters`
- **Path aliases**: `@/*` maps to `src/*`
- **JSX**: React JSX transformation
- **Module Resolution**: Bundler mode for Vite compatibility

## Architecture Patterns

### Component Architecture

- **Page-level components** in `/src/pages/` handle routing and layout
- **Feature components** in `/src/components/[Feature]/` encapsulate business logic
- **UI components** in `/src/components/ui/` provide reusable interface elements
- **Modal components** in `/src/components/modals/` handle overlay interactions

### API Integration

- **Service layer** in `/src/services/` abstracts API calls
- **Axios configuration** with authentication headers
- **Socket.io** for real-time data (mining stats, price updates)
- **Authentication** via Google OAuth with JWT tokens

### State Flow

1. **Global state** via Context API (`DataContext.tsx`)
2. **Feature state** via custom hooks (`useMiningPool`, `useLiquidity`)
3. **Form state** via React Hook Form
4. **API state** via service functions with loading/error states

## Development Workflow

### Scripts Overview

- `npm run dev` - Start Vite development server
- `npm run build` - TypeScript compilation + production build
- `npm run lint` - ESLint with auto-fix option (`lint:fix`)
- `npm run deadcode` - Knip analysis with auto-fix option (`deadcode:fix`)
- `npm run code-quality` - Combined lint + dead code check
- `npm run format` - Prettier formatting with check option

### Git Hooks (Husky)

- **Pre-commit**: Likely runs formatting and linting
- **Post-install**: Automatic Husky setup

### Environment Variables

```env
VITE_API_BASE=https://api.caosengine.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SESSION_NAME=session_key
VITE_TEST_MODE=0|1
```

## Current Patterns & Practices

### Good Patterns Found

- **Consistent TypeScript interfaces** for component props and context types
- **Custom hooks** for reusable stateful logic
- **Utility functions** for common operations (number conversion, formatting)
- **Modular component organization** by feature areas
- **Path aliases** for clean imports
- **Strict linting configuration** with unused imports removal

### Areas for Improvement

- **Mixed file extensions** (`.jsx` and `.tsx` coexist - prefer `.tsx` for consistency)
- **Global data access** via `Utils.ts` could benefit from proper context management
- **Type safety** - some components use `any` types that could be more specific
- **Component naming** - some components have generic names that could be more descriptive

## Build & Development

### Package Manager

- **pnpm 9.0.0** enforced via preinstall hook
- **Node.js 18+** required
- **Development server**: `http://localhost:5173`

### Build Process

1. TypeScript compilation (`tsc`)
2. Vite bundling with optimizations
3. Asset processing and code splitting
4. Production-ready static files

### Testing Strategy

- **Type checking** via TypeScript compiler
- **Linting** via ESLint with comprehensive rules
- **Dead code detection** via Knip
- **No explicit test framework** detected - consider adding Jest/Vitest

## Security Considerations

- **Environment variables** for sensitive configuration
- **JWT token handling** for authentication
- **Google OAuth** integration for secure login
- **HTTPS** for API communication (production)

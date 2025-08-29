# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HelloCity User Portal is a Next.js 14 frontend application with comprehensive internationalization, authentication, and state management. It connects to a .NET 8 backend API and provides a bilingual user interface for city relocation assistance.

## Development Commands

### Frontend (HelloCityUserPortal/)
- **Install dependencies**: `npm install`
- **Compile i18n messages**: `npm run lingui:compile` (required after fresh install and after adding new text)
- **Start dev server**: `npm run dev` (runs on http://localhost:3000)
- **Build production**: `npm run build`
- **Run all tests**: `npm run test`
- **Run specific test**: `npm test -- ComponentName.test.tsx`
- **Test with coverage**: `npm run test:coverage`
- **Test in watch mode**: `npm run test:watch`
- **Lint**: `npm run lint` or `npm run lint:fix`
- **Format**: `npm run format:check` or `npm run format:fix`
- **Fix all code quality**: `npm run fix` (runs both lint:fix and format:fix)
- **Type check**: `npm run type-check`
- **Start Storybook**: `npm run storybook` (http://localhost:6006)
- **Extract i18n**: `npm run lingui:extract && npm run lingui:compile` (after adding new text)

## Architecture

### Next.js 14 App Router Structure
- **src/app/[lang]/**: Dynamic language routing with `generateStaticParams` for en/zh locales
- **src/app/[lang]/layout.tsx**: Preloads all i18n messages to prevent loading issues during language switching
- **ClientProviders.tsx**: Client-side provider wrapper for Redux, i18n, and language contexts

### State Management (Redux Toolkit + Redux Saga)
- **src/store/**: Centralized state management with saga middleware
- **src/store/slices/**: RTK slices for state management
- **src/store/sagas/**: Side effect management with Redux Saga (not Redux Thunk)
- Store configured with `thunk: false` and saga middleware for async operations

### Internationalization Architecture
- **Lingui i18n**: Uses `po` format with English as source locale, Chinese as target
- **Server-side preloading**: All messages loaded in layout to prevent client-side loading delays
- **Context providers**: `I18nProvider` wraps `LanguageProvider` for seamless language switching
- **URL-based routing**: `/en/` and `/zh/` routes with language detection from pathname

### Component Architecture
- **src/components/**: Atomic reusable components
- **src/compoundComponents/**: Complex composed components (modals, multi-part UI)
- **src/contexts/**: React contexts for language and i18n state
- **Material-UI + Tailwind**: Hybrid approach with MUI components and Tailwind utilities

### Authentication & API Layer
- **Auth0 integration**: Full authentication flow with JWT tokens
- **src/utils/fetchWithAuth.ts**: Authenticated API calls with automatic token injection
- **src/api/**: API layer with proper error handling and type safety

## Key Development Patterns

### Component Development
- Use existing MUI components with Tailwind for custom styling
- Follow compound component pattern for complex UI elements
- All user-facing text must use `<Trans>` components with explicit IDs
- Component props interfaces should extend base MUI props when applicable

### Internationalization Workflow
1. Add `<Trans id="unique.id" message="Default text">` to components
2. Run `npm run lingui:extract` to extract messages
3. Update translations in `src/locales/zh/messages.po`
4. Run `npm run lingui:compile` to compile messages
5. Test both `/en/` and `/zh/` routes

### State Management Patterns
- Use Redux slices for UI state and caching
- Implement sagas for API calls and side effects
- Type Redux state with `RootState` and actions with `AppDispatch`
- Keep component state for truly local UI state only

### Testing Strategy
- **Jest + React Testing Library**: Component testing with jsdom environment
- **Mock setup**: Comprehensive mocking for Next.js navigation, i18n, and Auth0
- **Test wrappers**: Use `TestProviders` for consistent test setup
- **Coverage**: Configured with v8 provider, excludes test utils
- Tests must pass before commits (enforced by Husky)

## Environment Setup

### Required Files
- `.env.local`: Copy from `.env.example` with actual Auth0 and API credentials
- Auth0 configuration for authentication flow
- Backend API base URL for authenticated requests

### Development Dependencies
- Node.js ≥20.19.0 (Node 22 LTS recommended)
- Exact dependency versions (no `^` prefixes) - MUI v7.2+ may have compatibility issues

## Important Implementation Details

### Language Context Integration
- `useLanguage()` hook provides current language and switching functionality
- Language changes update URL pathname and activate new i18n locale
- Server components can use `serverI18n.ts` utilities for SSR translations

### Redux Store Configuration
- Saga middleware replaces Redux Thunk
- DevTools enabled in development only
- Store provides `RootState` and `AppDispatch` types for TypeScript

### API Integration Pattern
- Always use `fetchWithAuth()` for authenticated backend calls
- API responses should be typed with proper TypeScript interfaces
- Error handling implemented at API layer with proper user feedback

### Testing Considerations
- Mock Next.js router, pathname, and search params in jest.setup.ts
- Language context is mocked with React state for test isolation
- Trans components render as spans with message content for testing
- Test utilities in `__tests__/utils/` are ignored by coverage

## Quality Gates

### Pre-commit Hooks (Husky)
- ESLint validation and auto-fixing
- Prettier formatting enforcement
- TypeScript type checking
- Test execution (all tests must pass)
- i18n extraction and compilation

### Build Requirements
- All TypeScript must compile without errors
- All tests must pass with coverage reporting
- Linting and formatting rules must be followed
- i18n messages must be compiled before testing

### Deployment Considerations
- Production builds require `npm run build` success
- All environment variables must be configured
- Auth0 domain and client configuration required
- Backend API must be accessible from deployment environment
[![中文说明](https://img.shields.io/badge/文档-中文-blue?style=flat-square)](./README.zh-CN.md)

# Hello City Client

A modern frontend project powered by Next.js 14, React 18, TypeScript, Material-UI, Tailwind CSS, Redux Toolkit, and comprehensive internationalization support.

## 📋 Table of Contents

1. [Requirements](#1-requirements)
2. [Getting Started](#2-getting-started)
3. [Environment Configuration](#3-environment-configuration)
4. [Development Commands](#4-development-commands)
5. [Git Hooks (Husky)](#5-git-hooks-husky)
6. [Tech Stack](#6-tech-stack)
7. [Project Structure](#7-project-structure)
8. [Development Workflow](#8-development-workflow)
9. [Notes](#9-notes)

## 1. Requirements

- Node.js: **>=20.19.0 or >=22.12.0** (Node 22 LTS recommended)
- Package manager: npm (v9+ recommended), or yarn/pnpm/bun
- Local ENV file
  - Create `.env.local` file, populate it with the same constant names in `.env.example` file
  - Currently the `.env.local` file contains constants that enables:
    - Auth0
    - Backend Api calls

## 2. Getting Started

1. **Clone the project and enter the directory:**

   ```bash
   git clone <repo-url/ssh>
   cd HelloCityUserPortal
   ```

2. **Install dependencies:**

   ```bash
   npm install  # or npm ci
   # or
   yarn install --frozen-lockfile  # or yarn ci
   # or
   pnpm install --frozen-lockfile  # or pnpm ci
   # or
   bun install --frozen-lockfile
   ```

3. **Compile internationalization messages:**

   ```bash
   npm run compile
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   # or yarn dev / pnpm dev / bun dev
   ```

5. **Set up environment variables** (see Environment Configuration below)

6. **Open** [http://localhost:3000](http://localhost:3000) **in your browser.**

## 4. Development Commands

### Core Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check
```

### Code Quality

```bash
# Linting
npm run lint          # Check for issues
npm run lint:fix      # Fix issues automatically

# Formatting
npm run format:check  # Check formatting
npm run format:fix    # Fix formatting

# Combined fix
npm run fix           # Run both lint:fix and format:fix
```

### Testing

Unit tests must be passed before creating a pull request.

```bash
# Run all tests once
npm run test

# Watch mode (reruns on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files location:

- `**/__tests__/**/*.test.tsx`
- `**/*.test.tsx`, `**/*.spec.tsx`

### Internationalization

```bash
# Extract messages from code
npm run extract

# Compile extracted messages
npm run compile

# Run both (required after adding new text)
npm run extract && npm run compile
```

### Storybook

Interactive component documentation and development.

**First time setup (recommended):**

```bash
# Build Storybook first (faster subsequent starts)
npm run build-storybook

# Then start development server
npm run storybook
```

**Regular development:**

```bash
# Start Storybook dev server (auto-builds if needed)
npm run storybook
```

Storybook looks for `.stories.tsx` files in the `stories/` directory.

**Access Storybook:** [http://localhost:6006](http://localhost:6006)

## 3. Environment Configuration

**Required:** Create `.env.local` file in the project root:

```bash
# macOS/Linux
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

Populate `.env.local` with actual values for:

- **Auth0 Configuration:**
  - `AUTH0_SECRET` - Random 32-character string
  - `AUTH0_BASE_URL` - Your application URL (http://localhost:3000 for development)
  - `AUTH0_ISSUER_BASE_URL` - Your Auth0 domain
  - `AUTH0_CLIENT_ID` - Your Auth0 application client ID
  - `AUTH0_CLIENT_SECRET` - Your Auth0 application client secret

- **Backend API:**
  - `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL

**Note:** Contact team lead for actual environment values.

## 5. Git Hooks (Husky)

Automatically enforces code quality standards:

- ✅ Code formatting (Prettier)
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Test validation
- ✅ Commit message format

**Setup:** Automatically configured during `npm install` on all platforms.

## 6. Tech Stack

### Core Framework

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### UI & Styling

- [Material-UI](https://mui.com/) - React component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Custom theme with brand colors and gradients

### State Management

- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Redux Saga](https://redux-saga.js.org/) - Side effect management

### Authentication & API

- [Auth0](https://auth0.com/) - Authentication and authorization
- [Axios](https://axios-http.com/) - HTTP client

### Internationalization

- [Lingui](https://lingui.js.org/) - i18n library
- Support for English and Chinese

### Development Tools

- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react) - Testing
- [Storybook](https://storybook.js.org/) - Component documentation
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - Code quality
- [Husky](https://typicode.github.io/husky/) - Git hooks

## 7. Project Structure

```
src/
├── app/                    # Next.js App Router (pages, layouts)
├── components/             # Reusable UI components
├── compoundComponents/     # Complex composed components
├── store/                  # Redux store, slices, sagas
├── contexts/               # React contexts (Language, i18n)
├── api/                    # API layer with authentication
├── locales/                # i18n message catalogs
├── theme/                  # Material-UI theme configuration
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── stories/                # Storybook stories
```

### Key Configuration Files

- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `src/theme/` - Material-UI theme with brand colors
- `jest.config.ts` + `jest.setup.ts` - Testing configuration
- `lingui.config.js` - Internationalization setup
- `.storybook/` - Storybook configuration

## 8. Development Workflow

### Adding New Features

1. Create components in `src/components/`
2. Add Redux state in `src/store/slices/` if needed
3. Add Storybook stories in `src/stories/`
4. Write tests in `__tests__/` directories
5. Use `<Trans>` components for all user-facing text
6. Run `npm run extract && npm run compile` after adding text

### Language Support

- **English**: `/en/` routes (default)
- **Chinese**: `/zh/` routes
- Always wrap user-facing text with `<Trans>` components
- Test both languages during development

### Code Quality

- Husky pre-commit hooks run automatically
- All tests must pass before creating PRs
- ESLint and Prettier enforce code standards
- TypeScript strict mode enabled

### Authentication

- Auth0 handles user authentication
- Use `fetchWithAuth` utility for authenticated API calls
- User state managed through Redux

## 9. Notes

- All dependencies use exact versions (no `^` prefixes), MUI versions above 7.2 may have compatibility issues
- TypeScript strict mode and comprehensive type checking enabled

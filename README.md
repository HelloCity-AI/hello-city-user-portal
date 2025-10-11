[![中文说明](https://img.shields.io/badge/文档-中文-blue?style=flat-square)](./README.zh-CN.md)

# Hello City Client

A modern frontend project powered by Next.js 14, React 18, TypeScript, Material-UI, Tailwind CSS, Redux Toolkit, and comprehensive internationalization support.

## 📋 Table of Contents

1. [Requirements](#1-requirements)
2. [Getting Started](#2-getting-started)
3. [Environment Configuration](#3-environment-configuration)
4. [Development Commands](#4-development-commands)
5. [Key Features](#5-key-features)
6. [Git Hooks (Husky)](#6-git-hooks-husky)
7. [Tech Stack](#7-tech-stack)
8. [Project Structure](#8-project-structure)
9. [Development Workflow](#9-development-workflow)
10. [Notes](#10-notes)

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
   npm run lingui:compile
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

# End-to-end tests
npm run test:e2e
```

Test files location:

- `**/__tests__/**/*.test.tsx`
- `**/*.test.tsx`, `**/*.spec.tsx`

### Internationalization

```bash
# Extract messages from code
npm run lingui:extract

# Compile extracted messages
npm run lingui:compile

# Run both (required after adding new text)
npm run lingui:extract && npm run lingui:compile
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

## 5. Key Features

### AI-Powered Chat Assistant

Real-time AI chat with OpenAI GPT integration and intelligent checklist generation.

**Features:**

- **Streaming Responses:** Real-time SSE streaming via Vercel AI SDK
- **Conversation Management:** Create, view, and manage chat conversations
- **Intelligent Checklists:** AI-generated task checklists with async processing
- **Multi-Language Support:** Full i18n support for English and Chinese

**Architecture:**

- **Route Groups:** Organized with `(app)` protected pages and `(site)` public pages
  - `/assistant` - AI chat interface (authenticated)
  - `/profile` - User profile management (authenticated)
  - `/` - Landing page (public)
  - `/contact-us` - Contact form (public)

**Tech Stack:**

- Vercel AI SDK (`@ai-sdk/react`, `ai`)
- OpenAI GPT integration
- Redux Saga for state management
- SSE streaming for real-time responses

### Route Groups Architecture

The application uses Next.js 14 Route Groups to organize pages:

- **`(app)` group** - Protected application pages requiring authentication
- **`(site)` group** - Public marketing and informational pages

This structure provides:

- Shared layouts per group
- Clean URL structure (group names don't appear in URLs)
- Logical separation of authenticated vs. public routes

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

- **OpenAI API (Required for AI Chat):**
  - `OPENAI_API_KEY` - Your OpenAI API key for chat streaming

**Note:** Contact team lead for actual environment values.

## 6. Git Hooks (Husky)

Automatically enforces code quality standards:

- ✅ Code formatting (Prettier)
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Test validation
- ✅ Commit message format

**Setup:** Automatically configured during `npm install` on all platforms.

## 7. Tech Stack

### Core Framework

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### UI & Styling

- [Material-UI v7.2+](https://mui.com/) - React component library
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) - Advanced date/time components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI primitives
  - Avatar, Dropdown Menu, Select, Slot components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Custom theme with brand colors and gradients

### State Management

- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Redux Saga](https://redux-saga.js.org/) - Side effect management

### AI & Streaming

- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI chat streaming interface
- [OpenAI](https://openai.com/) - GPT-powered chat responses

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

## 8. Project Structure

```
src/
├── app/[lang]/             # Next.js App Router with i18n routing
│   ├── (app)/              # Protected application pages
│   │   ├── assistant/      # AI chat assistant
│   │   ├── profile/        # User profile
│   │   └── create-user-profile/  # Profile creation
│   ├── (site)/             # Public marketing pages
│   │   ├── page.tsx        # Landing page
│   │   └── contact-us/     # Contact form
│   └── api/                # Next.js API routes
│       └── chat/           # OpenAI chat streaming endpoint
├── components/             # Atomic reusable components
│   ├── ai-elements/        # AI-specific UI components
│   └── AppPageSections/    # App layout sections
├── compoundComponents/     # Complex multi-part components
│   ├── ChatPage/           # AI chat feature components
│   │   ├── ChatMainArea/   # Main conversation interface
│   │   ├── ChatSidebar/    # Conversation history
│   │   └── ChecklistPanel/ # City checklist panel
│   ├── NavBar/             # Navigation bar
│   ├── Menus/              # Dropdown menus
│   └── Modals/             # Modal dialogs
├── store/                  # Redux state management
│   ├── slices/             # Redux slices (user, conversation, checklist)
│   └── sagas/              # Redux Saga files
├── api/                    # API layer with Auth0 authentication
│   └── transformers/       # Backend ↔ Frontend data transformation
├── contexts/               # React contexts (Language, I18n)
├── hooks/                  # Custom React hooks
├── locales/                # i18n message catalogs (en/zh po format)
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── theme/                  # Material-UI theme configuration
```

### Key Configuration Files

- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `src/theme/` - Material-UI theme with brand colors
- `jest.config.ts` + `jest.setup.ts` - Testing configuration
- `lingui.config.js` - Internationalization setup
- `.storybook/` - Storybook configuration

## 9. Development Workflow

### Adding New Features

1. Create components in `src/components/`
2. Add Redux state in `src/store/slices/` if needed
3. Add Storybook stories in `src/stories/`
4. Write tests in `__tests__/` directories
5. Use `<Trans>` components for all user-facing text
6. Run `npm run lingui:extract && npm run lingui:compile` after adding text

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

## 10. Notes

- All dependencies use exact versions (no `^` prefixes), MUI versions above 7.2 may have compatibility issues
- TypeScript strict mode and comprehensive type checking enabled

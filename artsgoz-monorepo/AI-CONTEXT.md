# Project Context & Developer Guide

This document is a comprehensive guide to the `artsgoz-monorepo` workspace, compiled specifically for AI coding assistants to quickly onboard, understand architectural decisions, and follow established project conventions.

---

## 🚀 Workspace Overview

This is an **Nx-managed monorepo** using **pnpm workspaces** to orchestrate build targets, dependencies, and type checking.

### Projects

The monorepo contains the following workspace projects:

1. **`@org/frontend`** (`apps/frontend`): The main public-facing client application.
2. **`@org/backoffice`** (`apps/backoffice`): The admin panel / backoffice application.
3. **`@artsgoz/design-system`** (`libs/design-system`): A shared custom UI component library consumed by both applications.

---

## 🛠️ Tech Stack & Real Specifications

> [!WARNING]
> The root `README.md` file contains some outdated placeholder documentation (e.g., claiming the apps use Next.js 16 and Tailwind v3). Below is the **correct and active** tech stack:

- **Framework**: Vite 8 + React 19 (Single Page Applications, not Next.js).
- **Routing**: `react-router` version 7 (using `createBrowserRouter` & `RouterProvider`).
- **Language**: TypeScript 6.0+ with modern ESM configuration.
- **Styling**: **Tailwind CSS v4** (imported via `@import 'tailwindcss';` in `styles.css` using the new Tailwind v4 syntax).
- **Monorepo Engine**: Nx 22.7.
- **Package Manager**: pnpm.

---

## ⚠️ Critical Development Conventions (Must Follow)

### 1. ESM Imports REQUIRE `.js` Extensions

Because of the ESM configuration in this workspace, all imports of relative files (TS/JSX/JS/TSX) in the source directories must specify their compile-time extensions (typically **`.js`**).

- **Correct**: `import { ClubCard } from './ClubCard.js';`
- **Incorrect**: `import { ClubCard } from './ClubCard';`

### 2. Feature-Based Directory Structure

The application code under `apps/frontend/src/features/` is strictly modular. Each feature should be self-contained:

```
features/my-feature/
├── components/           # UI components specific to this feature
├── constants.ts          # Feature-specific mock data, configurations
├── types.ts              # TypeScript interfaces/types for this feature
└── index.ts              # Clean public API exporting only what's needed
```

- **Rule**: Other parts of the application (e.g., routing pages or layouts) should only import from the feature's root `index.ts`. Never deep import (e.g. do not import from `features/my-feature/components/MyComponent.js`).

### 3. Using the Shared Design System

Always check `libs/design-system/src/lib/components/` first before building new UI components. Import them from `@artsgoz/design-system`:

```tsx
import {
  Button,
  SectionHeading,
  Pagination,
  SearchInput,
} from '@artsgoz/design-system';
```

Available components include:

- `Button`
- `CULoginButton` (styled specifically for Chulalongkorn University login theme)
- `Chip`
- `Icon`
- `IconButton`
- `Pagination`
- `SearchInput`
- `SectionHeading`

### 4. Internationalization (i18n) Rules

- **Nesting Structure**: Do not use flat keys at the top-level of translation files if they have children paths (e.g. `"student_services": "..."` blocks children like `"student_services.bento.title"`). Keep namespaces as fully nested JSON trees.
- **Dynamic Keys**: Store raw translation keys in mock data configurations (e.g., `constants.ts`) and dynamically translate them using `t(key)` at the rendering component level.
- **Dual Languages**: Always add translation keys to both [th/translation.json](file:///c:/Users/Lenovo/artsgoz-monorepo/apps/frontend/public/locales/th/translation.json) and [en/translation.json](file:///c:/Users/Lenovo/artsgoz-monorepo/apps/frontend/public/locales/en/translation.json) simultaneously to prevent missing keys/fallbacks.

---

## ⚙️ Development Commands

Always run these commands from the root directory:

- **Start all dev servers**: `pnpm dev`
- **Start frontend dev server**: `pnpm dev:frontend`
- **Start backoffice dev server**: `pnpm dev:backoffice`
- **Run type-checking**: `pnpm typecheck`
- **Build all projects**: `pnpm build`
- **Run tests**: `pnpm test`
- **Lint codebase**: `pnpm lint` / Auto-fix: `pnpm lint:fix`

---

## 📝 Commit Conventions

Commits are strictly validated using `commitlint` and `husky`. Use the format:
`<type>(<scope>): <description>`

- **Allowed Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Examples**:
  - `feat(frontend): add club descriptions to cards`
  - `fix(design-system): prevent button text clipping`

---

# 🤖 System Prompt for Antigravity Agent

## 🎯 Role

You are an elite Senior Frontend Architect working on the `artsgoz-monorepo` project. Your code must be production-ready, highly optimized, and strictly adhere to the project's established architecture.

## 🏗️ Tech Stack & Architecture

- **Framework:** React 19 + Vite + TypeScript.
- **Styling:** Tailwind CSS (v3.4+).
- **Workspace:** Nx Monorepo structure.
- **Architecture:** Feature-Sliced Design (FSD) mixed with Clean Architecture.
  - `src/features/`: Contains domain-specific logic, components, types, and constants. Must export via `index.ts`.
  - `src/routes/`: Contains page-level components assembling features. Handled via React Router v7.
  - `src/components/` & `@artsgoz/design-system`: Shared, dumb UI components.

## 📜 Strict Coding Directives

### 1. State Management (The Golden Rule)

- **NEVER** use `useState` for search queries, active categories, tabs, or pagination.
- **ALWAYS** use URL Search Parameters (via `useSearchParams`) for shareable state.

### 2. Styling & UI Components

- **NEVER** build standard UI elements (Buttons, Inputs, Chips, Pagination) from scratch using native HTML tags in feature pages.
- **ALWAYS** import existing UI components from `@artsgoz/design-system` or `src/components/`.
- Apply strict Tailwind CSS utility classes. Avoid arbitrary values where possible.

### 3. Animations & UX

- For micro-interactions (hover, active, focus states), use Tailwind CSS (e.g., `transition-all duration-300 hover:scale-[1.02] active:scale-95`).
- For layout changes, complex list reveals, or smooth mount/unmount animations (e.g., expanding accordions, staggered grid loads), you MUST use **Framer Motion** (`motion.div`, `AnimatePresence`).

### 4. Execution Behavior

- When tasked with creating a new feature, automatically scaffold the required FSD folders (`components/`, `types.ts`, `constants.ts`, `index.ts`) inside the target feature directory before touching the route files.
- If the user requests code that violates these rules, automatically refactor it to comply with the URL-driven and FSD architecture without asking for permission.

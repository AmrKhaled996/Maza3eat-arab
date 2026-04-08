# Maza3eat-Arab 🌍

**Maza3eat-Arab** is a community-driven travel platform designed for Arab travelers to share their journeys, review destinations, and exchange advice in a collaborative environment.

It combines the storytelling of a **Travel Blog** with the interactive nature of **Reddit-style Q&A**.

## Current Project Status

- This repository currently contains the **frontend application only**.
- The home experience is partially implemented with real API calls via Axios + React Query.
- Several routed pages still exist as placeholders (empty fragments) and are not yet feature-complete.
- Development uses a Vite proxy for `/api` requests to `http://localhost:3000`.

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- TanStack React Query 5
- Axios
- ESLint 9

## Implemented Areas

- Home page composition with:
  - Hero section
  - Featured posts section
  - Community section
  - Q&A section
  - Footer
- API integration for home data:
  - Home community posts
  - Home featured posts
  - Home questions
  - Popular questions
  - Trending tags
- Axios response interceptor for token refresh flow using `VITE_BACKEND_URL`.

## Routes (Current)

- `/` (Home page)
- `/login` (placeholder)
- `/community` (placeholder)
- `/post/:id` (placeholder content)
- `/create-post` (placeholder)
- `/q&a` (placeholder)
- `/q&a/:id` (placeholder)
- `/create-q&a` (placeholder)
- `/featured` (basic shell page with navigation)
- `/profile/:id/posts` (placeholder)
- `/profile/:id/q&a` (placeholder)

## Known Gaps

- Multiple pages are still scaffolded and need UI + data wiring.
- Lint currently fails due unused variables/imports and a few `any` types.
- Auth guarding exists (`ProtectedRoute`) but is not wired into route definitions.

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm

### Installation

```bash
git clone https://github.com/AmrKhaled996/maza3eat-arab.git
cd maza3eat-arab
npm install
```

### Run Development Server

```bash
npm run dev
```

### Available Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

## Environment

The app expects this variable when using refresh-token flow:

```bash
VITE_BACKEND_URL=http://localhost:3000
```

Also note:

- Axios instance uses `baseURL: /api/v1`.
- Vite proxies `/api/*` to `http://localhost:3000` in development.

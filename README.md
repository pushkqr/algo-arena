## Algo Arena

Algo Arena is a competitive strategy evaluation platform for building, benchmarking, and ranking algorithms across dynamic environments.

Users can author strategies, run asynchronous evaluations, inspect detailed results, and compare outcomes on a leaderboard. The platform is built around a tight technical loop: submit, evaluate, measure, refine.

## Core Loop

- `Build` strategies for a specific environment and manage their lifecycle over time.
- `Evaluate` them through sandbox checks and asynchronous environment runs.
- `Rank` completed outcomes on a leaderboard with environment-aware filtering.
- `Improve` using detailed result views, repeat submissions, and clear benchmark feedback.

## What You Can Do

- Author and manage strategies per environment.
- Run sandbox checks before saving or evaluating.
- View your own evaluation results in detail.
- Compare completed runs on a global leaderboard.
- Operate service-side evaluation workflows with role-gated controls.
- Discover newly enabled environments dynamically from backend metadata.
- Manage usernames, email verification, and account identity flows.

## System Overview

- Frontend: React/Vite application for strategy authoring, evaluation visibility, rankings, and account workflows.
- Backend: asynchronous evaluation service for queueing runs, storing results, ranking outcomes, and exposing environment metadata.
- Auth: Firebase-backed identity with token-based API access for user and service workflows.

## Tech Stack

- React 19
- React Router 7
- Vite 8
- Firebase Auth (client authentication)
- React Toastify (notification UX)
- ESLint 9

## Project Structure

```text
.
|-- src/                  # Application source
|   |-- api/              # API clients
|   |-- components/       # Reusable UI components
|   |-- hooks/            # Feature and state hooks
|   |-- pages/            # Route-level pages
|   |-- styles/           # Global and modular styles
|   `-- lib/              # Shared utilities and config
|-- public/               # Static public assets
|-- package.json          # Scripts and dependencies
`-- README.md             # Project documentation
```

## Backend API Surface (Consumed by Frontend)

- `GET /api/meta/environment`
- `GET /api/strategies`
- `POST /api/strategies/sandbox-run`
- `POST/PATCH/DELETE /api/strategies/*`
- `GET /api/results`
- `GET /api/results/:evaluationId`
- `GET /api/evaluations/*` for service-user workflows
- `GET /api/leaderboard/evaluations`
- `GET /api/users/username-availability`
- `PUT /api/users/me/username`

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (recommended)
- A running backend API compatible with the routes above
- Firebase project credentials for frontend auth

## Environment Configuration

Create `.env.local` or `.env` in the repository root:

```bash
VITE_API_BASE_URL=http://localhost:5432
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."}

# Optional frontend service-user visibility controls
VITE_SERVICE_USER_ID=
VITE_SERVICE_USER_IDS=
VITE_SERVICE_USER_EMAIL=
VITE_SERVICE_USER_EMAILS=
VITE_SERVICE_MANAGER_UIDS=
VITE_SERVICE_MANAGER_EMAILS=
```

Notes:

- `VITE_FIREBASE_CONFIG` must be valid JSON.
- `VITE_API_BASE_URL` must point to the backend origin.

## Local Development

```bash
npm install
npm run dev
```

Default Vite dev server is available at `http://localhost:5173`.

## Build & Preview

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` - run local development server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint checks

## Supported Environment(s)

- `AuctionHouse`
- `TicTacToe`

Enabled environments are fetched dynamically from `GET /api/meta/environment`,
so newly available environments can appear in selectors and documentation flows
without hardcoded frontend updates.

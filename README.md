git# Algo Arena

Algo Arena is a strategy-evaluation platform where users submit algorithms, run environment evaluations, and compare ranked results through a leaderboard.

## Overview

The application provides:

- Strategy authoring and lifecycle management per environment
- Strategy sandbox run support for quick verify-before-save iteration
- User-scoped evaluation results
- Global leaderboard views for completed evaluations
- Username management with availability checks and claim/update flow
- Role-gated service operations for running evaluations
- Dynamic environment catalog loading from backend meta endpoint
- Public support/contact page for issue reporting

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
├─ src/                  # Application source
│  ├─ api/               # API clients
│  ├─ components/        # Reusable UI components
│  ├─ hooks/             # Feature and state hooks
│  ├─ pages/             # Route-level pages
│  ├─ styles/            # Global and modular styles
│  └─ lib/               # Shared utilities and config
├─ public/               # Static public assets
├─ package.json          # Scripts and dependencies
└─ README.md             # Project documentation
```

## Key Product Flows

- Authentication
  - `Log in`: email + password
  - `Sign up`: username + email + password
- Username lifecycle
  - live availability check
  - transactional username claim/update via API
  - recovery UX for partial signup completion
- Profile management
  - edit username
  - verify email
  - identity copy actions
- Evaluation visibility
  - user-scoped results pages
  - leaderboard paging and filtering by environment/evaluation

## Backend API Surface (Consumed by Frontend)

- `GET /api/meta/environment`
- `GET /api/strategies`
- `POST /api/strategies/sandbox-run`
- `POST/PATCH/DELETE /api/strategies/*`
- `GET /api/results`
- `GET /api/results/:evaluationId`
- `GET /api/evaluations/*` (service-user workflows)
- `GET /api/leaderboard/evaluations`
- `GET /api/users/username-availability`
- `PUT /api/users/me/username`

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (recommended)
- A running backend API compatible with the routes above
- Firebase project credentials for frontend auth

## Environment Configuration

Create `.env.local` (or `.env`) in repository root:

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

- `npm run dev` — run local development server
- `npm run build` — create production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint checks

## Supported Environment(s)

- `AuctionHouse`
- `TicTacToe`

Environment options are fetched dynamically from `GET /api/meta/environment`,
so newly enabled environments can appear in frontend selectors without
hardcoded UI updates.

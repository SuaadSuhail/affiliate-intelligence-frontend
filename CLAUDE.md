# Affiliate Intelligence Platform — Frontend

## Project overview
React + TypeScript frontend for the Affiliate
Intelligence Platform. Connects to the FastAPI
backend at http://localhost:8080.

## Tech stack
- React 18 with TypeScript
- Vite
- Tailwind CSS v3
- Recharts for data visualisation
- Axios for API calls
- Lucide React for icons
- shadcn/ui component patterns

## Backend connection
- Base URL: http://localhost:8080 (dev)
- All POST endpoints require header:
  X-Api-Key: change-me-in-production
- CORS is configured on the backend to allow
  the frontend origin

## Environment variables
VITE_API_URL — backend base URL
VITE_API_KEY — API key for protected endpoints

## Key API endpoints used
GET  /affiliates — list all affiliates
GET  /ml/dashboard — portfolio stats
GET  /ml/scores — affiliates sorted by health
GET  /ml/explain/{id} — SHAP explanation
POST /agent/chat — send message to AI agent
POST /ingest/full — trigger data ingestion
POST /process/nlp — trigger NLP tagging
POST /ml/train — train ML models
POST /ml/score — score all affiliates
GET  /task/{id} — poll background task status
POST /admin/migrate — run database migrations

## Project structure
src/
├── api/
│   ├── client.ts       ← axios instance with auth
│   └── endpoints.ts    ← typed API functions
├── components/
│   ├── ui/             ← reusable UI primitives
│   │   ├── Badge.tsx
│   │   ├── HealthBar.tsx
│   │   ├── ScoreCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── AffiliateList.tsx
│   ├── AffiliateDetail.tsx
│   ├── Dashboard.tsx
│   ├── ChatInterface.tsx
│   └── PipelineControls.tsx
├── App.tsx             ← main layout
├── main.tsx
└── index.css

## Git conventions
Branch strategy:
  main        → stable, working code only
  feature/*   → one branch per feature

Commit format: <type>(<scope>): <description>
Types: feat, fix, style, refactor, docs

## Rules for Claude Code
- Always read this file fully before starting
- Update this file after completing any work
- Document every new component added
- Document any new API endpoints used
- Note any important decisions or fixes made

## Built components
- `src/api/client.ts` — Axios instance with base URL, API key header, and 60s timeout
- `src/api/endpoints.ts` — Typed API functions for every backend endpoint
- `src/components/ui/Badge.tsx` — Status pill badge (active/at_risk/churned/high_growth)
- `src/components/ui/HealthBar.tsx` — Colour-coded horizontal progress bar (0-100)
- `src/components/ui/ScoreCard.tsx` — Stat card with title, value, and optional subtitle
- `src/components/ui/LoadingSpinner.tsx` — Animated spinning circle via Tailwind animate-spin
- `src/components/AffiliateList.tsx` — Sidebar affiliate list with badge, health bar, days since contact
- `src/components/AffiliateDetail.tsx` — Detail panel with SHAP explanation bars
- `src/components/Dashboard.tsx` — Stats row + Recharts BarChart of affiliate health scores
- `src/components/ChatInterface.tsx` — Chat panel with bubbles, suggested chips, tool-use pills
- `src/components/PipelineControls.tsx` — Pipeline buttons with task polling and toast notifications
- `src/App.tsx` — Three-panel layout: sidebar + tabbed main + sliding detail panel

## Status
- Status: build complete, runtime errors fixed
- npm run dev: http://localhost:5173
- Backend required: http://localhost:8080

## Fixes
- Fixed: `verbatimModuleSyntax` requires `import type` for all interface imports.
  All components now use `import type { ... }` for types and a separate `import { ... }`
  for runtime values (functions). Affects: App.tsx, AffiliateList, AffiliateDetail,
  Dashboard, ChatInterface.
- Fixed: Recharts v3 Tooltip `formatter` prop type — removed explicit `number` annotation
  so TypeScript infers the correct `ValueType | undefined` signature.
- Fixed: Dashboard NaN% on Avg Churn Risk and Avg Growth Potential — backend returns
  decimals (e.g. 0.389), now multiplied by 100 and formatted with toFixed(1).
- Fixed: Dashboard interface realigned to actual /ml/dashboard API response.
  Actual response has at_risk_count, churned_count, high_growth_count, and a scores[]
  array — not high_risk_count, avg_churn_risk, avg_growth_potential, or score_history_entries.
  Added DashboardScore interface. avg_churn_risk and avg_growth_potential are now computed
  client-side from dashboard.scores[].

## API response shapes (verified)
GET /ml/dashboard returns:
  { total_affiliates, avg_health_score, at_risk_count, high_growth_count, churned_count,
    scores: [{ affiliate_id, name, churn_risk_score, growth_potential_score, health_score }] }
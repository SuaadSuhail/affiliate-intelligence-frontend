# Affiliate Intelligence Platform — Frontend

React + TypeScript frontend for the Affiliate Intelligence Platform — an agentic AI system for affiliate relationship management.

## Overview

A three-panel dashboard that connects to the FastAPI backend to provide:

- Live portfolio health dashboard with charts
- AI chat interface powered by a LangChain ReAct agent
- Pipeline controls for running data ingestion, NLP processing, ML training, and scoring
- Affiliate detail panel with SHAP explainability

## Tech stack

| Component | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| HTTP client | Axios |
| Icons | Lucide React |
| Markdown | react-markdown |

## Backend

Requires the FastAPI backend running at `http://localhost:8080`

Backend repository: [github.com/SuaadSuhail/affiliate-intelligence-platform](https://github.com/SuaadSuhail/affiliate-intelligence-platform)

## Setup

**Prerequisites**
- Node.js 18+
- Backend API running at `http://localhost:8080`

**Installation**

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_API_URL=http://localhost:8080
VITE_API_KEY=change-me-in-production
```

**Start the dev server**

```bash
npm run dev
```

Open http://localhost:5173

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:8080` |
| `VITE_API_KEY` | API key matching backend `API_SECRET_KEY` | `change-me-in-production` |

## Project structure

```
src/
├── api/
│   ├── client.ts        ← Axios instance with auth header
│   └── endpoints.ts     ← Typed API functions and interfaces
├── components/
│   ├── ui/
│   │   ├── Badge.tsx         ← Status badge (active/at_risk/churned/high_growth)
│   │   ├── HealthBar.tsx     ← Colour-coded health score bar
│   │   ├── ScoreCard.tsx     ← Stat card for dashboard
│   │   └── LoadingSpinner.tsx
│   ├── AffiliateList.tsx     ← Left sidebar with all affiliates
│   ├── AffiliateDetail.tsx   ← Right panel with SHAP explanation
│   ├── Dashboard.tsx         ← Portfolio stats and bar chart
│   ├── ChatInterface.tsx     ← AI agent chat with markdown rendering
│   └── PipelineControls.tsx  ← Pipeline buttons with task polling
└── App.tsx                   ← Three-panel layout with tabs
```

## Features

- **Live dashboard** — stats pulled from backend on load and auto-refreshed every 60 seconds
- **Affiliate list** — sorted by health score with colour-coded health bars
- **AI chat** — sends messages to the LangChain agent and renders markdown responses (bold, lists, code blocks)
- **Tool visibility** — tools used by the agent are displayed under each response
- **Pipeline controls** — trigger background tasks and poll for completion with success/error toasts
- **Affiliate detail panel** — SHAP risk and growth factor explanations per affiliate

## Building for production

```bash
npm run build
```

Output goes to `dist/` — serve with any static file server or deploy to Netlify, Vercel, or Railway.

Set `VITE_API_URL` to your production backend URL before building.
# Affiliate Intelligence Platform — Frontend

React + TypeScript frontend for the Affiliate Intelligence Platform.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS v3, Recharts, Axios, Lucide React

## Backend

Requires the FastAPI backend running at `http://localhost:8080`

See: [github.com/SuaadSuhail/affiliate-intelligence-platform](https://github.com/SuaadSuhail/affiliate-intelligence-platform)

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL and API key
npm run dev
```

Open http://localhost:5173

## Environment variables

| Variable        | Description                                     |
|----------------|-------------------------------------------------|
| `VITE_API_URL` | Backend URL (default: `http://localhost:8080`)  |
| `VITE_API_KEY` | API key matching backend `API_SECRET_KEY`       |
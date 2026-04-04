# NightPulse MVP

NightPulse is a nightlife discovery MVP that estimates real-time venue energy using multi-signal scoring (not exact occupancy).

## Stack
- Next.js + TypeScript
- Tailwind CSS + lightweight shadcn-style components
- PostgreSQL + Prisma
- Supabase Auth client bootstrap
- Google Maps/Places-ready env wiring
- Background snapshot jobs

## Core MVP Features
- Explore page centered on **hot near me**
- Venue cards with live activity label + confidence + line + cover + dress context
- BuzzScore engine (`0-100`) with crowd labels and “compared to usual” insight
- User live report endpoint with short-lived weighting
- Venue detail page with live-report feed
- Owner/admin/favorites/live/profile screens scaffolded for fast expansion
- Mock fallback system for offline/demo mode

## Data Model
Prisma includes:
`User`, `Venue`, `VenuePhoto`, `VenueTag`, `VenueEvent`, `VenueDressCode`, `VenueCoverRule`, `LiveUpdate`, `BuzzScoreSnapshot`, `FavoriteVenue`, `OwnerClaim`, `NeighborhoodTrend`, `ReportFlag`, `AuditLog`.

## Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Background Jobs
```bash
npm run jobs
```
This computes and stores buzz snapshots for cached refresh/trend analytics.

## API Endpoints
- `GET /api/venues`
- `POST /api/live-reports`
- `GET /api/buzz-snapshots`

## Product Constraint Handling
This MVP **does not** rely on exact live occupancy from Google/Meta APIs. It provides an estimated status from weighted signals + crowdsourced live updates + trend baselines.

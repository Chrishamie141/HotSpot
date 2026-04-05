# NightPulse

NightPulse is a production-oriented nightlife discovery app that estimates venue busyness in real time using Google Places + local signal enrichment.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- Supabase Auth bootstrap
- Google Maps JavaScript API + Places API

## Key Features
- Real nearby nightlife discovery from Google Places (`bar`, `night_club`)
- Split explore experience (venue list + live map)
- Dynamic filtering: open now, rating, price level, distance, type
- Venue detail with gallery, map preview, and live activity sections
- Local enrichment for buzz scores, live reports, dress code, and cover info
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

## APIs
- `GET /api/venues?lat=&lng=&radius=&minRating=&openNow=&priceLevels=&type=`
- `GET /api/venues/:placeId`
- `POST /api/live-reports`
- `GET /api/buzz-snapshots`

## Architecture Notes
- Google Places provides source-of-truth venue discovery and details.
- Postgres/Prisma stores NightPulse-specific data (buzz snapshots, live reports, dress code, cover, ownership, moderation).
- Service layer keeps external API mapping isolated for future provider expansion.
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

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

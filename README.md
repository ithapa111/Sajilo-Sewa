# Sajilo Sewa Reference Data

This repository now contains a starter reference dataset for building a multi-service platform with:

- ridesharing
- food ordering
- courier delivery

The content is Uber-inspired at the product-flow level, but it does not copy Uber branding, names, or proprietary data.

## Files

- `index.html`: app entry point
- `styles.css`: visual system and responsive layout
- `app.js`: UI rendering logic
- `data/sajilo-seed-data.json`: seed-ready reference data for the app
- `data/sajilo-seed-data.js`: browser-ready seed data for direct HTML loading
- `docs/reference-model.md`: explanation of the important entities and how to use them

## Run

Open `index.html` in a browser.

The page reads from `data/sajilo-seed-data.js` first, so it can load directly even without a dev server.

To run the API-backed version:

1. `npm start`
2. Open `http://localhost:3000`

## Demo Flow

1. Start the app with `npm start`.
2. Open `http://localhost:3000`.
3. Use the built-in demo session immediately, or create/log into an account.
4. Submit a ride, food, or courier request.
5. Review the live API response and refreshed operational dashboard.

## Deploy On Render

This repository includes [`render.yaml`](C:\Users\Indra\OneDrive\Desktop\Sajilo-Sewa\render.yaml) for a quick demo deployment as a Render web service.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint and connect this repository.
3. Confirm the service settings from `render.yaml`.
4. Deploy and open the generated Render URL.

Current demo deployment notes:

- The Render config uses `STORAGE_DRIVER=json` so the app runs without any extra infrastructure.
- New signups and submitted requests write to local JSON files.
- On Render, that filesystem is not durable across restarts or redeploys, so this is suitable for demos, not durable production data.

For PostgreSQL-backed API reads and writes:

1. Set `STORAGE_DRIVER=postgres`
2. Set `DATABASE_URL`
3. Run `psql ... -f db/schema.sql`
4. Run `psql ... -f db/seed.sql`
5. Start the app with `npm start`

## API

- `GET /api/health`
- `GET /api/auth/config`
- `GET /api/auth/me`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/overview`
- `GET /api/platform`
- `GET /api/rides`
- `GET /api/food`
- `GET /api/courier`
- `GET /api/seed`
- `POST /api/rides/requests`
- `POST /api/food/orders`
- `POST /api/courier/deliveries`

## Database

- `db/schema.sql`: normalized relational schema
- `db/seed.sql`: starter inserts matching the seed dataset
- `docs/postgres-setup.md`: PostgreSQL runtime setup

## Intended Use

Use this data as a foundation for:

- database schema design
- admin dashboards
- mobile app mock APIs
- pricing and dispatch logic
- onboarding and support flows

## Notes

- Locations and records are fictional sample data.
- Pricing values are examples and should be adjusted for your market.
- JSON storage supports account signup, login, and token resolution through `data/auth-users.json`.
- PostgreSQL storage currently supports the platform data and service write APIs, but not persisted account signup/login yet.
- If you want, the next step can be turning this into a real backend schema for Supabase, Firebase, PostgreSQL, or a full React/Next.js app.

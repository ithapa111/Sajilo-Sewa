# Sajilo Sewa

Sajilo Sewa means "Easy Service." This project is a mobile-first marketplace for the Nepalese community in the USA that brings local discovery and three service lines into one app:

- Yelp-style browsing for local community restaurants, services, events, and groups
- ridesharing
- food ordering
- courier delivery

The current app includes:

- a polished landing page focused on Nepalese community discovery
- a marketplace search page with list and map-style browsing
- separate member and business login flows
- public browsing with member-gated reviews, favorites, and service requests
- community categories for photoshoots, ceremony makeup, priests, free social sewa, volunteering, carpools, community centers, events, sports, adult matchmaking threads, and lawyer services
- service-specific API paths and request flows
- operational dashboards, live map views, and themed request forms
- JSON and PostgreSQL storage options for seeded platform data

The content is inspired by modern mobility and delivery product flows, but it does not copy third-party branding, names, or proprietary data.

## Files

- `index.html`: app entry point
- `marketplace.html`: community marketplace search with map/list results
- `business.html`: public business profile page
- `account.html`: member and business login flows
- `styles.css`: visual system and responsive layout
- `data/marketplace-data.json`: marketplace seed data for businesses, categories, reviews, and map coordinates
- `data/sajilo-seed-data.json`: seed-ready reference data for the app
- `data/sajilo-seed-data.js`: browser-ready seed data for direct HTML loading
- `docs/reference-model.md`: explanation of the important entities and how to use them

## Run

Open `index.html` in a browser for a static preview.

The page reads from `data/sajilo-seed-data.js` first, so it can load directly even without a dev server.

To run the full API-backed app:

1. `npm start`
2. Open `http://localhost:3000`

## App Flow

1. Start the app with `npm start`.
2. Open `http://localhost:3000`.
3. Start with built-in access, or create/log into an account.
4. Explore the three product areas: ridesharing, food ordering and delivery, and courier.
5. Submit a ride, food, or courier request.
6. Review the live API response, themed operations view, and refreshed platform data.

## Deploy On Render

This repository includes [`render.yaml`](C:\Users\Indra\OneDrive\Desktop\Sajilo-Sewa\render.yaml) for a quick demo deployment as a Render web service.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint and connect this repository.
3. Confirm the service settings from `render.yaml`.
4. Deploy and open the generated Render URL.

Current deployment notes:

- The Render config uses `STORAGE_DRIVER=json` so the app runs without any extra infrastructure.
- New signups and submitted requests write to local JSON files.
- On Render, that filesystem is not durable across restarts or redeploys, so this setup is suitable for demos, not durable production data.

For PostgreSQL-backed API reads and writes:

1. Set `STORAGE_DRIVER=postgres`
2. Set `DATABASE_URL`
3. Run `psql ... -f db/schema.sql`
4. Run `psql ... -f db/seed.sql`
5. Start the app with `npm start`

## API

Service-specific APIs are separated so each product line is easier to understand and extend:

- `GET /api/health`
- `GET /api/services`
- `GET /api/auth/config`
- `GET /api/auth/me`
- `POST /api/auth/member/signup`
- `POST /api/auth/member/login`
- `POST /api/auth/business/signup`
- `POST /api/auth/business/login`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/marketplace/categories`
- `GET /api/marketplace/businesses`
- `GET /api/marketplace/businesses/:slug`
- `GET /api/marketplace/businesses/:id/reviews`
- `POST /api/marketplace/businesses/:id/reviews`
- `POST /api/marketplace/businesses/:id/favorite`
- `DELETE /api/marketplace/businesses/:id/favorite`
- `POST /api/marketplace/business-claims`
- `POST /api/marketplace/service-requests`
- `GET /api/overview`
- `GET /api/platform`
- `GET /api/rideshare/overview`
- `POST /api/rideshare/requests`
- `GET /api/food-delivery/overview`
- `POST /api/food-delivery/orders`
- `GET /api/courier/overview`
- `POST /api/courier/requests`
- `GET /api/seed`

Legacy aliases still work for compatibility:

- `GET /api/rides`
- `POST /api/rides/requests`
- `GET /api/food`
- `POST /api/food/orders`
- `GET /api/courier`
- `POST /api/courier/deliveries`

## Database

- `db/schema.sql`: normalized relational schema
- `db/seed.sql`: starter inserts matching the seed dataset
- `docs/postgres-setup.md`: PostgreSQL runtime setup

## Intended Use

Use this project as a foundation for:

- database schema design
- admin and operations dashboards
- mobile or web product mock APIs
- pricing and dispatch logic
- onboarding and support flows
- multi-service product demos and portfolio projects

## Notes

- Locations and records are fictional sample data.
- Pricing values are examples and should be adjusted for your market.
- JSON storage supports account signup, login, and token resolution through `data/auth-users.json`.
- PostgreSQL storage currently supports the platform data and service write APIs, but not persisted account signup/login yet.
- A natural next step is turning this into a production app with a real frontend framework, persistent auth, and durable infrastructure.

# Backend Starter Plan

This repository now includes a dependency-free Node server and a normalized SQL schema so the app has a real backend boundary.

## Runtime

- `server.js` serves the frontend and JSON API endpoints
- `lib/store.js` selects `json` or `postgres` storage
- `lib/auth.js` enforces bearer-token API authorization
- `package.json` defines `npm start`
- data is read from `data/sajilo-seed-data.json`

## API endpoints

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

## Write behavior

POST endpoints append new records into `data/sajilo-seed-data.json` and regenerate `data/sajilo-seed-data.js`.

In JSON mode, account signup and login are also persisted in `data/auth-users.json`.

This is a local development persistence layer, not a production database strategy.

In PostgreSQL mode, writes go through SQL operations executed via `psql`.
Account signup and login are not implemented in PostgreSQL mode yet.

## Database direction

Use `db/schema.sql` as the first normalized relational schema for:

- users and roles
- rideshare dispatch
- restaurant marketplace
- delivery operations
- trust and safety events

## Recommended next production moves

1. Move seed JSON into PostgreSQL tables using `db/schema.sql`.
2. Add authentication for riders, drivers, customers, couriers, and admins.
3. Split the API into services for marketplace, ride dispatch, and order management.
4. Replace static seed state with live writes, queues, and webhook-driven notifications.

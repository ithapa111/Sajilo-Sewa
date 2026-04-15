# PostgreSQL Setup

This app can run in two storage modes:

- `json`: local file persistence
- `postgres`: API reads and writes through PostgreSQL using the `psql` CLI

## Environment

Copy values from `.env.example` and set:

```env
STORAGE_DRIVER=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/sajilo_sewa
PSQL_BIN=psql
```

## Initialize database

Run these commands in order:

```powershell
psql $env:DATABASE_URL -f db/schema.sql
psql $env:DATABASE_URL -f db/seed.sql
```

## Auth model

The current server uses bearer tokens for API authorization.

PostgreSQL mode currently uses the static development tokens mirrored in `.env.example`:

- `dev-admin-token`
- `dev-rider-token`
- `dev-customer-token`
- `dev-courier-token`
- `dev-driver-token`

`POST /api/auth/signup` and `POST /api/auth/login` are available only in JSON storage mode today.

## Current API behavior in PostgreSQL mode

- `GET /api/overview`
- `GET /api/platform`
- `GET /api/rides`
- `GET /api/food`
- `GET /api/courier`
- `GET /api/seed`
- `POST /api/rides/requests`
- `POST /api/food/orders`
- `POST /api/courier/deliveries`

## Important limitation

The PostgreSQL runtime path depends on the local `psql` executable being available because this repository intentionally avoids external Node packages.

For production, replace that transport layer with a proper PostgreSQL driver and connection pooling.

# Reference Model

This dataset is designed for a platform that combines rideshare and food delivery in one system.

## Core modules

### Marketplace

- service categories
- cities and operating zones
- surge rules
- promotions
- payment methods

### Rideshare

- riders
- drivers
- vehicles
- service tiers
- ride requests
- live trips
- trip history
- fare breakdown
- safety and support events

### Food ordering

- customers
- restaurants
- menu categories
- menu items
- modifiers
- store hours
- food couriers
- orders
- order status events
- delivery pricing

### Shared platform data

- wallet and payments
- ratings and reviews
- notifications
- saved places
- issue types
- admin KPIs

## Important data you usually need in an app like this

### User and identity data

- user id
- role
- phone
- email
- profile photo
- language
- saved addresses
- emergency contact
- payment preference

### Rideshare operational data

- pickup and dropoff points
- ETA
- route distance
- route duration
- service type
- vehicle capacity
- driver acceptance rate
- fare estimate
- surge multiplier
- cancellation reason
- trip status

### Food delivery operational data

- restaurant cuisine type
- preparation time
- delivery radius
- order items
- item modifiers
- subtotal
- taxes
- delivery fee
- service fee
- courier assignment
- live tracking milestones

### Trust and safety data

- SOS availability
- ride share verification
- document verification
- issue reporting
- lost item support
- refund reason
- blocked users or merchants

## How to use the JSON

1. Import it into a database as seed data.
2. Split each top-level collection into separate tables.
3. Use the IDs as foreign keys.
4. Expand status enums and pricing rules for your country and city.

## Recommended next implementation step

Turn the JSON into:

- SQL schema and inserts
- Supabase seed files
- Firebase collections
- a REST or GraphQL mock backend

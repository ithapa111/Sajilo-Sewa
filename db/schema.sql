CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  center_lat NUMERIC(9, 6),
  center_lng NUMERIC(9, 6),
  status TEXT NOT NULL
);

CREATE TABLE zones (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL,
  surge_eligible BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE platform_users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  rating NUMERIC(3, 2),
  wallet_balance NUMERIC(10, 2),
  online_status TEXT,
  current_zone_id TEXT REFERENCES zones(id)
);

CREATE TABLE api_tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES platform_users(id),
  role TEXT NOT NULL,
  label TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE saved_places (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES platform_users(id),
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  lat NUMERIC(9, 6),
  lng NUMERIC(9, 6)
);

CREATE TABLE vehicles (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL REFERENCES platform_users(id),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  model_year INTEGER NOT NULL,
  color TEXT NOT NULL,
  plate_number TEXT NOT NULL UNIQUE
);

CREATE TABLE ride_service_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  base_fare NUMERIC(10, 2) NOT NULL,
  per_mile NUMERIC(10, 2) NOT NULL,
  per_minute NUMERIC(10, 2) NOT NULL,
  minimum_fare NUMERIC(10, 2) NOT NULL,
  booking_fee NUMERIC(10, 2) NOT NULL,
  cancellation_fee NUMERIC(10, 2) NOT NULL
);

CREATE TABLE vehicle_service_tiers (
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  tier_id TEXT NOT NULL REFERENCES ride_service_tiers(id),
  PRIMARY KEY (vehicle_id, tier_id)
);

CREATE TABLE surge_rules (
  id TEXT PRIMARY KEY,
  zone_id TEXT NOT NULL REFERENCES zones(id),
  time_window TEXT NOT NULL,
  multiplier NUMERIC(4, 2) NOT NULL,
  reason TEXT NOT NULL
);

CREATE TABLE ride_requests (
  id TEXT PRIMARY KEY,
  rider_id TEXT NOT NULL REFERENCES platform_users(id),
  requested_tier_id TEXT NOT NULL REFERENCES ride_service_tiers(id),
  pickup_address TEXT NOT NULL,
  pickup_lat NUMERIC(9, 6),
  pickup_lng NUMERIC(9, 6),
  dropoff_address TEXT NOT NULL,
  dropoff_lat NUMERIC(9, 6),
  dropoff_lng NUMERIC(9, 6),
  estimated_distance_miles NUMERIC(10, 2),
  estimated_duration_minutes NUMERIC(10, 2),
  estimated_fare NUMERIC(10, 2),
  surge_multiplier NUMERIC(4, 2),
  status TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  rider_id TEXT NOT NULL REFERENCES platform_users(id),
  driver_id TEXT NOT NULL REFERENCES platform_users(id),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  tier_id TEXT NOT NULL REFERENCES ride_service_tiers(id),
  status TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_lat NUMERIC(9, 6),
  pickup_lng NUMERIC(9, 6),
  dropoff_address TEXT NOT NULL,
  dropoff_lat NUMERIC(9, 6),
  dropoff_lng NUMERIC(9, 6),
  distance_miles NUMERIC(10, 2),
  duration_minutes NUMERIC(10, 2),
  payment_method_id TEXT,
  rider_rating INTEGER,
  driver_rating INTEGER,
  total_fare NUMERIC(10, 2) NOT NULL
);

CREATE TABLE trip_timeline_events (
  id BIGSERIAL PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id),
  event_status TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE trip_safety_events (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id),
  event_type TEXT NOT NULL,
  triggered_by_user_id TEXT NOT NULL REFERENCES platform_users(id),
  event_status TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating NUMERIC(3, 2),
  price_level INTEGER NOT NULL,
  address TEXT NOT NULL,
  zone_id TEXT NOT NULL REFERENCES zones(id),
  delivery_radius_miles NUMERIC(10, 2) NOT NULL,
  avg_prep_time_minutes INTEGER NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE restaurant_cuisines (
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  cuisine_tag TEXT NOT NULL,
  PRIMARY KEY (restaurant_id, cuisine_tag)
);

CREATE TABLE menu_categories (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  category_id TEXT NOT NULL REFERENCES menu_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE modifier_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  selection_type TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE modifier_options (
  id TEXT PRIMARY KEY,
  modifier_group_id TEXT NOT NULL REFERENCES modifier_groups(id),
  label TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE menu_item_modifier_groups (
  menu_item_id TEXT NOT NULL REFERENCES menu_items(id),
  modifier_group_id TEXT NOT NULL REFERENCES modifier_groups(id),
  PRIMARY KEY (menu_item_id, modifier_group_id)
);

CREATE TABLE food_orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES platform_users(id),
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  courier_id TEXT REFERENCES platform_users(id),
  status TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_lat NUMERIC(9, 6),
  delivery_lng NUMERIC(9, 6),
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL,
  service_fee NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  courier_tip NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  payment_method_id TEXT,
  customer_rating INTEGER
);

CREATE TABLE food_order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES food_orders(id),
  menu_item_id TEXT NOT NULL REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  line_total NUMERIC(10, 2) NOT NULL
);

CREATE TABLE food_order_item_modifiers (
  order_item_id BIGINT NOT NULL REFERENCES food_order_items(id),
  modifier_option_id TEXT NOT NULL REFERENCES modifier_options(id),
  PRIMARY KEY (order_item_id, modifier_option_id)
);

CREATE TABLE food_order_timeline_events (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES food_orders(id),
  event_status TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE courier_package_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  max_weight_kg NUMERIC(10, 2) NOT NULL
);

CREATE TABLE courier_deliveries (
  id TEXT PRIMARY KEY,
  sender_user_id TEXT NOT NULL REFERENCES platform_users(id),
  courier_id TEXT REFERENCES platform_users(id),
  package_type_id TEXT NOT NULL REFERENCES courier_package_types(id),
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  status TEXT NOT NULL,
  quoted_price NUMERIC(10, 2) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL
);

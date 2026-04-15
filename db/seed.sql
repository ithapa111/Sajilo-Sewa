INSERT INTO cities (id, name, country, center_lat, center_lng, status) VALUES
  ('city_chi', 'Chicago', 'USA', 41.878100, -87.629800, 'active');

INSERT INTO zones (id, city_id, name, zone_type, surge_eligible) VALUES
  ('zone_loop', 'city_chi', 'Downtown Loop', 'high-demand', TRUE),
  ('zone_north', 'city_chi', 'North Side', 'residential-mixed', TRUE),
  ('zone_west', 'city_chi', 'West Corridor', 'airport-connector', TRUE);

INSERT INTO platform_users (id, role, full_name, phone, email, rating, wallet_balance, online_status, current_zone_id) VALUES
  ('rider_001', 'rider', 'Maya Thompson', '+1-312-555-0101', 'maya@example.com', 4.90, 18.50, NULL, NULL),
  ('rider_002', 'rider', 'Daniel Brooks', '+1-312-555-0103', 'daniel@example.com', 4.80, 6.25, NULL, NULL),
  ('driver_001', 'driver', 'Jorge Alvarez', '+1-312-555-0201', NULL, 4.96, NULL, 'online', 'zone_loop'),
  ('driver_002', 'driver', 'Aisha Patel', '+1-312-555-0202', NULL, 4.91, NULL, 'busy', 'zone_north'),
  ('cust_001', 'customer', 'Maya Thompson', '+1-312-555-0101', 'maya@example.com', NULL, NULL, NULL, NULL),
  ('cust_002', 'customer', 'Elena Cruz', '+1-312-555-0301', 'elena@example.com', NULL, NULL, NULL, NULL),
  ('courier_001', 'courier', 'Samir Khan', '+1-312-555-0401', NULL, 4.88, NULL, 'online', 'zone_loop'),
  ('courier_002', 'courier', 'Lena Morris', '+1-312-555-0402', NULL, 4.93, NULL, 'online', 'zone_north');

INSERT INTO api_tokens (token, user_id, role, label, is_active) VALUES
  ('dev-admin-token', 'driver_001', 'admin', 'Development admin token', TRUE),
  ('dev-rider-token', 'rider_001', 'rider', 'Development rider token', TRUE),
  ('dev-customer-token', 'cust_001', 'customer', 'Development customer token', TRUE),
  ('dev-courier-token', 'courier_001', 'courier', 'Development courier token', TRUE),
  ('dev-driver-token', 'driver_001', 'driver', 'Development driver token', TRUE);

INSERT INTO saved_places (user_id, label, address, lat, lng) VALUES
  ('rider_001', 'Home', '1900 N Sheffield Ave, Chicago, IL', 41.916100, -87.653600),
  ('rider_001', 'Work', '233 S Wacker Dr, Chicago, IL', 41.878900, -87.635900);

INSERT INTO vehicles (id, driver_id, make, model, model_year, color, plate_number) VALUES
  ('veh_001', 'driver_001', 'Toyota', 'Camry', 2022, 'Silver', 'SJL-2041'),
  ('veh_002', 'driver_002', 'Honda', 'Pilot', 2023, 'Black', 'SJL-1187');

INSERT INTO ride_service_tiers (id, name, capacity, base_fare, per_mile, per_minute, minimum_fare, booking_fee, cancellation_fee) VALUES
  ('tier_go', 'Sajilo Go', 4, 2.50, 1.35, 0.32, 6.50, 1.25, 4.00),
  ('tier_plus', 'Sajilo Plus', 6, 4.50, 1.90, 0.45, 9.00, 1.75, 5.00),
  ('tier_exec', 'Sajilo Exec', 4, 8.00, 3.10, 0.72, 18.00, 2.50, 8.00);

INSERT INTO vehicle_service_tiers (vehicle_id, tier_id) VALUES
  ('veh_001', 'tier_go'),
  ('veh_001', 'tier_plus'),
  ('veh_002', 'tier_plus');

INSERT INTO surge_rules (id, zone_id, time_window, multiplier, reason) VALUES
  ('surge_001', 'zone_loop', '07:00-09:30', 1.40, 'commuter_peak'),
  ('surge_002', 'zone_west', '16:30-19:00', 1.60, 'airport_rush');

INSERT INTO ride_requests (id, rider_id, requested_tier_id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, estimated_distance_miles, estimated_duration_minutes, estimated_fare, surge_multiplier, status, requested_at) VALUES
  ('rq_001', 'rider_001', 'tier_go', '875 N Michigan Ave, Chicago, IL', 41.898800, -87.624200, '233 S Wacker Dr, Chicago, IL', 41.878900, -87.635900, 2.90, 14.00, 13.42, 1.20, 'searching', '2026-04-14T18:20:00-05:00');

INSERT INTO trips (id, rider_id, driver_id, vehicle_id, tier_id, status, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, distance_miles, duration_minutes, payment_method_id, rider_rating, driver_rating, total_fare) VALUES
  ('trip_001', 'rider_002', 'driver_001', 'veh_001', 'tier_go', 'completed', '150 W Adams St, Chicago, IL', 41.879500, -87.633900, '1035 W Van Buren St, Chicago, IL', 41.876100, -87.652400, 2.10, 11.00, 'pay_card_visa', 5, 5, 13.18),
  ('trip_002', 'rider_001', 'driver_002', 'veh_002', 'tier_plus', 'in_progress', '1901 W Madison St, Chicago, IL', 41.881500, -87.675500, '5700 S DuSable Lake Shore Dr, Chicago, IL', 41.792500, -87.583100, 8.40, 26.00, 'pay_wallet', NULL, NULL, 39.25);

INSERT INTO trip_timeline_events (trip_id, event_status, occurred_at) VALUES
  ('trip_001', 'driver_assigned', '2026-04-14T08:10:00-05:00'),
  ('trip_001', 'driver_arrived', '2026-04-14T08:14:00-05:00'),
  ('trip_001', 'trip_started', '2026-04-14T08:16:00-05:00'),
  ('trip_001', 'trip_completed', '2026-04-14T08:27:00-05:00'),
  ('trip_002', 'driver_assigned', '2026-04-14T17:52:00-05:00'),
  ('trip_002', 'trip_started', '2026-04-14T18:03:00-05:00');

INSERT INTO trip_safety_events (id, trip_id, event_type, triggered_by_user_id, event_status, occurred_at) VALUES
  ('safe_001', 'trip_002', 'share_trip', 'rider_001', 'completed', '2026-04-14T18:05:00-05:00');

INSERT INTO restaurants (id, name, rating, price_level, address, zone_id, delivery_radius_miles, avg_prep_time_minutes, is_open) VALUES
  ('rest_001', 'Himal Street Kitchen', 4.70, 2, '825 W Randolph St, Chicago, IL', 'zone_loop', 4.50, 22, TRUE),
  ('rest_002', 'Lakeview Burger House', 4.50, 2, '2932 N Broadway, Chicago, IL', 'zone_north', 5.00, 18, TRUE);

INSERT INTO restaurant_cuisines (restaurant_id, cuisine_tag) VALUES
  ('rest_001', 'Nepali'),
  ('rest_001', 'Momo'),
  ('rest_001', 'Noodles'),
  ('rest_002', 'Burgers'),
  ('rest_002', 'Fries'),
  ('rest_002', 'Shakes');

INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('mc_001', 'rest_001', 'Momos', 1),
  ('mc_002', 'rest_001', 'Noodles', 2),
  ('mc_003', 'rest_002', 'Signature Burgers', 1);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_popular, is_available) VALUES
  ('item_001', 'rest_001', 'mc_001', 'Chicken Steam Momo', 'Steamed dumplings with spiced chicken filling', 12.50, TRUE, TRUE),
  ('item_002', 'rest_001', 'mc_002', 'Chow Mein', 'Stir-fried noodles with vegetables and sauce', 13.25, FALSE, TRUE),
  ('item_003', 'rest_002', 'mc_003', 'Classic Smash Burger', 'Double patty burger with cheese and house sauce', 14.75, TRUE, TRUE);

INSERT INTO modifier_groups (id, name, selection_type, is_required) VALUES
  ('mod_001', 'Spice Level', 'single', TRUE),
  ('mod_002', 'Add Protein', 'single', FALSE),
  ('mod_003', 'Extras', 'multi', FALSE);

INSERT INTO modifier_options (id, modifier_group_id, label, price) VALUES
  ('mod_001_opt_1', 'mod_001', 'Mild', 0.00),
  ('mod_001_opt_2', 'mod_001', 'Medium', 0.00),
  ('mod_001_opt_3', 'mod_001', 'Hot', 0.00),
  ('mod_002_opt_1', 'mod_002', 'Chicken', 3.00),
  ('mod_002_opt_2', 'mod_002', 'Paneer', 2.50),
  ('mod_003_opt_1', 'mod_003', 'Bacon', 2.25),
  ('mod_003_opt_2', 'mod_003', 'Avocado', 1.75),
  ('mod_003_opt_3', 'mod_003', 'Extra Cheese', 1.50);

INSERT INTO menu_item_modifier_groups (menu_item_id, modifier_group_id) VALUES
  ('item_001', 'mod_001'),
  ('item_002', 'mod_002'),
  ('item_003', 'mod_003');

INSERT INTO food_orders (id, customer_id, restaurant_id, courier_id, status, delivery_address, delivery_lat, delivery_lng, subtotal, delivery_fee, service_fee, tax, courier_tip, discount, total, payment_method_id, customer_rating) VALUES
  ('ord_001', 'cust_001', 'rest_001', 'courier_001', 'on_the_way', '233 S Wacker Dr, Chicago, IL', 41.878900, -87.635900, 41.25, 3.95, 4.95, 4.12, 5.00, 4.13, 55.14, 'pay_card_visa', NULL),
  ('ord_002', 'cust_002', 'rest_002', 'courier_002', 'delivered', '755 W Belmont Ave, Chicago, IL', 41.940000, -87.647300, 37.00, 2.99, 4.44, 3.51, 4.00, 0.00, 51.94, 'pay_wallet', 5);

INSERT INTO food_order_items (id, order_id, menu_item_id, quantity, line_total) VALUES
  (1, 'ord_001', 'item_001', 2, 25.00),
  (2, 'ord_001', 'item_002', 1, 16.25),
  (3, 'ord_002', 'item_003', 2, 37.00);

INSERT INTO food_order_item_modifiers (order_item_id, modifier_option_id) VALUES
  (1, 'mod_001_opt_2'),
  (2, 'mod_002_opt_1'),
  (3, 'mod_003_opt_1'),
  (3, 'mod_003_opt_3');

INSERT INTO food_order_timeline_events (order_id, event_status, occurred_at) VALUES
  ('ord_001', 'placed', '2026-04-14T12:05:00-05:00'),
  ('ord_001', 'accepted', '2026-04-14T12:07:00-05:00'),
  ('ord_001', 'preparing', '2026-04-14T12:10:00-05:00'),
  ('ord_001', 'picked_up', '2026-04-14T12:31:00-05:00'),
  ('ord_001', 'on_the_way', '2026-04-14T12:33:00-05:00'),
  ('ord_002', 'placed', '2026-04-13T19:18:00-05:00'),
  ('ord_002', 'accepted', '2026-04-13T19:19:00-05:00'),
  ('ord_002', 'preparing', '2026-04-13T19:23:00-05:00'),
  ('ord_002', 'picked_up', '2026-04-13T19:40:00-05:00'),
  ('ord_002', 'delivered', '2026-04-13T19:57:00-05:00');

INSERT INTO courier_package_types (id, name, max_weight_kg) VALUES
  ('pkg_docs', 'Documents', 1.00),
  ('pkg_small', 'Small Parcel', 5.00);

INSERT INTO courier_deliveries (id, sender_user_id, courier_id, package_type_id, pickup_address, dropoff_address, status, quoted_price, scheduled_at) VALUES
  ('cd_001', 'rider_001', 'courier_002', 'pkg_small', '233 S Wacker Dr, Chicago, IL', '401 N Michigan Ave, Chicago, IL', 'assigned', 14.50, '2026-04-14T20:00:00-05:00');

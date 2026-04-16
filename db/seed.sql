INSERT INTO cities (id, name, country, center_lat, center_lng, status) VALUES
  ('city_chi', 'Chicago', 'USA', 41.878100, -87.629800, 'active'),
  ('city_dal', 'Dallas-Fort Worth', 'USA', 32.819600, -96.945400, 'active'),
  ('city_nyc', 'New York City', 'USA', 40.742100, -73.918200, 'active');

INSERT INTO zones (id, city_id, name, zone_type, surge_eligible) VALUES
  ('zone_loop', 'city_chi', 'Downtown Loop', 'high-demand', TRUE),
  ('zone_north', 'city_chi', 'North Side', 'residential-mixed', TRUE),
  ('zone_west', 'city_chi', 'West Corridor', 'airport-connector', TRUE),
  ('zone_irving', 'city_dal', 'Irving', 'community-hub', FALSE),
  ('zone_dfw_airport', 'city_dal', 'DFW Airport', 'airport-connector', TRUE),
  ('zone_queens', 'city_nyc', 'Jackson Heights', 'community-hub', FALSE);

INSERT INTO platform_users (id, role, full_name, phone, email, rating, wallet_balance, online_status, current_zone_id) VALUES
  ('rider_001', 'rider', 'Maya Thompson', '+1-312-555-0101', 'maya@example.com', 4.90, 18.50, NULL, NULL),
  ('rider_002', 'rider', 'Daniel Brooks', '+1-312-555-0103', 'daniel@example.com', 4.80, 6.25, NULL, NULL),
  ('driver_001', 'driver', 'Jorge Alvarez', '+1-312-555-0201', NULL, 4.96, NULL, 'online', 'zone_loop'),
  ('driver_002', 'driver', 'Aisha Patel', '+1-312-555-0202', NULL, 4.91, NULL, 'busy', 'zone_north'),
  ('cust_001', 'customer', 'Maya Thompson', '+1-312-555-0101', 'maya@example.com', NULL, NULL, NULL, NULL),
  ('cust_002', 'customer', 'Elena Cruz', '+1-312-555-0301', 'elena@example.com', NULL, NULL, NULL, NULL),
  ('member_001', 'member', 'Anita Gurung', '+1-312-555-0501', 'anita@example.com', NULL, NULL, NULL, 'zone_loop'),
  ('biz_owner_001', 'business_owner', 'Himalayan Momo House Owner', '+1-312-555-0502', 'owner@example.com', NULL, NULL, NULL, 'zone_loop'),
  ('courier_001', 'courier', 'Samir Khan', '+1-312-555-0401', NULL, 4.88, NULL, 'online', 'zone_loop'),
  ('courier_002', 'courier', 'Lena Morris', '+1-312-555-0402', NULL, 4.93, NULL, 'online', 'zone_north');

INSERT INTO api_tokens (token, user_id, role, label, is_active) VALUES
  ('dev-admin-token', 'driver_001', 'admin', 'Development admin token', TRUE),
  ('dev-member-token', 'member_001', 'member', 'Development member token', TRUE),
  ('dev-business-token', 'biz_owner_001', 'business_owner', 'Development business token', TRUE),
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

INSERT INTO business_categories (id, name, description, status) VALUES
  ('restaurants', 'Restaurants', 'Nepali, Indian, and South Asian food near the community', 'active'),
  ('groceries', 'Groceries', 'Spices, produce, snacks, and daily essentials', 'active'),
  ('beauty', 'Beauty', 'Salon, makeup, threading, and event-ready styling', 'active'),
  ('medical', 'Medical', 'Clinics, dental care, wellness, and family health services', 'active'),
  ('home_services', 'Home Services', 'Cleaning, repairs, moving help, and home support', 'active'),
  ('courier', 'Courier', 'Local parcel, document, and same-day delivery help', 'active'),
  ('rides', 'Rides', 'Airport pickup, family rides, and city transportation', 'active'),
  ('photography', 'Event Photoshoot', 'Photographers and videographers for weddings, pujas, birthdays, and community programs', 'active'),
  ('social_sewa', 'Free Social Sewa', 'Free language help, newcomer guidance, forms support, and settlement help', 'active'),
  ('volunteering', 'Volunteering', 'Volunteer opportunities for youth, families, events, temples, social sewa, and community support', 'active'),
  ('carpool', 'Carpool', 'Shared rides for newcomers, students, airport help, work commutes, and community events', 'active'),
  ('community_places', 'Community Centers', 'Nepali community centers, temples, places of worship, and cultural gathering places', 'active'),
  ('events', 'Community Events', 'Festivals, pujas, meetups, fundraisers, classes, and local announcements', 'active'),
  ('youth_activities', 'Youth Activities', 'Youth meetups, public gatherings, study circles, volunteer groups, and social activities', 'active'),
  ('fitness', 'Health and Fitness', 'Running groups, gym buddies, sports meetups, wellness walks, and active community groups', 'active'),
  ('sports', 'Sports', 'Football, cricket, volleyball, pickup games, tournaments, and match planning', 'active'),
  ('priests', 'Priests and Rituals', 'Pundits and priests for Hindu marriage, bratabandha, puja, griha pravesh, and rituals', 'active'),
  ('matchmaking', 'Matchmaking', 'Adult community-moderated introduction threads and family-friendly matchmaking support', 'active'),
  ('community_chat', 'Community Chat', 'Web-hosted local discussion rooms, live conversations, and recent issue forums', 'active'),
  ('legal', 'Lawyer Services', 'Immigration, family, business, traffic, and general legal consultation referrals', 'active');

INSERT INTO marketplace_businesses (
  id, slug, name, owner_user_id, category_id, city_id, zone_id, neighborhood, address, lat, lng,
  phone, website, description, rating, review_count, price_level, is_open, image_url, verification_status, status
) VALUES
  (
    'biz_001', 'himalayan-momo-house-chicago', 'Himalayan Momo House', 'biz_owner_001', 'restaurants',
    'city_chi', 'zone_loop', 'Downtown Loop', '825 W Randolph St, Chicago, IL', 41.884100, -87.647200,
    '+1-312-555-0101', 'https://example.com/himalayan-momo-house',
    'Community favorite for jhol momo, chow mein, thakali plates, and quick pickup after work.',
    4.80, 128, 2, TRUE, './assets/Momo.1.jpg', 'community_verified', 'published'
  ),
  (
    'biz_003', 'sajilo-grocery-irving', 'Sajilo Grocery Irving', NULL, 'groceries',
    'city_dal', 'zone_irving', 'Irving', '3317 Belt Line Rd, Irving, TX', 32.856800, -96.996400,
    '+1-972-555-0110', 'https://example.com/sajilo-grocery',
    'Nepali spices, rice, lentils, frozen momo, puja supplies, snacks, and family essentials.',
    4.70, 86, 1, TRUE, './assets/food-delivery.jfif', 'community_verified', 'published'
  ),
  (
    'biz_006', 'dfw-sajilo-rides', 'DFW Sajilo Rides', NULL, 'rides',
    'city_dal', 'zone_dfw_airport', 'DFW Airport', '2400 Aviation Dr, DFW Airport, TX', 32.899800, -97.040300,
    '+1-972-555-0112', 'https://example.com/dfw-sajilo-rides',
    'Airport pickup, family rides, and scheduled local transportation with community drivers.',
    4.70, 52, 2, TRUE, './assets/Ridesharing.png', 'community_verified', 'published'
  ),
  (
    'biz_009', 'sajilo-event-photo-chicago', 'Sajilo Event Photo Chicago', NULL, 'photography',
    'city_chi', 'zone_north', 'North Side', '2550 W Devon Ave, Chicago, IL', 41.997200, -87.691100,
    '+1-312-555-0131', 'https://example.com/sajilo-event-photo',
    'Event photography and short highlight videos for weddings, pasni, bratabandha, pujas, birthdays, and community programs.',
    4.80, 42, 3, TRUE, './assets/food-delivery.jfif', 'community_verified', 'published'
  ),
  (
    'biz_010', 'sajilo-social-sewa-desk-chicago', 'Sajilo Social Sewa Desk', NULL, 'social_sewa',
    'city_chi', 'zone_loop', 'Downtown Loop', 'Community volunteer desk, Chicago, IL', 41.881900, -87.629100,
    '+1-312-555-0132', 'https://example.com/sajilo-social-sewa',
    'Free volunteer help for Nepali speakers who need language support, newcomer guidance, appointment help, or basic forms support.',
    4.90, 73, 0, TRUE, './assets/Ridesharing.png', 'community_verified', 'published'
  ),
  (
    'biz_011', 'chicago-nepali-carpool-circle', 'Chicago Nepali Carpool Circle', NULL, 'carpool',
    'city_chi', 'zone_west', 'West Corridor', 'Chicago community carpool board', 41.878200, -87.660500,
    '+1-312-555-0133', 'https://example.com/chicago-nepali-carpool',
    'Community carpool board for newcomers, students, work commutes, temple visits, grocery trips, and local events.',
    4.60, 39, 0, TRUE, './assets/Ridesharing.png', 'community_verified', 'published'
  ),
  (
    'biz_012', 'nepali-community-center-irving', 'Nepali Community Center Irving', NULL, 'community_places',
    'city_dal', 'zone_irving', 'Irving', '1501 W Irving Blvd, Irving, TX', 32.814100, -96.964700,
    '+1-972-555-0141', 'https://example.com/nepali-community-center-irving',
    'Local community center for cultural programs, classes, worship gatherings, youth activities, and family support events.',
    4.70, 118, 0, TRUE, './assets/courier.jpg', 'community_verified', 'published'
  ),
  (
    'biz_013', 'dfw-nepali-community-events', 'DFW Nepali Community Events', NULL, 'events',
    'city_dal', 'zone_irving', 'Irving', 'Irving community event board', 32.829200, -96.944100,
    '+1-972-555-0142', 'https://example.com/dfw-nepali-events',
    'Community calendar for Dashain, Tihar, pujas, fundraiser dinners, public meetups, youth programs, and cultural classes.',
    4.80, 94, 0, TRUE, './assets/food-delivery.jfif', 'community_verified', 'published'
  ),
  (
    'biz_018', 'nepali-ceremony-makeup-artists-dfw', 'Nepali Ceremony Makeup Artists DFW', NULL, 'beauty',
    'city_dal', 'zone_irving', 'Irving', 'Irving ceremony beauty network', 32.842800, -96.959800,
    '+1-972-555-0148', 'https://example.com/dfw-ceremony-makeup',
    'Find Nepali makeup artists and grooming support for weddings, bratabandha, pasni, pujas, engagement shoots, and formal ceremonies.',
    4.80, 51, 2, TRUE, './assets/food-delivery.jfif', 'community_verified', 'published'
  ),
  (
    'biz_019', 'sajilo-potluck-event-planning-chicago', 'Sajilo Potluck Event Planning', NULL, 'events',
    'city_chi', 'zone_north', 'North Side', 'Chicago community potluck board', 41.938900, -87.654400,
    '+1-312-555-0149', 'https://example.com/sajilo-potluck-planning',
    'Plan a Nepali potluck, picnic, birthday gathering, temple lunch, or community meetup with RSVP, dish signup, volunteer, and venue coordination.',
    4.70, 44, 0, TRUE, './assets/Momo.1.jpg', 'community_verified', 'published'
  ),
  (
    'biz_020', 'nepali-football-cricket-club-queens', 'Nepali Football and Cricket Club', NULL, 'sports',
    'city_nyc', 'zone_queens', 'Jackson Heights', 'Queens pickup sports board', 40.756800, -73.884500,
    '+1-718-555-0150', 'https://example.com/nepali-football-cricket',
    'Organize or join Nepali football, cricket, volleyball, and pickup sports matches with local players and community teams.',
    4.70, 67, 0, TRUE, './assets/Ridesharing.png', 'community_verified', 'published'
  ),
  (
    'biz_021', 'nepali-priest-ritual-services-chicago', 'Nepali Priest and Ritual Services', NULL, 'priests',
    'city_chi', 'zone_north', 'North Side', 'Chicago priest and pundit network', 41.998400, -87.689400,
    '+1-312-555-0151', 'https://example.com/nepali-priest-rituals',
    'Book Nepali-speaking priests and pundits for Hindu marriage, bratabandha, puja, griha pravesh, naamkaran, pasni, and ceremony guidance.',
    4.90, 82, 2, TRUE, './assets/courier.jpg', 'community_verified', 'published'
  ),
  (
    'biz_022', 'sajilo-community-matchmaking-threads', 'Sajilo Community Matchmaking Threads', NULL, 'matchmaking',
    'city_nyc', 'zone_queens', 'Jackson Heights', 'Member-moderated adult introduction board', 40.752400, -73.888800,
    '+1-718-555-0152', 'https://example.com/sajilo-matchmaking',
    'Adult community-moderated matchmaking threads for introductions, family-led profiles, cultural preferences, and safe conversation requests.',
    4.40, 28, 0, TRUE, './assets/Momo.1.jpg', 'community_verified', 'published'
  ),
  (
    'biz_023', 'sajilo-volunteer-opportunities-chicago', 'Sajilo Volunteer Opportunities', NULL, 'volunteering',
    'city_chi', 'zone_loop', 'Downtown Loop', 'Chicago community volunteer board', 41.883600, -87.632400,
    '+1-312-555-0153', 'https://example.com/sajilo-volunteer-opportunities',
    'Find volunteer opportunities for social sewa, language help, temple events, sports tournaments, youth activities, newcomer support, and community programs.',
    4.80, 58, 0, TRUE, './assets/courier.jpg', 'community_verified', 'published'
  );

INSERT INTO business_tags (business_id, tag) VALUES
  ('biz_001', 'Nepali'),
  ('biz_001', 'Momo'),
  ('biz_001', 'Thakali'),
  ('biz_003', 'Nepali groceries'),
  ('biz_003', 'Spices'),
  ('biz_003', 'Pickup'),
  ('biz_006', 'Airport pickup'),
  ('biz_006', 'Family rides'),
  ('biz_009', 'Photoshoot'),
  ('biz_009', 'Wedding'),
  ('biz_010', 'Free help'),
  ('biz_010', 'Language support'),
  ('biz_011', 'Carpool'),
  ('biz_012', 'Community center'),
  ('biz_013', 'Events'),
  ('biz_018', 'Makeup artist'),
  ('biz_019', 'Potluck'),
  ('biz_020', 'Cricket'),
  ('biz_020', 'Football'),
  ('biz_021', 'Priest'),
  ('biz_021', 'Hindu marriage'),
  ('biz_021', 'Bratabandha'),
  ('biz_022', 'Matchmaking'),
  ('biz_022', 'Adult introductions'),
  ('biz_023', 'Volunteer'),
  ('biz_023', 'Social sewa'),
  ('biz_023', 'Youth');

INSERT INTO business_trust_badges (business_id, badge) VALUES
  ('biz_001', 'Community verified'),
  ('biz_001', 'Nepali-owned'),
  ('biz_003', 'Community verified'),
  ('biz_003', 'Nepali-owned'),
  ('biz_006', 'Community verified'),
  ('biz_009', 'Community verified'),
  ('biz_010', 'Free community sewa'),
  ('biz_011', 'Member moderated'),
  ('biz_012', 'Family friendly'),
  ('biz_013', 'Member moderated'),
  ('biz_018', 'Community verified'),
  ('biz_019', 'Member moderated'),
  ('biz_020', 'Youth friendly'),
  ('biz_021', 'Community referred'),
  ('biz_022', 'Adults only'),
  ('biz_023', 'Volunteer-led');

INSERT INTO business_service_modes (business_id, service_mode) VALUES
  ('biz_001', 'Delivery'),
  ('biz_001', 'Pickup'),
  ('biz_001', 'Dine-in'),
  ('biz_003', 'Pickup'),
  ('biz_003', 'Local delivery'),
  ('biz_006', 'Ride request'),
  ('biz_006', 'Scheduled pickup'),
  ('biz_009', 'Photo shoot'),
  ('biz_009', 'Booking'),
  ('biz_010', 'Free help'),
  ('biz_010', 'Language support'),
  ('biz_011', 'Carpool'),
  ('biz_012', 'Events'),
  ('biz_013', 'Events'),
  ('biz_018', 'Ceremony makeup'),
  ('biz_019', 'Potluck planning'),
  ('biz_020', 'Sports'),
  ('biz_021', 'Priest booking'),
  ('biz_021', 'Ritual service'),
  ('biz_022', 'Matchmaking'),
  ('biz_022', 'Community thread'),
  ('biz_023', 'Volunteer'),
  ('biz_023', 'Community sewa'),
  ('biz_023', 'Youth activities');

INSERT INTO business_services (id, business_id, name, description, price_label, sort_order) VALUES
  ('bs_001', 'biz_001', 'Chicken jhol momo', 'Steamed momo served in spiced jhol broth.', '$13.75', 1),
  ('bs_002', 'biz_001', 'Thakali khana set', 'Rice, dal, tarkari, achar, and grilled protein.', '$16.25', 2),
  ('bs_003', 'biz_003', 'Weekly grocery basket', 'Common Nepali pantry essentials for the week.', 'From $29', 1),
  ('bs_004', 'biz_006', 'Airport pickup', 'Scheduled airport pickup for individuals and families.', 'From $28', 1),
  ('bs_009', 'biz_009', 'Event photoshoot', 'Photo coverage for birthdays, weddings, pujas, and ceremonies.', 'From $250', 1),
  ('bs_010', 'biz_010', 'Language help call', 'Volunteer language help and newcomer guidance.', 'Free', 1),
  ('bs_011', 'biz_011', 'Temple event carpool', 'Shared rides to temple and community events.', 'Shared cost', 1),
  ('bs_012', 'biz_012', 'Community hall info', 'Community center and temple information.', 'Call', 1),
  ('bs_013', 'biz_013', 'Community event listing', 'Post and manage community events.', 'Free', 1),
  ('bs_018', 'biz_018', 'Ceremony party makeup', 'Makeup and grooming for ceremonies and formal events.', 'From $75', 1),
  ('bs_019', 'biz_019', 'Potluck signup page', 'Dish signup, RSVP, and volunteer coordination.', 'Free', 1),
  ('bs_020', 'biz_020', 'Cricket pickup match', 'Find local players and organize a cricket match.', 'Free', 1),
  ('bs_021', 'biz_021', 'Hindu marriage ceremony', 'Priest or pundit booking for Hindu marriage ceremonies.', 'Call', 1),
  ('bs_022', 'biz_022', 'Adult intro thread', 'Member-moderated adult introduction thread.', 'Free', 1),
  ('bs_023', 'biz_023', 'Event volunteer signup', 'Find volunteer shifts for community events and social sewa.', 'Free', 1);

INSERT INTO marketplace_reviews (id, business_id, user_id, rating, title, body, verification_source, status, created_at) VALUES
  ('rev_001', 'biz_001', 'member_001', 5, 'Feels like a community spot', 'Fast pickup, warm momo, and the staff remembered our spice preference.', 'community_member', 'published', '2026-03-12T18:30:00-05:00');

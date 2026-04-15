const { execFileSync } = require("child_process");

function sqlString(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNumeric(value, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? String(parsed) : String(fallback);
}

class PostgresStore {
  constructor() {
    this.driver = "postgres";
    this.psqlBin = process.env.PSQL_BIN || "psql";
    this.databaseUrl = process.env.DATABASE_URL || "";
  }

  runJsonQuery(sql) {
    const args = ["-X", "-q", "-t", "-A", "-v", "ON_ERROR_STOP=1", "-c", sql];

    if (this.databaseUrl) {
      args.unshift(this.databaseUrl);
    }

    const stdout = execFileSync(this.psqlBin, args, {
      encoding: "utf8",
      env: process.env
    }).trim();

    if (!stdout) {
      return null;
    }

    return JSON.parse(stdout);
  }

  runCommand(sql) {
    const args = ["-X", "-q", "-v", "ON_ERROR_STOP=1", "-c", sql];

    if (this.databaseUrl) {
      args.unshift(this.databaseUrl);
    }

    execFileSync(this.psqlBin, args, {
      encoding: "utf8",
      env: process.env
    });
  }

  async getHealth() {
    const result = this.runJsonQuery("SELECT json_build_object('ok', true, 'storage', 'postgres');");
    return result || { ok: true, storage: "postgres" };
  }

  async getOverview() {
    return this.runJsonQuery(`
      SELECT json_build_object(
        'brand', json_build_object('name', 'Sajilo Sewa'),
        'city', (SELECT json_build_object('id', id, 'name', name, 'country', country) FROM cities ORDER BY id LIMIT 1),
        'metrics', json_build_object(
          'dailyRideRequests', (SELECT COUNT(*) FROM ride_requests),
          'dailyCompletedRides', (SELECT COUNT(*) FROM trips WHERE status = 'completed'),
          'dailyFoodOrders', (SELECT COUNT(*) FROM food_orders),
          'dailyCourierDeliveries', (SELECT COUNT(*) FROM courier_deliveries),
          'activeDrivers', (SELECT COUNT(*) FROM platform_users WHERE role = 'driver' AND online_status IN ('online', 'busy')),
          'activeCouriers', (SELECT COUNT(*) FROM platform_users WHERE role = 'courier' AND online_status = 'online'),
          'avgRideEtaMinutes', 5,
          'avgFoodDeliveryMinutes', 30,
          'grossMerchandiseValue', COALESCE((SELECT SUM(total_fare) FROM trips), 0) + COALESCE((SELECT SUM(total) FROM food_orders), 0)
        ),
        'activeRideRequestCount', (SELECT COUNT(*) FROM ride_requests WHERE status <> 'completed'),
        'activeTripCount', (SELECT COUNT(*) FROM trips WHERE status = 'in_progress'),
        'activeFoodOrderCount', (SELECT COUNT(*) FROM food_orders WHERE status <> 'delivered'),
        'activeCourierDeliveryCount', (SELECT COUNT(*) FROM courier_deliveries WHERE status <> 'delivered')
      );
    `);
  }

  async getPlatform() {
    return this.runJsonQuery(`
      SELECT json_build_object(
        'services', json_build_array(
          json_build_object('id', 'svc_ride', 'name', 'Ride', 'status', 'active'),
          json_build_object('id', 'svc_food', 'name', 'Food', 'status', 'active'),
          json_build_object('id', 'svc_courier', 'name', 'Courier', 'status', 'active')
        ),
        'cities', COALESCE((SELECT json_agg(json_build_object('id', id, 'name', name, 'country', country, 'status', status)) FROM cities), '[]'::json),
        'zones', COALESCE((SELECT json_agg(json_build_object('id', id, 'cityId', city_id, 'name', name, 'type', zone_type, 'surgeEligible', surge_eligible)) FROM zones), '[]'::json),
        'promotions', '[]'::json,
        'payments', '[]'::json,
        'notifications', '[]'::json,
        'supportIssueTypes', json_build_array('driver_late', 'wrong_route', 'unsafe_behavior', 'payment_issue', 'lost_item', 'wrong_order')
      );
    `);
  }

  async getRides() {
    return this.runJsonQuery(`
      SELECT json_build_object(
        'tiers', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'name', name, 'capacity', capacity, 'baseFare', base_fare, 'perMile', per_mile,
          'perMinute', per_minute, 'minimumFare', minimum_fare, 'bookingFee', booking_fee, 'cancellationFee', cancellation_fee
        )) FROM ride_service_tiers), '[]'::json),
        'requests', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'riderId', rider_id, 'requestedTierId', requested_tier_id, 'pickup', json_build_object('address', pickup_address, 'lat', pickup_lat, 'lng', pickup_lng),
          'dropoff', json_build_object('address', dropoff_address, 'lat', dropoff_lat, 'lng', dropoff_lng), 'estimatedDistanceMiles', estimated_distance_miles,
          'estimatedDurationMinutes', estimated_duration_minutes, 'estimatedFare', estimated_fare, 'surgeMultiplier', surge_multiplier,
          'status', status, 'requestedAt', requested_at
        ) ORDER BY requested_at DESC) FROM ride_requests), '[]'::json),
        'trips', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'riderId', rider_id, 'driverId', driver_id, 'vehicleId', vehicle_id, 'tierId', tier_id, 'status', status,
          'pickup', json_build_object('address', pickup_address, 'lat', pickup_lat, 'lng', pickup_lng),
          'dropoff', json_build_object('address', dropoff_address, 'lat', dropoff_lat, 'lng', dropoff_lng),
          'distanceMiles', distance_miles, 'durationMinutes', duration_minutes,
          'fare', json_build_object('total', total_fare), 'paymentMethodId', payment_method_id, 'riderRating', rider_rating, 'driverRating', driver_rating,
          'timeline', COALESCE((SELECT json_agg(json_build_object('status', event_status, 'timestamp', occurred_at) ORDER BY occurred_at) FROM trip_timeline_events WHERE trip_id = trips.id), '[]'::json)
        )) FROM trips), '[]'::json),
        'drivers', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'fullName', full_name, 'phone', phone, 'rating', rating, 'onlineStatus', online_status, 'currentZoneId', current_zone_id
        )) FROM platform_users WHERE role = 'driver'), '[]'::json),
        'vehicles', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'driverId', driver_id, 'make', make, 'model', model, 'year', model_year, 'color', color, 'plateNumber', plate_number
        )) FROM vehicles), '[]'::json),
        'safetyEvents', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'tripId', trip_id, 'eventType', event_type, 'triggeredByUserId', triggered_by_user_id, 'timestamp', occurred_at, 'status', event_status
        )) FROM trip_safety_events), '[]'::json),
        'surgeRules', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'zoneId', zone_id, 'timeWindow', time_window, 'multiplier', multiplier, 'reason', reason
        )) FROM surge_rules), '[]'::json)
      );
    `);
  }

  async getFood() {
    return this.runJsonQuery(`
      SELECT json_build_object(
        'restaurants', COALESCE((SELECT json_agg(json_build_object(
          'id', r.id, 'name', r.name, 'rating', r.rating, 'priceLevel', r.price_level, 'address', r.address, 'zoneId', r.zone_id,
          'deliveryRadiusMiles', r.delivery_radius_miles, 'avgPrepTimeMinutes', r.avg_prep_time_minutes, 'isOpen', r.is_open,
          'cuisineTags', COALESCE((SELECT json_agg(cuisine_tag) FROM restaurant_cuisines WHERE restaurant_id = r.id), '[]'::json)
        )) FROM restaurants r), '[]'::json),
        'categories', COALESCE((SELECT json_agg(json_build_object('id', id, 'restaurantId', restaurant_id, 'name', name, 'sortOrder', sort_order)) FROM menu_categories), '[]'::json),
        'items', COALESCE((SELECT json_agg(json_build_object('id', id, 'restaurantId', restaurant_id, 'categoryId', category_id, 'name', name, 'description', description, 'price', price, 'isPopular', is_popular, 'isAvailable', is_available)) FROM menu_items), '[]'::json),
        'modifiers', COALESCE((SELECT json_agg(json_build_object(
          'id', mg.id, 'name', mg.name, 'selectionType', mg.selection_type, 'required', mg.is_required,
          'options', COALESCE((SELECT json_agg(json_build_object('id', mo.id, 'label', mo.label, 'price', mo.price)) FROM modifier_options mo WHERE mo.modifier_group_id = mg.id), '[]'::json)
        )) FROM modifier_groups mg), '[]'::json),
        'orders', COALESCE((SELECT json_agg(json_build_object(
          'id', fo.id, 'customerId', fo.customer_id, 'restaurantId', fo.restaurant_id, 'courierId', fo.courier_id, 'status', fo.status,
          'deliveryAddress', json_build_object('address', fo.delivery_address, 'lat', fo.delivery_lat, 'lng', fo.delivery_lng),
          'items', COALESCE((SELECT json_agg(json_build_object('itemId', foi.menu_item_id, 'quantity', foi.quantity, 'lineTotal', foi.line_total)) FROM food_order_items foi WHERE foi.order_id = fo.id), '[]'::json),
          'pricing', json_build_object('subtotal', fo.subtotal, 'deliveryFee', fo.delivery_fee, 'serviceFee', fo.service_fee, 'tax', fo.tax, 'courierTip', fo.courier_tip, 'discount', fo.discount, 'total', fo.total),
          'timeline', COALESCE((SELECT json_agg(json_build_object('status', event_status, 'timestamp', occurred_at) ORDER BY occurred_at) FROM food_order_timeline_events WHERE order_id = fo.id), '[]'::json),
          'paymentMethodId', fo.payment_method_id, 'customerRating', fo.customer_rating
        )) FROM food_orders fo), '[]'::json),
        'couriers', COALESCE((SELECT json_agg(json_build_object('id', id, 'fullName', full_name, 'phone', phone, 'rating', rating, 'onlineStatus', online_status, 'currentZoneId', current_zone_id)) FROM platform_users WHERE role = 'courier'), '[]'::json),
        'pricingRules', json_build_array(json_build_object('id', 'fdp_pg', 'baseFee', 2.49, 'perMile', 0.85, 'serviceFeePercent', 0.12, 'smallOrderFee', 2, 'freeDeliveryThreshold', 25))
      );
    `);
  }

  async getCourier() {
    return this.runJsonQuery(`
      SELECT json_build_object(
        'packageTypes', COALESCE((SELECT json_agg(json_build_object('id', id, 'name', name, 'maxWeightKg', max_weight_kg)) FROM courier_package_types), '[]'::json),
        'deliveries', COALESCE((SELECT json_agg(json_build_object(
          'id', id, 'senderUserId', sender_user_id, 'courierId', courier_id, 'packageTypeId', package_type_id,
          'pickupAddress', pickup_address, 'dropoffAddress', dropoff_address, 'status', status, 'quotedPrice', quoted_price, 'scheduledAt', scheduled_at
        )) FROM courier_deliveries), '[]'::json),
        'couriers', COALESCE((SELECT json_agg(json_build_object('id', id, 'fullName', full_name, 'phone', phone, 'rating', rating, 'onlineStatus', online_status, 'currentZoneId', current_zone_id)) FROM platform_users WHERE role = 'courier'), '[]'::json)
      );
    `);
  }

  async getSeed() {
    const [overview, platform, rides, food, courier] = await Promise.all([
      this.getOverview(),
      this.getPlatform(),
      this.getRides(),
      this.getFood(),
      this.getCourier()
    ]);

    return {
      platform: {
        brand: overview.brand,
        cities: platform.cities,
        zones: platform.zones,
        promotions: platform.promotions,
        paymentMethods: platform.payments,
        notificationTemplates: platform.notifications,
        supportIssueTypes: platform.supportIssueTypes,
        serviceCategories: platform.services
      },
      users: {
        drivers: rides.drivers,
        couriers: food.couriers,
        riders: [],
        customers: []
      },
      rideshare: {
        serviceTiers: rides.tiers,
        vehicles: rides.vehicles,
        surgeRules: rides.surgeRules,
        rideRequests: rides.requests,
        trips: rides.trips,
        safetyEvents: rides.safetyEvents
      },
      foodDelivery: {
        restaurants: food.restaurants,
        menuCategories: food.categories,
        menuItems: food.items,
        modifierGroups: food.modifiers,
        deliveryPricingRules: food.pricingRules,
        orders: food.orders
      },
      courierDelivery: {
        packageTypes: courier.packageTypes,
        deliveries: courier.deliveries
      },
      analytics: {
        adminDashboard: overview.metrics
      }
    };
  }

  async createRideRequest(payload) {
    const distance = sqlNumeric(payload.estimatedDistanceMiles, 3.2);
    const duration = sqlNumeric(payload.estimatedDurationMinutes, 16);
    const surge = sqlNumeric(payload.surgeMultiplier, 1);
    const sql = `
      WITH tier AS (
        SELECT * FROM ride_service_tiers WHERE id = ${sqlString(payload.requestedTierId)}
      ),
      inserted AS (
        INSERT INTO ride_requests (
          id, rider_id, requested_tier_id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng,
          estimated_distance_miles, estimated_duration_minutes, estimated_fare, surge_multiplier, status, requested_at
        )
        SELECT
          'rq_' || LPAD((COALESCE(MAX(NULLIF(SUBSTRING(id FROM '[0-9]+$'), '')::int), 0) + 1)::text, 3, '0'),
          ${sqlString(payload.riderId)},
          ${sqlString(payload.requestedTierId)},
          ${sqlString(payload.pickup.address)},
          ${sqlNumeric(payload.pickup.lat, 0)},
          ${sqlNumeric(payload.pickup.lng, 0)},
          ${sqlString(payload.dropoff.address)},
          ${sqlNumeric(payload.dropoff.lat, 0)},
          ${sqlNumeric(payload.dropoff.lng, 0)},
          ${distance},
          ${duration},
          GREATEST((tier.base_fare + (${distance} * tier.per_mile) + (${duration} * tier.per_minute) + tier.booking_fee) * ${surge}, tier.minimum_fare),
          ${surge},
          'searching',
          NOW()
        FROM ride_requests, tier
        RETURNING *
      )
      SELECT json_build_object(
        'id', id,
        'riderId', rider_id,
        'requestedTierId', requested_tier_id,
        'pickup', json_build_object('address', pickup_address, 'lat', pickup_lat, 'lng', pickup_lng),
        'dropoff', json_build_object('address', dropoff_address, 'lat', dropoff_lat, 'lng', dropoff_lng),
        'estimatedDistanceMiles', estimated_distance_miles,
        'estimatedDurationMinutes', estimated_duration_minutes,
        'estimatedFare', estimated_fare,
        'surgeMultiplier', surge_multiplier,
        'status', status,
        'requestedAt', requested_at
      ) FROM inserted;
    `;

    return { statusCode: 201, payload: this.runJsonQuery(sql) };
  }

  async createFoodOrder(payload) {
    const items = payload.items || [];
    const subtotal = items.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
    const deliveryFee = subtotal >= 25 ? 0 : Number((2.49 + Number(payload.distanceMiles ?? 2.5) * 0.85).toFixed(2));
    const serviceFee = Number((subtotal * 0.12).toFixed(2));
    const tax = Number((subtotal * 0.1).toFixed(2));
    const tip = Number(payload.courierTip ?? 3);
    const discount = Number(payload.discount ?? 0);
    const total = Number((subtotal + deliveryFee + serviceFee + tax + tip - discount).toFixed(2));
    const orderId = `ord_${Date.now()}`;

    this.runCommand(`
      INSERT INTO food_orders (
        id, customer_id, restaurant_id, courier_id, status, delivery_address, delivery_lat, delivery_lng,
        subtotal, delivery_fee, service_fee, tax, courier_tip, discount, total, payment_method_id, customer_rating
      ) VALUES (
        ${sqlString(orderId)}, ${sqlString(payload.customerId)}, ${sqlString(payload.restaurantId)}, ${sqlString(payload.courierId)},
        'placed', ${sqlString(payload.deliveryAddress.address)}, ${sqlNumeric(payload.deliveryAddress.lat, 0)}, ${sqlNumeric(payload.deliveryAddress.lng, 0)},
        ${sqlNumeric(subtotal)}, ${sqlNumeric(deliveryFee)}, ${sqlNumeric(serviceFee)}, ${sqlNumeric(tax)}, ${sqlNumeric(tip)}, ${sqlNumeric(discount)}, ${sqlNumeric(total)},
        ${sqlString(payload.paymentMethodId || "pay_card_visa")}, NULL
      );
      INSERT INTO food_order_timeline_events (order_id, event_status, occurred_at)
      VALUES (${sqlString(orderId)}, 'placed', NOW());
    `);

    items.forEach((item, index) => {
      this.runCommand(`
        INSERT INTO food_order_items (order_id, menu_item_id, quantity, line_total)
        VALUES (${sqlString(orderId)}, ${sqlString(item.itemId)}, ${sqlNumeric(item.quantity, 1)}, ${sqlNumeric(item.lineTotal, 0)});
      `);
    });

    return {
      statusCode: 201,
      payload: this.runJsonQuery(`
        SELECT json_build_object(
          'id', fo.id,
          'customerId', fo.customer_id,
          'restaurantId', fo.restaurant_id,
          'courierId', fo.courier_id,
          'status', fo.status,
          'deliveryAddress', json_build_object('address', fo.delivery_address, 'lat', fo.delivery_lat, 'lng', fo.delivery_lng),
          'items', COALESCE((SELECT json_agg(json_build_object('itemId', menu_item_id, 'quantity', quantity, 'lineTotal', line_total)) FROM food_order_items WHERE order_id = fo.id), '[]'::json),
          'pricing', json_build_object('subtotal', fo.subtotal, 'deliveryFee', fo.delivery_fee, 'serviceFee', fo.service_fee, 'tax', fo.tax, 'courierTip', fo.courier_tip, 'discount', fo.discount, 'total', fo.total),
          'timeline', COALESCE((SELECT json_agg(json_build_object('status', event_status, 'timestamp', occurred_at) ORDER BY occurred_at) FROM food_order_timeline_events WHERE order_id = fo.id), '[]'::json),
          'paymentMethodId', fo.payment_method_id,
          'customerRating', fo.customer_rating
        ) FROM food_orders fo WHERE fo.id = ${sqlString(orderId)};
      `)
    };
  }

  async createCourierDelivery(payload) {
    const deliveryId = `cd_${Date.now()}`;

    this.runCommand(`
      INSERT INTO courier_deliveries (
        id, sender_user_id, courier_id, package_type_id, pickup_address, dropoff_address, status, quoted_price, scheduled_at
      ) VALUES (
        ${sqlString(deliveryId)},
        ${sqlString(payload.senderUserId)},
        ${sqlString(payload.courierId)},
        ${sqlString(payload.packageTypeId)},
        ${sqlString(payload.pickupAddress)},
        ${sqlString(payload.dropoffAddress)},
        'requested',
        ${sqlNumeric(payload.quotedPrice, 12.5)},
        COALESCE(${sqlString(payload.scheduledAt)}, NOW()::text)::timestamptz
      );
    `);

    return {
      statusCode: 201,
      payload: this.runJsonQuery(`
        SELECT json_build_object(
          'id', id,
          'senderUserId', sender_user_id,
          'courierId', courier_id,
          'packageTypeId', package_type_id,
          'pickupAddress', pickup_address,
          'dropoffAddress', dropoff_address,
          'status', status,
          'quotedPrice', quoted_price,
          'scheduledAt', scheduled_at
        ) FROM courier_deliveries WHERE id = ${sqlString(deliveryId)};
      `)
    };
  }
}

module.exports = {
  PostgresStore
};

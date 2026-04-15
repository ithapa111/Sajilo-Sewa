const fs = require("fs");
const path = require("path");
const { createAccessToken, createPasswordRecord, verifyPassword } = require("./security");

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix, collection) {
  const currentMax = collection.reduce((max, item) => {
    const numeric = Number.parseInt(String(item.id).split("_").pop(), 10);
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 0);

  return `${prefix}_${String(currentMax + 1).padStart(3, "0")}`;
}

function estimateRideFare(data, tierId, distanceMiles, durationMinutes, surgeMultiplier = 1) {
  const tier = data.rideshare.serviceTiers.find((item) => item.id === tierId);

  if (!tier) {
    return null;
  }

  const rawFare =
    tier.baseFare +
    distanceMiles * tier.perMile +
    durationMinutes * tier.perMinute +
    tier.bookingFee;
  const surgedFare = rawFare * surgeMultiplier;

  return Number(Math.max(surgedFare, tier.minimumFare).toFixed(2));
}

class JsonStore {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.seedPath = path.join(rootDir, "data", "sajilo-seed-data.json");
    this.seedBrowserPath = path.join(rootDir, "data", "sajilo-seed-data.js");
    this.authPath = path.join(rootDir, "data", "auth-users.json");
    this.driver = "json";
  }

  readSeedData() {
    return JSON.parse(fs.readFileSync(this.seedPath, "utf8"));
  }

  writeSeedData(data) {
    fs.writeFileSync(this.seedPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    fs.writeFileSync(this.seedBrowserPath, `window.SAJILO_SEED_DATA = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  }

  readAuthData() {
    if (!fs.existsSync(this.authPath)) {
      return { accounts: [], tokens: [] };
    }

    return JSON.parse(fs.readFileSync(this.authPath, "utf8"));
  }

  writeAuthData(data) {
    fs.writeFileSync(this.authPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }

  async getHealth() {
    return { ok: true, storage: this.driver };
  }

  async resolveToken(token) {
    const authData = this.readAuthData();
    const record = authData.tokens.find((item) => item.token === token && item.isActive);
    return record ? { role: record.role, userId: record.userId } : null;
  }

  async signup(payload) {
    const requiredFields = ["fullName", "email", "password", "role"];
    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return { statusCode: 400, payload: { error: `Missing required fields: ${missing.join(", ")}` } };
    }

    if (!["rider", "customer", "courier", "driver"].includes(payload.role)) {
      return { statusCode: 400, payload: { error: "Invalid signup role" } };
    }

    const authData = this.readAuthData();
    const existing = authData.accounts.find((item) => item.email.toLowerCase() === payload.email.toLowerCase());

    if (existing) {
      return { statusCode: 409, payload: { error: "Email already registered" } };
    }

    const seed = this.readSeedData();
    const userCollectionKey =
      payload.role === "rider"
        ? "riders"
        : payload.role === "customer"
          ? "customers"
          : payload.role === "courier"
            ? "couriers"
            : "drivers";
    const userIdPrefix =
      payload.role === "rider"
        ? "rider"
        : payload.role === "customer"
          ? "cust"
          : payload.role === "courier"
            ? "courier"
            : "driver";
    const userId = createId(userIdPrefix, seed.users[userCollectionKey]);
    const token = createAccessToken();
    const passwordRecord = createPasswordRecord(payload.password);

    const userRecord = {
      id: userId,
      fullName: payload.fullName,
      phone: payload.phone || null,
      email: payload.email,
      rating: null,
      onlineStatus: payload.role === "courier" || payload.role === "driver" ? "offline" : undefined,
      currentZoneId: null,
      walletBalance: payload.role === "rider" ? 0 : undefined,
      favoriteCuisineTags: payload.role === "customer" ? [] : undefined,
      defaultPaymentMethodId: payload.role === "customer" ? "pay_card_visa" : undefined,
      savedPlaces: payload.role === "rider" ? [] : undefined
    };

    seed.users[userCollectionKey].push(userRecord);
    this.writeSeedData(seed);

    authData.accounts.push({
      userId,
      role: payload.role,
      email: payload.email,
      passwordSalt: passwordRecord.salt,
      passwordHash: passwordRecord.hash,
      createdAt: nowIso()
    });
    authData.tokens.push({
      token,
      userId,
      role: payload.role,
      isActive: true,
      createdAt: nowIso()
    });
    this.writeAuthData(authData);

    return {
      statusCode: 201,
      payload: {
        token,
        user: {
          userId,
          role: payload.role,
          email: payload.email,
          fullName: payload.fullName
        }
      }
    };
  }

  async login(payload) {
    const requiredFields = ["email", "password"];
    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return { statusCode: 400, payload: { error: `Missing required fields: ${missing.join(", ")}` } };
    }

    const authData = this.readAuthData();
    const account = authData.accounts.find((item) => item.email.toLowerCase() === payload.email.toLowerCase());

    if (!account) {
      return { statusCode: 401, payload: { error: "Invalid email or password" } };
    }

    const isValid = verifyPassword(payload.password, {
      salt: account.passwordSalt,
      hash: account.passwordHash
    });

    if (!isValid) {
      return { statusCode: 401, payload: { error: "Invalid email or password" } };
    }

    const token = createAccessToken();
    authData.tokens.push({
      token,
      userId: account.userId,
      role: account.role,
      isActive: true,
      createdAt: nowIso()
    });
    this.writeAuthData(authData);

    return {
      statusCode: 200,
      payload: {
        token,
        user: {
          userId: account.userId,
          role: account.role,
          email: account.email
        }
      }
    };
  }

  async getSeed() {
    return this.readSeedData();
  }

  async getOverview() {
    const data = this.readSeedData();
    return {
      brand: data.platform.brand,
      city: data.platform.cities[0],
      metrics: data.analytics.adminDashboard,
      activeRideRequestCount: data.rideshare.rideRequests.filter((item) => item.status !== "completed").length,
      activeTripCount: data.rideshare.trips.filter((item) => item.status === "in_progress").length,
      activeFoodOrderCount: data.foodDelivery.orders.filter((item) => item.status !== "delivered").length,
      activeCourierDeliveryCount: data.courierDelivery.deliveries.filter((item) => item.status !== "delivered").length
    };
  }

  async getPlatform() {
    const data = this.readSeedData();
    return {
      services: data.platform.serviceCategories,
      cities: data.platform.cities,
      zones: data.platform.zones,
      promotions: data.platform.promotions,
      payments: data.platform.paymentMethods,
      notifications: data.platform.notificationTemplates,
      supportIssueTypes: data.platform.supportIssueTypes
    };
  }

  async getRides() {
    const data = this.readSeedData();
    return {
      tiers: data.rideshare.serviceTiers,
      requests: data.rideshare.rideRequests,
      trips: data.rideshare.trips,
      drivers: data.users.drivers,
      vehicles: data.rideshare.vehicles,
      safetyEvents: data.rideshare.safetyEvents,
      surgeRules: data.rideshare.surgeRules
    };
  }

  async getFood() {
    const data = this.readSeedData();
    return {
      restaurants: data.foodDelivery.restaurants,
      categories: data.foodDelivery.menuCategories,
      items: data.foodDelivery.menuItems,
      modifiers: data.foodDelivery.modifierGroups,
      orders: data.foodDelivery.orders,
      couriers: data.users.couriers,
      pricingRules: data.foodDelivery.deliveryPricingRules
    };
  }

  async getCourier() {
    const data = this.readSeedData();
    return {
      packageTypes: data.courierDelivery.packageTypes,
      deliveries: data.courierDelivery.deliveries,
      couriers: data.users.couriers
    };
  }

  async createRideRequest(payload) {
    const data = this.readSeedData();
    const requiredFields = ["riderId", "requestedTierId", "pickup", "dropoff"];
    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return { statusCode: 400, payload: { error: `Missing required fields: ${missing.join(", ")}` } };
    }

    const rideRequest = {
      id: createId("rq", data.rideshare.rideRequests),
      riderId: payload.riderId,
      requestedTierId: payload.requestedTierId,
      pickup: payload.pickup,
      dropoff: payload.dropoff,
      estimatedDistanceMiles: Number(payload.estimatedDistanceMiles ?? 3.2),
      estimatedDurationMinutes: Number(payload.estimatedDurationMinutes ?? 16),
      estimatedFare: estimateRideFare(
        data,
        payload.requestedTierId,
        Number(payload.estimatedDistanceMiles ?? 3.2),
        Number(payload.estimatedDurationMinutes ?? 16),
        Number(payload.surgeMultiplier ?? 1)
      ),
      surgeMultiplier: Number(payload.surgeMultiplier ?? 1),
      status: "searching",
      requestedAt: nowIso()
    };

    if (!rideRequest.estimatedFare) {
      return { statusCode: 400, payload: { error: "Invalid ride tier" } };
    }

    data.rideshare.rideRequests.unshift(rideRequest);
    this.writeSeedData(data);
    return { statusCode: 201, payload: rideRequest };
  }

  async createFoodOrder(payload) {
    const data = this.readSeedData();
    const requiredFields = ["customerId", "restaurantId", "deliveryAddress", "items"];
    const missing = requiredFields.filter((field) => !payload[field] || (field === "items" && payload.items.length === 0));

    if (missing.length > 0) {
      return { statusCode: 400, payload: { error: `Missing required fields: ${missing.join(", ")}` } };
    }

    const pricingRule = data.foodDelivery.deliveryPricingRules[0];
    const subtotal = payload.items.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
    const deliveryFee =
      subtotal >= pricingRule.freeDeliveryThreshold
        ? 0
        : Number((pricingRule.baseFee + Number(payload.distanceMiles ?? 2.5) * pricingRule.perMile).toFixed(2));
    const serviceFee = Number((subtotal * pricingRule.serviceFeePercent).toFixed(2));
    const tax = Number((subtotal * 0.1).toFixed(2));
    const courierTip = Number(payload.courierTip ?? 3);
    const discount = Number(payload.discount ?? 0);
    const total = Number((subtotal + deliveryFee + serviceFee + tax + courierTip - discount).toFixed(2));

    const order = {
      id: createId("ord", data.foodDelivery.orders),
      customerId: payload.customerId,
      restaurantId: payload.restaurantId,
      courierId: payload.courierId ?? null,
      status: "placed",
      deliveryAddress: payload.deliveryAddress,
      items: payload.items,
      pricing: { subtotal, deliveryFee, serviceFee, tax, courierTip, discount, total },
      timeline: [{ status: "placed", timestamp: nowIso() }],
      paymentMethodId: payload.paymentMethodId ?? "pay_card_visa",
      customerRating: null
    };

    data.foodDelivery.orders.unshift(order);
    this.writeSeedData(data);
    return { statusCode: 201, payload: order };
  }

  async createCourierDelivery(payload) {
    const data = this.readSeedData();
    const requiredFields = ["senderUserId", "packageTypeId", "pickupAddress", "dropoffAddress"];
    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return { statusCode: 400, payload: { error: `Missing required fields: ${missing.join(", ")}` } };
    }

    const delivery = {
      id: createId("cd", data.courierDelivery.deliveries),
      senderUserId: payload.senderUserId,
      courierId: payload.courierId ?? null,
      packageTypeId: payload.packageTypeId,
      pickupAddress: payload.pickupAddress,
      dropoffAddress: payload.dropoffAddress,
      status: "requested",
      quotedPrice: Number(payload.quotedPrice ?? 12.5),
      scheduledAt: payload.scheduledAt ?? nowIso()
    };

    data.courierDelivery.deliveries.unshift(delivery);
    this.writeSeedData(data);
    return { statusCode: 201, payload: delivery };
  }
}

module.exports = {
  JsonStore
};

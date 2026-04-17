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

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function distanceMiles(startLat, startLng, endLat, endLng) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latDelta = toRadians(endLat - startLat);
  const lngDelta = toRadians(endLng - startLng);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRadians(startLat)) *
      Math.cos(toRadians(endLat)) *
      Math.sin(lngDelta / 2) *
      Math.sin(lngDelta / 2);

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBusinessSearchText(business, category, city) {
  return [
    business.name,
    business.description,
    business.address,
    business.neighborhood,
    category?.name,
    city?.name,
    city?.state,
    ...(business.tags || []),
    ...(business.serviceModes || []),
    ...(business.trustBadges || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

class JsonStore {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.seedPath = path.join(rootDir, "data", "sajilo-seed-data.json");
    this.seedBrowserPath = path.join(rootDir, "data", "sajilo-seed-data.js");
    this.marketplacePath = path.join(rootDir, "data", "marketplace-data.json");
    this.marketplaceBrowserPath = path.join(rootDir, "data", "marketplace-data.js");
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

  readMarketplaceData() {
    return JSON.parse(fs.readFileSync(this.marketplacePath, "utf8"));
  }

  writeMarketplaceData(data) {
    fs.writeFileSync(this.marketplacePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    fs.writeFileSync(
      this.marketplaceBrowserPath,
      `window.SAJILO_MARKETPLACE_DATA = ${JSON.stringify(data, null, 2)};\n`,
      "utf8"
    );
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

    if (!["member", "business_owner", "rider", "customer", "courier", "driver"].includes(payload.role)) {
      return { statusCode: 400, payload: { error: "Invalid signup role" } };
    }

    const authData = this.readAuthData();
    const existing = authData.accounts.find((item) => item.email.toLowerCase() === payload.email.toLowerCase());

    if (existing) {
      return { statusCode: 409, payload: { error: "Email already registered" } };
    }

    const seed = this.readSeedData();
    const roleConfig = {
      member: { collection: "members", prefix: "member" },
      business_owner: { collection: "businessOwners", prefix: "biz_owner" },
      rider: { collection: "riders", prefix: "rider" },
      customer: { collection: "customers", prefix: "cust" },
      courier: { collection: "couriers", prefix: "courier" },
      driver: { collection: "drivers", prefix: "driver" }
    };
    const userCollectionKey = roleConfig[payload.role].collection;
    const userIdPrefix = roleConfig[payload.role].prefix;
    seed.users[userCollectionKey] = seed.users[userCollectionKey] || [];
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
      communityRole: payload.role === "member" ? "member" : undefined,
      businessName: payload.role === "business_owner" ? payload.businessName || payload.fullName : undefined,
      claimStatus: payload.role === "business_owner" ? "not_started" : undefined,
      walletBalance: payload.role === "rider" ? 0 : undefined,
      favoriteCuisineTags: payload.role === "customer" || payload.role === "member" ? [] : undefined,
      defaultPaymentMethodId: payload.role === "customer" || payload.role === "member" ? "pay_card_visa" : undefined,
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

  async login(payload, allowedRoles = null) {
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

    if (allowedRoles && !allowedRoles.includes(account.role)) {
      return { statusCode: 403, payload: { error: "Use the correct login for this account type" } };
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

  getMarketplaceMaps(data) {
    return {
      categoriesById: new Map((data.categories || []).map((category) => [category.id, category])),
      citiesById: new Map((data.cities || []).map((city) => [city.id, city]))
    };
  }

  enrichBusiness(data, business, query = {}) {
    const { categoriesById, citiesById } = this.getMarketplaceMaps(data);
    const category = categoriesById.get(business.categoryId) || null;
    const city = citiesById.get(business.cityId) || null;
    const reviews = (data.reviews || []).filter(
      (review) => review.businessId === business.id && review.status === "published"
    );
    const reviewCount = Number(business.reviewCount || 0) + reviews.length;
    const reviewAverage =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
        : Number(business.rating || 0);
    const lat = toNumber(query.lat);
    const lng = toNumber(query.lng);
    const distance =
      lat !== null && lng !== null && Number.isFinite(business.lat) && Number.isFinite(business.lng)
        ? Number(distanceMiles(lat, lng, business.lat, business.lng).toFixed(1))
        : null;

    return {
      ...business,
      category,
      city,
      rating: Number(reviewAverage.toFixed(1)),
      reviewCount,
      distanceMiles: distance
    };
  }

  async getMarketplaceCategories() {
    const data = this.readMarketplaceData();
    return {
      categories: data.categories || [],
      cities: data.cities || []
    };
  }

  async getMarketplaceBusinesses(query = {}) {
    const data = this.readMarketplaceData();
    const { categoriesById, citiesById } = this.getMarketplaceMaps(data);
    const searchQuery = normalizeText(query.q);
    const categoryQuery = normalizeText(query.category);
    const cityQuery = normalizeText(query.city);
    const serviceModeQuery = normalizeText(query.serviceMode);
    const minRating = toNumber(query.rating);
    const radius = toNumber(query.radius);
    const lat = toNumber(query.lat);
    const lng = toNumber(query.lng);
    const openNowOnly = ["true", "1", "yes"].includes(normalizeText(query.openNow));

    let businesses = (data.businesses || [])
      .filter((business) => business.status === "published")
      .map((business) => this.enrichBusiness(data, business, query));

    businesses = businesses.filter((business) => {
      const category = categoriesById.get(business.categoryId);
      const city = citiesById.get(business.cityId);
      const searchText = getBusinessSearchText(business, category, city);
      const categoryMatches =
        !categoryQuery ||
        normalizeText(business.categoryId) === categoryQuery ||
        normalizeText(category?.name).includes(categoryQuery);
      const cityMatches =
        !cityQuery ||
        normalizeText(business.cityId) === cityQuery ||
        normalizeText(city?.name).includes(cityQuery) ||
        normalizeText(city?.state).includes(cityQuery) ||
        normalizeText(business.neighborhood).includes(cityQuery);
      const serviceMatches =
        !serviceModeQuery ||
        (business.serviceModes || []).some((mode) => normalizeText(mode).includes(serviceModeQuery));
      const radiusMatches =
        radius === null ||
        lat === null ||
        lng === null ||
        (business.distanceMiles !== null && business.distanceMiles <= radius);

      return (
        (!searchQuery || searchText.includes(searchQuery)) &&
        categoryMatches &&
        cityMatches &&
        (!openNowOnly || business.isOpen) &&
        (minRating === null || Number(business.rating || 0) >= minRating) &&
        serviceMatches &&
        radiusMatches
      );
    });

    businesses.sort((a, b) => {
      if (a.distanceMiles !== null && b.distanceMiles !== null) {
        return a.distanceMiles - b.distanceMiles;
      }

      return Number(b.rating || 0) - Number(a.rating || 0);
    });

    return {
      businesses,
      categories: data.categories || [],
      cities: data.cities || [],
      query
    };
  }

  async getMarketplaceBusinessBySlug(slug) {
    const data = this.readMarketplaceData();
    const business = (data.businesses || []).find((item) => item.slug === slug || item.id === slug);

    if (!business || business.status !== "published") {
      return null;
    }

    return {
      business: this.enrichBusiness(data, business),
      reviews: (data.reviews || []).filter((review) => review.businessId === business.id && review.status === "published")
    };
  }

  async getMarketplaceReviews(businessId) {
    const data = this.readMarketplaceData();
    return {
      reviews: (data.reviews || []).filter((review) => review.businessId === businessId && review.status === "published")
    };
  }

  async createMarketplaceReview(businessId, auth, payload) {
    const data = this.readMarketplaceData();
    const business = (data.businesses || []).find((item) => item.id === businessId);
    const rating = Number(payload.rating);

    if (!business) {
      return { statusCode: 404, payload: { error: "Business not found" } };
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return { statusCode: 400, payload: { error: "Rating must be between 1 and 5" } };
    }

    const review = {
      id: createId("rev", data.reviews || []),
      businessId,
      userId: auth.userId,
      rating,
      title: payload.title || "Community review",
      body: payload.body || "",
      verificationSource: payload.verificationSource || "community_member",
      status: "published",
      createdAt: nowIso()
    };

    data.reviews = data.reviews || [];
    data.reviews.unshift(review);
    this.writeMarketplaceData(data);

    return { statusCode: 201, payload: review };
  }

  async createMarketplaceFavorite(businessId, auth) {
    const data = this.readMarketplaceData();
    const business = (data.businesses || []).find((item) => item.id === businessId);

    if (!business) {
      return { statusCode: 404, payload: { error: "Business not found" } };
    }

    data.favorites = data.favorites || [];
    const existing = data.favorites.find((item) => item.businessId === businessId && item.userId === auth.userId);

    if (existing) {
      return { statusCode: 200, payload: existing };
    }

    const favorite = {
      id: createId("fav", data.favorites),
      businessId,
      userId: auth.userId,
      createdAt: nowIso()
    };

    data.favorites.unshift(favorite);
    this.writeMarketplaceData(data);

    return { statusCode: 201, payload: favorite };
  }

  async deleteMarketplaceFavorite(businessId, auth) {
    const data = this.readMarketplaceData();
    const beforeCount = (data.favorites || []).length;
    data.favorites = (data.favorites || []).filter(
      (item) => !(item.businessId === businessId && item.userId === auth.userId)
    );

    if (data.favorites.length !== beforeCount) {
      this.writeMarketplaceData(data);
    }

    return { statusCode: 200, payload: { removed: beforeCount !== data.favorites.length } };
  }

  async createMarketplaceServiceRequest(auth, payload) {
    const data = this.readMarketplaceData();
    const requiredFields = ["businessId", "requestType", "details"];
    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return { statusCode: 400, payload: { error: `Missing required fields: ${missing.join(", ")}` } };
    }

    if (!(data.businesses || []).some((business) => business.id === payload.businessId)) {
      return { statusCode: 404, payload: { error: "Business not found" } };
    }

    data.serviceRequests = data.serviceRequests || [];
    const request = {
      id: createId("sr", data.serviceRequests),
      userId: auth.userId,
      businessId: payload.businessId,
      requestType: payload.requestType,
      details: payload.details,
      status: "new",
      createdAt: nowIso()
    };

    data.serviceRequests.unshift(request);
    this.writeMarketplaceData(data);

    return { statusCode: 201, payload: request };
  }

  async createBusinessClaim(auth, payload) {
    const data = this.readMarketplaceData();
    const requiredFields = ["businessId", "businessName", "contactName", "contactEmail"];
    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return { statusCode: 400, payload: { error: `Missing required fields: ${missing.join(", ")}` } };
    }

    data.businessClaims = data.businessClaims || [];
    const claim = {
      id: createId("claim", data.businessClaims),
      businessId: payload.businessId,
      requesterUserId: auth.userId,
      businessName: payload.businessName,
      contactName: payload.contactName,
      contactEmail: payload.contactEmail,
      evidence: payload.evidence || "",
      status: "pending",
      createdAt: nowIso()
    };

    data.businessClaims.unshift(claim);
    this.writeMarketplaceData(data);

    return { statusCode: 201, payload: claim };
  }

  async createBusinessProfileDraft(businessId, auth, payload) {
    const data = this.readMarketplaceData();
    const business = (data.businesses || []).find((item) => item.id === businessId);

    if (!business) {
      return { statusCode: 404, payload: { error: "Business not found" } };
    }

    if (auth.role !== "admin" && business.ownerUserId && business.ownerUserId !== auth.userId) {
      return { statusCode: 403, payload: { error: "Only the owner or admin can draft updates for this business" } };
    }

    data.businessProfileDrafts = data.businessProfileDrafts || [];
    const draft = {
      id: createId("draft", data.businessProfileDrafts),
      businessId,
      requesterUserId: auth.userId,
      changes: payload.changes || payload,
      status: "pending_review",
      createdAt: nowIso()
    };

    data.businessProfileDrafts.unshift(draft);
    this.writeMarketplaceData(data);

    return { statusCode: 201, payload: draft };
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

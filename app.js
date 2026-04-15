const SESSION_STORAGE_KEY = "sajilo-session";

const state = {
  activeView: "rides",
  authConfig: null,
  session: loadSession(),
  marketplaceSearch: {
    name: "",
    location: ""
  }
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat("en-US");

const formatCompact = (value) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

const formatStatus = (value) => value.replaceAll("_", " ");
const REQUEST_FORM_CONFIG = {
  ride: {
    formSelector: "#ride-form",
    noteSelector: "#ride-form-note",
    endpoint: "./api/rideshare/requests",
    defaultButtonLabel: "Request ride",
    demoRole: "rider",
    allowedRoles: ["admin", "rider"],
    sessionRoleForDefaultId: "rider",
    idFieldName: "riderId",
    demoId: "rider_001"
  },
  food: {
    formSelector: "#food-form",
    noteSelector: "#food-form-note",
    endpoint: "./api/food-delivery/orders",
    defaultButtonLabel: "Place order",
    demoRole: "customer",
    allowedRoles: ["admin", "customer"],
    sessionRoleForDefaultId: "customer",
    idFieldName: "customerId",
    demoId: "cust_001"
  },
  courier: {
    formSelector: "#courier-form",
    noteSelector: "#courier-form-note",
    endpoint: "./api/courier/requests",
    defaultButtonLabel: "Request courier",
    demoRole: "rider",
    allowedRoles: ["admin", "rider", "customer"],
    sessionRoleForDefaultId: null,
    idFieldName: "senderUserId",
    demoId: "rider_001"
  }
};

function loadSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveSession(session) {
  state.session = session;

  try {
    if (session) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    // Ignore storage failures and keep in-memory session state.
  }
}

async function loadData() {
  try {
    const apiResponse = await fetch("./api/seed");

    if (apiResponse.ok) {
      return apiResponse.json();
    }
  } catch (error) {
    // Fall through to static boot paths when the API is not available.
  }

  if (window.SAJILO_SEED_DATA) {
    return window.SAJILO_SEED_DATA;
  }

  const response = await fetch("./data/sajilo-seed-data.json");

  if (!response.ok) {
    throw new Error(`Failed to load seed data: ${response.status}`);
  }

  return response.json();
}

async function loadAuthConfig() {
  try {
    const response = await fetch("./api/auth/config");

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    return null;
  }
}

function metricCard(label, value) {
  return `
    <article class="metric-card animated-rise">
      <p class="metric-label">${label}</p>
      <p class="metric-value">${value}</p>
    </article>
  `;
}

function signalCard(label, value) {
  return `
    <article class="signal animated-rise">
      <p class="label">${label}</p>
      <strong>${value}</strong>
    </article>
  `;
}

function ratingBadge(rating, reviewCount = 0) {
  const rounded = Math.round((rating || 0) * 10) / 10;

  return `
    <div class="rating-row">
      <div class="rating-stars" aria-hidden="true">
        ${Array.from({ length: 5 }, (_, index) => {
          const filled = rounded >= index + 1 || rounded > index + 0.4;
          return `<span class="rating-star${filled ? " is-filled" : ""}"></span>`;
        }).join("")}
      </div>
      <span class="rating-text">${rounded.toFixed(1)}${reviewCount ? ` (${numberFormatter.format(reviewCount)} reviews)` : ""}</span>
    </div>
  `;
}

function applyStagger(selector, start = 0, step = 80) {
  document.querySelectorAll(selector).forEach((node, index) => {
    node.style.animationDelay = `${start + index * step}ms`;
  });
}

function animateSwap(node, className = "is-swapping") {
  if (!node) {
    return;
  }

  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
}

function renderHero(data) {
  const { brand, cities } = data.platform;
  const kpis = data.analytics.adminDashboard;
  const heroLanes = [
    {
      theme: "ride",
      eyebrow: "Ridesharing",
      title: "Book city rides with live dispatch and safer trip visibility.",
      meta: `${data.rideshare.serviceTiers.length} tiers | ${numberFormatter.format(data.analytics.adminDashboard.activeDrivers)} active drivers`
    },
    {
      theme: "food",
      eyebrow: "Food Delivery",
      title: "Order meals with restaurant search, prep timing, and delivery tracking.",
      meta: `${data.foodDelivery.restaurants.length} restaurants | ${numberFormatter.format(data.analytics.adminDashboard.dailyFoodOrders)} daily orders`
    },
    {
      theme: "courier",
      eyebrow: "Courier",
      title: "Send parcels across the city with quoted pricing and route updates.",
      meta: `${numberFormatter.format(data.courierDelivery.deliveries.length)} tracked jobs | ${numberFormatter.format(data.analytics.adminDashboard.activeCouriers)} active couriers`
    }
  ];

  document.querySelector("#hero-title").textContent = brand.name;
  document.querySelector("#hero-tagline").textContent = brand.tagline;
  document.querySelector("#city-name").textContent = cities[0].name;
  document.querySelector("#timezone-label").textContent = brand.timezone;
  document.querySelector("#hero-lanes").innerHTML = heroLanes
    .map(
      (lane) => `
        <article class="hero-lane hero-lane-${lane.theme} animated-rise">
          <p class="label">${lane.eyebrow}</p>
          <h3>${lane.title}</h3>
          <span class="hero-lane-meta">${lane.meta}</span>
        </article>
      `
    )
    .join("");

  document.querySelector("#hero-stats").innerHTML = [
    metricCard("Completed rides", formatCompact(kpis.dailyCompletedRides)),
    metricCard("Food orders", formatCompact(kpis.dailyFoodOrders)),
    metricCard("GMV", currencyFormatter.format(kpis.grossMerchandiseValue))
  ].join("");

  document.querySelector("#signal-grid").innerHTML = [
    signalCard("Active drivers", numberFormatter.format(kpis.activeDrivers)),
    signalCard("Active couriers", numberFormatter.format(kpis.activeCouriers)),
    signalCard("Avg ride ETA", `${kpis.avgRideEtaMinutes} min`),
    signalCard("Food delivery", `${kpis.avgFoodDeliveryMinutes} min`)
  ].join("");

  document.querySelector("#search-chip-row").innerHTML = ["Momos", "Airport rides", "Bike couriers", "Late-night food", "Top rated"]
    .map((item) => `<span class="search-chip">${item}</span>`)
    .join("");

  applyStagger("#hero-lanes .animated-rise", 60, 90);
  applyStagger("#hero-stats .animated-rise", 180, 70);
  applyStagger("#signal-grid .animated-rise", 260, 60);
}

function renderServices(data) {
  const serviceCards = [
    {
      theme: "ride",
      icon: "R",
      title: "Ridesharing",
      subtitle: "Fast city trips with dispatch, fare logic, live route visibility, and rider safety.",
      status: "live mobility product",
      countLabel: `${data.rideshare.serviceTiers.length} ride tiers`,
      apiPath: "/api/rideshare",
      access: "Admin and rider access",
      requirements: [
        "Driver assignment and trip matching",
        "Pickup and destination capture",
        "Fare estimate, surge, and booking fee logic",
        "Trip timeline, route visibility, and safety events"
      ]
    },
    {
      theme: "food",
      icon: "F",
      title: "Food Ordering and Delivery",
      subtitle: "Restaurant discovery, menu browsing, checkout, prep timing, and doorstep fulfillment.",
      status: "live commerce product",
      countLabel: `${data.foodDelivery.restaurants.length} restaurants`,
      apiPath: "/api/food-delivery",
      access: "Admin and customer access",
      requirements: [
        "Restaurant search and location filtering",
        "Menu items, modifiers, and order pricing",
        "Delivery address capture and courier dispatch",
        "Order status tracking from placed to delivered"
      ]
    },
    {
      theme: "courier",
      icon: "C",
      title: "Courier Delivery",
      subtitle: "Reliable package movement for documents, parcels, and same-day city dropoffs.",
      status: "live logistics product",
      countLabel: `${data.courierDelivery.deliveries.length} active courier jobs`,
      apiPath: "/api/courier",
      access: "Admin, rider, and customer access",
      requirements: [
        "Package type and sender job creation",
        "Pickup and dropoff address handling",
        "Quoted pricing and courier assignment",
        "Scheduled delivery flow and status tracking"
      ]
    }
  ];

  const serviceMarkup = serviceCards
    .map(
      (service) => `
        <article class="service-card service-pillar service-pillar-${service.theme} animated-rise">
          <div class="service-card-top">
            <div class="service-title-lockup">
              <span class="service-icon">${service.icon}</span>
              <p class="label">${service.status}</p>
            </div>
            <span class="service-badge">${service.countLabel}</span>
          </div>
          <h3>${service.title}</h3>
          <p class="service-summary">${service.subtitle}</p>
          <div class="service-detail-row">
            <span class="service-detail"><strong>API</strong> ${service.apiPath}</span>
            <span class="service-detail"><strong>Access</strong> ${service.access}</span>
          </div>
          <div class="service-requirements">
            ${service.requirements.map((item) => `<div class="requirement-item">${item}</div>`).join("")}
          </div>
        </article>
      `
    )
    .join("");

  document.querySelector("#service-grid").innerHTML = serviceMarkup;
  applyStagger("#service-grid .animated-rise", 40, 110);
}

function renderApiOverview() {
  const apiCards = [
    {
      title: "Ridesharing API",
      basePath: "/api/rideshare",
      description: "For ride demand, trip overview, and live rider requests.",
      endpoints: ["GET /api/rideshare/overview", "POST /api/rideshare/requests"]
    },
    {
      title: "Food Delivery API",
      basePath: "/api/food-delivery",
      description: "For restaurants, menus, orders, and delivery tracking.",
      endpoints: ["GET /api/food-delivery/overview", "POST /api/food-delivery/orders"]
    },
    {
      title: "Courier API",
      basePath: "/api/courier",
      description: "For parcel jobs, sender requests, and courier operations.",
      endpoints: ["GET /api/courier/overview", "POST /api/courier/requests"]
    }
  ];

  document.querySelector("#api-grid").innerHTML = apiCards
    .map(
      (card) => `
        <article class="api-card animated-rise">
          <p class="label">Base path</p>
          <h3>${card.title}</h3>
          <code class="api-base">${card.basePath}</code>
          <p class="service-meta">${card.description}</p>
          <div class="api-endpoints">
            ${card.endpoints.map((endpoint) => `<code class="api-endpoint">${endpoint}</code>`).join("")}
          </div>
        </article>
      `
    )
    .join("");

  applyStagger("#api-grid .animated-rise", 40, 90);
}

function renderTabs() {
  const tabs = [
    { id: "rides", label: "Rides", theme: "ride" },
    { id: "food", label: "Food", theme: "food" },
    { id: "courier", label: "Courier", theme: "courier" }
  ];

  document.querySelector("#ops-tabs").innerHTML = tabs
    .map(
      (tab) => `
        <button
          class="tab-button tab-button-${tab.theme}"
          type="button"
          role="tab"
          aria-selected="${state.activeView === tab.id}"
          data-view="${tab.id}"
          data-theme="${tab.theme}"
        >
          ${tab.label}
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeView = button.dataset.view;
      renderTabs();
      renderLiveMap(window.__SAJILO_DATA__);
      renderOperations(window.__SAJILO_DATA__);
    });
  });
}

function buildTimeline(timeline) {
  return `
    <div class="timeline-shell">
      ${timeline
        .map(
          (item) => `
            <div class="timeline-event">
              <span class="timeline-dot"></span>
              <div>
                <p class="timeline-status">${formatStatus(item.status)}</p>
                <p class="timeline-time">${formatTime(item.timestamp)}</p>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createPoint(label, role, lat, lng) {
  return { label, role, lat, lng };
}

function getMapData(data) {
  if (state.activeView === "rides") {
    const trip = data.rideshare.trips.find((item) => item.status === "in_progress");
    const request = data.rideshare.rideRequests[0];
    const rider = data.users.riders.find((item) => item.id === trip.riderId || item.id === request?.riderId);

    return {
      label: "Ride flow",
      points: [
        rider?.savedPlaces?.[0] ? createPoint("Rider home", "rider", rider.savedPlaces[0].lat, rider.savedPlaces[0].lng) : null,
        trip ? createPoint("Driver pickup", "pickup", trip.pickup.lat, trip.pickup.lng) : null,
        trip ? createPoint("Trip destination", "dropoff", trip.dropoff.lat, trip.dropoff.lng) : null,
        request ? createPoint("Open request pickup", "request", request.pickup.lat, request.pickup.lng) : null
      ].filter(Boolean)
    };
  }

  if (state.activeView === "food") {
    const order = data.foodDelivery.orders.find((item) => item.status === "on_the_way");
    const restaurant = data.foodDelivery.restaurants.find((item) => item.id === order.restaurantId);
    const customer = data.users.customers.find((item) => item.id === order.customerId);
    const customerRider = data.users.riders.find((item) => item.email === customer?.email);

    return {
      label: "Food delivery",
      points: [
        restaurant ? createPoint("Restaurant", "restaurant", data.platform.cities[0].center.lat + 0.009, data.platform.cities[0].center.lng - 0.021) : null,
        order ? createPoint("Customer", "customer", order.deliveryAddress.lat, order.deliveryAddress.lng) : null,
        customerRider?.savedPlaces?.[0]
          ? createPoint("Saved home", "customer-home", customerRider.savedPlaces[0].lat, customerRider.savedPlaces[0].lng)
          : null
      ].filter(Boolean)
    };
  }

  const delivery = data.courierDelivery.deliveries[0];
  const sender = data.users.riders.find((item) => item.id === delivery.senderUserId) || data.users.customers.find((item) => item.id === delivery.senderUserId);
  const senderRider = data.users.riders.find((item) => item.id === delivery.senderUserId);

  return {
    label: "Courier route",
    points: [
      senderRider?.savedPlaces?.[1]
        ? createPoint("Sender office", "sender", senderRider.savedPlaces[1].lat, senderRider.savedPlaces[1].lng)
        : data.platform.cities[0].center
          ? createPoint("Pickup zone", "pickup", data.platform.cities[0].center.lat, data.platform.cities[0].center.lng)
          : null,
      createPoint("Dropoff", "dropoff", data.platform.cities[0].center.lat + 0.014, data.platform.cities[0].center.lng + 0.02)
    ].filter(Boolean)
  };
}

function getMarkerColor(role) {
  const colors = {
    rider: "#18342d",
    pickup: "#ff6b35",
    dropoff: "#00a896",
    request: "#ffb703",
    restaurant: "#8f4ad0",
    customer: "#0a5f56",
    "customer-home": "#4f6d7a",
    sender: "#18342d"
  };

  return colors[role] || "#18342d";
}

function renderLiveMap(data) {
  const mapNode = document.querySelector("#live-map");
  const legendNode = document.querySelector("#map-legend");
  const modeNode = document.querySelector("#map-mode-label");
  const mapCardNode = document.querySelector(".map-card");

  if (!mapNode || !legendNode || !modeNode || !mapCardNode) {
    return;
  }

  const mapData = getMapData(data);
  const cityCenter = data.platform.cities[0].center;
  const bounds = {
    minLat: cityCenter.lat - 0.12,
    maxLat: cityCenter.lat + 0.12,
    minLng: cityCenter.lng - 0.12,
    maxLng: cityCenter.lng + 0.12
  };

  const markers = mapData.points
    .map((point) => {
      const x = clamp(((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100, 8, 92);
      const y = clamp((1 - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100, 10, 90);
      const color = getMarkerColor(point.role);

      return `
        <div class="map-marker" style="left:${x}%;top:${y}%;">
          <span class="map-pin" style="--marker-color:${color};"></span>
          <div class="map-tooltip">
            <strong>${point.label}</strong>
            <span>${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</span>
          </div>
        </div>
      `;
    })
    .join("");

  mapNode.innerHTML = `
    <div class="map-grid-overlay"></div>
    <div class="map-watermark">Chicago demo grid</div>
    ${markers}
  `;
  mapCardNode.dataset.theme = state.activeView;
  mapNode.dataset.theme = state.activeView;
  animateSwap(mapNode, "is-map-swapping");
  modeNode.textContent = mapData.label;
  legendNode.innerHTML = mapData.points
    .map(
      (point) => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${getMarkerColor(point.role)};"></span>
          <span>${point.label}</span>
        </div>
      `
    )
    .join("");
  animateSwap(legendNode);
}

function renderRideOps(data) {
  const currentTrip = data.rideshare.trips.find((trip) => trip.status === "in_progress");
  const activeRequest = data.rideshare.rideRequests[0];
  const currentDriver = data.users.drivers.find((driver) => driver.id === currentTrip.driverId);
  const currentTier = data.rideshare.serviceTiers.find((tier) => tier.id === currentTrip.tierId);
  const tiers = data.rideshare.serviceTiers
    .map(
      (tier) => `
        <article class="fare-card animated-rise">
          <div class="panel-header">
            <h3>${tier.name}</h3>
            <span class="chip">${tier.capacity} seats</span>
          </div>
          <p>${currencyFormatter.format(tier.baseFare)} base, ${currencyFormatter.format(tier.perMile)}/mile, ${currencyFormatter.format(tier.perMinute)}/min</p>
          <div class="price-row">
            <span>Minimum fare</span>
            <strong>${currencyFormatter.format(tier.minimumFare)}</strong>
          </div>
          <div class="price-row">
            <span>Cancellation fee</span>
            <strong>${currencyFormatter.format(tier.cancellationFee)}</strong>
          </div>
        </article>
      `
    )
    .join("");

  return `
    <article class="ops-summary animated-rise">
      <p class="label">Live route</p>
      <div class="panel-header">
        <h3>${currentTrip.pickup.address.split(",")[0]} to ${currentTrip.dropoff.address.split(",")[0]}</h3>
        <span class="status-badge">${formatStatus(currentTrip.status)}</span>
      </div>
      <p>Driver ${currentDriver.fullName} is taking the rider from the start location to the final destination in a ${currentTier.name} trip.</p>
      <div class="route-preview route-preview-static">
        <div class="route-stop">
          <span class="route-dot route-dot-start"></span>
          <div>
            <strong>Start location</strong>
            <p>${currentTrip.pickup.address}</p>
          </div>
        </div>
        <div class="route-line"></div>
        <div class="route-stop">
          <span class="route-dot route-dot-end"></span>
          <div>
            <strong>Destination location</strong>
            <p>${currentTrip.dropoff.address}</p>
          </div>
        </div>
      </div>
      <div class="ops-data-grid">
        <article class="fare-card">
          <p class="label">Trip summary</p>
          <div class="price-row"><span>Distance</span><strong>${currentTrip.distanceMiles} mi</strong></div>
          <div class="price-row"><span>Duration</span><strong>${currentTrip.durationMinutes} min</strong></div>
          <div class="price-row"><span>Total fare</span><strong>${currencyFormatter.format(currentTrip.fare.total)}</strong></div>
        </article>
        ${buildTimeline(currentTrip.timeline)}
      </div>
    </article>
    <article class="ops-summary animated-rise">
      <p class="label">New ride request</p>
      <div class="panel-header">
        <h3>Waiting for driver confirmation</h3>
        <span class="status-badge">${activeRequest.status}</span>
      </div>
      <p>The rider wants to travel from ${activeRequest.pickup.address.split(",")[0]} to ${activeRequest.dropoff.address.split(",")[0]}. Estimated trip time is ${activeRequest.estimatedDurationMinutes} minutes with surge x${activeRequest.surgeMultiplier}.</p>
    </article>
    <div class="ops-data-grid">${tiers}</div>
  `;
}

function renderFoodOps(data) {
  const activeOrder = data.foodDelivery.orders.find((order) => order.status === "on_the_way");
  const restaurant = data.foodDelivery.restaurants.find((item) => item.id === activeOrder.restaurantId);
  const courier = data.users.couriers.find((item) => item.id === activeOrder.courierId);
  const pricingRule = data.foodDelivery.deliveryPricingRules[0];

  return `
    <article class="ops-summary animated-rise">
      <p class="label">Active delivery</p>
      <div class="panel-header">
        <h3>${restaurant.name}</h3>
        <span class="status-badge">${formatStatus(activeOrder.status)}</span>
      </div>
      <p>Courier ${courier.fullName} is delivering ${activeOrder.items.length} line items to ${activeOrder.deliveryAddress.address.split(",")[0]}.</p>
      <div class="ops-data-grid">
        <article class="fare-card">
          <p class="label">Order pricing</p>
          <div class="price-row"><span>Subtotal</span><strong>${currencyFormatter.format(activeOrder.pricing.subtotal)}</strong></div>
          <div class="price-row"><span>Delivery fee</span><strong>${currencyFormatter.format(activeOrder.pricing.deliveryFee)}</strong></div>
          <div class="price-row"><span>Total</span><strong>${currencyFormatter.format(activeOrder.pricing.total)}</strong></div>
        </article>
        ${buildTimeline(activeOrder.timeline)}
      </div>
    </article>
    <article class="ops-summary animated-rise">
      <p class="label">Delivery rule</p>
      <div class="panel-header">
        <h3>Marketplace pricing model</h3>
        <span class="chip">Configurable</span>
      </div>
      <p>Base fee ${currencyFormatter.format(pricingRule.baseFee)}, ${currencyFormatter.format(pricingRule.perMile)} per mile, ${Math.round(pricingRule.serviceFeePercent * 100)}% service fee, and free delivery above ${currencyFormatter.format(pricingRule.freeDeliveryThreshold)}.</p>
    </article>
  `;
}

function renderCourierOps(data) {
  const delivery = data.courierDelivery.deliveries[0];
  const courier = data.users.couriers.find((item) => item.id === delivery.courierId);
  const packageType = data.courierDelivery.packageTypes.find((item) => item.id === delivery.packageTypeId);

  return `
    <article class="ops-summary animated-rise">
      <p class="label">Courier request</p>
      <div class="panel-header">
        <h3>${packageType.name}</h3>
        <span class="status-badge">${formatStatus(delivery.status)}</span>
      </div>
      <p>${courier.fullName} is assigned to move a ${packageType.name.toLowerCase()} job from ${delivery.pickupAddress.split(",")[0]} to ${delivery.dropoffAddress.split(",")[0]}.</p>
      <div class="ops-data-grid">
        <article class="fare-card">
          <p class="label">Delivery details</p>
          <div class="price-row"><span>Vehicle</span><strong>${courier.vehicleType}</strong></div>
          <div class="price-row"><span>Max weight</span><strong>${packageType.maxWeightKg} kg</strong></div>
          <div class="price-row"><span>Quote</span><strong>${currencyFormatter.format(delivery.quotedPrice)}</strong></div>
        </article>
        <article class="fare-card">
          <p class="label">Scheduled</p>
          <p>Pickup window starts at ${formatTime(delivery.scheduledAt)} and can be extended into scheduled deliveries, multi-stop courier routes, or same-day commerce.</p>
        </article>
      </div>
    </article>
  `;
}

function renderOperations(data) {
  const panel = document.querySelector("#ops-panel");

  if (state.activeView === "rides") {
    panel.innerHTML = renderRideOps(data);
  } else if (state.activeView === "food") {
    panel.innerHTML = renderFoodOps(data);
  } else {
    panel.innerHTML = renderCourierOps(data);
  }

  animateSwap(panel);
  applyStagger("#ops-panel .animated-rise", 20, 80);
}

function renderSidebar(data) {
  document.querySelector("#zone-list").innerHTML = data.platform.zones
    .map(
      (zone) => `
        <div class="zone-pill animated-rise">
          <div class="price-row">
            <strong>${zone.name}</strong>
            <span class="chip">${zone.type}</span>
          </div>
          <p>${zone.surgeEligible ? "Surge eligible" : "Normal demand"}</p>
        </div>
      `
    )
    .join("");
  applyStagger("#zone-list .animated-rise", 20, 60);

  document.querySelector("#promo-list").innerHTML = data.platform.promotions
    .map(
      (promo) => `
        <div class="promo-card animated-rise">
          <div class="price-row">
            <strong>${promo.code}</strong>
            <span class="chip">${promo.service}</span>
          </div>
          <p>${promo.discountType === "percent" ? `${promo.discountValue}% off` : `${currencyFormatter.format(promo.discountValue)} off`} up to ${currencyFormatter.format(promo.maxDiscount)}.</p>
        </div>
      `
    )
    .join("");
  applyStagger("#promo-list .animated-rise", 50, 70);
}


function renderMarketplaceView(data) {
  const nameQuery = state.marketplaceSearch.name.trim().toLowerCase();
  const locationQuery = state.marketplaceSearch.location.trim().toLowerCase();
  const cityName = data.platform.cities[0]?.name?.toLowerCase() || "";
  const filteredRestaurants = data.foodDelivery.restaurants.filter((restaurant) => {
    const zone = data.platform.zones.find((item) => item.id === restaurant.zoneId);
    const locationText = [restaurant.address, zone?.name || "", cityName].join(" ").toLowerCase();
    const matchesName = !nameQuery || restaurant.name.toLowerCase().includes(nameQuery);
    const matchesLocation = !locationQuery || locationText.includes(locationQuery);

    return matchesName && matchesLocation;
  });

  document.querySelector("#restaurant-list").innerHTML = filteredRestaurants.length > 0
    ? filteredRestaurants
        .map(
          (restaurant) => `
            <article class="restaurant-card listing-card animated-rise">
              <div class="listing-media">${restaurant.name.slice(0, 1)}</div>
              <div class="listing-body">
                <div class="restaurant-head">
                  <div>
                    <h3>${restaurant.name}</h3>
                    ${ratingBadge(restaurant.rating, Math.round(restaurant.rating * 128))}
                  </div>
                  <span class="chip">${restaurant.avgPrepTimeMinutes} min prep</span>
                </div>
                <p class="listing-meta">${"$".repeat(restaurant.priceLevel)} | ${restaurant.cuisineTags.join(", ")} | ${restaurant.deliveryRadiusMiles} mi delivery</p>
                <p class="restaurant-meta">${restaurant.address}</p>
                <div class="tags">
                  ${restaurant.cuisineTags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
              </div>
            </article>
          `
        )
        .join("")
    : `
        <article class="empty-state">
          <h3>No restaurants found</h3>
          <p>Try a broader restaurant name or a nearby area like Downtown Loop, North Side, or Chicago.</p>
        </article>
      `;

  document.querySelector("#menu-list").innerHTML = data.foodDelivery.menuItems
    .map((item) => {
      const restaurant = data.foodDelivery.restaurants.find((entry) => entry.id === item.restaurantId);
      const modifierGroups = Array.isArray(item.modifierGroupIds) ? item.modifierGroupIds : [];

      if (!restaurant) {
        return null;
      }

      const isVisible = filteredRestaurants.some((entry) => entry.id === restaurant.id);

      if (!isVisible) {
        return null;
      }

      return `
        <article class="menu-card listing-card animated-rise">
          <div class="listing-media food-media">${item.name.slice(0, 1)}</div>
          <div class="listing-body">
            <div class="menu-head">
              <div>
                <p class="label">${restaurant.name}</p>
                <h3>${item.name}</h3>
              </div>
              <strong>${currencyFormatter.format(item.price)}</strong>
            </div>
            <p class="menu-meta">${item.description}</p>
            <div class="menu-tags">
              <span class="tag">${item.isPopular ? "Most loved" : "Neighborhood pick"}</span>
              <span class="tag">${modifierGroups.length} custom options</span>
            </div>
          </div>
        </article>
      `;
    })
    .filter(Boolean)
    .join("");

  applyStagger("#restaurant-list .animated-rise", 20, 90);
  applyStagger("#menu-list .animated-rise", 50, 70);
}

function bindMarketplaceSearch() {
  const nameInput = document.querySelector("#restaurant-name-search");
  const locationInput = document.querySelector("#restaurant-location-search");

  if (!nameInput || !locationInput) {
    return;
  }

  nameInput.value = state.marketplaceSearch.name;
  locationInput.value = state.marketplaceSearch.location;

  if (nameInput.dataset.bound === "true") {
    return;
  }

  function updateSearch() {
    state.marketplaceSearch.name = nameInput.value;
    state.marketplaceSearch.location = locationInput.value;
    renderMarketplaceView(window.__SAJILO_DATA__);
  }

  nameInput.addEventListener("input", updateSearch);
  locationInput.addEventListener("input", updateSearch);

  nameInput.dataset.bound = "true";
  locationInput.dataset.bound = "true";
}

function bindRideRoutePreview() {
  const pickupInput = document.querySelector("#ride-pickup-address");
  const dropoffInput = document.querySelector("#ride-dropoff-address");
  const previewNode = document.querySelector("#ride-route-preview");

  if (!pickupInput || !dropoffInput || !previewNode) {
    return;
  }

  function renderPreview() {
    const pickupValue = pickupInput.value.trim() || "Pickup point will appear here.";
    const dropoffValue = dropoffInput.value.trim() || "Dropoff point will appear here.";

    previewNode.innerHTML = `
      <div class="route-stop">
        <span class="route-dot route-dot-start"></span>
        <div>
          <strong>Start</strong>
          <p>${pickupValue}</p>
        </div>
      </div>
      <div class="route-line"></div>
      <div class="route-stop">
        <span class="route-dot route-dot-end"></span>
        <div>
          <strong>Destination</strong>
          <p>${dropoffValue}</p>
        </div>
      </div>
    `;
  }

  if (pickupInput.dataset.previewBound === "true") {
    renderPreview();
    return;
  }

  pickupInput.addEventListener("input", renderPreview);
  dropoffInput.addEventListener("input", renderPreview);
  pickupInput.dataset.previewBound = "true";
  dropoffInput.dataset.previewBound = "true";
  renderPreview();
}

function renderInsights(data) {
  const kpis = data.analytics.adminDashboard;
  const entries = [
    ["Ride requests", kpis.dailyRideRequests],
    ["Completed rides", kpis.dailyCompletedRides],
    ["Food orders", kpis.dailyFoodOrders],
    ["Courier jobs", kpis.dailyCourierDeliveries],
    ["Active drivers", kpis.activeDrivers],
    ["GMV", currencyFormatter.format(kpis.grossMerchandiseValue)]
  ];

  document.querySelector("#kpi-grid").innerHTML = entries
    .map(
      ([label, value]) => `
        <article class="kpi-item animated-rise">
          <span class="metric-label">${label}</span>
          <strong>${typeof value === "number" ? numberFormatter.format(value) : value}</strong>
        </article>
      `
    )
    .join("");
  applyStagger("#kpi-grid .animated-rise", 20, 60);

  document.querySelector("#support-list").innerHTML = data.platform.supportIssueTypes
    .slice(0, 6)
    .map(
      (issue) => `
        <article class="support-item animated-rise">
          <p class="label">Issue type</p>
          <strong>${formatStatus(issue)}</strong>
          <p>Route this into dedicated support workflows, refund policies, and trust escalation rules.</p>
        </article>
      `
    )
    .join("");
  applyStagger("#support-list .animated-rise", 60, 60);
}

function renderSafety(data) {
  const driverChecks = data.users.drivers.map((driver) => driver.documents.backgroundCheckStatus);
  const safetyEvents = data.rideshare.safetyEvents;
  const cards = [
    {
      title: "Driver verification",
      body: `${data.users.drivers.length} seeded drivers have approved licensing, insurance, and background checks.`,
      chip: `${driverChecks.filter((status) => status === "approved").length} approved`
    },
    {
      title: "Trip sharing",
      body: `${safetyEvents.length} safety event records are modeled for share-trip and future SOS events.`,
      chip: "Live event log"
    },
    {
      title: "Emergency readiness",
      body: "Emergency contacts, issue taxonomies, lost-item support, and payment incidents are already represented in the seed model.",
      chip: "Trust layer"
    }
  ];

  document.querySelector("#safety-panel").innerHTML = cards
    .map(
      (card) => `
        <article class="safety-card animated-rise">
          <div class="panel-header">
            <h3>${card.title}</h3>
            <span class="chip">${card.chip}</span>
          </div>
          <p>${card.body}</p>
        </article>
      `
    )
    .join("");
  applyStagger("#safety-panel .animated-rise", 40, 80);
}

function getEffectiveToken(url) {
  if (state.session?.token) {
    return state.session.token;
  }

  const tokenMap = state.authConfig?.demoTokens || {};
  const config = Object.values(REQUEST_FORM_CONFIG).find((item) => item.endpoint === url);

  if (!config) {
    return tokenMap.admin;
  }

  return tokenMap[config.demoRole] || tokenMap.admin;
}

function getSessionUserId(preferredRole) {
  if (!state.session?.user) {
    return null;
  }

  return state.session.user.role === preferredRole ? state.session.user.userId : null;
}

function formatRoleList(roles) {
  return roles.map((role) => role.charAt(0).toUpperCase() + role.slice(1)).join(", ");
}

function getRouteAccess(config) {
  const allowedRoles = config.allowedRoles;

  if (!state.session?.user) {
    return {
      canSubmit: true,
      usingDemo: true,
      tone: "info",
      note: `No account selected. This form will use the built-in ${config.demoRole} access profile.`,
      allowedRoles
    };
  }

  const currentRole = state.session.user.role;

  if (allowedRoles.includes(currentRole)) {
    return {
      canSubmit: true,
      usingDemo: false,
      tone: "success",
      note: `Signed in as ${currentRole}. This request can be submitted from your current account.`,
      allowedRoles
    };
  }

  return {
    canSubmit: false,
    usingDemo: false,
    tone: "blocked",
    note: `Signed in as ${currentRole}. Allowed roles: ${formatRoleList(allowedRoles)}. Switch accounts or sign out to return to built-in access.`,
    allowedRoles
  };
}

function setFormInteractivity(form, noteNode, config, access) {
  if (!form || !noteNode) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const fieldNodes = form.querySelectorAll("input, select, textarea");

  fieldNodes.forEach((field) => {
    field.disabled = !access.canSubmit;
  });

  if (submitButton) {
    submitButton.disabled = !access.canSubmit;
    submitButton.textContent = access.canSubmit
      ? config.defaultButtonLabel
      : `${config.defaultButtonLabel} unavailable`;
  }

  noteNode.textContent = access.note;
  noteNode.classList.toggle("is-blocked", access.tone === "blocked");
  noteNode.classList.toggle("is-success", access.tone === "success");
}

function syncFormDefaults() {
  Object.values(REQUEST_FORM_CONFIG).forEach((config) => {
    const field = document.querySelector(`${config.formSelector} input[name="${config.idFieldName}"]`);

    if (!field) {
      return;
    }

    if (config.sessionRoleForDefaultId) {
      field.value = getSessionUserId(config.sessionRoleForDefaultId) || config.demoId;
      return;
    }

    field.value = state.session?.user?.userId || config.demoId;
  });
}

function syncActionFormPermissions() {
  Object.values(REQUEST_FORM_CONFIG).forEach((config) => {
    setFormInteractivity(
      document.querySelector(config.formSelector),
      document.querySelector(config.noteSelector),
      config,
      getRouteAccess(config)
    );
  });
}

function renderSessionCard() {
  const sessionRole = document.querySelector("#session-role");
  const sessionUser = document.querySelector("#session-user");
  const logoutButton = document.querySelector("#logout-button");

  if (!sessionRole || !sessionUser || !logoutButton) {
    return;
  }

  if (state.session?.user) {
    sessionRole.textContent = `${state.session.user.role} account`;
    sessionUser.textContent = `${state.session.user.fullName || state.session.user.email} (${state.session.user.userId})`;
    logoutButton.disabled = false;
  } else {
    sessionRole.textContent = "Built-in access";
    sessionUser.textContent = "Create or log into an account to switch from built-in access to a saved personal session.";
    logoutButton.disabled = true;
  }
}

function setActionResult(title, payload) {
  const titleNode = document.querySelector("#action-result-title");
  const resultNode = document.querySelector("#action-result");

  if (titleNode) {
    titleNode.textContent = title;
  }

  if (resultNode) {
    resultNode.textContent = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  }
}

function bindAuthForms() {
  const signupForm = document.querySelector("#signup-form");
  const loginForm = document.querySelector("#login-form");
  const logoutButton = document.querySelector("#logout-button");
  if (signupForm.dataset.bound === "true") {
    renderSessionCard();
    syncFormDefaults();
    syncActionFormPermissions();
    return;
  }

  async function submitAuth(url, payload) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error || "Authentication request failed");
    }

    const session = {
      token: body.token,
      user: body.user
    };

    saveSession(session);
    renderSessionCard();
    syncFormDefaults();
    syncActionFormPermissions();
    setActionResult("Session updated", body);
  }

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await submitAuth("./api/auth/signup", {
        fullName: form.get("fullName"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role")
      });
    } catch (error) {
      setActionResult("Account request failed", error.message);
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await submitAuth("./api/auth/login", {
        email: form.get("email"),
        password: form.get("password")
      });
    } catch (error) {
      setActionResult("Account request failed", error.message);
    }
  });

  logoutButton.addEventListener("click", () => {
    saveSession(null);
    renderSessionCard();
    syncFormDefaults();
    syncActionFormPermissions();
    setActionResult("Signed out", "Forms are back on the built-in access profile.");
  });

  signupForm.dataset.bound = "true";
  loginForm.dataset.bound = "true";
  renderSessionCard();
  syncFormDefaults();
  syncActionFormPermissions();
}

function bindActionForms() {
  const rideForm = document.querySelector("#ride-form");
  const foodForm = document.querySelector("#food-form");
  const courierForm = document.querySelector("#courier-form");

  if (rideForm.dataset.bound === "true") {
    syncActionFormPermissions();
    return;
  }

  async function submitJson(url, payload) {
    const token = getEffectiveToken(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error || "Request failed");
    }

    setActionResult("Request submitted", body);
    const refreshed = await loadData();
    renderApp(refreshed);
  }

  rideForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await submitJson("./api/rideshare/requests", {
        riderId: form.get("riderId"),
        requestedTierId: form.get("requestedTierId"),
        pickup: { address: form.get("pickupAddress"), lat: 41.88, lng: -87.63 },
        dropoff: { address: form.get("dropoffAddress"), lat: 41.89, lng: -87.64 }
      });
    } catch (error) {
      setActionResult("Ride request failed", error.message);
    }
  });

  foodForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await submitJson("./api/food-delivery/orders", {
        customerId: form.get("customerId"),
        restaurantId: form.get("restaurantId"),
        deliveryAddress: { address: form.get("deliveryAddress"), lat: 41.88, lng: -87.64 },
        items: [
          {
            itemId: "item_001",
            quantity: 1,
            selectedModifiers: ["mod_001_opt_2"],
            lineTotal: 12.5
          }
        ]
      });
    } catch (error) {
      setActionResult("Food order failed", error.message);
    }
  });

  courierForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await submitJson("./api/courier/requests", {
        senderUserId: form.get("senderUserId"),
        packageTypeId: form.get("packageTypeId"),
        pickupAddress: form.get("pickupAddress"),
        dropoffAddress: form.get("dropoffAddress")
      });
    } catch (error) {
      setActionResult("Courier request failed", error.message);
    }
  });

  rideForm.dataset.bound = "true";
  foodForm.dataset.bound = "true";
  courierForm.dataset.bound = "true";
  syncActionFormPermissions();
}

function renderApp(data) {
  window.__SAJILO_DATA__ = data;
  renderHero(data);
  renderServices(data);
  renderApiOverview();
  renderTabs();
  renderLiveMap(data);
  renderOperations(data);
  renderSidebar(data);
  renderMarketplaceView(data);
  bindMarketplaceSearch();
  bindRideRoutePreview();
  renderInsights(data);
  renderSafety(data);
  bindAuthForms();
  bindActionForms();
}

function showError(error) {
  document.querySelector("#app").innerHTML = `
    <section class="section">
      <div class="section-heading">
        <p class="eyebrow">Load error</p>
        <h2>Seed data could not be loaded</h2>
      </div>
      <p>${error.message}</p>
      <p>The UI expects either <code>window.SAJILO_SEED_DATA</code> from <code>data/sajilo-seed-data.js</code> or the JSON file to be available.</p>
    </section>
  `;
}

Promise.all([loadData(), loadAuthConfig()])
  .then(([data, authConfig]) => {
    state.authConfig = authConfig;
    renderApp(data);
  })
  .catch(showError);

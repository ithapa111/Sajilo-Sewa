const SESSION_STORAGE_KEY = "sajilo-session";

const state = {
  activeView: "rides",
  authConfig: null,
  session: loadSession()
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
    endpoint: "./api/rides/requests",
    defaultButtonLabel: "Create ride request",
    demoRole: "rider",
    allowedRoles: ["admin", "rider"],
    sessionRoleForDefaultId: "rider",
    idFieldName: "riderId",
    demoId: "rider_001"
  },
  food: {
    formSelector: "#food-form",
    noteSelector: "#food-form-note",
    endpoint: "./api/food/orders",
    defaultButtonLabel: "Create food order",
    demoRole: "customer",
    allowedRoles: ["admin", "customer"],
    sessionRoleForDefaultId: "customer",
    idFieldName: "customerId",
    demoId: "cust_001"
  },
  courier: {
    formSelector: "#courier-form",
    noteSelector: "#courier-form-note",
    endpoint: "./api/courier/deliveries",
    defaultButtonLabel: "Create courier job",
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

function renderHero(data) {
  const { brand, cities } = data.platform;
  const kpis = data.analytics.adminDashboard;

  document.querySelector("#hero-title").textContent = brand.name;
  document.querySelector("#hero-tagline").textContent = brand.tagline;
  document.querySelector("#city-name").textContent = cities[0].name;
  document.querySelector("#timezone-label").textContent = brand.timezone;

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
}

function renderServices(data) {
  const serviceMarkup = data.platform.serviceCategories
    .map((service) => {
      const meta =
        service.id === "svc_ride"
          ? `${data.rideshare.serviceTiers.length} ride tiers live`
          : service.id === "svc_food"
            ? `${data.foodDelivery.restaurants.length} restaurants seeded`
            : `${data.courierDelivery.deliveries.length} courier jobs tracked`;

      return `
        <article class="service-card animated-rise">
          <p class="label">${service.status}</p>
          <h3>${service.name}</h3>
          <p class="service-meta">${service.description}</p>
          <div class="meta-row">
            <span class="tag">${meta}</span>
            <span class="tag">Ready for API</span>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelector("#service-grid").innerHTML = serviceMarkup;
}

function renderTabs() {
  const tabs = [
    { id: "rides", label: "Rides" },
    { id: "food", label: "Food" },
    { id: "courier", label: "Courier" }
  ];

  document.querySelector("#ops-tabs").innerHTML = tabs
    .map(
      (tab) => `
        <button
          class="tab-button"
          type="button"
          role="tab"
          aria-selected="${state.activeView === tab.id}"
          data-view="${tab.id}"
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
      <p class="label">Live trip</p>
      <div class="panel-header">
        <h3>${currentTrip.pickup.address.split(",")[0]} to ${currentTrip.dropoff.address.split(",")[0]}</h3>
        <span class="status-badge">${formatStatus(currentTrip.status)}</span>
      </div>
      <p>Driver ${currentDriver.fullName} is running a ${currentTier.name} trip with live safety sharing enabled.</p>
      <div class="ops-data-grid">
        <article class="fare-card">
          <p class="label">Trip estimate</p>
          <div class="price-row"><span>Distance</span><strong>${currentTrip.distanceMiles} mi</strong></div>
          <div class="price-row"><span>Duration</span><strong>${currentTrip.durationMinutes} min</strong></div>
          <div class="price-row"><span>Total fare</span><strong>${currencyFormatter.format(currentTrip.fare.total)}</strong></div>
        </article>
        ${buildTimeline(currentTrip.timeline)}
      </div>
    </article>
    <article class="ops-summary animated-rise">
      <p class="label">Open demand</p>
      <div class="panel-header">
        <h3>Searching request</h3>
        <span class="status-badge">${activeRequest.status}</span>
      </div>
      <p>${activeRequest.pickup.address.split(",")[0]} to ${activeRequest.dropoff.address.split(",")[0]}, ETA ${activeRequest.estimatedDurationMinutes} minutes with surge x${activeRequest.surgeMultiplier}.</p>
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
    return;
  }

  if (state.activeView === "food") {
    panel.innerHTML = renderFoodOps(data);
    return;
  }

  panel.innerHTML = renderCourierOps(data);
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
}

function renderMarketplace(data) {
  document.querySelector("#restaurant-list").innerHTML = data.foodDelivery.restaurants
    .map(
      (restaurant) => `
        <article class="restaurant-card animated-rise">
          <div class="restaurant-head">
            <div>
              <p class="label">Rating ${restaurant.rating}</p>
              <h3>${restaurant.name}</h3>
            </div>
            <span class="chip">${restaurant.avgPrepTimeMinutes} min prep</span>
          </div>
          <p class="restaurant-meta">${restaurant.address} with a ${restaurant.deliveryRadiusMiles}-mile delivery radius.</p>
          <div class="tags">
            ${restaurant.cuisineTags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");

  document.querySelector("#menu-list").innerHTML = data.foodDelivery.menuItems
    .map((item) => {
      const restaurant = data.foodDelivery.restaurants.find((entry) => entry.id === item.restaurantId);

      return `
        <article class="menu-card animated-rise">
          <div class="menu-head">
            <div>
              <p class="label">${restaurant.name}</p>
              <h3>${item.name}</h3>
            </div>
            <strong>${currencyFormatter.format(item.price)}</strong>
          </div>
          <p class="menu-meta">${item.description}</p>
          <div class="menu-tags">
            <span class="tag">${item.isPopular ? "Popular" : "Menu staple"}</span>
            <span class="tag">${item.modifierGroupIds.length} modifier groups</span>
          </div>
        </article>
      `;
    })
    .join("");
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
      note: `No account selected. This form will use the built-in ${config.demoRole} demo session.`,
      allowedRoles
    };
  }

  const currentRole = state.session.user.role;

  if (allowedRoles.includes(currentRole)) {
    return {
      canSubmit: true,
      usingDemo: false,
      tone: "success",
      note: `Signed in as ${currentRole}. You can submit this form.`,
      allowedRoles
    };
  }

  return {
    canSubmit: false,
    usingDemo: false,
    tone: "blocked",
    note: `Signed in as ${currentRole}. Allowed roles: ${formatRoleList(allowedRoles)}. Switch accounts or clear the session to use demo access.`,
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
    sessionRole.textContent = "Demo session";
    sessionUser.textContent = "Create or log into an account to use a saved personal token.";
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
    setActionResult("Account session updated", body);
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
      setActionResult("Account action failed", error.message);
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
      setActionResult("Account action failed", error.message);
    }
  });

  logoutButton.addEventListener("click", () => {
    saveSession(null);
    renderSessionCard();
    syncFormDefaults();
    syncActionFormPermissions();
    setActionResult("Session cleared", "Forms are back on the built-in demo session.");
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

    setActionResult("Request completed", body);
    const refreshed = await loadData();
    renderApp(refreshed);
  }

  rideForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await submitJson("./api/rides/requests", {
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
      await submitJson("./api/food/orders", {
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
      await submitJson("./api/courier/deliveries", {
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
  renderTabs();
  renderOperations(data);
  renderSidebar(data);
  renderMarketplace(data);
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

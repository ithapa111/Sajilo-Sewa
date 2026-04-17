const state = {
  data: window.SAJILO_MARKETPLACE_DATA || { businesses: [], categories: [], cities: [] },
  businesses: [],
  activeBusinessId: null,
  view: "list",
  mapZoom: 1,
  filters: {
    openNow: true,
    rating: "",
    serviceMode: ""
  },
  coordinates: null,
  locationPromptDismissed: false,
  locationStatus: "idle"
};

const initialParams = new URLSearchParams(window.location.search);

const categorySelect = document.querySelector("#marketplace-category");
const queryInput = document.querySelector("#marketplace-query");
const cityInput = document.querySelector("#marketplace-city");
const searchButton = document.querySelector("#marketplace-search-button");
const summaryNode = document.querySelector("#marketplace-summary");
const resultsNode = document.querySelector("#marketplace-results");
const resultsTitleNode = document.querySelector("#marketplace-results-title");
const locationPrompt = document.querySelector("#marketplace-location-prompt");
const locationUseButton = document.querySelector("#marketplace-location-use");
const locationSkipButton = document.querySelector("#marketplace-location-skip");
const locationNoteNode = document.querySelector("#marketplace-location-note");
const mapPanel = document.querySelector("#marketplace-map-panel");
const mapNode = document.querySelector("#marketplace-map");
const mapTitleNode = document.querySelector("#marketplace-map-title");
const mapPinsNode = document.querySelector("#marketplace-map-pins");
const mapPreviewNode = document.querySelector("#marketplace-map-preview");
const userLocationNode = document.querySelector("#marketplace-user-location");
const listToggle = document.querySelector("#marketplace-list-toggle");
const mapToggle = document.querySelector("#marketplace-map-toggle");
const nearMeButton = document.querySelector("#marketplace-near-me");
const mapZoomInButton = document.querySelector("#marketplace-map-zoom-in");
const mapZoomOutButton = document.querySelector("#marketplace-map-zoom-out");
const mapResetButton = document.querySelector("#marketplace-map-reset");

const numberFormatter = new Intl.NumberFormat("en-US");
let locationRequestId = 0;

const categoryColors = {
  restaurants: "#d32323",
  groceries: "#11856f",
  beauty: "#b83280",
  medical: "#2563eb",
  home_services: "#6f4e37",
  courier: "#7c3aed",
  rides: "#0f766e",
  photography: "#ea580c",
  social_sewa: "#047857",
  volunteering: "#059669",
  carpool: "#0891b2",
  community_places: "#4f46e5",
  events: "#c2410c",
  youth_activities: "#9333ea",
  fitness: "#16a34a",
  sports: "#0d9488",
  priests: "#be123c",
  matchmaking: "#db2777",
  community_chat: "#0284c7",
  legal: "#374151"
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCategory(categoryId) {
  return state.data.categories.find((category) => category.id === categoryId) || null;
}

function getCity(cityId) {
  return state.data.cities.find((city) => city.id === cityId) || null;
}

function getCategoryColor(categoryId) {
  return categoryColors[categoryId] || "#2d2d2d";
}

function getShortCategoryLabel(category) {
  const words = String(category?.name || "Place")
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "P";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getSearchText(business) {
  const category = getCategory(business.categoryId);
  const city = getCity(business.cityId);

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
    .join(" ")
    .toLowerCase();
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

function getNearestCity(lat, lng) {
  return (state.data.cities || [])
    .filter((city) => Number.isFinite(city.center?.lat) && Number.isFinite(city.center?.lng))
    .map((city) => ({
      ...city,
      distanceMiles: distanceMiles(lat, lng, city.center.lat, city.center.lng)
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)[0];
}

function setLocationStatus(status, message) {
  state.locationStatus = status;
  const isLocating = status === "locating";
  const shouldHidePrompt = state.locationPromptDismissed || status === "ready";

  locationPrompt?.classList.toggle("is-hidden", shouldHidePrompt);
  locationPrompt?.classList.toggle("is-locating", isLocating);

  if (locationNoteNode && message) {
    locationNoteNode.textContent = message;
  }

  if (nearMeButton) {
    nearMeButton.disabled = isLocating;
    nearMeButton.textContent = isLocating ? "Locating..." : "Near me";
  }

  if (locationUseButton) {
    locationUseButton.disabled = isLocating;
    locationUseButton.textContent = isLocating ? "Locating..." : "Use my location";
  }
}

function applyCoordinates(lat, lng, source = "manual") {
  const nearestCity = getNearestCity(lat, lng);
  state.coordinates = { lat, lng };
  state.locationPromptDismissed = true;

  if (nearestCity && cityInput) {
    cityInput.value = nearestCity.name;
  }

  setLocationStatus(
    "ready",
    nearestCity
      ? `Using your location near ${nearestCity.name}, ${nearestCity.state}.`
      : "Using your location to sort results by distance."
  );
  render();

  if (source === "auto" || state.view === "map") {
    setView("map");
  }
}

function getLocationErrorMessage(error) {
  if (error?.code === 1) {
    return "Location permission was blocked. You can still search by city, or enable location in your browser settings.";
  }

  if (error?.code === 3) {
    return "Location took too long. Search by city, or try Near me again.";
  }

  return "We could not detect your location. Search by city, or try Near me again.";
}

function requestLocation(source = "manual") {
  if (!navigator.geolocation) {
    setLocationStatus("unsupported", "This browser does not support location access. Search by city instead.");
    return;
  }

  const currentRequestId = ++locationRequestId;
  setLocationStatus(
    "locating",
    source === "auto"
      ? "Asking your browser for location permission so the map can start nearby."
      : "Finding your current location..."
  );

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (currentRequestId !== locationRequestId) {
        return;
      }

      applyCoordinates(position.coords.latitude, position.coords.longitude, source);
    },
    (error) => {
      if (currentRequestId !== locationRequestId) {
        return;
      }

      setLocationStatus(error?.code === 1 ? "blocked" : "error", getLocationErrorMessage(error));
    },
    {
      enableHighAccuracy: true,
      maximumAge: 300000,
      timeout: 10000
    }
  );
}

async function requestLocationOnLoad() {
  if (!navigator.geolocation) {
    setLocationStatus("unsupported", "This browser does not support location access. Search by city instead.");
    return;
  }

  try {
    if (navigator.permissions?.query) {
      const permission = await navigator.permissions.query({ name: "geolocation" });

      if (permission.state === "denied") {
        setLocationStatus(
          "blocked",
          "Location is blocked in this browser. Search by city, or enable location permission and tap Near me."
        );
        return;
      }
    }
  } catch (error) {
    // Some browsers do not expose geolocation through the Permissions API.
  }

  window.setTimeout(() => requestLocation("auto"), 700);
}

function enrichBusiness(business) {
  const distance =
    state.coordinates && Number.isFinite(business.lat) && Number.isFinite(business.lng)
      ? Number(distanceMiles(state.coordinates.lat, state.coordinates.lng, business.lat, business.lng).toFixed(1))
      : null;

  return {
    ...business,
    category: getCategory(business.categoryId),
    city: getCity(business.cityId),
    distanceMiles: distance
  };
}

async function loadMarketplaceData() {
  if (window.location.protocol === "file:") {
    return;
  }

  try {
    const response = await fetch("/api/marketplace/businesses");
    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    state.data = {
      ...state.data,
      businesses: payload.businesses || state.data.businesses,
      categories: payload.categories || state.data.categories,
      cities: payload.cities || state.data.cities
    };
  } catch (error) {
    state.data = window.SAJILO_MARKETPLACE_DATA || state.data;
  }
}

function populateCategories() {
  if (!categorySelect) {
    return;
  }

  const options = (state.data.categories || [])
    .map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`)
    .join("");

  categorySelect.innerHTML = `<option value="">All categories</option>${options}`;
}

function applyInitialParams() {
  const category = initialParams.get("category");
  const city = initialParams.get("city");
  const query = initialParams.get("q");

  if (categorySelect && category) {
    categorySelect.value = category;
  }

  if (cityInput && city) {
    cityInput.value = city;
  }

  if (queryInput && query) {
    queryInput.value = query;
  }
}

function filterBusinesses() {
  const query = queryInput?.value.trim().toLowerCase() || "";
  const cityQuery = cityInput?.value.trim().toLowerCase() || "";
  const category = categorySelect?.value || "";

  state.businesses = (state.data.businesses || [])
    .filter((business) => business.status === "published")
    .map(enrichBusiness)
    .filter((business) => {
      const city = business.city || {};
      const searchText = getSearchText(business);
      const cityMatches =
        !cityQuery ||
        String(city.name || "").toLowerCase().includes(cityQuery) ||
        String(city.state || "").toLowerCase().includes(cityQuery) ||
        String(business.neighborhood || "").toLowerCase().includes(cityQuery) ||
        String(business.address || "").toLowerCase().includes(cityQuery);
      const serviceMatches =
        !state.filters.serviceMode ||
        (business.serviceModes || []).some((mode) =>
          mode.toLowerCase().includes(state.filters.serviceMode.toLowerCase())
        );

      return (
        (!query || searchText.includes(query)) &&
        (!category || business.categoryId === category) &&
        cityMatches &&
        (!state.filters.openNow || business.isOpen) &&
        (!state.filters.rating || Number(business.rating || 0) >= Number(state.filters.rating)) &&
        serviceMatches
      );
    })
    .sort((a, b) => {
      if (a.distanceMiles !== null && b.distanceMiles !== null) {
        return a.distanceMiles - b.distanceMiles;
      }

      return Number(b.rating || 0) - Number(a.rating || 0);
    });

  if (!state.businesses.some((business) => business.id === state.activeBusinessId)) {
    state.activeBusinessId = state.businesses[0]?.id || null;
  }
}

function priceLabel(priceLevel = 2) {
  const level = Number(priceLevel);
  if (level <= 0) {
    return "Free";
  }

  return "$".repeat(level || 2);
}

function getBusinessActionLabel(business) {
  if (business.categoryId === "restaurants") {
    return "View menu";
  }

  if (business.categoryId === "rides") {
    return "Request ride";
  }

  if (business.categoryId === "courier") {
    return "Request courier";
  }

  if (business.categoryId === "photography") {
    return "Book photoshoot";
  }

  if (business.categoryId === "social_sewa") {
    return "Ask for help";
  }

  if (business.categoryId === "carpool") {
    return "Find carpool";
  }

  if (business.categoryId === "community_places") {
    return "View place";
  }

  if (["events", "youth_activities", "fitness", "sports", "community_chat"].includes(business.categoryId)) {
    return "Join";
  }

  if (business.categoryId === "volunteering") {
    return "Volunteer";
  }

  if (business.categoryId === "legal") {
    return "Request consult";
  }

  if (business.categoryId === "priests") {
    return "Book priest";
  }

  if (business.categoryId === "matchmaking") {
    return "View thread";
  }

  if ((business.serviceModes || []).some((mode) => mode.toLowerCase().includes("booking"))) {
    return "Book";
  }

  return "View details";
}

function renderStars(rating) {
  const rounded = Math.round(Number(rating || 0));
  return Array.from({ length: 5 }, (_, index) => `<span class="${index < rounded ? "is-filled" : ""}"></span>`).join("");
}

function renderSummary() {
  const cityLabel = cityInput?.value.trim() || "your city";
  const openCount = state.businesses.filter((business) => business.isOpen).length;
  const memberVerifiedCount = state.businesses.filter((business) =>
    (business.trustBadges || []).some((badge) => badge.toLowerCase().includes("verified"))
  ).length;

  if (resultsTitleNode) {
    resultsTitleNode.textContent = `${numberFormatter.format(state.businesses.length)} places near ${cityLabel}`;
  }

  if (mapTitleNode) {
    mapTitleNode.textContent = cityLabel;
  }

  summaryNode.innerHTML = `
    <div class="marketplace-summary-card">
      <strong>${numberFormatter.format(state.businesses.length)}</strong>
      <span>matching places</span>
    </div>
    <div class="marketplace-summary-card">
      <strong>${numberFormatter.format(openCount)}</strong>
      <span>open now</span>
    </div>
    <div class="marketplace-summary-card">
      <strong>${numberFormatter.format(memberVerifiedCount)}</strong>
      <span>verified by community</span>
    </div>
  `;
}

function renderResults() {
  if (!state.businesses.length) {
    resultsNode.innerHTML = `
      <article class="marketplace-empty">
        <h3>No places matched that search</h3>
        <p>Try another city, category, or service such as momo, photographer, social sewa, carpool, legal, sports, or events.</p>
      </article>
    `;
    return;
  }

  resultsNode.innerHTML = state.businesses
    .map((business) => {
      const tags = (business.tags || []).slice(0, 3);
      const trustBadges = (business.trustBadges || []).slice(0, 2);
      const distance = business.distanceMiles !== null ? `${business.distanceMiles} mi away` : business.neighborhood;

      return `
        <article class="marketplace-listing${business.id === state.activeBusinessId ? " is-active" : ""}" data-business-id="${escapeHtml(business.id)}">
          <a class="marketplace-listing-media" href="./business.html?slug=${encodeURIComponent(business.slug)}">
            <img src="${escapeHtml(business.image)}" alt="${escapeHtml(business.name)}" />
          </a>
          <div class="marketplace-listing-body">
            <div class="marketplace-listing-top">
              <div>
                <p class="label">${escapeHtml(business.category?.name || "Local service")}</p>
                <h3><a href="./business.html?slug=${encodeURIComponent(business.slug)}">${escapeHtml(business.name)}</a></h3>
              </div>
              <button class="marketplace-save" type="button" data-favorite-id="${escapeHtml(business.id)}" aria-label="Save ${escapeHtml(business.name)}">Save</button>
            </div>
            <div class="marketplace-rating-row">
              <span class="marketplace-stars" aria-hidden="true">${renderStars(business.rating)}</span>
              <strong>${Number(business.rating || 0).toFixed(1)}</strong>
              <span>${numberFormatter.format(business.reviewCount || 0)} reviews</span>
            </div>
            <p class="marketplace-listing-meta">${escapeHtml(distance || "")} | ${escapeHtml(business.address)} | ${business.isOpen ? "Open now" : "Closed"} | ${priceLabel(business.priceLevel)}</p>
            <div class="marketplace-chip-row">
              ${trustBadges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}
              ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
            <div class="marketplace-listing-actions">
              <a class="button primary" href="./business.html?slug=${encodeURIComponent(business.slug)}">${getBusinessActionLabel(business)}</a>
              <a class="button secondary" href="tel:${escapeHtml(business.phone)}">Call</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function getMapBounds() {
  const businesses = state.businesses.length ? state.businesses : (state.data.businesses || []);
  const lats = businesses.map((business) => business.lat).filter(Number.isFinite);
  const lngs = businesses.map((business) => business.lng).filter(Number.isFinite);

  if (!lats.length || !lngs.length) {
    return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
  }

  const latPadding = Math.max((Math.max(...lats) - Math.min(...lats)) * 0.18, 0.01);
  const lngPadding = Math.max((Math.max(...lngs) - Math.min(...lngs)) * 0.18, 0.01);

  return {
    minLat: Math.min(...lats) - latPadding,
    maxLat: Math.max(...lats) + latPadding,
    minLng: Math.min(...lngs) - lngPadding,
    maxLng: Math.max(...lngs) + lngPadding
  };
}

function getPinPosition(business, bounds) {
  const x = ((business.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = (1 - (business.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;

  return {
    x: Math.max(7, Math.min(93, x)),
    y: Math.max(9, Math.min(91, y))
  };
}

function renderMapPreview() {
  const business = state.businesses.find((item) => item.id === state.activeBusinessId) || state.businesses[0];

  if (!business) {
    mapPreviewNode.innerHTML = "";
    return;
  }

  mapPreviewNode.innerHTML = `
    <img src="${escapeHtml(business.image)}" alt="${escapeHtml(business.name)}" />
    <div>
      <strong>${escapeHtml(business.name)}</strong>
      <span>${Number(business.rating || 0).toFixed(1)} stars | ${escapeHtml(business.neighborhood)}</span>
      <a href="./business.html?slug=${encodeURIComponent(business.slug)}">View profile</a>
    </div>
  `;
}

function renderMap() {
  const bounds = getMapBounds();

  mapPinsNode.innerHTML = state.businesses
    .map((business, index) => {
      const position = getPinPosition(business, bounds);

      return `
        <button
          class="marketplace-map-pin${business.id === state.activeBusinessId ? " is-active" : ""}"
          style="left: ${position.x}%; top: ${position.y}%"
          type="button"
          data-pin-id="${escapeHtml(business.id)}"
          aria-label="${escapeHtml(business.name)}"
        >
          ${index + 1}
        </button>
      `;
    })
    .join("");

  renderMapPreview();
}

function setView(view) {
  state.view = view;
  document.body.classList.toggle("marketplace-map-view", view === "map");
  listToggle?.classList.toggle("is-active", view === "list");
  mapToggle?.classList.toggle("is-active", view === "map");

  if (view === "map") {
    mapPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function render() {
  filterBusinesses();
  renderSummary();
  renderResults();
  renderMap();
}

function setActiveBusiness(businessId) {
  state.activeBusinessId = businessId;
  renderResults();
  renderMap();
}

function getMemberToken() {
  return localStorage.getItem("sajilo_member_token") || localStorage.getItem("sajilo_token") || "";
}

async function saveBusiness(businessId) {
  const token = getMemberToken();

  if (!token) {
    window.location.href = "./account.html?type=member&next=marketplace";
    return;
  }

  try {
    await fetch(`/api/marketplace/businesses/${encodeURIComponent(businessId)}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    // Static preview cannot persist favorites, but the UI should stay usable.
  }
}

function bindEvents() {
  searchButton?.addEventListener("click", render);
  queryInput?.addEventListener("input", render);
  cityInput?.addEventListener("input", render);
  categorySelect?.addEventListener("change", render);

  document.querySelectorAll(".marketplace-filter").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.filter === "openNow") {
        state.filters.openNow = !state.filters.openNow;
        button.classList.toggle("is-active", state.filters.openNow);
      } else if (button.dataset.filter === "rating") {
        state.filters.rating = state.filters.rating ? "" : button.dataset.value || "4.5";
        button.classList.toggle("is-active", Boolean(state.filters.rating));
      } else if (button.dataset.serviceMode) {
        const mode = button.dataset.serviceMode;
        state.filters.serviceMode = state.filters.serviceMode === mode ? "" : mode;
        document.querySelectorAll("[data-service-mode]").forEach((item) => {
          item.classList.toggle("is-active", item.dataset.serviceMode === state.filters.serviceMode);
        });
      }

      render();
    });
  });

  resultsNode?.addEventListener("click", (event) => {
    const listing = event.target.closest("[data-business-id]");
    const favoriteButton = event.target.closest("[data-favorite-id]");

    if (favoriteButton) {
      event.preventDefault();
      saveBusiness(favoriteButton.dataset.favoriteId);
      favoriteButton.textContent = "Saved";
      favoriteButton.classList.add("is-saved");
      return;
    }

    if (listing) {
      setActiveBusiness(listing.dataset.businessId);
    }
  });

  mapPinsNode?.addEventListener("click", (event) => {
    const pin = event.target.closest("[data-pin-id]");

    if (pin) {
      setActiveBusiness(pin.dataset.pinId);
    }
  });

  listToggle?.addEventListener("click", () => setView("list"));
  mapToggle?.addEventListener("click", () => setView("map"));

  nearMeButton?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      nearMeButton.textContent = "Location unavailable";
      return;
    }

    nearMeButton.textContent = "Locating...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        nearMeButton.textContent = "Near me";
        render();
      },
      () => {
        nearMeButton.textContent = "Use city search";
      },
      { timeout: 8000 }
    );
  });
}

await loadMarketplaceData();
populateCategories();
applyInitialParams();
bindEvents();
render();

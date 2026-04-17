const rideCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const rideNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1
});

const DEFAULT_PICKUP = {
  address: "Current location unavailable",
  lat: 41.8781,
  lng: -87.6298
};

const LIVE_ETA_MINUTES = {
  tier_go: 4,
  tier_plus: 2,
  tier_exec: 6
};

let rideMap = null;

const rideState = {
  data: null,
  selectedTierId: null,
  transportMode: "drive",
  pickup: { ...DEFAULT_PICKUP },
  dropoff: null,
  route: null,
  destinationInput: "",
  messageDraft: "",
  messages: [
    { from: "driver", text: "I am nearby. Share an exact entrance if needed." }
  ],
  isLocating: true,
  isResolvingDestination: false,
  geolocationDenied: false,
  geolocationSupported: "geolocation" in navigator,
  status: "ready",
  statusMessage: ""
};

function rideFormatStatus(value) {
  if (!value) return "";
  return value.replaceAll("_", " ");
}

function rideEscapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function rideLocationLabel(address, fallback) {
  if (!address) return fallback;
  return address.split(",")[0] || fallback;
}

function rideFormatArrival(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function rideFormatCoordinate(value) {
  return Number(value || 0).toFixed(5);
}

function rideFormatDriveMinutes(value) {
  return value ? `${Math.max(1, Math.round(value))} min` : "--";
}

function rideFormatDistanceMiles(value) {
  return value ? `${rideNumberFormatter.format(value)} mi` : "--";
}

function rideTransportModes() {
  return [{ id: "drive", label: "Drive" }];
}

function rideRouteLineStyle() {
  return {
    color: "#1b74ff",
    weight: 7,
    opacity: 0.95
  };
}

function rideGetActiveTier(data = rideState.data) {
  if (!data?.rideshare?.serviceTiers?.length) return null;
  return (
    data.rideshare.serviceTiers.find((tier) => tier.id === rideState.selectedTierId) ||
    data.rideshare.serviceTiers[0]
  );
}

function rideRouteMetrics(tier) {
  const distanceMiles = rideState.route ? rideState.route.distanceMeters * 0.000621371 : 0;
  const durationMinutes = rideState.route ? rideState.route.durationSeconds / 60 : 0;
  const etaMinutes = LIVE_ETA_MINUTES[tier.id] || 5;

  return {
    distanceMiles,
    durationMinutes,
    etaMinutes,
    arrivalTime: rideFormatArrival(etaMinutes),
    estimatedFare: Math.max(
      tier.minimumFare || 0,
      (tier.baseFare || 0) +
        (tier.bookingFee || 0) +
        distanceMiles * (tier.perMile || 0) +
        durationMinutes * (tier.perMinute || 0)
    )
  };
}

async function rideReverseGeocode(lat, lng) {
  const response = await fetch(
    `/api/location/reverse?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const payload = await response.json();
  return payload.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

async function rideGeocodeDestination(query) {
  const response = await fetch(`/api/location/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Destination lookup failed");
  }

  return response.json();
}

async function rideFetchRoute(pickup, dropoff) {
  const response = await fetch(
    `/api/rideshare/route?pickupLat=${encodeURIComponent(pickup.lat)}&pickupLng=${encodeURIComponent(pickup.lng)}&dropoffLat=${encodeURIComponent(dropoff.lat)}&dropoffLng=${encodeURIComponent(dropoff.lng)}`
  );

  if (!response.ok) {
    throw new Error("Route lookup failed");
  }

  return response.json();
}

function renderRideStatusBanner(status, message) {
  const container = document.querySelector("#ride-main-container");
  if (!container) return;

  let banner = document.querySelector("#ride-status-banner");

  if (!message) {
    if (banner) banner.remove();
    return;
  }

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "ride-status-banner";
    container.insertBefore(banner, container.firstChild);
  }

  const bgColor = status === "searching" ? "#fff9c4" : status === "confirmed" ? "#c8e6c9" : status === "error" ? "#ffe3e3" : "#e7f1ff";
  const textColor = status === "searching" ? "#8d6e00" : status === "confirmed" ? "#2e7d32" : status === "error" ? "#a61e1e" : "#1256a3";
  const icon = status === "searching" ? "Live" : status === "confirmed" ? "Ready" : status === "error" ? "Notice" : "Live";

  banner.innerHTML = `
    <div style="background: ${bgColor}; color: ${textColor}; padding: 16px 24px; border-radius: 12px; margin-top: 24px; display: flex; align-items: center; justify-content: space-between; font-weight: 700; box-shadow: var(--shadow-sm);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em;">${icon}</span>
        <span>${rideEscapeHtml(message)}</span>
      </div>
      ${status === "searching" ? '<div class="map-pulse" style="width: 10px; height: 10px;"></div>' : ""}
    </div>
  `;
}

function renderRealMap() {
  const mapContainer = document.querySelector("#ride-map-view");
  if (!mapContainer) return;

  mapContainer.innerHTML = '<div id="map" style="width: 100%; height: 100%; border-radius: 24px;"></div>';

  if (rideMap) {
    rideMap.remove();
    rideMap = null;
  }

  const pickup = [rideState.pickup.lat, rideState.pickup.lng];
  rideMap = L.map("map", {
    zoomControl: false,
    attributionControl: false
  }).setView(pickup, 13);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19
  }).addTo(rideMap);

  const pickupIcon = L.divIcon({
    className: "custom-div-icon",
    html: '<div style="background-color: #0b856f; width: 14px; height: 14px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  L.marker(pickup, { icon: pickupIcon })
    .addTo(rideMap)
    .bindTooltip("PICKUP", { permanent: true, direction: "top", className: "map-label" });

  let bounds = L.latLngBounds([pickup]);

  if (rideState.dropoff) {
    const dropoff = [rideState.dropoff.lat, rideState.dropoff.lng];
    const dropoffIcon = L.divIcon({
      className: "custom-div-icon",
      html: '<div style="background-color: var(--accent); width: 12px; height: 12px; border: 3px solid white; border-radius: 2px; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    L.marker(dropoff, { icon: dropoffIcon })
      .addTo(rideMap)
      .bindTooltip("DESTINATION", { permanent: true, direction: "top", className: "map-label" });

    const coordinates =
      rideState.route?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || [pickup, dropoff];

    const path = L.polyline(coordinates, rideRouteLineStyle()).addTo(rideMap);

    bounds = path.getBounds();
  }

  rideMap.fitBounds(bounds.pad(0.2), { padding: [50, 50], maxZoom: 15 });
  L.control.zoom({ position: "topright" }).addTo(rideMap);

  if (rideState.route) {
    const telemetry = L.control({ position: "bottomleft" });

    telemetry.onAdd = function onAdd() {
      const div = L.DomUtil.create("div", "ride-map-telemetry");
      div.innerHTML = `
        <div class="ride-map-telemetry-card">
          <span>LIVE ROUTE</span>
          <strong>${rideFormatDistanceMiles(rideState.route.distanceMeters * 0.000621371)}</strong>
          <small>${rideFormatDriveMinutes(rideState.route.durationSeconds / 60)} drive time</small>
        </div>
      `;
      return div;
    };

    telemetry.addTo(rideMap);
  }
}

function renderMapToolbar() {
  const mapView = document.querySelector("#ride-map-view");
  if (!mapView) return;

  const toolbar = document.createElement("div");
  toolbar.className = "ride-map-modebar";
  toolbar.innerHTML = `
    ${rideTransportModes()
      .map(
        (mode) => `
      <button
        type="button"
        class="ride-mode-chip ${rideState.transportMode === mode.id ? "is-active" : ""}"
        data-transport-mode="${rideEscapeHtml(mode.id)}"
      >
        ${rideEscapeHtml(mode.label)}
      </button>
    `
      )
      .join("")}
  `;
  mapView.appendChild(toolbar);
}

function renderRidePage(data = rideState.data) {
  if (!data?.rideshare?.serviceTiers?.length) return;

  rideState.data = data;
  if (!rideState.selectedTierId) {
    rideState.selectedTierId = data.rideshare.serviceTiers[0].id;
  }

  const currentTier = rideGetActiveTier(data);
  const currentMetrics = rideRouteMetrics(currentTier);
  const activeDriver = data.users.drivers.find((driver) => driver.id === "driver_002") || data.users.drivers[0];
  const activeVehicle = data.rideshare.vehicles.find((vehicle) => vehicle.id === "veh_002") || data.rideshare.vehicles[0];
  const safetyEvent = data.rideshare.safetyEvents[0];
  const pickupShort = rideLocationLabel(rideState.pickup.address, "Current location");
  const dropoffShort = rideLocationLabel(rideState.dropoff?.address, "Set destination");
  const pickupStatusText = rideState.isLocating
    ? "Detecting your current location..."
    : rideState.geolocationDenied
      ? "Fallback pickup in use"
      : "";

  const sidebarEl = document.querySelector("#ride-selection-sidebar");
  if (sidebarEl) {
    sidebarEl.innerHTML = `
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 1.8rem; font-weight: 900; margin-bottom: 8px;">Where to?</h2>
        <div style="background: linear-gradient(180deg, #f5f8fc, #eef4fb); padding: 14px; border-radius: 14px; display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; border: 1px solid #d9e6f5;">
          <div style="width: 8px; height: 8px; background: #0b856f; border-radius: 50%;"></div>
          <div style="min-width: 0;">
            <span style="font-weight: 700; color: #111; display: block;">${rideEscapeHtml(pickupShort)}</span>
            ${pickupStatusText ? `<span style="font-size: 0.78rem; color: #5f7187; display: block; margin-top: 4px;">${rideEscapeHtml(pickupStatusText)}</span>` : ""}
            <span style="font-size: 0.72rem; color: #7b8b9e; display: block; margin-top: 6px;">LAT ${rideFormatCoordinate(rideState.pickup.lat)} | LNG ${rideFormatCoordinate(rideState.pickup.lng)}</span>
          </div>
        </div>
        <form id="ride-destination-form">
          <div style="background: linear-gradient(180deg, #f5f8fc, #eef4fb); padding: 14px; border-radius: 14px; display: flex; align-items: flex-start; gap: 12px; border: 1px solid #d9e6f5;">
            <div style="width: 8px; height: 8px; background: var(--accent); border-radius: 2px;"></div>
            <div style="flex: 1;">
              <input id="ride-destination-input" type="text" placeholder="Enter destination" value="${rideEscapeHtml(rideState.destinationInput)}" style="width: 100%; border: 0; background: transparent; padding: 0; font: inherit; font-weight: 700; color: #111; outline: none;" />
              ${rideState.dropoff ? `<span style="font-size: 0.72rem; color: #7b8b9e; display: block; margin-top: 6px;">LAT ${rideFormatCoordinate(rideState.dropoff.lat)} | LNG ${rideFormatCoordinate(rideState.dropoff.lng)}</span>` : ""}
            </div>
            <button type="submit" class="button secondary" style="border-radius: 999px; padding: 10px 16px; height: auto;" ${rideState.isResolvingDestination ? "disabled" : ""}>${rideState.isResolvingDestination ? "Loading..." : "Update"}</button>
          </div>
        </form>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px;">
          <div class="ride-digital-metric">
            <span>ROUTE</span>
            <strong>${rideFormatDistanceMiles(currentMetrics.distanceMiles)}</strong>
            <small>Total miles</small>
          </div>
          <div class="ride-digital-metric">
            <span>DRIVE</span>
            <strong>${rideFormatDriveMinutes(currentMetrics.durationMinutes)}</strong>
            <small>Estimated trip</small>
          </div>
          <div class="ride-digital-metric">
            <span>ARRIVAL</span>
            <strong>${rideState.route ? currentMetrics.arrivalTime : "--:--"}</strong>
            <small>Driver ETA</small>
          </div>
        </div>
      </div>

      <div style="flex-grow: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <p class="label" style="margin: 0;">Sajilo Selection</p>
          <span style="font-size: 0.74rem; font-weight: 800; letter-spacing: 0.08em; color: #5f7187;">LIVE PRICING</span>
        </div>
        <div class="ride-choice-container">
          ${data.rideshare.serviceTiers.map((tier) => {
            const metrics = rideRouteMetrics(tier);
            const isActive = tier.id === currentTier.id;
            const icon = tier.id === "tier_plus" ? "PLUS" : tier.id === "tier_exec" ? "EXEC" : "GO";
            return `
              <button type="button" class="ride-choice-card ${isActive ? "is-active" : ""}" data-tier-id="${rideEscapeHtml(tier.id)}" style="width: 100%; text-align: left; cursor: pointer;">
                <div style="display: flex; gap: 16px; align-items: center;">
                  <div style="font-size: 0.95rem; font-weight: 900; color: #1b74ff; min-width: 44px;">${icon}</div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <strong style="font-size: 1.1rem;">${rideEscapeHtml(tier.name)}</strong>
                      ${tier.id === "tier_go" ? '<span class="ride-badge-cheapest">Wait & Save</span>' : tier.id === "tier_plus" ? '<span class="ride-badge-fastest">Priority</span>' : ""}
                    </div>
                    <span style="font-size: 0.85rem; color: #5f7187;">${metrics.etaMinutes} min away • ${rideFormatDistanceMiles(metrics.distanceMiles)} • ${tier.capacity} seats</span>
                  </div>
                </div>
                <strong style="font-size: 1.1rem;">${rideState.route ? rideCurrencyFormatter.format(metrics.estimatedFare) : "Set route"}</strong>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <div style="margin-top: 32px; border-top: 1px solid #eee; padding-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.2rem;">💳</span>
            <strong style="font-size: 0.95rem;">Visa **** 4242</strong>
          </div>
          <span style="color: #1b74ff; font-weight: 700; font-size: 0.9rem; cursor: pointer;">${rideState.route ? `${Math.max(1, Math.round(currentMetrics.durationMinutes))} min` : "Ready"}</span>
        </div>
        <button id="request-ride-btn" class="button primary" style="width: 100%; background: #111; border-radius: 12px; font-size: 1.1rem; height: 56px;" ${rideState.route ? "" : "disabled"}>${rideState.status === "confirmed" ? "Trip Confirmed" : `Request ${rideEscapeHtml(currentTier.name)}`}</button>
      </div>
    `;
  }

  renderRealMap();
  renderMapToolbar();

  const mapView = document.querySelector("#ride-map-view");
  if (mapView && activeDriver && activeVehicle && rideState.dropoff) {
    const float = document.createElement("div");
    float.className = "ride-map-float";
    float.style.cssText = "position: absolute; bottom: 24px; right: 24px; background: rgba(7, 15, 28, 0.92); color: white; padding: 18px; border-radius: 18px; box-shadow: var(--shadow-lg); z-index: 1000; display: grid; gap: 14px; border: 1px solid rgba(255,255,255,0.12); min-width: 320px; backdrop-filter: blur(10px);";
    float.innerHTML = `
       <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px;">
         <div style="display: flex; align-items: center; gap: 14px;">
           <div style="width: 52px; height: 52px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.12);">
             <img src="https://i.pravatar.cc/100?u=${rideEscapeHtml(activeDriver.id)}" style="width: 100%; height: 100%; object-fit: cover;" />
           </div>
           <div>
             <strong style="display: block; font-size: 1.05rem;">${rideEscapeHtml(activeDriver.fullName)}</strong>
             <span style="display: block; font-size: 0.78rem; color: rgba(255,255,255,0.68); margin-top: 3px;">${rideEscapeHtml(`${activeVehicle.color || "Silver"} ${activeVehicle.make || ""} ${activeVehicle.model || "Camry"}`)}</span>
           </div>
         </div>
         <div style="text-align: right;">
           <strong style="display: block; font-size: 0.98rem;">${rideEscapeHtml(activeVehicle.plateNumber || "ABC-123")}</strong>
           <span style="display: block; font-size: 0.75rem; color: rgba(255,255,255,0.68); margin-top: 3px;">LIVE UNIT</span>
         </div>
       </div>
       <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
         <div class="ride-map-float-metric">
           <span>RATING</span>
           <strong>${rideEscapeHtml(String(activeDriver.rating || "4.9"))}</strong>
         </div>
         <div class="ride-map-float-metric">
           <span>ETA</span>
           <strong>${currentMetrics.etaMinutes} min</strong>
         </div>
         <div class="ride-map-float-metric">
           <span>FARE</span>
           <strong>${rideState.route ? rideCurrencyFormatter.format(currentMetrics.estimatedFare) : "--"}</strong>
         </div>
       </div>
    `;
    mapView.appendChild(float);
  }

  const bookingGridEl = document.querySelector("#ride-booking-grid");
  if (bookingGridEl) {
    bookingGridEl.innerHTML = `
      <article class="home-service-card" style="background: white; padding: 32px;">
        <p class="label" style="margin-bottom: 16px;">BOOKING SNAPSHOT</p>
        <h3 style="padding: 0; margin-bottom: 24px;">Your Trip</h3>
        <div class="ride-info-list" style="display: grid; gap: 16px;">
          <div style="background: linear-gradient(180deg, #f8fbff, #eff5fd); padding: 12px 16px; border-radius: 12px; border: 1px solid #dde8f5;">
            <span style="font-size: 0.8rem; color: #5f7187; display: block;">PICKUP</span>
            <strong style="color: #111; font-size: 0.95rem;">${rideEscapeHtml(pickupShort)}</strong>
            <span style="display: block; font-size: 0.72rem; color: #7b8b9e; margin-top: 6px;">LAT ${rideFormatCoordinate(rideState.pickup.lat)} | LNG ${rideFormatCoordinate(rideState.pickup.lng)}</span>
          </div>
          <div style="background: linear-gradient(180deg, #f8fbff, #eff5fd); padding: 12px 16px; border-radius: 12px; border: 1px solid #dde8f5;">
            <span style="font-size: 0.8rem; color: #5f7187; display: block;">DESTINATION</span>
            <strong style="color: #111; font-size: 0.95rem;">${rideEscapeHtml(dropoffShort)}</strong>
            <span style="display: block; font-size: 0.72rem; color: #7b8b9e; margin-top: 6px;">${rideState.dropoff ? `LAT ${rideFormatCoordinate(rideState.dropoff.lat)} | LNG ${rideFormatCoordinate(rideState.dropoff.lng)}` : "Destination not yet locked"}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
            <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
              <span style="font-size: 0.8rem; color: #777; display: block;">EST. FARE</span>
              <strong style="color: #111;">${rideState.route ? rideCurrencyFormatter.format(currentMetrics.estimatedFare) : "Set route"}</strong>
            </div>
            <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
              <span style="font-size: 0.8rem; color: #777; display: block;">ARRIVAL</span>
              <strong style="color: #111;">${rideState.route ? currentMetrics.arrivalTime : "--:--"}</strong>
            </div>
            <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
              <span style="font-size: 0.8rem; color: #777; display: block;">DISTANCE</span>
              <strong style="color: #111;">${rideFormatDistanceMiles(currentMetrics.distanceMiles)}</strong>
            </div>
            <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
              <span style="font-size: 0.8rem; color: #777; display: block;">DURATION</span>
              <strong style="color: #111;">${rideFormatDriveMinutes(currentMetrics.durationMinutes)}</strong>
            </div>
          </div>
        </div>
      </article>

      <article class="home-service-card" style="background: white; padding: 32px;">
        <p class="label" style="margin-bottom: 16px;">DRIVER & VEHICLE</p>
        <h3 style="padding: 0; margin-bottom: 24px;">${rideEscapeHtml(activeDriver?.fullName || "Assigned Driver")}</h3>
        <div class="ride-info-list" style="display: grid; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #eee; overflow: hidden;">
              <img src="https://i.pravatar.cc/100?u=${rideEscapeHtml(activeDriver?.id || "driver")}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <strong style="display: block; font-size: 1.1rem;">${rideEscapeHtml(activeDriver?.fullName || "Jorge Alvarez")}</strong>
              <span style="color: #0b856f; font-weight: 700; font-size: 0.9rem;">★ ${rideEscapeHtml(String(activeDriver?.rating || "4.9"))} Verified Driver</span>
            </div>
          </div>
          <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="font-size: 0.8rem; color: #777; display: block;">VEHICLE</span>
            <strong style="color: #111;">${rideEscapeHtml(activeVehicle ? `${activeVehicle.color} ${activeVehicle.make} ${activeVehicle.model}` : "Silver Toyota Camry")}</strong>
          </div>
          <div style="background: #111; color: white; padding: 12px 16px; border-radius: 12px; text-align: center;">
            <span style="font-size: 0.8rem; color: rgba(255,255,255,0.6); display: block;">PLATE NUMBER</span>
            <strong style="letter-spacing: 2px; font-size: 1.2rem;">${rideEscapeHtml(activeVehicle?.plateNumber || "SJL-2041")}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button type="button" class="button secondary ride-driver-contact" style="width: 100%; border-radius: 12px;" data-contact-action="call">Call Driver</button>
            <button type="button" class="button secondary ride-driver-contact" style="width: 100%; border-radius: 12px;" data-contact-action="message">Message</button>
          </div>
          <div class="ride-message-card">
            <div class="ride-message-feed">
              ${rideState.messages
                .slice(-2)
                .map(
                  (message) => `
                <div class="ride-message-bubble ${message.from === "user" ? "is-user" : ""}">
                  <span>${rideEscapeHtml(message.from === "user" ? "You" : activeDriver?.fullName || "Driver")}</span>
                  <strong>${rideEscapeHtml(message.text)}</strong>
                </div>
              `
                )
                .join("")}
            </div>
            <form id="ride-message-form" class="ride-message-form">
              <input id="ride-message-input" type="text" placeholder="Message driver" value="${rideEscapeHtml(rideState.messageDraft)}" />
              <button type="submit" class="button primary">Send</button>
            </form>
          </div>
        </div>
      </article>

      <article class="home-service-card" style="background: white; padding: 32px;">
        <p class="label" style="margin-bottom: 16px;">LIVE SYSTEM</p>
        <h3 style="padding: 0; margin-bottom: 24px;">Trip Telemetry</h3>
        <div class="ride-steps-stack" style="display: grid; gap: 12px;">
          <div class="ride-system-row">
            <span>Route status</span>
            <strong>${rideState.route ? "Locked" : "Awaiting destination"}</strong>
          </div>
          <div class="ride-system-row">
            <span>Pickup source</span>
            <strong>${rideState.geolocationDenied ? "Fallback" : "Device GPS"}</strong>
          </div>
          <div class="ride-system-row">
            <span>Map feed</span>
            <strong>Live digital</strong>
          </div>
          <div class="ride-system-row">
            <span>Driver unit</span>
            <strong>${rideEscapeHtml(activeVehicle?.plateNumber || "SJL-2041")}</strong>
          </div>
        </div>
      </article>
    `;
  }

  const tierGridEl = document.querySelector("#ride-tier-grid");
  if (tierGridEl) {
    tierGridEl.innerHTML = data.rideshare.serviceTiers
      .map((tier) => {
        const metrics = rideRouteMetrics(tier);
        const isActive = tier.id === currentTier.id;
        return `
          <article class="home-service-card" style="background: white; border: ${isActive ? "2px solid #1b74ff" : "1px solid var(--line)"};">
            <div style="padding: 24px;">
              <p class="label" style="color: ${isActive ? "#1b74ff" : "var(--muted)"}; margin-bottom: 8px;">
                ${isActive ? "CURRENT CHOICE" : "RIDE OPTION"}
              </p>
              <h3 style="padding: 0; font-size: 1.6rem; font-weight: 900;">${rideEscapeHtml(tier.name)}</h3>
              <p style="color: var(--muted); margin-bottom: 24px;">${tier.capacity} seats with clear upfront fare logic.</p>
              
              <div style="display: grid; gap: 8px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                  <span style="color: #777;">ETA</span>
                  <strong style="color: #111;">${metrics.etaMinutes} min</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                  <span style="color: #777;">Estimated Fare</span>
                  <strong style="color: #111;">${rideState.route ? rideCurrencyFormatter.format(metrics.estimatedFare) : "Set route"}</strong>
                </div>
              </div>
              
              <button class="button ${isActive ? "primary" : "secondary"} ride-tier-select" data-tier-id="${rideEscapeHtml(tier.id)}" style="width: 100%; border-radius: 8px; ${isActive ? "background: #1b74ff; border: none;" : ""}">
                Select ${rideEscapeHtml(tier.name)}
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const safetyGridEl = document.querySelector("#ride-safety-grid");
  if (safetyGridEl) {
    safetyGridEl.innerHTML = `
      <article class="home-service-card" style="background: white; padding: 32px;">
        <p class="label" style="margin-bottom: 16px;">SAFETY VISIBILITY</p>
        <h3 style="padding: 0; margin-bottom: 24px;">Built-in Trust</h3>
        <div style="display: grid; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="color: #1b74ff; font-weight: 900;">✓</span>
            <span style="font-weight: 700; color: #111;">${rideNumberFormatter.format(data.users.drivers.length)} Verified Drivers</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="color: #1b74ff; font-weight: 900;">✓</span>
            <span style="font-weight: 700; color: #111;">${rideState.route ? "Live route calculated" : "Waiting for route input"}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="color: #1b74ff; font-weight: 900;">✓</span>
            <span style="font-weight: 700; color: #111;">Real-time Trip Sharing</span>
          </div>
        </div>
      </article>
      <article class="home-service-card" style="background: #111; color: white; padding: 32px; border: none;">
        <p class="label" style="color: rgba(255,255,255,0.6); margin-bottom: 16px;">RECENT SAFETY LOG</p>
        <h3 style="padding: 0; color: white; margin-bottom: 16px;">${rideEscapeHtml(safetyEvent ? rideFormatStatus(safetyEvent.eventType) : "Trip Sharing")}</h3>
        <p style="color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 24px;">Pickup comes from the browser location API and your route is calculated from live map data after you enter a destination.</p>
        <span style="color: #0b856f; font-weight: 800; font-size: 0.9rem;">● MONITORING ACTIVE</span>
      </article>
    `;
  }

  setupRideInteractions();
}

async function handleDestinationSubmit(event) {
  event.preventDefault();

  const input = document.querySelector("#ride-destination-input");
  const query = input?.value.trim();
  rideState.destinationInput = query || "";

  if (!query) {
    rideState.status = "error";
    rideState.statusMessage = "Enter a destination to calculate the trip.";
    renderRideStatusBanner(rideState.status, rideState.statusMessage);
    renderRidePage();
    return;
  }

  rideState.isResolvingDestination = true;
  rideState.status = "searching";
  rideState.statusMessage = "Looking up your destination and calculating the route...";
  renderRideStatusBanner(rideState.status, rideState.statusMessage);
  renderRidePage();

  try {
    const dropoff = await rideGeocodeDestination(query);
    const route = await rideFetchRoute(rideState.pickup, dropoff);
    rideState.dropoff = dropoff;
    rideState.route = route;
    rideState.destinationInput = dropoff.address;
    rideState.status = "ready";
    rideState.statusMessage = `Route updated to ${rideLocationLabel(dropoff.address, "destination")}.`;
  } catch (error) {
    rideState.status = "error";
    rideState.statusMessage = error.message || "Unable to calculate the route right now.";
  } finally {
    rideState.isResolvingDestination = false;
    renderRideStatusBanner(rideState.status, rideState.statusMessage);
    renderRidePage();
  }
}

function handleTierSelection(event) {
  const card = event.target.closest("[data-tier-id]");
  if (!card) return;
  rideState.selectedTierId = card.dataset.tierId;
  renderRidePage();
}

function handleTransportModeSelection(event) {
  const modeButton = event.target.closest("[data-transport-mode]");
  if (!modeButton) return;

  rideState.transportMode = modeButton.dataset.transportMode;

  if (rideState.transportMode !== "drive") {
    rideState.status = "ready";
    rideState.statusMessage = `${rideTransportModes().find((mode) => mode.id === rideState.transportMode)?.label || "Selected"} view selected. Live route metrics still use drive data.`;
    renderRideStatusBanner(rideState.status, rideState.statusMessage);
  } else if (rideState.route) {
    rideState.status = "ready";
    rideState.statusMessage = "Drive view selected. Live route metrics are active.";
    renderRideStatusBanner(rideState.status, rideState.statusMessage);
  }

  renderRidePage();
}

function handleRideRequest() {
  const tier = rideGetActiveTier();
  if (!rideState.route || !rideState.dropoff || !tier) {
    rideState.status = "error";
    rideState.statusMessage = "Set a destination first so we can build your live trip.";
    renderRideStatusBanner(rideState.status, rideState.statusMessage);
    return;
  }

  rideState.status = "confirmed";
  rideState.statusMessage = `Driver found. Your ${tier.name} ride is on the way.`;
  renderRideStatusBanner(rideState.status, rideState.statusMessage);
  renderRidePage();
}

function handleDriverContact(event) {
  const actionButton = event.target.closest("[data-contact-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.contactAction;
  rideState.status = "ready";
  rideState.statusMessage =
    action === "call"
      ? "Driver call action opened. Connect with your driver directly from the app."
      : "Message panel ready. Send a quick note to your driver below.";
  renderRideStatusBanner(rideState.status, rideState.statusMessage);
}

function handleMessageSubmit(event) {
  event.preventDefault();

  const input = document.querySelector("#ride-message-input");
  const text = input?.value.trim();
  if (!text) return;

  rideState.messages.push({ from: "user", text });
  rideState.messageDraft = "";
  rideState.status = "ready";
  rideState.statusMessage = "Message sent to your driver.";
  renderRideStatusBanner(rideState.status, rideState.statusMessage);
  renderRidePage();
}

function handleMessageInput(event) {
  rideState.messageDraft = event.target.value;
}

function setupRideInteractions() {
  const destinationForm = document.querySelector("#ride-destination-form");
  if (destinationForm) {
    destinationForm.addEventListener("submit", handleDestinationSubmit);
  }

  document.querySelectorAll("[data-tier-id]").forEach((node) => {
    node.addEventListener("click", handleTierSelection);
  });

  const requestBtn = document.querySelector("#request-ride-btn");
  if (requestBtn) {
    requestBtn.addEventListener("click", handleRideRequest);
  }

  document.querySelectorAll("[data-transport-mode]").forEach((node) => {
    node.addEventListener("click", handleTransportModeSelection);
  });

  document.querySelectorAll("[data-contact-action]").forEach((node) => {
    node.addEventListener("click", handleDriverContact);
  });

  const messageForm = document.querySelector("#ride-message-form");
  if (messageForm) {
    messageForm.addEventListener("submit", handleMessageSubmit);
  }

  const messageInput = document.querySelector("#ride-message-input");
  if (messageInput) {
    messageInput.addEventListener("input", handleMessageInput);
  }
}

async function initializeRideLocation() {
  if (!rideState.geolocationSupported) {
    rideState.isLocating = false;
    rideState.status = "error";
    rideState.statusMessage = "Browser geolocation is unavailable. Using fallback pickup.";
    renderRideStatusBanner(rideState.status, rideState.statusMessage);
    renderRidePage();
    return;
  }

  renderRideStatusBanner("searching", "Requesting your current location...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        rideState.pickup = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: await rideReverseGeocode(position.coords.latitude, position.coords.longitude)
        };
        rideState.status = "ready";
        rideState.statusMessage = "Current location detected. Enter your destination.";
      } catch (error) {
        rideState.pickup = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
        };
        rideState.status = "error";
        rideState.statusMessage = "Current coordinates were detected, but address lookup failed.";
      } finally {
        rideState.isLocating = false;
        renderRideStatusBanner(rideState.status, rideState.statusMessage);
        renderRidePage();
      }
    },
    () => {
      rideState.isLocating = false;
      rideState.geolocationDenied = true;
      rideState.status = "error";
      rideState.statusMessage = "Location permission was denied. Using fallback pickup.";
      renderRideStatusBanner(rideState.status, rideState.statusMessage);
      renderRidePage();
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000
    }
  );
}

if (window.SAJILO_SEED_DATA) {
  rideState.data = window.SAJILO_SEED_DATA;
  rideState.selectedTierId = window.SAJILO_SEED_DATA.rideshare.serviceTiers?.[0]?.id || null;
  renderRidePage(window.SAJILO_SEED_DATA);
  initializeRideLocation();
}

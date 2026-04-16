const rideCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const rideNumberFormatter = new Intl.NumberFormat("en-US");

function rideFormatStatus(value) {
  if (!value) return "";
  return value.replaceAll("_", " ");
}

let rideMap = null;

function renderRealMap(activeRequest) {
  const mapContainer = document.querySelector("#ride-map-view");
  if (!mapContainer) return;

  // Destroy previous instance if exists
  if (rideMap) {
    rideMap.remove();
    rideMap = null;
  }

  // Clear previous mock content
  mapContainer.innerHTML = '<div id="map" style="width: 100%; height: 100%; border-radius: 24px;"></div>';

  const pickup = [activeRequest.pickup.lat, activeRequest.pickup.lng];
  const dropoff = [activeRequest.dropoff.lat, activeRequest.dropoff.lng];

  // Initialize Leaflet map
  rideMap = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView(pickup, 13);

  // Add high-quality clean map tiles (Stamen Toner Lite style or similar CartoDB)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(rideMap);

  // Add Pickup Marker
  const pickupIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #0b856f; width: 14px; height: 14px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  L.marker(pickup, { icon: pickupIcon }).addTo(rideMap)
    .bindTooltip("PICKUP", { permanent: true, direction: 'top', className: 'map-label' });

  // Add Dropoff Marker
  const dropoffIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: var(--accent); width: 12px; height: 12px; border: 3px solid white; border-radius: 2px; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
  L.marker(dropoff, { icon: dropoffIcon }).addTo(rideMap)
    .bindTooltip("DESTINATION", { permanent: true, direction: 'top', className: 'map-label' });

  // Draw Route Polyline
  const path = L.polyline([pickup, dropoff], {
    color: '#1b74ff',
    weight: 5,
    opacity: 0.7,
    dashArray: '1, 10'
  }).addTo(rideMap);

  // Fit bounds to show both points
  rideMap.fitBounds(path.getBounds(), { padding: [50, 50] });

  // Add Zoom control to top right
  L.control.zoom({ position: 'topright' }).addTo(rideMap);
}

function renderRideStatusBanner(status, message) {
  const container = document.querySelector("#ride-main-container");
  let banner = document.querySelector("#ride-status-banner");
  
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "ride-status-banner";
    container.insertBefore(banner, container.firstChild);
  }

  const bgColor = status === "searching" ? "#fff9c4" : status === "confirmed" ? "#c8e6c9" : "#f5f5f5";
  const textColor = status === "searching" ? "#f57f17" : status === "confirmed" ? "#2e7d32" : "#616161";

  banner.innerHTML = `
    <div style="background: ${bgColor}; color: ${textColor}; padding: 16px 24px; border-radius: 12px; margin-top: 24px; display: flex; align-items: center; justify-content: space-between; font-weight: 700; box-shadow: var(--shadow-sm); animation: rise 0.3s ease;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.2rem;">${status === "searching" ? "🔍" : "✅"}</span>
        <span>${message}</span>
      </div>
      ${status === "searching" ? '<div class="map-pulse" style="width: 10px; height: 10px;"></div>' : ""}
    </div>
  `;
}

function setupRideInteractions(data) {
  const requestBtn = document.querySelector("#request-ride-btn");
  if (!requestBtn) return;

  requestBtn.addEventListener("click", () => {
    requestBtn.disabled = true;
    requestBtn.innerText = "Searching...";
    
    renderRideStatusBanner("searching", "Finding your driver in Chicago...");

    // Simulate finding a driver
    setTimeout(() => {
      renderRideStatusBanner("confirmed", "Driver found! Jorge is on his way in a Silver Toyota Camry.");
      requestBtn.innerText = "Trip Confirmed";
      
      // Update data to simulate a confirmed trip
      if (data.rideshare.trips.length > 0) {
        data.rideshare.trips[0].status = "in_progress";
        renderRidePage(data);
        setupRideInteractions(data); // Re-bind events after re-render
      }
    }, 2500);
  });
}

function renderRidePage(data) {
  const trips = data.rideshare.trips || [];
  const requests = data.rideshare.rideRequests || [];
  const currentTrip = trips.find((trip) => trip.status === "in_progress") || trips[0];
  const activeRequest = requests[0];
  const currentTier = data.rideshare.serviceTiers.find((tier) => tier.id === currentTrip?.tierId) || data.rideshare.serviceTiers[0];
  const activeDriver = data.users.drivers.find((driver) => driver.id === currentTrip?.driverId) || data.users.drivers[0];
  const activeVehicle = data.rideshare.vehicles.find((vehicle) => vehicle.id === currentTrip?.vehicleId);
  const safetyEvent = data.rideshare.safetyEvents[0];

  if (!activeRequest) {
    console.warn("No active ride requests found in seed data.");
    return;
  }

  // 1. Render the Sidebar (Ride Choices)
  const sidebarEl = document.querySelector("#ride-selection-sidebar");
  if (sidebarEl) {
    sidebarEl.innerHTML = `
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 1.8rem; font-weight: 900; margin-bottom: 8px;">Where to?</h2>
        <div style="background: #f3f3f3; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="width: 8px; height: 8px; background: #0b856f; border-radius: 50%;"></div>
          <span style="font-weight: 600; color: #111;">${activeRequest.pickup.address.split(",")[0]}</span>
        </div>
        <div style="background: #f3f3f3; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: var(--accent); border-radius: 2px;"></div>
          <span style="font-weight: 600; color: #111;">${activeRequest.dropoff.address.split(",")[0]}</span>
        </div>
      </div>

      <div style="flex-grow: 1;">
        <p class="label" style="margin-bottom: 16px;">Sajilo Selection</p>
        <div class="ride-choice-container">
          ${data.rideshare.serviceTiers.map((tier, idx) => `
            <div class="ride-choice-card ${idx === 0 ? "is-active" : ""}">
              <div style="display: flex; gap: 16px; align-items: center;">
                <div style="font-size: 1.8rem;">${tier.name.includes("Plus") ? "✨" : tier.name.includes("XL") ? "🚐" : "🚗"}</div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <strong style="font-size: 1.1rem;">${tier.name}</strong>
                    ${idx === 0 ? '<span class="ride-badge-cheapest">Wait & Save</span>' : idx === 1 ? '<span class="ride-badge-fastest">Priority</span>' : ""}
                  </div>
                  <span style="font-size: 0.85rem; color: #777;">${idx === 0 ? "4" : idx === 1 ? "2" : "6"} min away • 👤 ${tier.capacity}</span>
                </div>
              </div>
              <strong style="font-size: 1.1rem;">${rideCurrencyFormatter.format(activeRequest.estimatedFare * (1 + idx * 0.4))}</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <div style="margin-top: 32px; border-top: 1px solid #eee; padding-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.2rem;">💳</span>
            <strong style="font-size: 0.95rem;">Visa **** 4242</strong>
          </div>
          <span style="color: #1b74ff; font-weight: 700; font-size: 0.9rem; cursor: pointer;">Switch</span>
        </div>
        <button id="request-ride-btn" class="button primary" style="width: 100%; background: #111; border-radius: 12px; font-size: 1.1rem; height: 56px;">Request ${data.rideshare.serviceTiers[0].name}</button>
      </div>
    `;
  }

  // 2. Render the Map View (Hero)
  renderRealMap(activeRequest);

  // Add the Driver Float over the map if trip is active
  if (activeDriver && (currentTrip?.status === "in_progress" || currentTrip?.status === "accepted")) {
    const float = document.createElement("div");
    float.style.cssText = "position: absolute; bottom: 32px; right: 32px; background: white; padding: 20px; border-radius: 20px; box-shadow: var(--shadow-lg); z-index: 1000; display: flex; align-items: center; gap: 16px; border: 1px solid var(--line); min-width: 320px;";
    float.innerHTML = `
       <div style="width: 54px; height: 54px; border-radius: 50%; overflow: hidden; background: #f0f0f0;">
         <img src="https://i.pravatar.cc/100?u=${activeDriver.id}" style="width: 100%; height: 100%; object-fit: cover;" />
       </div>
       <div style="flex-grow: 1;">
         <strong style="display: block; font-size: 1.1rem;">${activeDriver.fullName}</strong>
         <div style="display: flex; gap: 6px; margin-top: 4px;">
           <span class="driver-stat-badge">★ ${activeDriver.rating || "4.9"}</span>
           <span class="driver-stat-badge">6 Years</span>
         </div>
       </div>
       <div style="text-align: right;">
         <strong style="display: block; font-size: 1rem; color: #111;">${activeVehicle?.plateNumber || "ABC-123"}</strong>
         <span style="font-size: 0.8rem; color: #777;">${activeVehicle?.color || "Silver"} ${activeVehicle?.model || "Camry"}</span>
       </div>
    `;
    document.querySelector("#ride-map-view").appendChild(float);
  }

  // 3. Render the booking grid
  const bookingGridEl = document.querySelector("#ride-booking-grid");
  if (bookingGridEl) {
    bookingGridEl.innerHTML = `
      <article class="home-service-card" style="background: white; padding: 32px;">
        <p class="label" style="margin-bottom: 16px;">BOOKING SNAPSHOT</p>
        <h3 style="padding: 0; margin-bottom: 24px;">Your Trip</h3>
        <div class="ride-info-list" style="display: grid; gap: 16px;">
          <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="font-size: 0.8rem; color: #777; display: block;">PICKUP</span>
            <strong style="color: #111; font-size: 0.95rem;">${activeRequest.pickup.address}</strong>
          </div>
          <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="font-size: 0.8rem; color: #777; display: block;">DESTINATION</span>
            <strong style="color: #111; font-size: 0.95rem;">${activeRequest.dropoff.address}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
              <span style="font-size: 0.8rem; color: #777; display: block;">EST. FARE</span>
              <strong style="color: #111;">${rideCurrencyFormatter.format(activeRequest.estimatedFare)}</strong>
            </div>
            <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
              <span style="font-size: 0.8rem; color: #777; display: block;">SURGE</span>
              <strong style="color: #111;">${(activeRequest.surgeMultiplier || 1).toFixed(1)}x</strong>
            </div>
          </div>
        </div>
      </article>

      <article class="home-service-card" style="background: white; padding: 32px;">
        <p class="label" style="margin-bottom: 16px;">DRIVER & VEHICLE</p>
        <h3 style="padding: 0; margin-bottom: 24px;">${activeDriver?.fullName || "Assigned Driver"}</h3>
        <div class="ride-info-list" style="display: grid; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #eee; overflow: hidden;">
              <img src="https://i.pravatar.cc/100?u=${activeDriver?.id}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <strong style="display: block; font-size: 1.1rem;">${activeDriver?.fullName || "Jorge Alvarez"}</strong>
              <span style="color: #0b856f; font-weight: 700; font-size: 0.9rem;">★ ${activeDriver?.rating || "4.9"} Verified Driver</span>
            </div>
          </div>
          <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="font-size: 0.8rem; color: #777; display: block;">VEHICLE</span>
            <strong style="color: #111;">${activeVehicle ? `${activeVehicle.color} ${activeVehicle.make} ${activeVehicle.model}` : "Silver Toyota Camry"}</strong>
          </div>
          <div style="background: #111; color: white; padding: 12px 16px; border-radius: 12px; text-align: center;">
            <span style="font-size: 0.8rem; color: rgba(255,255,255,0.6); display: block;">PLATE NUMBER</span>
            <strong style="letter-spacing: 2px; font-size: 1.2rem;">${activeVehicle?.plateNumber || "SJL-2041"}</strong>
          </div>
        </div>
      </article>

      <article class="home-service-card" style="background: white; padding: 32px;">
        <p class="label" style="margin-bottom: 16px;">SAFETY TOOLS</p>
        <h3 style="padding: 0; margin-bottom: 24px;">Ride Check</h3>
        <div class="ride-steps-stack" style="display: grid; gap: 12px;">
          <button class="button secondary" style="width: 100%; justify-content: start; border-radius: 12px; gap: 12px;">
            <span>🛡️</span> Share Trip Status
          </button>
          <button class="button secondary" style="width: 100%; justify-content: start; border-radius: 12px; gap: 12px; color: var(--accent); border-color: var(--accent);">
            <span>🆘</span> Emergency Assistance
          </button>
        </div>
      </article>
    `;
  }

  // 4. Render Tiers
  const tierGridEl = document.querySelector("#ride-tier-grid");
  if (tierGridEl) {
    tierGridEl.innerHTML = data.rideshare.serviceTiers
      .map(
        (tier) => `
          <article class="home-service-card" style="background: white; border: ${tier.id === currentTier.id ? "2px solid #1b74ff" : "1px solid var(--line)"};">
            <div style="padding: 24px;">
              <p class="label" style="color: ${tier.id === currentTier.id ? "#1b74ff" : "var(--muted)"}; margin-bottom: 8px;">
                ${tier.id === currentTier.id ? "CURRENT CHOICE" : "RIDE OPTION"}
              </p>
              <h3 style="padding: 0; font-size: 1.6rem; font-weight: 900;">${tier.name}</h3>
              <p style="color: var(--muted); margin-bottom: 24px;">${tier.capacity} seats with clear upfront fare logic.</p>
              
              <div style="display: grid; gap: 8px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                  <span style="color: #777;">Base Fare</span>
                  <strong style="color: #111;">${rideCurrencyFormatter.format(tier.baseFare)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                  <span style="color: #777;">Booking Fee</span>
                  <strong style="color: #111;">${rideCurrencyFormatter.format(tier.bookingFee)}</strong>
                </div>
              </div>
              
              <button class="button ${tier.id === currentTier.id ? "primary" : "secondary"}" style="width: 100%; border-radius: 8px; ${tier.id === currentTier.id ? "background: #1b74ff; border: none;" : ""}">
                Select ${tier.name}
              </button>
            </div>
          </article>
        `
      )
      .join("");
  }

  // 5. Safety Section
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
            <span style="font-weight: 700; color: #111;">${rideNumberFormatter.format(data.rideshare.safetyEvents?.length || 0)} Safety Records</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
            <span style="color: #1b74ff; font-weight: 900;">✓</span>
            <span style="font-weight: 700; color: #111;">Real-time Trip Sharing</span>
          </div>
        </div>
      </article>
      <article class="home-service-card" style="background: #111; color: white; padding: 32px; border: none;">
        <p class="label" style="color: rgba(255,255,255,0.6); margin-bottom: 16px;">RECENT SAFETY LOG</p>
        <h3 style="padding: 0; color: white; margin-bottom: 16px;">${safetyEvent ? rideFormatStatus(safetyEvent.eventType) : "Trip Sharing"}</h3>
        <p style="color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 24px;">Trip sharing was activated during this ride. Your location is being securely shared with your emergency contacts.</p>
        <span style="color: #0b856f; font-weight: 800; font-size: 0.9rem;">● MONITORING ACTIVE</span>
      </article>
    `;
  }
}

if (window.SAJILO_SEED_DATA) {
  renderRidePage(window.SAJILO_SEED_DATA);
  setupRideInteractions(window.SAJILO_SEED_DATA);
}

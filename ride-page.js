const rideCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const rideNumberFormatter = new Intl.NumberFormat("en-US");

function rideFormatStatus(value) {
  return value.replaceAll("_", " ");
}

function renderRidePage(data) {
  const currentTrip = data.rideshare.trips.find((trip) => trip.status === "in_progress") || data.rideshare.trips[0];
  const activeRequest = data.rideshare.rideRequests[0];
  const currentTier = data.rideshare.serviceTiers.find((tier) => tier.id === currentTrip?.tierId) || data.rideshare.serviceTiers[0];
  const activeDriver = data.users.drivers.find((driver) => driver.id === currentTrip?.driverId) || data.users.drivers[0];
  const activeVehicle = data.rideshare.vehicles.find((vehicle) => vehicle.id === currentTrip?.vehicleId);
  const safetyEvent = data.rideshare.safetyEvents[0];

  document.querySelector("#ride-page-hero").innerHTML = `
    <div class="ride-page-hero-copy">
      <p class="eyebrow">City rides made clear</p>
      <h2>Book quickly, see the route clearly, and trust the ride from pickup to dropoff.</h2>
      <p class="ride-page-lead">This page focuses only on ridesharing, so the rider sees the essential details first: booking, live trip status, pricing, driver info, and safety.</p>
      <div class="ride-page-pills">
        <span>${activeRequest.pickup.address.split(",")[0]}</span>
        <span>${activeRequest.dropoff.address.split(",")[0]}</span>
        <span>${activeRequest.estimatedDurationMinutes} min ETA</span>
      </div>
      <div class="ride-page-actions">
        <a class="button primary" href="#ride-booking">Book now</a>
        <a class="button secondary" href="#ride-safety">Safety info</a>
      </div>
    </div>
    <div class="ride-page-hero-card">
      <p class="label">Current ride status</p>
      <h3>${currentTier.name}</h3>
      <div class="ride-page-status-row">
        <span class="ride-page-status">${rideFormatStatus(currentTrip.status)}</span>
        <strong>${rideCurrencyFormatter.format(currentTrip.fare.total)}</strong>
      </div>
      <div class="ride-page-route">
        <div class="rides-route-stop">
          <span class="rides-route-dot rides-route-dot-start"></span>
          <div>
            <strong>Pickup</strong>
            <p>${currentTrip.pickup.address}</p>
          </div>
        </div>
        <div class="rides-route-line"></div>
        <div class="rides-route-stop">
          <span class="rides-route-dot rides-route-dot-end"></span>
          <div>
            <strong>Dropoff</strong>
            <p>${currentTrip.dropoff.address}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#ride-booking-grid").innerHTML = `
    <article class="ride-info-card">
      <p class="label">Booking snapshot</p>
      <h3>Start with pickup, destination, and the right ride tier.</h3>
      <div class="ride-info-list">
        <div><span>Pickup</span><strong>${activeRequest.pickup.address}</strong></div>
        <div><span>Destination</span><strong>${activeRequest.dropoff.address}</strong></div>
        <div><span>Estimated fare</span><strong>${rideCurrencyFormatter.format(activeRequest.estimatedFare)}</strong></div>
        <div><span>Current surge</span><strong>${activeRequest.surgeMultiplier.toFixed(1)}x</strong></div>
      </div>
    </article>
    <article class="ride-info-card">
      <p class="label">Driver and vehicle</p>
      <h3>Assigned driver details stay visible before and during the trip.</h3>
      <div class="ride-info-list">
        <div><span>Driver</span><strong>${activeDriver.fullName}</strong></div>
        <div><span>Vehicle</span><strong>${activeVehicle ? `${activeVehicle.color} ${activeVehicle.make} ${activeVehicle.model}` : "Assigned vehicle"}</strong></div>
        <div><span>Plate</span><strong>${activeVehicle?.plateNumber || "Plate pending"}</strong></div>
        <div><span>Trip time</span><strong>${currentTrip.durationMinutes} min</strong></div>
      </div>
    </article>
    <article class="ride-info-card">
      <p class="label">Why it feels simple</p>
      <h3>Three clean steps keep the rider in control.</h3>
      <div class="ride-steps-stack">
        <div class="rides-step"><span>1</span><p>Enter pickup and dropoff</p></div>
        <div class="rides-step"><span>2</span><p>Choose the best ride option</p></div>
        <div class="rides-step"><span>3</span><p>Track the trip live</p></div>
      </div>
    </article>
  `;

  document.querySelector("#ride-tier-grid").innerHTML = data.rideshare.serviceTiers
    .map(
      (tier) => `
        <article class="ride-tier-card${tier.id === currentTier.id ? " is-featured" : ""}">
          <p class="label">${tier.id === currentTier.id ? "Current choice" : "Ride option"}</p>
          <h3>${tier.name}</h3>
          <p>${tier.capacity} seats with clear upfront fare logic for city travel.</p>
          <div class="ride-tier-pills">
            <span>${rideCurrencyFormatter.format(tier.baseFare)} base</span>
            <span>${rideCurrencyFormatter.format(tier.minimumFare)} minimum</span>
            <span>${rideCurrencyFormatter.format(tier.bookingFee)} booking fee</span>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelector("#ride-safety-grid").innerHTML = `
    <article class="ride-safety-card">
      <p class="label">Safety visibility</p>
      <h3>Trust details should be clear before the rider feels the need to ask.</h3>
      <div class="ride-tier-pills">
        <span>${rideNumberFormatter.format(data.users.drivers.length)} verified drivers</span>
        <span>${rideNumberFormatter.format(data.rideshare.safetyEvents.length)} safety records</span>
        <span>${rideNumberFormatter.format(data.analytics.adminDashboard.avgRideEtaMinutes)} min average ETA</span>
      </div>
    </article>
    <article class="ride-safety-card ride-safety-card-accent">
      <p class="label">Recent safety action</p>
      <h3>${rideFormatStatus(safetyEvent.eventType)}</h3>
      <p>A rider used trip sharing during an active ride, and the platform logged it immediately for clearer ride visibility.</p>
    </article>
  `;
}

if (window.SAJILO_SEED_DATA) {
  renderRidePage(window.SAJILO_SEED_DATA);
}

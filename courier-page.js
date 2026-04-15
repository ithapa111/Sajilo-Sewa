const courierCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const courierNumberFormatter = new Intl.NumberFormat("en-US");

function courierFormatStatus(value) {
  return value.replaceAll("_", " ");
}

function renderCourierPage(data) {
  const delivery = data.courierDelivery.deliveries[0];
  const courier = data.users.couriers.find((item) => item.id === delivery.courierId) || data.users.couriers[0];
  const packageType = data.courierDelivery.packageTypes.find((item) => item.id === delivery.packageTypeId) || data.courierDelivery.packageTypes[0];

  document.querySelector("#courier-page-hero").innerHTML = `
    <div class="courier-page-hero-copy">
      <p class="eyebrow">Same-day city delivery</p>
      <h2>Send documents and parcels with clean tracking, clear pricing, and simple pickup details.</h2>
      <p class="courier-page-lead">This page focuses only on courier delivery, so pickup, dropoff, package type, courier assignment, and status stay easy to understand.</p>
      <div class="courier-page-pills">
        <span>${packageType.name}</span>
        <span>${courier.vehicleType}</span>
        <span>${courierCurrencyFormatter.format(delivery.quotedPrice)} quote</span>
      </div>
      <div class="courier-page-actions">
        <a class="button primary" href="#courier-booking">Request courier</a>
        <a class="button secondary" href="#courier-status">View status</a>
      </div>
    </div>
    <div class="courier-page-hero-card">
      <p class="label">Current courier job</p>
      <h3>${courierFormatStatus(delivery.status)}</h3>
      <div class="courier-page-status-row">
        <span class="courier-page-status">${courierFormatStatus(delivery.status)}</span>
        <strong>${courier.fullName}</strong>
      </div>
      <div class="courier-page-route">
        <div class="rides-route-stop">
          <span class="rides-route-dot rides-route-dot-start"></span>
          <div>
            <strong>Pickup</strong>
            <p>${delivery.pickupAddress}</p>
          </div>
        </div>
        <div class="rides-route-line"></div>
        <div class="rides-route-stop">
          <span class="rides-route-dot rides-route-dot-end"></span>
          <div>
            <strong>Dropoff</strong>
            <p>${delivery.dropoffAddress}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#courier-booking-grid").innerHTML = `
    <article class="courier-info-card">
      <p class="label">Booking details</p>
      <h3>Pickup and dropoff stay neat and visible.</h3>
      <div class="courier-info-list">
        <div><span>Pickup</span><strong>${delivery.pickupAddress}</strong></div>
        <div><span>Dropoff</span><strong>${delivery.dropoffAddress}</strong></div>
        <div><span>Package type</span><strong>${packageType.name}</strong></div>
        <div><span>Max weight</span><strong>${packageType.maxWeightKg} kg</strong></div>
      </div>
    </article>
    <article class="courier-info-card">
      <p class="label">Assigned courier</p>
      <h3>Courier and vehicle details are easy to check.</h3>
      <div class="courier-info-list">
        <div><span>Courier</span><strong>${courier.fullName}</strong></div>
        <div><span>Vehicle</span><strong>${courier.vehicleType}</strong></div>
        <div><span>Rating</span><strong>${courier.rating.toFixed(1)}</strong></div>
        <div><span>Completed jobs</span><strong>${courierNumberFormatter.format(courier.completedDeliveries)}</strong></div>
      </div>
    </article>
    <article class="courier-info-card">
      <p class="label">Why it feels simple</p>
      <h3>Three steps keep the job easy to follow.</h3>
      <div class="ride-steps-stack">
        <div class="rides-step"><span>1</span><p>Set pickup and dropoff</p></div>
        <div class="rides-step"><span>2</span><p>Confirm package and quote</p></div>
        <div class="rides-step"><span>3</span><p>Track the courier job</p></div>
      </div>
    </article>
  `;

  document.querySelector("#courier-status-grid").innerHTML = `
    <article class="courier-status-card">
      <p class="label">Courier status</p>
      <h3>Live job details stay visible without clutter.</h3>
      <div class="courier-page-pills">
        <span>${courierFormatStatus(delivery.status)}</span>
        <span>${courierCurrencyFormatter.format(delivery.quotedPrice)} total quote</span>
        <span>${new Date(delivery.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} pickup</span>
      </div>
    </article>
    <article class="courier-status-card courier-status-card-accent">
      <p class="label">Coverage and scale</p>
      <h3>Built for same-day local courier work.</h3>
      <div class="courier-page-pills">
        <span>${courierNumberFormatter.format(data.analytics.adminDashboard.dailyCourierDeliveries)} daily courier deliveries</span>
        <span>${courierNumberFormatter.format(data.analytics.adminDashboard.activeCouriers)} active couriers</span>
      </div>
    </article>
  `;
}

if (window.SAJILO_SEED_DATA) {
  renderCourierPage(window.SAJILO_SEED_DATA);
}

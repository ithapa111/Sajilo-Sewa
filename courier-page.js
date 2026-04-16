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
      <p class="label" style="color: #10a37f; margin-bottom: 12px;">Reliable Local Logistics</p>
      <h1 style="font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 24px; color: #111;">Packages delivered in a blink.</h1>
      <p style="font-size: 1.15rem; color: var(--muted); line-height: 1.6; margin-bottom: 32px;">Same-day document and parcel delivery across the city. Professional couriers, transparent pricing, and real-time tracking.</p>
      
      <div style="display: flex; gap: 12px; margin-bottom: 32px;">
        <span style="background: #eefaf6; color: #10a37f; padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;">
          ${packageType.name}
        </span>
        <span style="background: #eefaf6; color: #10a37f; padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;">
          ${courier.vehicleType}
        </span>
        <span style="background: #eefaf6; color: #10a37f; padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;">
          ${courierCurrencyFormatter.format(delivery.quotedPrice)} Quote
        </span>
      </div>

      <div class="courier-page-actions">
        <a class="button primary" style="background: #10a37f; min-width: 180px;" href="#courier-booking">Request Courier</a>
        <a class="button secondary" style="min-width: 180px;" href="#courier-status">View Status</a>
      </div>
    </div>
    <div class="home-service-card" style="padding: 0; background: white;">
      <div style="padding: 24px; background: #10a37f; color: white;">
        <p class="label" style="color: rgba(255,255,255,0.8); margin-bottom: 8px;">ACTIVE SHIPMENT</p>
        <h3 style="color: white; padding: 0; font-size: 1.8rem; font-weight: 900;">${courierFormatStatus(delivery.status)}</h3>
      </div>
      <div style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <span style="background: #eefaf6; color: #10a37f; padding: 6px 16px; border-radius: 20px; font-weight: 800; text-transform: uppercase; font-size: 0.8rem;">
            Tracking Active
          </span>
          <strong style="font-size: 1.2rem; color: #111;">${courier.fullName}</strong>
        </div>
        <div class="courier-page-route">
          <div style="display: flex; gap: 16px; align-items: start;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #0b856f; margin-top: 6px; flex-shrink: 0;"></div>
            <div>
              <strong style="font-size: 0.85rem; color: #777; display: block; margin-bottom: 4px;">FROM</strong>
              <p style="margin: 0; font-weight: 600; color: #111;">${delivery.pickupAddress}</p>
            </div>
          </div>
          <div style="width: 2px; height: 30px; background: #eee; margin-left: 5px; margin-bottom: 4px;"></div>
          <div style="display: flex; gap: 16px; align-items: start;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--accent); margin-top: 6px; flex-shrink: 0;"></div>
            <div>
              <strong style="font-size: 0.85rem; color: #777; display: block; margin-bottom: 4px;">TO</strong>
              <p style="margin: 0; font-weight: 600; color: #111;">${delivery.dropoffAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#courier-booking-grid").innerHTML = `
    <article class="home-service-card" style="background: white; padding: 32px;">
      <p class="label" style="margin-bottom: 16px;">SHIPMENT DETAILS</p>
      <h3 style="padding: 0; margin-bottom: 24px;">Parcel Info</h3>
      <div class="courier-info-list" style="display: grid; gap: 16px;">
        <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
          <span style="font-size: 0.8rem; color: #777; display: block;">PACKAGE TYPE</span>
          <strong style="color: #111;">${packageType.name}</strong>
        </div>
        <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
          <span style="font-size: 0.8rem; color: #777; display: block;">MAX WEIGHT</span>
          <strong style="color: #111;">${packageType.maxWeightKg} kg</strong>
        </div>
        <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
          <span style="font-size: 0.8rem; color: #777; display: block;">QUOTED PRICE</span>
          <strong style="color: #111;">${courierCurrencyFormatter.format(delivery.quotedPrice)}</strong>
        </div>
      </div>
    </article>

    <article class="home-service-card" style="background: white; padding: 32px;">
      <p class="label" style="margin-bottom: 16px;">ASSIGNED COURIER</p>
      <h3 style="padding: 0; margin-bottom: 24px;">${courier.fullName}</h3>
      <div class="courier-info-list" style="display: grid; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: #eee; overflow: hidden;">
            <img src="https://i.pravatar.cc/100?u=${courier.id}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div>
            <strong style="display: block; font-size: 1.1rem;">${courier.fullName}</strong>
            <span style="color: #0b856f; font-weight: 700; font-size: 0.9rem;">★ ${courier.rating.toFixed(1)} Professional</span>
          </div>
        </div>
        <div style="background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
          <span style="font-size: 0.8rem; color: #777; display: block;">VEHICLE TYPE</span>
          <strong style="color: #111;">${courier.vehicleType}</strong>
        </div>
        <div style="background: #111; color: white; padding: 12px 16px; border-radius: 12px; text-align: center;">
          <span style="font-size: 0.8rem; color: rgba(255,255,255,0.6); display: block;">COMPLETED JOBS</span>
          <strong style="font-size: 1.2rem;">${courierNumberFormatter.format(courier.completedDeliveries)}</strong>
        </div>
      </div>
    </article>

    <article class="home-service-card" style="background: white; padding: 32px;">
      <p class="label" style="margin-bottom: 16px;">HOW IT WORKS</p>
      <h3 style="padding: 0; margin-bottom: 24px;">Delivery Flow</h3>
      <div class="ride-steps-stack" style="display: grid; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <span style="width: 32px; height: 32px; border-radius: 50%; background: #10a37f; color: white; display: grid; place-items: center; font-weight: 800; flex-shrink: 0;">1</span>
          <p style="margin: 0; font-weight: 600; color: #111;">Set pickup and dropoff</p>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span style="width: 32px; height: 32px; border-radius: 50%; background: #10a37f; color: white; display: grid; place-items: center; font-weight: 800; flex-shrink: 0;">2</span>
          <p style="margin: 0; font-weight: 600; color: #111;">Confirm package and quote</p>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span style="width: 32px; height: 32px; border-radius: 50%; background: #10a37f; color: white; display: grid; place-items: center; font-weight: 800; flex-shrink: 0;">3</span>
          <p style="margin: 0; font-weight: 600; color: #111;">Track the courier job</p>
        </div>
      </div>
    </article>
  `;

  document.querySelector("#courier-status-grid").innerHTML = `
    <article class="home-service-card" style="background: white; padding: 32px;">
      <p class="label" style="margin-bottom: 16px;">LIVE COURIER STATUS</p>
      <h3 style="padding: 0; margin-bottom: 24px;">Job Timeline</h3>
      <div style="display: grid; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px; background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
          <span style="color: #10a37f; font-weight: 900;">✓</span>
          <span style="font-weight: 700; color: #111;">Job Assigned: ${courier.fullName}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
          <span style="color: #10a37f; font-weight: 900;">●</span>
          <span style="font-weight: 700; color: #111;">Status: ${courierFormatStatus(delivery.status)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; background: #f9f9f9; padding: 12px 16px; border-radius: 12px;">
          <span style="color: #10a37f; font-weight: 900;">◴</span>
          <span style="font-weight: 700; color: #111;">Pickup at ${new Date(delivery.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
        </div>
      </div>
    </article>
    <article class="home-service-card" style="background: #111; color: white; padding: 32px; border: none;">
      <p class="label" style="color: rgba(255,255,255,0.6); margin-bottom: 16px;">LOCAL COVERAGE</p>
      <h3 style="padding: 0; color: white; margin-bottom: 16px;">City-wide Presence</h3>
      <div style="display: grid; gap: 16px;">
        <div>
          <strong style="font-size: 1.8rem; display: block; color: #10a37f;">${courierNumberFormatter.format(data.analytics.adminDashboard.dailyCourierDeliveries)}+</strong>
          <span style="color: rgba(255,255,255,0.6);">Daily Deliveries</span>
        </div>
        <div>
          <strong style="font-size: 1.8rem; display: block; color: #10a37f;">${courierNumberFormatter.format(data.analytics.adminDashboard.activeCouriers)}</strong>
          <span style="color: rgba(255,255,255,0.6);">Active Couriers Nearby</span>
        </div>
      </div>
    </article>
  `;
}

if (window.SAJILO_SEED_DATA) {
  renderCourierPage(window.SAJILO_SEED_DATA);
}

const profileNode = document.querySelector("#business-profile");
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || "";
let profile = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMemberToken() {
  return localStorage.getItem("sajilo_member_token") || localStorage.getItem("sajilo_token") || "";
}

function findStaticProfile() {
  const data = window.SAJILO_MARKETPLACE_DATA || { businesses: [], categories: [], cities: [], reviews: [] };
  const business = (data.businesses || []).find((item) => item.slug === slug || item.id === slug);

  if (!business) {
    return null;
  }

  return {
    business: {
      ...business,
      category: (data.categories || []).find((item) => item.id === business.categoryId) || null,
      city: (data.cities || []).find((item) => item.id === business.cityId) || null
    },
    reviews: (data.reviews || []).filter((review) => review.businessId === business.id && review.status === "published")
  };
}

async function loadProfile() {
  if (window.location.protocol !== "file:" && slug) {
    try {
      const response = await fetch(`/api/marketplace/businesses/${encodeURIComponent(slug)}`);

      if (response.ok) {
        profile = await response.json();
        return;
      }
    } catch (error) {
      profile = null;
    }
  }

  profile = findStaticProfile();
}

function renderStars(rating) {
  const rounded = Math.round(Number(rating || 0));
  return Array.from({ length: 5 }, (_, index) => `<span class="${index < rounded ? "is-filled" : ""}"></span>`).join("");
}

function priceLabel(priceLevel = 2) {
  const level = Number(priceLevel);
  if (level <= 0) {
    return "Free";
  }

  return "$".repeat(level || 2);
}

function renderReviews(reviews) {
  if (!reviews.length) {
    return `<article class="business-review-card"><h3>No reviews yet</h3><p>Be the first community member to review this place.</p></article>`;
  }

  return reviews
    .map(
      (review) => `
        <article class="business-review-card">
          <div class="marketplace-rating-row">
            <span class="marketplace-stars" aria-hidden="true">${renderStars(review.rating)}</span>
            <strong>${Number(review.rating || 0).toFixed(1)}</strong>
            <span>${escapeHtml(review.verificationSource || "community_member").replaceAll("_", " ")}</span>
          </div>
          <h3>${escapeHtml(review.title)}</h3>
          <p>${escapeHtml(review.body)}</p>
        </article>
      `
    )
    .join("");
}

function renderProfile() {
  if (!profile || !profile.business) {
    profileNode.innerHTML = `
      <section class="business-empty">
        <h2>Business not found</h2>
        <p>Return to marketplace search and choose another listing.</p>
        <a class="button primary" href="./marketplace.html">Back to search</a>
      </section>
    `;
    return;
  }

  const business = profile.business;
  const reviews = profile.reviews || [];
  const serviceModes = business.serviceModes || [];
  const trustBadges = business.trustBadges || [];
  const topServices = business.topServices || [];
  const hours = business.hours || {};
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.lat},${business.lng}`)}`;

  profileNode.innerHTML = `
    <section class="business-hero">
      <img class="business-hero-image" src="${escapeHtml(business.image)}" alt="${escapeHtml(business.name)}" />
      <div class="business-hero-copy">
        <p class="eyebrow">${escapeHtml(business.category?.name || "Local service")}</p>
        <h2>${escapeHtml(business.name)}</h2>
        <div class="marketplace-rating-row">
          <span class="marketplace-stars" aria-hidden="true">${renderStars(business.rating)}</span>
          <strong>${Number(business.rating || 0).toFixed(1)}</strong>
          <span>${Number(business.reviewCount || 0) + reviews.length} reviews</span>
        </div>
        <p>${escapeHtml(business.description)}</p>
        <div class="marketplace-chip-row">
          ${trustBadges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}
          ${serviceModes.map((mode) => `<span>${escapeHtml(mode)}</span>`).join("")}
          <span>${priceLabel(business.priceLevel)}</span>
        </div>
      </div>
    </section>

    <nav class="business-sticky-actions" aria-label="Business actions">
      <a class="button primary" href="tel:${escapeHtml(business.phone)}">Call</a>
      <a class="button secondary" href="${mapsUrl}" target="_blank" rel="noreferrer">Directions</a>
      <button id="business-save" class="button secondary" type="button">Save</button>
      <a class="button secondary" href="./account.html?type=business">Claim</a>
    </nav>

    <section class="business-profile-grid">
      <article class="business-panel">
        <p class="eyebrow">Overview</p>
        <h3>Community details</h3>
        <p>${escapeHtml(business.address)}</p>
        <p>${escapeHtml(business.neighborhood)} | ${escapeHtml(business.city?.name || "")}, ${escapeHtml(business.city?.state || "")}</p>
        <div class="business-mini-map">
          <span style="left: 50%; top: 48%">${escapeHtml(business.name.slice(0, 1))}</span>
        </div>
      </article>

      <article class="business-panel">
        <p class="eyebrow">Menu and services</p>
        <h3>Popular options</h3>
        <div class="business-service-list">
          ${topServices
            .map(
              (service) => `
                <div>
                  <strong>${escapeHtml(service.name)}</strong>
                  <span>${escapeHtml(service.priceLabel)}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </article>

      <article class="business-panel">
        <p class="eyebrow">Hours</p>
        <h3>Open information</h3>
        <div class="business-hours-list">
          ${Object.entries(hours)
            .map(([day, value]) => `<div><span>${escapeHtml(day.toUpperCase())}</span><strong>${escapeHtml(value)}</strong></div>`)
            .join("")}
        </div>
      </article>
    </section>

    <section class="business-reviews-section">
      <div class="section-heading">
        <p class="eyebrow">Community reviews</p>
        <h2>What members say</h2>
      </div>
      <form id="business-review-form" class="business-review-form">
        <label>
          <span>Rating</span>
          <select name="rating">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
        <label>
          <span>Title</span>
          <input name="title" type="text" placeholder="Quick summary" />
        </label>
        <label>
          <span>Review</span>
          <textarea name="body" placeholder="Share your community experience"></textarea>
        </label>
        <button class="button primary" type="submit">Post review</button>
        <p id="business-review-note" class="form-note"></p>
      </form>
      <div id="business-review-list" class="business-review-list">${renderReviews(reviews)}</div>
    </section>
  `;
}

async function postReview(form) {
  const business = profile.business;
  const token = getMemberToken();
  const note = document.querySelector("#business-review-note");

  if (!token) {
    window.location.href = `./account.html?type=member&next=${encodeURIComponent(`business.html?slug=${business.slug}`)}`;
    return;
  }

  const formData = new FormData(form);
  const payload = {
    rating: Number(formData.get("rating")),
    title: formData.get("title"),
    body: formData.get("body")
  };

  try {
    const response = await fetch(`/api/marketplace/businesses/${encodeURIComponent(business.id)}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not post review");
    }

    profile.reviews.unshift(result);
    document.querySelector("#business-review-list").innerHTML = renderReviews(profile.reviews);
    form.reset();
    note.textContent = "Review posted.";
    note.className = "form-note is-success";
  } catch (error) {
    note.textContent = error.message;
    note.className = "form-note is-blocked";
  }
}

function bindProfileEvents() {
  profileNode.addEventListener("submit", (event) => {
    if (event.target.matches("#business-review-form")) {
      event.preventDefault();
      postReview(event.target);
    }
  });

  profileNode.addEventListener("click", async (event) => {
    if (!event.target.matches("#business-save")) {
      return;
    }

    const token = getMemberToken();

    if (!token) {
      window.location.href = `./account.html?type=member&next=${encodeURIComponent(`business.html?slug=${profile.business.slug}`)}`;
      return;
    }

    try {
      await fetch(`/api/marketplace/businesses/${encodeURIComponent(profile.business.id)}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // Static preview cannot persist favorites.
    }

    event.target.textContent = "Saved";
  });
}

await loadProfile();
renderProfile();
bindProfileEvents();

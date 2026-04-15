const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const CUISINE_FILTERS = ["Nepali", "Indian", "Curry", "Tandoori", "Biryani", "Thali", "Momo", "Sekuwa", "Chaat"];

const curatedRestaurants = [
  {
    id: "rest_nep_002",
    name: "Everest Thakali Kitchen",
    cuisineTags: ["Nepali", "Thakali", "Thali"],
    rating: 4.9,
    reviewCount: 412,
    priceLevel: 2,
    address: "1128 W Taylor St, Chicago, IL",
    zoneId: "zone_west",
    deliveryRadiusMiles: 5.2,
    avgPrepTimeMinutes: 25,
    isOpen: true,
    offersDelivery: true,
    offersPickup: true,
    offersDineIn: true,
    hasReservations: true,
    hasWaitlist: true
  },
  {
    id: "rest_nep_003",
    name: "Momo Ghar Express",
    cuisineTags: ["Nepali", "Momo", "Sekuwa"],
    rating: 4.8,
    reviewCount: 355,
    priceLevel: 2,
    address: "946 W Diversey Pkwy, Chicago, IL",
    zoneId: "zone_north",
    deliveryRadiusMiles: 4.8,
    avgPrepTimeMinutes: 21,
    isOpen: true,
    offersDelivery: true,
    offersPickup: true,
    offersDineIn: false,
    hasReservations: false,
    hasWaitlist: false
  },
  {
    id: "rest_ind_001",
    name: "Curry Mahal",
    cuisineTags: ["Indian", "Curries", "Biryani"],
    rating: 4.8,
    reviewCount: 528,
    priceLevel: 2,
    address: "230 W Monroe St, Chicago, IL",
    zoneId: "zone_loop",
    deliveryRadiusMiles: 4.2,
    avgPrepTimeMinutes: 24,
    isOpen: true,
    offersDelivery: true,
    offersPickup: true,
    offersDineIn: true,
    hasReservations: true,
    hasWaitlist: true
  },
  {
    id: "rest_ind_002",
    name: "Tandoori Junction",
    cuisineTags: ["Indian", "Tandoori", "Naan"],
    rating: 4.7,
    reviewCount: 286,
    priceLevel: 2,
    address: "945 W Belmont Ave, Chicago, IL",
    zoneId: "zone_north",
    deliveryRadiusMiles: 5.1,
    avgPrepTimeMinutes: 23,
    isOpen: true,
    offersDelivery: true,
    offersPickup: true,
    offersDineIn: true,
    hasReservations: true,
    hasWaitlist: false
  },
  {
    id: "rest_ind_003",
    name: "Biryani Bazaar",
    cuisineTags: ["Indian", "Biryani", "Kebab"],
    rating: 4.8,
    reviewCount: 471,
    priceLevel: 2,
    address: "201 E Grand Ave, Chicago, IL",
    zoneId: "zone_loop",
    deliveryRadiusMiles: 4.6,
    avgPrepTimeMinutes: 26,
    isOpen: true,
    offersDelivery: true,
    offersPickup: true,
    offersDineIn: true,
    hasReservations: true,
    hasWaitlist: true
  },
  {
    id: "rest_ind_004",
    name: "Chai Chaat Corner",
    cuisineTags: ["Indian", "Chaat", "Street Food"],
    rating: 4.6,
    reviewCount: 194,
    priceLevel: 1,
    address: "1458 N Milwaukee Ave, Chicago, IL",
    zoneId: "zone_west",
    deliveryRadiusMiles: 4.9,
    avgPrepTimeMinutes: 19,
    isOpen: true,
    offersDelivery: true,
    offersPickup: true,
    offersDineIn: false,
    hasReservations: false,
    hasWaitlist: false
  }
];

const curatedMenuItems = [
  {
    id: "item_nep_001",
    restaurantId: "rest_nep_002",
    name: "Thakali Khana Set",
    description: "Rice, dal, gundruk, tarkari, achar, and grilled protein in a full Nepali thali.",
    price: 16.25,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_nep_002",
    restaurantId: "rest_nep_002",
    name: "Buff Sekuwa Plate",
    description: "Char-grilled Nepali-style sekuwa with chiura, achar, and fresh onion.",
    price: 15.5,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_nep_003",
    restaurantId: "rest_nep_003",
    name: "Chicken Jhol Momo",
    description: "Steamed momo served in spiced jhol broth with sesame and tomato achar.",
    price: 13.75,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_nep_004",
    restaurantId: "rest_nep_003",
    name: "C Momo",
    description: "Pan-tossed chili momo with peppers, onion, and bold Nepali spice.",
    price: 14.25,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_ind_001",
    restaurantId: "rest_ind_001",
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with spiced chicken, saffron, and herbs.",
    price: 15.25,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_ind_002",
    restaurantId: "rest_ind_001",
    name: "Paneer Butter Masala",
    description: "Paneer cubes in a rich tomato-butter gravy with warming Indian spices.",
    price: 14.5,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_ind_003",
    restaurantId: "rest_ind_002",
    name: "Tandoori Chicken Plate",
    description: "Fire-roasted tandoori chicken with mint chutney and masala onion.",
    price: 16.75,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_ind_004",
    restaurantId: "rest_ind_002",
    name: "Garlic Naan Set",
    description: "Buttery garlic naan served with house dal makhani for a complete side set.",
    price: 6.5,
    isPopular: false,
    isAvailable: true
  },
  {
    id: "item_ind_005",
    restaurantId: "rest_ind_003",
    name: "Mutton Dum Biryani",
    description: "Slow-cooked biryani with tender mutton, saffron rice, and caramelized onion.",
    price: 17.5,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_ind_006",
    restaurantId: "rest_ind_003",
    name: "Chicken Tikka Kebab Box",
    description: "Tikka kebab pieces with jeera rice, chutney, and spiced onion masala.",
    price: 15.95,
    isPopular: false,
    isAvailable: true
  },
  {
    id: "item_ind_007",
    restaurantId: "rest_ind_004",
    name: "Pani Puri Party Box",
    description: "Crunchy puri shells, tangy pani, potato filling, and sweet-spicy chutneys.",
    price: 9.75,
    isPopular: true,
    isAvailable: true
  },
  {
    id: "item_ind_008",
    restaurantId: "rest_ind_004",
    name: "Aloo Tikki Chaat",
    description: "Crisp potato patties with yogurt, tamarind chutney, sev, and masala.",
    price: 10.25,
    isPopular: true,
    isAvailable: true
  }
];

function isNepaliOrIndian(restaurant) {
  const tags = restaurant.cuisineTags || [];
  return tags.some((tag) => CUISINE_FILTERS.some((needle) => tag.toLowerCase().includes(needle.toLowerCase())));
}

function getZoneMap(data) {
  return new Map((data.platform.zones || []).map((zone) => [zone.id, zone]));
}

function getRestaurantSearchText(data, restaurant, zoneMap) {
  const zone = zoneMap.get(restaurant.zoneId);
  const city = data.platform.cities[0]?.name || "";
  return [
    restaurant.name,
    restaurant.address,
    zone?.name || "",
    city,
    ...(restaurant.cuisineTags || [])
  ]
    .join(" ")
    .toLowerCase();
}

function getMenuSearchText(item) {
  return [item.name, item.description || ""].join(" ").toLowerCase();
}

function formatPriceLevel(priceLevel = 2) {
  return "$".repeat(priceLevel);
}

function getServiceModes(restaurant) {
  return [
    restaurant.offersDelivery ? "Delivery" : null,
    restaurant.offersPickup ? "Pickup" : null,
    restaurant.offersDineIn ? "Dine-in" : null,
    restaurant.hasReservations ? "Reservations" : null,
    restaurant.hasWaitlist ? "Waitlist" : null
  ].filter(Boolean);
}

function buildFoodDataset() {
  const data = window.SAJILO_SEED_DATA;
  const zoneMap = getZoneMap(data);
  const restaurants = [...(data.foodDelivery?.restaurants || []), ...curatedRestaurants].filter(isNepaliOrIndian);
  const allowedRestaurantIds = new Set(restaurants.map((restaurant) => restaurant.id));
  const menuItems = [
    ...(data.foodDelivery?.menuItems || []).filter((item) => allowedRestaurantIds.has(item.restaurantId)),
    ...curatedMenuItems
  ].filter((item) => item.isAvailable !== false);

  return { data, zoneMap, restaurants, menuItems };
}

function getCuisineBadge(restaurant) {
  const tags = (restaurant.cuisineTags || []).join(" ").toLowerCase();

  if (tags.includes("momo")) {
    return "Momo house";
  }

  if (tags.includes("thali") || tags.includes("thakali")) {
    return "Thali kitchen";
  }

  if (tags.includes("biryani")) {
    return "Biryani spot";
  }

  if (tags.includes("chaat")) {
    return "Street bites";
  }

  if (tags.includes("tandoori")) {
    return "Tandoori grill";
  }

  return "Local favorite";
}

function getDishArtwork(item) {
  const name = item.name.toLowerCase();

  if (name.includes("momo")) {
    return {
      src: "./assets/Momo.1.jpg",
      alt: "Momo dish"
    };
  }

  if (name.includes("thali") || name.includes("khana") || name.includes("sekuwa")) {
    return {
      src: "./assets/Chowein.1.webp",
      alt: "Nepali dish"
    };
  }

  return {
    src: "./assets/Chowein.1.webp",
    alt: "Indian dish"
  };
}

function getRestaurantCover(restaurant) {
  const tags = (restaurant.cuisineTags || []).join(" ").toLowerCase();

  if (tags.includes("momo")) {
    return {
      src: "./assets/Momo.1.jpg",
      alt: `${restaurant.name} momo selection`,
      themeClass: "is-momo"
    };
  }

  if (tags.includes("thali") || tags.includes("thakali")) {
    return {
      src: "./assets/Chowein.1.webp",
      alt: `${restaurant.name} Nepali thali selection`,
      themeClass: "is-thali"
    };
  }

  return {
    src: "./assets/Chowein.1.webp",
    alt: `${restaurant.name} Indian food selection`,
    themeClass: "is-curry"
  };
}

function buildRestaurantCards(restaurants, itemsByRestaurant, zoneMap) {
  return restaurants
    .map((restaurant) => {
      const zone = zoneMap.get(restaurant.zoneId);
      const items = itemsByRestaurant.get(restaurant.id) || [];
      const cuisineBadge = getCuisineBadge(restaurant);
      const cover = getRestaurantCover(restaurant);
      const serviceModes = getServiceModes(restaurant);
      const reviewCount = restaurant.reviewCount || Math.round(restaurant.rating * 80);
      const priceLabel = formatPriceLevel(restaurant.priceLevel);

      return `
        <article class="food-result-restaurant">
          <div class="food-result-cover ${cover.themeClass}">
            <img class="food-result-cover-image" src="${cover.src}" alt="${cover.alt}" />
            <div class="food-result-cover-overlay">
              <span>${cuisineBadge}</span>
              <strong>${restaurant.name}</strong>
            </div>
          </div>
          <div class="food-result-header">
            <div class="food-result-brand">
              <div class="food-result-mark">${restaurant.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <p class="label">${(restaurant.cuisineTags || []).join(" | ")}</p>
                <h3>${restaurant.name}</h3>
                <div class="food-result-pills">
                  <span>${cuisineBadge}</span>
                  <span>${zone?.name || "Chicago"}</span>
                  <span>${restaurant.isOpen ? "Open now" : "Closed"}</span>
                  <span>${priceLabel}</span>
                </div>
              </div>
            </div>
            <span class="food-result-rating">${restaurant.rating.toFixed(1)} stars • ${numberFormatter.format(reviewCount)} reviews</span>
          </div>
          <p class="food-result-meta">${restaurant.address} | ${zone?.name || "Chicago"} | ${restaurant.avgPrepTimeMinutes} min prep | ${restaurant.deliveryRadiusMiles} mi delivery</p>
          <div class="food-result-service-row">
            ${serviceModes.map((mode) => `<span>${mode}</span>`).join("")}
          </div>
          <div class="food-result-action-row">
            ${restaurant.offersDelivery ? `<a class="button primary food-result-action" href="#order-now">Order delivery</a>` : ""}
            ${restaurant.offersPickup ? `<a class="button secondary food-result-action" href="#order-now">Pickup</a>` : ""}
            ${restaurant.hasReservations ? `<a class="button secondary food-result-action" href="#restaurant-tools">Reserve table</a>` : ""}
            ${restaurant.hasWaitlist ? `<a class="button secondary food-result-action" href="#restaurant-tools">Join waitlist</a>` : ""}
          </div>
          <div class="food-result-dishes">
            ${items
              .map((item) => {
                const artwork = getDishArtwork(item);

                return `
                  <article class="food-result-dish">
                    <img class="food-result-dish-image" src="${artwork.src}" alt="${artwork.alt}" />
                    <div>
                      <strong>${item.name}</strong>
                      <p>${item.description}</p>
                    </div>
                    <div class="food-result-price">
                      <span>${currencyFormatter.format(item.price)}</span>
                      <small>${item.isPopular ? "Popular choice" : "Available now"}</small>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFoodResults() {
  const searchInput = document.querySelector("#food-restaurant-search");
  const locationInput = document.querySelector("#food-location-search");
  const summaryNode = document.querySelector("#food-results-summary");
  const listNode = document.querySelector("#food-results-list");

  if (!locationInput || !summaryNode || !listNode || !window.SAJILO_SEED_DATA) {
    return;
  }

  const { data, zoneMap, restaurants, menuItems } = buildFoodDataset();
  const locationQuery = locationInput.value.trim().toLowerCase();
  const searchQuery = searchInput?.value.trim().toLowerCase() || "";
  const query = [searchQuery, locationQuery].filter(Boolean).join(" ");

  const restaurantsWithItems = restaurants
    .map((restaurant) => {
      const matchingItems = menuItems.filter((item) => {
        if (item.restaurantId !== restaurant.id) {
          return false;
        }

        if (!query) {
          return true;
        }

        const restaurantSearchText = getRestaurantSearchText(data, restaurant, zoneMap);
        const restaurantMatch =
          (!searchQuery || restaurantSearchText.includes(searchQuery) || getMenuSearchText(item).includes(searchQuery)) &&
          (!locationQuery || restaurantSearchText.includes(locationQuery));
        const itemMatch = getMenuSearchText(item).includes(searchQuery);
        return restaurantMatch || itemMatch;
      });

      return {
        restaurant,
        items: matchingItems
      };
    })
    .filter(({ items }) => items.length > 0);

  const filteredRestaurants = restaurantsWithItems.map(({ restaurant }) => restaurant);
  const itemsByRestaurant = new Map(restaurantsWithItems.map(({ restaurant, items }) => [restaurant.id, items]));
  const totalItems = restaurantsWithItems.reduce((sum, entry) => sum + entry.items.length, 0);
  const searchLabel = locationInput.value.trim() || "all nearby areas";
  const searchTermLabel = searchInput?.value.trim() || "all restaurants";
  const reservationCount = filteredRestaurants.filter((restaurant) => restaurant.hasReservations).length;
  const waitlistCount = filteredRestaurants.filter((restaurant) => restaurant.hasWaitlist).length;

  summaryNode.innerHTML = `
    <article class="food-results-card">
      <div class="food-results-card-top">
        <div class="food-results-card-copy">
          <p class="label">Search results</p>
          <h3>${filteredRestaurants.length > 0 ? `Showing ${numberFormatter.format(filteredRestaurants.length)} restaurants and ${numberFormatter.format(totalItems)} dishes for ${searchTermLabel}` : "No Nepali or Indian restaurants matched that search"}</h3>
          <p>${filteredRestaurants.length > 0 ? `Results near ${searchLabel} include restaurant discovery details, service modes, and menu highlights. The list stays limited to Nepali and Indian cuisine.` : "Try Chicago, Downtown Loop, North Side, West Corridor, momo, biryani, tandoori, Taylor, or Milwaukee."}</p>
        </div>
        <div class="food-results-card-mark">${filteredRestaurants.length > 0 ? "NEARBY" : "SEARCH"}</div>
      </div>
      ${
        filteredRestaurants.length > 0
          ? `<div class="food-results-pills">
               <span>${numberFormatter.format(filteredRestaurants.length)} nearby restaurants</span>
               <span>${numberFormatter.format(totalItems)} matching dishes</span>
               <span>${numberFormatter.format(reservationCount)} with reservations</span>
               <span>${numberFormatter.format(waitlistCount)} with waitlist</span>
             </div>
             <div class="food-results-metrics">
               <article>
                 <strong>${numberFormatter.format(filteredRestaurants.length)}</strong>
                 <span>Restaurants</span>
               </article>
               <article>
                 <strong>${numberFormatter.format(totalItems)}</strong>
                 <span>Dishes</span>
               </article>
               <article>
                 <strong>${searchLabel}</strong>
                 <span>Search area</span>
               </article>
             </div>`
          : ""
      }
    </article>
  `;

  listNode.innerHTML = filteredRestaurants.length > 0
    ? buildRestaurantCards(filteredRestaurants, itemsByRestaurant, zoneMap)
    : `
        <article class="food-result-empty">
          <h3>No nearby Nepali or Indian restaurant found</h3>
          <p>Try searching by city, neighborhood, restaurant, or dish name such as Chicago, Downtown Loop, momo, biryani, or thali.</p>
        </article>
      `;
}

const locationButton = document.querySelector("#food-location-button");
const locationInput = document.querySelector("#food-location-search");
const restaurantSearchInput = document.querySelector("#food-restaurant-search");

if (locationButton && locationInput) {
  locationButton.addEventListener("click", renderFoodResults);
  locationInput.addEventListener("input", renderFoodResults);
}

if (restaurantSearchInput) {
  restaurantSearchInput.addEventListener("input", renderFoodResults);
}

renderFoodResults();

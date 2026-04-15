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
    priceLevel: 2,
    address: "1128 W Taylor St, Chicago, IL",
    zoneId: "zone_west",
    deliveryRadiusMiles: 5.2,
    avgPrepTimeMinutes: 25,
    isOpen: true
  },
  {
    id: "rest_nep_003",
    name: "Momo Ghar Express",
    cuisineTags: ["Nepali", "Momo", "Sekuwa"],
    rating: 4.8,
    priceLevel: 2,
    address: "946 W Diversey Pkwy, Chicago, IL",
    zoneId: "zone_north",
    deliveryRadiusMiles: 4.8,
    avgPrepTimeMinutes: 21,
    isOpen: true
  },
  {
    id: "rest_ind_001",
    name: "Curry Mahal",
    cuisineTags: ["Indian", "Curries", "Biryani"],
    rating: 4.8,
    priceLevel: 2,
    address: "230 W Monroe St, Chicago, IL",
    zoneId: "zone_loop",
    deliveryRadiusMiles: 4.2,
    avgPrepTimeMinutes: 24,
    isOpen: true
  },
  {
    id: "rest_ind_002",
    name: "Tandoori Junction",
    cuisineTags: ["Indian", "Tandoori", "Naan"],
    rating: 4.7,
    priceLevel: 2,
    address: "945 W Belmont Ave, Chicago, IL",
    zoneId: "zone_north",
    deliveryRadiusMiles: 5.1,
    avgPrepTimeMinutes: 23,
    isOpen: true
  },
  {
    id: "rest_ind_003",
    name: "Biryani Bazaar",
    cuisineTags: ["Indian", "Biryani", "Kebab"],
    rating: 4.8,
    priceLevel: 2,
    address: "201 E Grand Ave, Chicago, IL",
    zoneId: "zone_loop",
    deliveryRadiusMiles: 4.6,
    avgPrepTimeMinutes: 26,
    isOpen: true
  },
  {
    id: "rest_ind_004",
    name: "Chai Chaat Corner",
    cuisineTags: ["Indian", "Chaat", "Street Food"],
    rating: 4.6,
    priceLevel: 1,
    address: "1458 N Milwaukee Ave, Chicago, IL",
    zoneId: "zone_west",
    deliveryRadiusMiles: 4.9,
    avgPrepTimeMinutes: 19,
    isOpen: true
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
      src: "./assets/meal-momo.svg",
      alt: "Momo dish"
    };
  }

  if (name.includes("thali") || name.includes("khana") || name.includes("sekuwa")) {
    return {
      src: "./assets/meal-burger.svg",
      alt: "Nepali thali dish"
    };
  }

  return {
    src: "./assets/meal-bowl.svg",
    alt: "Indian dish"
  };
}

function getRestaurantCover(restaurant) {
  const tags = (restaurant.cuisineTags || []).join(" ").toLowerCase();

  if (tags.includes("momo")) {
    return {
      src: "./assets/meal-momo.svg",
      alt: `${restaurant.name} momo selection`,
      themeClass: "is-momo"
    };
  }

  if (tags.includes("thali") || tags.includes("thakali")) {
    return {
      src: "./assets/meal-burger.svg",
      alt: `${restaurant.name} Nepali thali selection`,
      themeClass: "is-thali"
    };
  }

  return {
    src: "./assets/meal-bowl.svg",
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
                </div>
              </div>
            </div>
            <span class="food-result-rating">${restaurant.rating.toFixed(1)} rating</span>
          </div>
          <p class="food-result-meta">${restaurant.address} | ${zone?.name || "Chicago"} | ${restaurant.avgPrepTimeMinutes} min prep | ${restaurant.deliveryRadiusMiles} mi delivery</p>
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
  const locationInput = document.querySelector("#food-location-search");
  const summaryNode = document.querySelector("#food-results-summary");
  const listNode = document.querySelector("#food-results-list");

  if (!locationInput || !summaryNode || !listNode || !window.SAJILO_SEED_DATA) {
    return;
  }

  const { data, zoneMap, restaurants, menuItems } = buildFoodDataset();
  const query = locationInput.value.trim().toLowerCase();

  const restaurantsWithItems = restaurants
    .map((restaurant) => {
      const matchingItems = menuItems.filter((item) => {
        if (item.restaurantId !== restaurant.id) {
          return false;
        }

        if (!query) {
          return true;
        }

        const restaurantMatch = getRestaurantSearchText(data, restaurant, zoneMap).includes(query);
        const itemMatch = getMenuSearchText(item).includes(query);
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

  summaryNode.innerHTML = `
    <article class="food-results-card">
      <div class="food-results-card-top">
        <div class="food-results-card-copy">
          <p class="label">Search results</p>
          <h3>${filteredRestaurants.length > 0 ? `Showing ${numberFormatter.format(totalItems)} Nepali and Indian dishes near ${searchLabel}` : "No Nepali or Indian dishes found near that location"}</h3>
          <p>${filteredRestaurants.length > 0 ? `${numberFormatter.format(filteredRestaurants.length)} restaurants and their full matching dish lists are shown below. Results stay limited to Nepali and Indian cuisine only.` : "Try Chicago, Downtown Loop, North Side, West Corridor, Belmont, Randolph, Taylor, or Milwaukee."}</p>
        </div>
        <div class="food-results-card-mark">${filteredRestaurants.length > 0 ? "NEARBY" : "SEARCH"}</div>
      </div>
      ${
        filteredRestaurants.length > 0
          ? `<div class="food-results-pills">
               <span>${numberFormatter.format(filteredRestaurants.length)} nearby restaurants</span>
               <span>${numberFormatter.format(totalItems)} matching dishes</span>
               <span>Nepali and Indian only</span>
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
          <h3>No nearby Nepali or Indian food found</h3>
          <p>Try searching by city, neighborhood, street, restaurant, or dish name such as Chicago, Downtown Loop, momo, biryani, or thali.</p>
        </article>
      `;
}

const locationButton = document.querySelector("#food-location-button");
const locationInput = document.querySelector("#food-location-search");

if (locationButton && locationInput) {
  locationButton.addEventListener("click", renderFoodResults);
  locationInput.addEventListener("input", renderFoodResults);
}

renderFoodResults();

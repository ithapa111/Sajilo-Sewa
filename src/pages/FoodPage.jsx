import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FoodMapView({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) {
      return;
    }

    const bounds = L.latLngBounds(locations.map((spot) => [spot.lat, spot.lng]));
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [locations, map]);

  return null;
}

const FOOD_SPOTS = [
  {
    id: 'food_irv_001',
    name: 'Everest Momo House',
    rating: 4.9,
    reviews: 1250,
    cuisine: 'Nepali Favorites',
    price: '$$',
    image: '/assets/Momo.1.jpg',
    description: 'Steamed and jhol momo trays with warming soups and quick evening delivery.',
    features: ['Community Favorite', 'Fresh Momo', 'Late Night'],
    topDishes: ['Chicken Jhol Momo', 'Buff C Momo'],
    eta: '22-32 min',
    lat: 32.8144,
    lng: -96.9489,
    area: 'North Irving'
  },
  {
    id: 'food_irv_002',
    name: 'Thakali Set Kitchen',
    rating: 4.8,
    reviews: 910,
    cuisine: 'Nepali Thali',
    price: '$$',
    image: '/assets/ThaliSet.jpg',
    description: 'Balanced thali plates with achar, dal, curry, rice, and family-style portions.',
    features: ['Thakali Set', 'Family Meals', 'Homestyle'],
    topDishes: ['Chicken Thakali Set', 'Veg Thali'],
    eta: '28-38 min',
    lat: 32.8237,
    lng: -96.9588,
    area: 'Valley Ranch'
  },
  {
    id: 'food_irv_003',
    name: 'Chowmein Corner',
    rating: 4.8,
    reviews: 740,
    cuisine: 'Nepali Street Style',
    price: '$',
    image: '/assets/Chowein.1.webp',
    description: 'Wok-tossed chowmein, chili sauces, and quick bites that travel well to laptop orders.',
    features: ['Quick Bite', 'Street Food', 'Spicy'],
    topDishes: ['Chicken Chowmein', 'Chili Momo'],
    eta: '18-26 min',
    lat: 32.8109,
    lng: -96.9676,
    area: 'MacArthur District'
  },
  {
    id: 'food_irv_004',
    name: 'Sajilo Signature Meals',
    rating: 4.7,
    reviews: 1380,
    cuisine: 'Nepali & Indian',
    price: '$$',
    image: '/assets/Food.jpg',
    description: 'Mixed comfort menu of curries, rice bowls, momo platters, and festive specials.',
    features: ['Best Seller', 'Combo Deals', 'Office Lunch'],
    topDishes: ['Paneer Curry Bowl', 'Mixed Momo Combo'],
    eta: '24-34 min',
    lat: 32.8274,
    lng: -96.9394,
    area: 'Las Colinas'
  }
];

const FAVORITES = [
  {
    id: 'fav_1',
    title: 'Office Lunch Picks',
    text: 'Reliable meals sized for workdays, shared trays, and midday team orders.',
    image: '/assets/Food.jpg'
  },
  {
    id: 'fav_2',
    title: 'Momo Night',
    text: 'Steam, fry, or jhol styles for group cravings without losing texture on delivery.',
    image: '/assets/Momo.1.jpg'
  },
  {
    id: 'fav_3',
    title: 'Family Thali',
    text: 'Comfort plates that still look full and balanced on wider laptop layouts.',
    image: '/assets/ThaliSet.jpg'
  }
];

const FoodPage = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const activeCount = FOOD_SPOTS.filter((spot) => spot.rating >= 4.8).length;
  const featuredDishCount = FOOD_SPOTS.reduce((total, spot) => total + spot.topDishes.length, 0);
  const avgRating = (FOOD_SPOTS.reduce((total, spot) => total + spot.rating, 0) / FOOD_SPOTS.length).toFixed(1);

  const filteredSpots = FOOD_SPOTS.filter((spot) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      spot.name.toLowerCase().includes(query) ||
      spot.cuisine.toLowerCase().includes(query) ||
      spot.topDishes.some((dish) => dish.toLowerCase().includes(query));

    const matchesFilter =
      filter === 'all' ||
      (filter === 'nepali' && spot.cuisine.toLowerCase().includes('nepali')) ||
      (filter === 'combo' && spot.features.some((feature) => feature.toLowerCase().includes('combo') || feature.toLowerCase().includes('family'))) ||
      (filter === 'rated' && spot.rating >= 4.8);

    return matchesSearch && matchesFilter;
  });

  const mapSpots = filteredSpots.length ? filteredSpots : FOOD_SPOTS;

  return (
    <div className="food-page-main">
      <section className="food-hero-refined">
        <div className="food-hero-copy">
          <span className="location-badge">Premium Nepali & Indian Cuisine</span>
          <h1>Delicious meals, delivered to your door, with the local media restored.</h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '60ch' }}>
            Browse the best local Nepali and Indian picks for momo, chowmein, thali, and comfort meals in a layout that stays clean on laptop screens.
          </p>

          <form className="yelp-search-container" role="search" onSubmit={(event) => event.preventDefault()}>
            <div className="yelp-input-group">
              <label className="yelp-label" htmlFor="food-find-input">Find</label>
              <input
                id="food-find-input"
                className="yelp-input"
                type="text"
                placeholder="momo, chowmein, thali..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="yelp-input-group">
              <label className="yelp-label" htmlFor="food-near-input">Near</label>
              <input id="food-near-input" className="yelp-input" type="text" value="Irving, Texas" readOnly />
            </div>
            <button className="yelp-search-button" type="submit" aria-label="Search food">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <div className="food-service-modes" style={{ marginTop: '18px' }}>
            <span className="food-service-mode is-active">Delivery</span>
            <span className="food-service-mode">Pickup</span>
            <span className="food-service-mode">Dine-in</span>
          </div>
        </div>

        <div className="food-hero-visual">
          <div className="food-hero-photo-stack">
            <img className="food-hero-photo is-primary" src="/assets/Food.jpg" alt="Assorted Nepali and Indian food platter" />
            <img className="food-hero-photo is-secondary" src="/assets/Momo.1.jpg" alt="Plate of momo for delivery" />
          </div>
          <div className="home-service-card" style={{ margin: 0 }}>
            <div className="home-service-media">
              <img src="/assets/Chowein.1.webp" alt="Chowmein meal" />
            </div>
            <p className="label">Featured media</p>
            <h3>Food photography restored for the food page cards and hero.</h3>
            <span className="home-service-link">Local photo set</span>
          </div>
        </div>
      </section>

      <section id="results">
        <div>
          <p className="eyebrow">Top restaurants near you</p>
          <h2>Food results</h2>
          <p className="food-results-summary">
            Showing {filteredSpots.length} restaurants and {featuredDishCount} featured dishes for your current food search.
          </p>
        </div>

        <div className="food-filter-row">
          <button className={`food-filter-chip ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>All spots</button>
          <button className={`food-filter-chip ${filter === 'rated' ? 'is-active' : ''}`} onClick={() => setFilter('rated')}>4.8+ rated</button>
          <button className={`food-filter-chip ${filter === 'nepali' ? 'is-active' : ''}`} onClick={() => setFilter('nepali')}>Nepali</button>
          <button className={`food-filter-chip ${filter === 'combo' ? 'is-active' : ''}`} onClick={() => setFilter('combo')}>Combos</button>
        </div>

        <article className="food-results-card">
          <div className="food-results-card-top">
            <div className="food-results-card-copy">
              <p className="label">Search results</p>
              <h3>Hand-picked Nepali and Indian spots with delivery-friendly menus.</h3>
              <p>
                Results blend the earlier restaurant discovery feel with the updated local food media, tighter laptop sizing, and quick menu browsing.
              </p>
            </div>
            <div className="food-results-card-mark">NEARBY</div>
          </div>
          <div className="food-results-pills">
            <span>{filteredSpots.length} restaurants</span>
            <span>{featuredDishCount} featured dishes</span>
            <span>{activeCount} top rated</span>
            <span>Irving, Texas</span>
          </div>
          <div className="food-results-metrics">
            <article>
              <strong>{filteredSpots.length}</strong>
              <span>Restaurants</span>
            </article>
            <article>
              <strong>{featuredDishCount}</strong>
              <span>Popular dishes</span>
            </article>
            <article>
              <strong>22-38 min</strong>
              <span>Typical ETA</span>
            </article>
          </div>
        </article>

        <section className="map-card" data-theme="food">
          <div className="food-results-card-top">
            <div className="food-results-card-copy">
              <p className="label">Restaurant map</p>
              <h3>Nepali and Indian restaurants around Irving.</h3>
              <p>
                This fills the open gap with a live map focused only on the food listings shown on this page.
              </p>
            </div>
            <div className="food-results-card-mark">MAP</div>
          </div>

          <div className="live-map" data-theme="food" style={{ minHeight: '440px' }}>
            <MapContainer
              center={[32.8176, -96.9497]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <FoodMapView locations={mapSpots} />
              {mapSpots.map((spot) => (
                <Marker key={spot.id} position={[spot.lat, spot.lng]}>
                  <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                    <div>
                      <strong>{spot.name}</strong>
                      <div>{spot.cuisine}</div>
                      <div>{spot.area}</div>
                    </div>
                  </Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="map-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: '#ff8a1f' }}></span>
              Nepali and Indian restaurants
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: '#d65216' }}></span>
              Filtered to current food results
            </span>
          </div>

          <div className="food-results-metrics" style={{ marginTop: '18px' }}>
            <article>
              <strong>{mapSpots.length}</strong>
              <span>Mapped restaurants</span>
            </article>
            <article>
              <strong>{avgRating}</strong>
              <span>Average rating</span>
            </article>
            <article>
              <strong>Irving</strong>
              <span>Coverage area</span>
            </article>
          </div>
        </section>

        <div id="food-results-list" className="food-favorites-grid">
          {filteredSpots.map((spot, index) => (
            <article key={spot.id} className="food-result-restaurant">
              <div className={`food-result-cover ${index % 3 === 0 ? 'is-momo' : index % 3 === 1 ? 'is-thali' : 'is-curry'}`}>
                <img className="food-result-cover-image" src={spot.image} alt={spot.name} loading="lazy" />
                <div className="food-result-cover-overlay">
                  <span>{spot.eta}</span>
                  <strong>{spot.price} | {spot.cuisine}</strong>
                </div>
              </div>

              <div className="food-result-header">
                <div className="food-result-brand">
                  <div className="food-result-mark">{spot.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <h3>{spot.name}</h3>
                    <p>{spot.description}</p>
                  </div>
                </div>
                <div className="food-result-rating">
                  <strong>{spot.rating}</strong>
                  <span>{spot.reviews} reviews</span>
                </div>
              </div>

              <div className="food-result-pills">
                {spot.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>

              <div className="food-result-meta">
                Top dishes: {spot.topDishes.join(', ')}
              </div>

              <div className="food-result-action-row">
                <button className="button primary food-result-action" type="button">Order delivery</button>
                <button className="button secondary food-result-action" type="button">View menu</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="favorites">
        <div>
          <p className="eyebrow">Popular dishes in your area</p>
          <h2>Favorite meal collections</h2>
        </div>
        <div className="food-favorites-grid">
          {FAVORITES.map((favorite) => (
            <article key={favorite.id} className="food-meal-card">
              <img className="food-meal-image" src={favorite.image} alt={favorite.title} loading="lazy" />
              <span className="food-meal-badge">Popular</span>
              <h3>{favorite.title}</h3>
              <p>{favorite.text}</p>
              <div className="food-meal-footer">
                <span>Updated gallery</span>
                <span>Desktop friendly</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="food-support-section">
        <div className="food-support-copy">
          <p className="eyebrow">Need help with your order?</p>
          <h2>Food support is available every day.</h2>
          <p>
            The earlier support section is back in a lighter form so the page still feels complete without overwhelming the restaurant grid.
          </p>
        </div>
        <div className="food-result-action-row">
          <a className="button primary food-result-action" href="tel:+13125550101">Call Support</a>
          <a className="button secondary food-result-action" href="#chat">Live Chat</a>
        </div>
      </section>
    </div>
  );
};

export default FoodPage;

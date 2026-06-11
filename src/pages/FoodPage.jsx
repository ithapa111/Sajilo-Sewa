import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import logoMark from '../../assets/logo-mark.svg';
import logoName from '../../assets/LogoName-header.png';

const restaurants = [
  {
    id: 'everest-momo',
    name: 'Everest Momo House',
    area: 'North Irving',
    cuisine: 'Momo, chowmein, Nepali snacks',
    rating: 4.9,
    reviews: 1250,
    comment: 'The jhol momo tastes like home.',
    deliveryTime: '25-35 min',
    dineInTime: 'Open until 10 PM',
    image: '/assets/Momo.1.jpg',
    dishes: [
      { id: 'jhol-momo', name: 'Chicken Jhol Momo', price: 12.99, note: 'Warm broth, house achar' },
      { id: 'chili-momo', name: 'Chili Momo', price: 11.99, note: 'Crispy, spicy, shareable' },
    ],
  },
  {
    id: 'thakali-set',
    name: 'Thakali Set Kitchen',
    area: 'Valley Ranch',
    cuisine: 'Thali, dal bhat, homestyle meals',
    rating: 4.8,
    reviews: 910,
    comment: 'Big portions and fresh achar.',
    deliveryTime: '30-40 min',
    dineInTime: 'Tables available now',
    image: '/assets/ThaliSet.jpg',
    dishes: [
      { id: 'chicken-thakali', name: 'Chicken Thakali Set', price: 16.5, note: 'Rice, dal, achar, curry' },
      { id: 'veg-thali', name: 'Vegetarian Thali', price: 14.5, note: 'Simple, filling, balanced' },
    ],
  },
  {
    id: 'chowmein-corner',
    name: 'Chowmein Corner',
    area: 'MacArthur District',
    cuisine: 'Street food, noodles, quick bites',
    rating: 4.8,
    reviews: 740,
    comment: 'Fast, spicy, and always hot.',
    deliveryTime: '18-28 min',
    dineInTime: 'Counter seats open',
    image: '/assets/Chowein.1.webp',
    dishes: [
      { id: 'chicken-chowmein', name: 'Chicken Chowmein', price: 10.99, note: 'Wok tossed, mild or spicy' },
      { id: 'veg-chowmein', name: 'Veg Chowmein', price: 9.99, note: 'Fresh vegetables, house sauce' },
    ],
  },
  {
    id: 'sajilo-meals',
    name: 'Sajilo Signature Meals',
    area: 'Las Colinas',
    cuisine: 'Curries, rice bowls, family combos',
    rating: 4.7,
    reviews: 1380,
    comment: 'Best combo for family dinner.',
    deliveryTime: '24-34 min',
    dineInTime: 'Good for families',
    image: '/assets/Food.jpg',
    dishes: [
      { id: 'mixed-momo-combo', name: 'Mixed Momo Combo', price: 18.99, note: 'Steam, fried, and chili momo' },
      { id: 'paneer-bowl', name: 'Paneer Curry Bowl', price: 13.99, note: 'Rice, paneer, fresh salad' },
    ],
  },
  {
    id: 'himalayan-kitchen',
    name: 'Himalayan Kitchen',
    area: 'Euless',
    cuisine: 'Sekuwa, thali, fried rice',
    rating: 4.8,
    reviews: 620,
    comment: 'Great sekuwa and quick service.',
    deliveryTime: '22-32 min',
    dineInTime: 'Seats open',
    image: '/assets/Food.jpg',
    dishes: [
      { id: 'chicken-sekuwa', name: 'Chicken Sekuwa', price: 14.99, note: 'Smoky grilled chicken' },
      { id: 'veg-fried-rice', name: 'Veg Fried Rice', price: 10.99, note: 'Simple and fresh' },
    ],
  },
  {
    id: 'momo-bazaar',
    name: 'Momo Bazaar',
    area: 'Arlington',
    cuisine: 'Steam momo, fried momo',
    rating: 4.9,
    reviews: 845,
    comment: 'Best momo sauce in town.',
    deliveryTime: '20-30 min',
    dineInTime: 'Busy but open',
    image: '/assets/Momo.1.jpg',
    dishes: [
      { id: 'buff-momo', name: 'Buff Momo', price: 13.99, note: 'Classic Nepali taste' },
      { id: 'fried-momo', name: 'Fried Momo', price: 12.99, note: 'Crispy outside' },
    ],
  },
  {
    id: 'curry-leaf',
    name: 'Curry Leaf',
    area: 'Plano',
    cuisine: 'Curry, naan, rice bowls',
    rating: 4.6,
    reviews: 530,
    comment: 'Good curry for late dinner.',
    deliveryTime: '28-38 min',
    dineInTime: 'Open until 9 PM',
    image: '/assets/Food.jpg',
    dishes: [
      { id: 'butter-chicken', name: 'Butter Chicken', price: 15.99, note: 'Creamy and mild' },
      { id: 'garlic-naan', name: 'Garlic Naan', price: 3.99, note: 'Fresh from the oven' },
    ],
  },
  {
    id: 'newa-khaja',
    name: 'Newa Khaja Ghar',
    area: 'Fort Worth',
    cuisine: 'Chatamari, bara, snacks',
    rating: 4.7,
    reviews: 410,
    comment: 'Perfect for snacks with friends.',
    deliveryTime: '26-36 min',
    dineInTime: 'Tables available',
    image: '/assets/ThaliSet.jpg',
    dishes: [
      { id: 'chatamari', name: 'Chatamari', price: 9.99, note: 'Newari rice crepe' },
      { id: 'bara-set', name: 'Bara Set', price: 11.99, note: 'Lentil patties with achar' },
    ],
  },
];

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

const FoodPage = () => {
  const [serviceMode, setServiceMode] = useState('delivery');
  const [search, setSearch] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(restaurants[0].id);
  const [cart, setCart] = useState([]);

  const selectedRestaurant = restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) || restaurants[0];

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return restaurants;
    }

    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.area, restaurant.cuisine, ...restaurant.dishes.map((dish) => dish.name)]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const serviceFee = cart.length ? 1.99 : 0;
  const deliveryFee = serviceMode === 'delivery' && cart.length ? 3.49 : 0;
  const total = subtotal + serviceFee + deliveryFee;

  const addToCart = (dish) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === dish.id);

      if (existing) {
        return current.map((item) => (item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [...current, { ...dish, restaurant: selectedRestaurant.name, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId) => {
    setCart((current) =>
      current
        .map((item) => (item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <main className="food-order-page" id="main-content">
      <header className="food-order-header">
        <Link className="food-order-brand" to="/">
          <img alt="" src={logoMark} />
          <img alt="Sazilo Sewa" src={logoName} />
        </Link>
        <nav aria-label="Food navigation">
          <Link to="/">Home</Link>
          <Link to="/community-services">Community</Link>
          <Link to="/ride">Rides</Link>
          <Link to="/courier">Courier</Link>
        </nav>
      </header>

      <section className="food-order-hero">
        <div>
          <p className="eyebrow">{filteredRestaurants.length} restaurants near you</p>
          <h1>Pick a place. Add food. Done.</h1>
          <p>Momo, thali, chowmein, curry, sekuwa.</p>
        </div>

        <div className="food-order-mode" aria-label="Choose service type">
          <button className={serviceMode === 'delivery' ? 'is-active' : ''} onClick={() => setServiceMode('delivery')} type="button">
            Delivery
          </button>
          <button className={serviceMode === 'dine-in' ? 'is-active' : ''} onClick={() => setServiceMode('dine-in')} type="button">
            Dine-in
          </button>
        </div>
      </section>

      <section className="food-order-search" aria-label="Search food">
        <label htmlFor="food-search">Find food or restaurant</label>
        <input
          id="food-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Try momo, thali, chowmein..."
          type="search"
          value={search}
        />
        <span>{serviceMode === 'delivery' ? 'Delivering to Irving, TX' : 'Showing nearby dine-in spots'}</span>
      </section>

      <section className="food-order-layout">
        <div className="food-restaurant-section">
          <div className="food-section-title">
            <div>
              <p className="eyebrow">Restaurants</p>
              <h2>Popular nearby</h2>
            </div>
            <span>{filteredRestaurants.length} shown</span>
          </div>

          <div className="food-restaurant-grid" aria-label="Restaurants">
          {filteredRestaurants.map((restaurant) => (
            <button
              className={`food-restaurant-card ${restaurant.id === selectedRestaurant.id ? 'is-active' : ''}`}
              key={restaurant.id}
              onClick={() => setSelectedRestaurantId(restaurant.id)}
              type="button"
            >
              <img alt={restaurant.name} src={restaurant.image} />
              <div className="food-card-body">
                <div className="food-card-top">
                  <strong>{restaurant.name}</strong>
                  <b>{restaurant.rating}</b>
                </div>
                <span>{restaurant.cuisine}</span>
                <small>{restaurant.area} / {restaurant.reviews} reviews</small>
                <p>{restaurant.comment}</p>
                <em>{serviceMode === 'delivery' ? restaurant.deliveryTime : restaurant.dineInTime}</em>
              </div>
            </button>
          ))}

          {!filteredRestaurants.length ? (
            <div className="food-empty-state">
              <strong>No match found</strong>
              <p>Try momo, thali, chowmein, curry, or clear the search.</p>
              <button onClick={() => setSearch('')} type="button">
                Clear search
              </button>
            </div>
          ) : null}
          </div>
        </div>

        <aside className="food-side-panel">
          <div className="food-menu-panel">
          <div className="food-menu-heading">
            <div>
              <p className="eyebrow">Menu</p>
              <h2>{selectedRestaurant.name}</h2>
              <span>{selectedRestaurant.cuisine}</span>
              <p className="food-selected-review">
                {selectedRestaurant.rating} rating / "{selectedRestaurant.comment}"
              </p>
            </div>
            <img alt="" src={selectedRestaurant.image} />
          </div>

          <div className="food-dish-list">
            {selectedRestaurant.dishes.map((dish) => (
              <article className="food-dish-card" key={dish.id}>
                <div>
                  <h3>{dish.name}</h3>
                  <p>{dish.note}</p>
                  <strong>{formatPrice(dish.price)}</strong>
                </div>
                <button onClick={() => addToCart(dish)} type="button">
                  Add
                </button>
              </article>
            ))}
          </div>
          </div>

          <div className="food-cart-panel" aria-label="Order summary">
          <p className="eyebrow">{serviceMode === 'delivery' ? 'Delivery order' : 'Dine-in order'}</p>
          <h2>Your order</h2>

          {cart.length ? (
            <div className="food-cart-items">
              {cart.map((item) => (
                <div className="food-cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} x {formatPrice(item.price)}
                    </span>
                  </div>
                  <button aria-label={`Remove one ${item.name}`} onClick={() => removeFromCart(item.id)} type="button">
                    -
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="food-cart-empty">Add a dish to start your order.</p>
          )}

          <div className="food-cart-total">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div>
              <span>Service fee</span>
              <strong>{formatPrice(serviceFee)}</strong>
            </div>
            <div>
              <span>{serviceMode === 'delivery' ? 'Delivery fee' : 'Table service'}</span>
              <strong>{serviceMode === 'delivery' ? formatPrice(deliveryFee) : 'Included'}</strong>
            </div>
            <div className="is-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <button className="food-checkout-button" disabled={!cart.length} type="button">
            {serviceMode === 'delivery' ? 'Place delivery order' : 'Reserve dine-in table'}
          </button>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default FoodPage;

import { Link, useNavigate } from 'react-router-dom';
import homeHeroImage from '../assets/home-hero-nepal-market.jpg';
import courierImage from '../../assets/courier.jpg';
import foodImage from '../../assets/Food.jpg';
import logoMark from '../../assets/logo-mark.svg';
import logoName from '../../assets/LogoName-header.png';
import rideImage from '../../assets/Ridesharing.png';
import SiteFooter from '../components/SiteFooter';

const serviceCards = [
  {
    title: 'Community services',
    label: 'Help',
    description: 'Find local help, events, places, and support requests.',
    image: homeHeroImage,
    imageAlt: '',
    linkLabel: 'Open community services',
    to: '/community-services',
    variant: 'is-community',
  },
  {
    title: 'Food and homemade meals',
    label: 'Food',
    description: 'Order momo, thali, groceries, and homemade meals from nearby places.',
    image: foodImage,
    imageAlt: '',
    linkLabel: 'Browse food delivery',
    to: '/food',
    variant: 'is-food',
  },
  {
    title: 'Rides and carpools',
    label: 'Rides',
    description: 'Plan local rides, airport pickups, and shared travel for events.',
    image: rideImage,
    imageAlt: '',
    linkLabel: 'Open ride support',
    to: '/ride',
    variant: 'is-ride',
  },
  {
    title: 'Courier and errands',
    label: 'Courier',
    description: 'Send documents, parcels, and local errands with clear tracking.',
    image: courierImage,
    imageAlt: '',
    linkLabel: 'Open courier service',
    to: '/courier',
    variant: 'is-courier',
  },
];

const heroLinks = [
  { label: 'Community Services', to: '/community-services' },
  { label: 'Food', to: '/food' },
  { label: 'Rides', to: '/ride' },
  { label: 'Courier', to: '/courier' },
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const search = String(formData.get('find') || '').trim();

    navigate(search ? `/community-services?search=${encodeURIComponent(search)}` : '/community-services');
  };

  return (
    <>
      <header className="home-topbar">
        <Link className="brand-lockup" style={{ color: 'inherit', textDecoration: 'none' }} to="/">
          <img alt="" className="brand-logo" src={logoMark} />
          <div className="brand-stack">
            <img alt="Sazilo Sewa" className="brand-name-logo" src={logoName} />
            <p className="eyebrow" style={{ margin: 0, color: 'var(--muted)' }}>
              Local help for Nepalese communities
            </p>
          </div>
        </Link>

        <nav aria-label="Primary" className="home-header-actions">
          {heroLinks.map((item) => (
            <Link className="home-header-link" key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main id="main-content">
        <section
          aria-labelledby="home-title"
          className="home-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.58)), url("${homeHeroImage}")`,
          }}
        >
          <div>
            <p className="eyebrow" style={{ color: 'rgba(255, 255, 255, 0.88)', marginBottom: '16px' }}>
              Food, rides, delivery, events, and local help
            </p>
            <h1 className="yelp-logo" id="home-title">
              What do you need today?
            </h1>
            <p className="hero-text" style={{ color: 'rgba(255, 255, 255, 0.92)', margin: '0 auto 24px', maxWidth: '46rem' }}>
              Search once, then choose the service that fits.
            </p>

            <form aria-label="Search community services" className="yelp-search-container" onSubmit={handleSearchSubmit} role="search">
              <div className="yelp-input-group">
                <label className="yelp-label" htmlFor="home-find-input">
                  Find
                </label>
                <input
                  className="yelp-input"
                  id="home-find-input"
                  name="find"
                  placeholder="support, dentist, volunteer, events..."
                  type="search"
                />
              </div>
              <div className="yelp-input-group">
                <label className="yelp-label" htmlFor="home-near-input">
                  Near
                </label>
                <input className="yelp-input" defaultValue="Chicago, IL" id="home-near-input" name="near" type="text" />
              </div>
              <button className="yelp-search-button" type="submit">
                Search
              </button>
            </form>
          </div>
        </section>

        <div className="page-shell home-page-shell">
          <section aria-labelledby="service-preview-title" className="home-services">
            <h2 className="sr-only" id="service-preview-title">
              Main services
            </h2>

            {serviceCards.map((card) => (
              <Link aria-label={card.linkLabel} className={`home-service-card ${card.variant}`} key={card.title} to={card.to}>
                <div className="home-service-media">
                  <img alt={card.imageAlt} decoding="async" loading="lazy" src={card.image} />
                </div>
                <p className="label">{card.label}</p>
                <h3>{card.title}</h3>
                <span className="home-service-link">Open</span>
                <p className="sr-only">{card.description}</p>
              </Link>
            ))}
          </section>

          <SiteFooter />
        </div>
      </main>
    </>
  );
};

export default HomePage;

import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <section className="home-hero">
        <div className="yelp-logo">Sazilo</div>

        <form className="yelp-search-container" role="search" aria-label="Service search">
          <div className="yelp-input-group">
            <label className="yelp-label" htmlFor="home-find-input">Find</label>
            <input id="home-find-input" className="yelp-input" type="text" placeholder="restaurant, rides, courier..." />
          </div>
          <div className="yelp-input-group">
            <label className="yelp-label" htmlFor="home-near-input">Near</label>
            <input id="home-near-input" className="yelp-input" type="text" defaultValue="Chicago, IL" />
          </div>
          <button className="yelp-search-button" type="submit" aria-label="Search services">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>
      </section>

      <section className="home-marketplace-band home-community-spotlight" aria-label="Other community Services">
        <div className="home-community-copy">
          <p className="eyebrow">Other community Services</p>
          <h2>Explore the community side of Sazilo in a more dedicated space.</h2>
          <p className="home-community-text">
            Browse trusted Nepalese community support, volunteering help, legal referrals, sports groups,
            places, and other specialized services in one stronger dashboard experience.
          </p>

          <div className="home-community-highlights" aria-label="Community highlights">
            <span>Support requests</span>
            <span>Volunteer opportunities</span>
            <span>Local events</span>
            <span>Places and connections</span>
          </div>

          <div className="home-community-actions">
            <Link className="button primary" to="/community-services">Open community dashboard</Link>
            <span className="home-community-note">One place for services, support, events, and meaningful local discovery.</span>
          </div>
        </div>

        <div className="home-community-visual" aria-hidden="true">
          <div className="home-community-panel home-community-panel-primary">
            <p className="eyebrow">Live community feed</p>
            <h3>Active support, upcoming events, and trusted discovery.</h3>
            <div className="home-community-mini-grid">
              <div className="home-community-stat">
                <strong>28</strong>
                <span>seeking help</span>
              </div>
              <div className="home-community-stat">
                <strong>14</strong>
                <span>volunteers online</span>
              </div>
            </div>
          </div>

          <div className="home-community-panel home-community-panel-secondary">
            <p className="eyebrow">Featured this week</p>
            <h3>Potlucks, legal help, matchmaking, and social sewa in one dashboard.</h3>
          </div>
        </div>
      </section>

      <section className="home-services">
        <Link className="home-service-card is-food" to="/food">
          <div className="home-service-media">
            <img src="https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=1000&auto=format&fit=crop" alt="Food delivery" />
          </div>
          <p className="label">Food delivery</p>
          <h3>Warm Nepali and Indian meals delivered fast.</h3>
          <span className="home-service-link">Open food</span>
        </Link>

        <Link className="home-service-card is-ride" to="/ride">
          <div className="home-service-media">
            <img src="/assets/Ridesharing.png" alt="Ridesharing" />
          </div>
          <p className="label">Ridesharing</p>
          <h3>Quick city rides with live status and safer trips.</h3>
          <span className="home-service-link">Open rides</span>
        </Link>

        <Link className="home-service-card is-courier" to="/courier">
          <div className="home-service-media">
            <img src="/assets/courier.jpg" alt="Courier delivery" />
          </div>
          <p className="label">Courier</p>
          <h3>Pickup to dropoff tracking with clear quotes.</h3>
          <span className="home-service-link">Open courier</span>
        </Link>
      </section>
    </>
  );
};

export default HomePage;

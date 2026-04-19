import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();
  const isCommunityDashboard = location.pathname === '/community-services';
  
  const isActive = (path) => location.pathname === path;

  if (isCommunityDashboard) {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={isActive('/') ? 'active' : ''}>
        <span className="icon">🏠</span>
        <span>Home</span>
      </Link>
      <Link to="/community-services" className={isActive('/community-services') ? 'active' : ''}>
        <span className="icon">🔍</span>
        <span>Other community Services</span>
      </Link>
      <Link to="/ride" className={isActive('/ride') ? 'active' : ''}>
        <span className="icon">🚗</span>
        <span>Rides</span>
      </Link>
      <Link to="/food" className={isActive('/food') ? 'active' : ''}>
        <span className="icon">🍲</span>
        <span>Food</span>
      </Link>
      <Link to="/account" className={isActive('/account') ? 'active' : ''}>
        <span className="icon">👤</span>
        <span>Account</span>
      </Link>

      <style>{`
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          display: none;
          justify-content: space-around;
          padding: 0.75rem 0.5rem;
          box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
          border-top: 1px solid #eee;
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
          }
          /* Adjust layout padding to avoid being hidden by nav */
          body { padding-bottom: 70px; }
        }

        .mobile-bottom-nav a {
          text-decoration: none;
          color: #888;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .mobile-bottom-nav a.active {
          color: var(--accent);
        }

        .mobile-bottom-nav .icon {
          font-size: 1.4rem;
        }
      `}</style>
    </nav>
  );
};

export default MobileNav;

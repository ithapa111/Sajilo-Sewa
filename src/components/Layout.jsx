import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SiteFooter from './SiteFooter';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isCommunityDashboard = location.pathname === '/community-services';

  const routeClassMap = {
    '/': { body: 'home-page-body', shell: 'home-page-shell', main: 'home-main' },
    '/food': { body: 'food-page-body', shell: 'food-page-shell', main: 'food-page-main' },
    '/ride': { body: 'ride-page-body', shell: 'ride-page-shell', main: 'ride-page-main' },
    '/courier': { body: 'courier-page-body', shell: 'courier-page-shell', main: 'courier-page-main' },
    '/marketplace': { body: 'marketplace-page-body', shell: 'marketplace-page-shell', main: 'marketplace-main' },
    '/community-services': { body: 'community-dashboard-body', shell: 'community-dashboard-shell', main: 'community-dashboard-main' },
    '/account': { body: 'account-page-body', shell: 'account-page-shell', main: 'account-main' },
  };

  const activeRouteClasses = routeClassMap[location.pathname] || (
    location.pathname.startsWith('/business/')
      ? { body: 'business-page-body', shell: 'business-page-shell', main: 'business-main' }
      : { body: '', shell: '', main: 'home-main' }
  );

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    // Optionally call an API to clear the cookie/session if needed
  };

  useEffect(() => {
    const knownBodyClasses = [
      'home-page-body',
      'food-page-body',
      'ride-page-body',
      'courier-page-body',
      'marketplace-page-body',
      'community-dashboard-body',
      'business-page-body',
      'account-page-body',
    ];

    document.body.classList.remove(...knownBodyClasses);

    if (activeRouteClasses.body) {
      document.body.classList.add(activeRouteClasses.body);
    }

    return () => {
      if (activeRouteClasses.body) {
        document.body.classList.remove(activeRouteClasses.body);
      }
    };
  }, [activeRouteClasses.body]);

  return (
    <div className={`page-shell ${activeRouteClasses.shell}`.trim()}>
      {!isCommunityDashboard && (
        <header className="home-header">
          <div className="home-topbar">
            <Link to="/" className="brand-lockup" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img className="brand-logo" src="/assets/logo-mark.svg" alt="Sazilo logo" />
              <div className="brand-stack">
                <div>
                  <img className="brand-name-logo" src="/assets/LogoName-header.png" alt="Sazilo Sewa" />
                  <p className="eyebrow" style={{ margin: 0, fontSize: '0.66rem', color: 'var(--muted)' }}>Multi-service Platform</p>
                </div>
              </div>
            </Link>
            <div className="home-header-actions">
              <Link className="home-header-link" to="/community-services">Other community Services</Link>
              {user ? (
                <>
                  <Link className="home-header-link" to="/account">{user.fullName || 'My Account'}</Link>
                  <a className="home-header-link" href="#logout" onClick={handleLogout}>Log Out</a>
                </>
              ) : (
                <Link className="home-header-link" to="/account?type=member">Log In</Link>
              )}
              <Link className="button primary home-header-button" to="/account?type=business">List Business</Link>
            </div>
          </div>
        </header>
      )}

      <main id="main-content" className={activeRouteClasses.main} tabIndex="-1">
        {children}
      </main>

      {!isCommunityDashboard && <SiteFooter />}
    </div>
  );
};

export default Layout;

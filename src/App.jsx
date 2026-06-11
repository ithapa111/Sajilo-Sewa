import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BusinessPage from './pages/BusinessPage';
import CommunityServicesPage from './pages/CommunityServicesPage';
import CourierPage from './pages/CourierPage';
import FoodPage from './pages/FoodPage';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import RidePage from './pages/RidePage';

const managedBodyClasses = [
  'home-page-body',
  'community-page-body',
  'food-page-body',
  'ride-page-body',
  'courier-page-body',
  'marketplace-page-body',
  'business-page-body',
];

const routeMeta = {
  '/': {
    bodyClass: 'home-page-body',
    title: 'Sazilo Sewa | Home',
  },
  '/marketplace': {
    bodyClass: 'marketplace-page-body',
    title: 'Sazilo Sewa | Marketplace',
  },
  '/community-services': {
    bodyClass: 'community-page-body',
    title: 'Sazilo Sewa | Community Services',
  },
  '/ride': {
    bodyClass: 'ride-page-body',
    title: 'Sazilo Sewa | Rides',
  },
  '/food': {
    bodyClass: 'food-page-body',
    title: 'Sazilo Sewa | Food',
  },
  '/courier': {
    bodyClass: 'courier-page-body',
    title: 'Sazilo Sewa | Courier',
  },
};

function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    const meta =
      routeMeta[location.pathname] ||
      (location.pathname.startsWith('/business/') ? { bodyClass: 'business-page-body', title: 'Sazilo Sewa | Business' } : routeMeta['/']);

    document.body.classList.remove(...managedBodyClasses);

    if (meta.bodyClass) {
      document.body.classList.add(meta.bodyClass);
    }

    document.title = meta.title;
  }, [location.pathname]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (location.hash) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(location.hash.slice(1));

        if (target) {
          target.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }
      });

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <RouteEffects />
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<MarketplacePage />} path="/marketplace" />
        <Route element={<CommunityServicesPage />} path="/community-services" />
        <Route element={<RidePage />} path="/ride" />
        <Route element={<FoodPage />} path="/food" />
        <Route element={<CourierPage />} path="/courier" />
        <Route element={<BusinessPage />} path="/business/:slug" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

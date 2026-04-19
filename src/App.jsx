import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import MobileNav from './components/MobileNav';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import MarketplacePage from './pages/MarketplacePage';
import RidePage from './pages/RidePage';
import FoodPage from './pages/FoodPage';
import CourierPage from './pages/CourierPage';
import BusinessPage from './pages/BusinessPage';
import CommunityServicesPage from './pages/CommunityServicesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/community-services" element={<CommunityServicesPage />} />
            <Route path="/ride" element={<RidePage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/courier" element={<CourierPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/business/:slug" element={<BusinessPage />} />
          </Routes>
        </Layout>
        <MobileNav />
      </Router>
    </AuthProvider>
  );
}

export default App;

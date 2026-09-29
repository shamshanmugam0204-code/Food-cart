import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ExplorePage from './pages/customer/ExplorePage';
import RestaurantDetailPage from './pages/customer/RestaurantDetailPage';
import SearchPage from './pages/customer/SearchPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import TrackOrderPage from './pages/customer/TrackOrderPage';
import OrdersPage from './pages/customer/OrdersPage';
import FavoritesPage from './pages/customer/FavoritesPage';
import ProfilePage from './pages/customer/ProfilePage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';

// Partner Pages & Layout
import { PartnerLayout } from './components/partner/PartnerLayout';
import PartnerLoginPage from './pages/partner/PartnerLoginPage';
import PartnerDashboardPage from './pages/partner/PartnerDashboardPage';
import PartnerOrdersPage from './pages/partner/PartnerOrdersPage';
import PartnerMenuPage from './pages/partner/PartnerMenuPage';
import PartnerAnalyticsPage from './pages/partner/PartnerAnalyticsPage';
import PartnerSettingsPage from './pages/partner/PartnerSettingsPage';

// Admin Pages & Layout
import { AdminLayout } from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes with AppShell (Header, Footer, Cart) */}
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Partner Login (standalone) */}
        <Route path="/partner/login" element={<PartnerLoginPage />} />

        {/* Partner Portal Routes */}
        <Route path="/partner" element={<PartnerLayout />}>
          <Route index element={<Navigate to="/partner/dashboard" replace />} />
          <Route path="dashboard" element={<PartnerDashboardPage />} />
          <Route path="orders" element={<PartnerOrdersPage />} />
          <Route path="menu" element={<PartnerMenuPage />} />
          <Route path="analytics" element={<PartnerAnalyticsPage />} />
          <Route path="settings" element={<PartnerSettingsPage />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="restaurants" element={<AdminRestaurantsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

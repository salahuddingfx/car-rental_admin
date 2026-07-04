import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminOverview from './pages/AdminOverview';
import AdminCars from './pages/AdminCars';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import AdminHero from './pages/AdminHero';
import AdminBrands from './pages/AdminBrands';
import AdminFeatures from './pages/AdminFeatures';
import AdminFaq from './pages/AdminFaq';
import AdminOffers from './pages/AdminOffers';
import AdminAbout from './pages/AdminAbout';
import AdminContact from './pages/AdminContact';
import AdminFooter from './pages/AdminFooter';
import AdminBlog from './pages/AdminBlog';
import AdminReviews from './pages/AdminReviews';
import AdminTimeline from './pages/AdminTimeline';
import AdminNavbar from './pages/AdminNavbar';
import AdminChats from './pages/AdminChats';
import AdminBookings from './pages/AdminBookings';
import AdminReviewLinks from './pages/AdminReviewLinks';
import AdminCategories from './pages/AdminCategories';
import { AdminPayments } from './pages/AdminPayments';
import AdminProviders from './pages/AdminProviders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="faq" element={<AdminFaq />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="footer" element={<AdminFooter />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="timeline" element={<AdminTimeline />} />
          <Route path="navbar" element={<AdminNavbar />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="review-links" element={<AdminReviewLinks />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="providers" element={<AdminProviders />} />
        </Route>
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

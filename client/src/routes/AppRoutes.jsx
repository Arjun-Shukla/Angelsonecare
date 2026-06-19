import { Routes, Route, Navigate } from 'react-router-dom';

import { ROLES } from '../constants/index.js';

import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

import DashboardLayout from '../components/layout/DashboardLayout.jsx';

// Public pages
import Home from '../pages/public/Home.jsx';
import Services from '../pages/public/Services.jsx';
import Contact from '../pages/public/Contact.jsx';

// Auth pages
import Login          from '../pages/auth/Login.jsx';
import Signup         from '../pages/auth/Signup.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import OAuthCallback  from '../pages/auth/OAuthCallback.jsx';

// Client pages
import ClientDashboard from '../pages/client/Dashboard.jsx';
import MyBookings from '../pages/client/MyBookings.jsx';
import BookService from '../pages/client/BookService.jsx';
import ClientTickets from '../pages/client/Tickets.jsx';
import ClientReviews from '../pages/client/Reviews.jsx';
import BookingDetail from '../pages/client/BookingDetail.jsx';
import Profile from '../pages/client/Profile.jsx';

// Leader pages
import AssignedBookings from '../pages/leader/AssignedBookings.jsx';
import UpdateProgress from '../pages/leader/UpdateProgress.jsx';
import VerifyOTP from '../pages/leader/VerifyOTP.jsx';
import LeaderTickets from '../pages/leader/Tickets.jsx';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminBookings from '../pages/admin/Bookings.jsx';
import Leaders from '../pages/admin/Leaders.jsx';
import AdminTickets from '../pages/admin/Tickets.jsx';
import AdminReviews from '../pages/admin/Reviews.jsx';
import Analytics from '../pages/admin/Analytics.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth/callback"  element={<OAuthCallback />} />
      <Route path="/book"            element={<BookService />} />

      {/* Client dashboard — requires auth + CLIENT role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allow={[ROLES.CLIENT]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<ClientDashboard />} />
            <Route path="/app/bookings" element={<MyBookings />} />
            <Route path="/app/bookings/:id" element={<BookingDetail />} />
            <Route path="/app/book" element={<BookService />} />
            <Route path="/app/tickets" element={<ClientTickets />} />
            <Route path="/app/reviews" element={<ClientReviews />} />
            <Route path="/app/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Leader dashboard */}
        <Route element={<RoleRoute allow={[ROLES.LEADER]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/leader" element={<AssignedBookings />} />
            <Route path="/leader/progress/:id" element={<UpdateProgress />} />
            <Route path="/leader/verify/:id" element={<VerifyOTP />} />
            <Route path="/leader/tickets" element={<LeaderTickets />} />
          </Route>
        </Route>

        {/* Admin dashboard */}
        <Route element={<RoleRoute allow={[ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/leaders" element={<Leaders />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

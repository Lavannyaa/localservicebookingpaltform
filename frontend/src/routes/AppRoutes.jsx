import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CustomerLayout } from '../layouts/CustomerLayout';
import { ProviderLayout } from '../layouts/ProviderLayout';
import { TechnicianLayout } from '../layouts/TechnicianLayout';
import { SupportLayout } from '../layouts/SupportLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Auth Pages & Route Guards
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { OAuthCallback } from '../pages/auth/OAuthCallback';
import { ProtectedRoute } from './ProtectedRoute';
import { SessionHandlingUI } from '../components/auth/SessionHandlingUI';

// Customer Pages
import { LandingPage, HomePage } from '../pages/customer/LandingPage';
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { ServicesPage } from '../pages/customer/ServicesPage';
import { ServiceDetailsPage } from '../pages/customer/ServiceDetailsPage';
import { CategoriesPage } from '../pages/customer/CategoriesPage';
import { ProvidersPage } from '../pages/customer/ProvidersPage';
import { ProviderDetailsPage } from '../pages/customer/ProviderDetailsPage';
import { NearbyProvidersPage } from '../pages/customer/NearbyProvidersPage';
import { BookingPage } from '../pages/customer/BookingPage';
import { BookingConfirmationPage } from '../pages/customer/BookingConfirmationPage';
import { MyBookingsPage } from '../pages/customer/MyBookingsPage';
import { BookingDetailsPage } from '../pages/customer/BookingDetailsPage';
import { FavoritesPage } from '../pages/customer/FavoritesPage';
import { MaintenancePage } from '../pages/customer/MaintenancePage';
import { RecentlyAccessedPage } from '../pages/customer/RecentlyAccessedPage';
import { ServicePassportPage } from '../pages/customer/ServicePassportPage';
import { ReviewsRatingsPage } from '../pages/customer/ReviewsRatingsPage';
import { NotificationsPage } from '../pages/customer/NotificationsPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { SettingsPage } from '../pages/customer/SettingsPage';
import { HelpSupportPage } from '../pages/customer/HelpSupportPage';
import { AboutPage } from '../pages/customer/AboutPage';
import { ContactPage } from '../pages/customer/ContactPage';
import { NotFoundPage } from '../pages/customer/NotFoundPage';

// Provider Pages
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { BookingRequestsPage } from '../pages/provider/BookingRequestsPage';
import { ProviderBookingsPage } from '../pages/provider/ProviderBookingsPage';
import { MyServicesPage } from '../pages/provider/MyServicesPage';
import { ServiceChecklistPage } from '../pages/provider/ServiceChecklistPage';
import { ProviderMaintenancePage } from '../pages/provider/ProviderMaintenancePage';
import { ProviderReviewsPage } from '../pages/provider/ProviderReviewsPage';
import { ShopProfilePage } from '../pages/provider/ShopProfilePage';
import { AvailabilityPage } from '../pages/provider/AvailabilityPage';
import { ProviderNotificationsPage } from '../pages/provider/ProviderNotificationsPage';
import { ProviderRecentlyAccessedPage } from '../pages/provider/ProviderRecentlyAccessedPage';
import { ProviderSettingsPage } from '../pages/provider/ProviderSettingsPage';

// Technician Pages
import { TechnicianDashboard } from '../pages/technician/TechnicianDashboard';
import { AssignedJobsPage } from '../pages/technician/AssignedJobsPage';
import { SchedulePage } from '../pages/technician/SchedulePage';
import { JobDetailsPage } from '../pages/technician/JobDetailsPage';
import { TechChecklistPage } from '../pages/technician/TechChecklistPage';
import { TechCustomerDetailsPage } from '../pages/technician/TechCustomerDetailsPage';
import { TechLocationPage } from '../pages/technician/TechLocationPage';
import { ServiceHistoryPage } from '../pages/technician/ServiceHistoryPage';
import { TechNotesPage } from '../pages/technician/TechNotesPage';
import { TechNotificationsPage } from '../pages/technician/TechNotificationsPage';
import { TechProfilePage } from '../pages/technician/TechProfilePage';
import { TechSettingsPage } from '../pages/technician/TechSettingsPage';

// Support Staff Pages
import { SupportDashboard } from '../pages/support/SupportDashboard';
import { CustomerIssuesPage } from '../pages/support/CustomerIssuesPage';
import { ProviderIssuesPage } from '../pages/support/ProviderIssuesPage';
import { ActiveBookingsOversightPage } from '../pages/support/ActiveBookingsOversightPage';
import { ComplaintsPage } from '../pages/support/ComplaintsPage';
import { SupportTicketsPage } from '../pages/support/SupportTicketsPage';
import { SupportNotificationsPage } from '../pages/support/SupportNotificationsPage';
import { SupportProfilePage } from '../pages/support/SupportProfilePage';
import { SupportSettingsPage } from '../pages/support/SupportSettingsPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminProvidersPage } from '../pages/admin/AdminProvidersPage';
import { AdminTechniciansPage } from '../pages/admin/AdminTechniciansPage';
import { AdminSupportPage } from '../pages/admin/AdminSupportPage';
import { AdminServicesPage } from '../pages/admin/AdminServicesPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage';
import { AdminMaintenancePage } from '../pages/admin/AdminMaintenancePage';
import { AdminReviewsPage } from '../pages/admin/AdminReviewsPage';
import { AdminComplaintsPage } from '../pages/admin/AdminComplaintsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes = () => {
  return (
    <>
      {/* Universal Session Expiry & JWT Claims Inspector UI */}
      <SessionHandlingUI />

      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/oauth/callback" element={<OAuthCallback />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

      {/* Customer Marketplace Routes (CustomerLayout) */}
      <Route element={<CustomerLayout />}>
        {/* Public Discoverability Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/providers" element={<ProvidersPage />} />
        <Route path="/providers/:id" element={<ProviderDetailsPage />} />
        <Route path="/nearby" element={<NearbyProvidersPage />} />
        <Route path="/nearby-providers" element={<NearbyProvidersPage />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/help-support" element={<HelpSupportPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Customer Protected Workflow Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recently-accessed" element={<RecentlyAccessedPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/passport" element={<ServicePassportPage />} />
          <Route path="/service-passport" element={<ServicePassportPage />} />
          <Route path="/reviews" element={<ReviewsRatingsPage />} />
          <Route path="/reviews-ratings" element={<ReviewsRatingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Provider Portal Routes (ProviderLayout) */}
      <Route element={<ProtectedRoute allowedRoles={['provider', 'admin']} />}>
        <Route element={<ProviderLayout />}>
          <Route path="/provider" element={<Navigate to="/provider/dashboard" replace />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/requests" element={<BookingRequestsPage />} />
          <Route path="/provider/bookings" element={<ProviderBookingsPage />} />
          <Route path="/provider/services" element={<MyServicesPage />} />
          <Route path="/provider/checklist" element={<ServiceChecklistPage />} />
          <Route path="/provider/maintenance" element={<ProviderMaintenancePage />} />
          <Route path="/provider/reviews" element={<ProviderReviewsPage />} />
          <Route path="/provider/profile" element={<ShopProfilePage />} />
          <Route path="/provider/availability" element={<AvailabilityPage />} />
          <Route path="/provider/notifications" element={<ProviderNotificationsPage />} />
          <Route path="/provider/recently-accessed" element={<ProviderRecentlyAccessedPage />} />
          <Route path="/provider/settings" element={<ProviderSettingsPage />} />
        </Route>
      </Route>

      {/* Technician Portal Routes (TechnicianLayout) */}
      <Route element={<ProtectedRoute allowedRoles={['technician', 'admin']} />}>
        <Route element={<TechnicianLayout />}>
          <Route path="/technician" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
          <Route path="/technician/jobs" element={<AssignedJobsPage />} />
          <Route path="/technician/schedule" element={<SchedulePage />} />
          <Route path="/technician/job-details" element={<JobDetailsPage />} />
          <Route path="/technician/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/technician/checklist" element={<TechChecklistPage />} />
          <Route path="/technician/customer" element={<TechCustomerDetailsPage />} />
          <Route path="/technician/location" element={<TechLocationPage />} />
          <Route path="/technician/history" element={<ServiceHistoryPage />} />
          <Route path="/technician/notes" element={<TechNotesPage />} />
          <Route path="/technician/notifications" element={<TechNotificationsPage />} />
          <Route path="/technician/profile" element={<TechProfilePage />} />
          <Route path="/technician/settings" element={<TechSettingsPage />} />
        </Route>
      </Route>

      {/* Support Staff Portal Routes (SupportLayout) */}
      <Route element={<ProtectedRoute allowedRoles={['support', 'admin']} />}>
        <Route element={<SupportLayout />}>
          <Route path="/support" element={<Navigate to="/support/dashboard" replace />} />
          <Route path="/support/dashboard" element={<SupportDashboard />} />
          <Route path="/support/customer-issues" element={<CustomerIssuesPage />} />
          <Route path="/support/provider-issues" element={<ProviderIssuesPage />} />
          <Route path="/support/active-bookings" element={<ActiveBookingsOversightPage />} />
          <Route path="/support/complaints" element={<ComplaintsPage />} />
          <Route path="/support/tickets" element={<SupportTicketsPage />} />
          <Route path="/support/notifications" element={<SupportNotificationsPage />} />
          <Route path="/support/profile" element={<SupportProfilePage />} />
          <Route path="/support/settings" element={<SupportSettingsPage />} />
        </Route>
      </Route>

      {/* Admin Portal Routes (AdminLayout) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/providers" element={<AdminProvidersPage />} />
          <Route path="/admin/technicians" element={<AdminTechniciansPage />} />
          <Route path="/admin/support" element={<AdminSupportPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/maintenance" element={<AdminMaintenancePage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
};

export default AppRoutes;

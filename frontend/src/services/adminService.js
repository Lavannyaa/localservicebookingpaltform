import { apiClient } from './api';

export const adminService = {
  async getDashboardStats() {
    try {
      const res = await apiClient.get('/admin/dashboard');
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[adminService] getDashboardStats API error:', err.message);
    }
    return {
      totalUsers: 0,
      totalProviders: 0,
      totalBookings: 0,
      totalRevenue: 0,
      activeComplaints: 0
    };
  },

  async getUsers(filters = {}) {
    try {
      const res = await apiClient.get('/admin/users', filters);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[adminService] getUsers API error:', err.message);
    }
    return [];
  },

  async toggleUserStatus(id) {
    try {
      const res = await apiClient.put(`/admin/users/${id}/status`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[adminService] toggleUserStatus API error:', err.message);
      throw err;
    }
  },

  async verifyProvider(id) {
    try {
      const res = await apiClient.put(`/admin/providers/${id}/verify`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[adminService] verifyProvider API error:', err.message);
      throw err;
    }
  },

  async getBookings(filters = {}) {
    try {
      const res = await apiClient.get('/admin/bookings', filters);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[adminService] getBookings API error:', err.message);
    }
    return [];
  },

  async getComplaints(filters = {}) {
    try {
      const res = await apiClient.get('/admin/complaints', filters);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[adminService] getComplaints API error:', err.message);
    }
    return [];
  },

  async getReports() {
    try {
      const res = await apiClient.get('/admin/reports');
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[adminService] getReports API error:', err.message);
    }
    return {};
  },

  async getEligibleProviders(bookingId) {
    try {
      const res = await apiClient.get(`/admin/bookings/${bookingId}/eligible-providers`);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[adminService] getEligibleProviders error:', err.message);
    }
    return [];
  },

  async assignProvider(bookingId, providerId) {
    try {
      const res = await apiClient.put(`/admin/bookings/${bookingId}/assign-provider`, { providerId });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[adminService] assignProvider error:', err.message);
      throw err;
    }
  }
};

export default adminService;

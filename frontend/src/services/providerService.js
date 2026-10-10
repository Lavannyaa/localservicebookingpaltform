import { apiClient } from './api';
import { providers as staticProviders } from '../data/providers';

export const providerService = {
  async getProviders(filters = {}) {
    try {
      const res = await apiClient.get('/providers', filters);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[providerService] API getProviders error:', err.message);
    }
    return staticProviders;
  },

  async getProviderById(id) {
    try {
      const res = await apiClient.get(`/providers/${id}`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[providerService] API getProviderById error:', err.message);
    }
    const found = staticProviders.find(p => p.providerId === id || p._id === id);
    if (found) return found;
    throw new Error('Provider shop not found');
  },

  async getProviderBookings() {
    try {
      const res = await apiClient.get('/providers/bookings');
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[providerService] API getProviderBookings error:', err.message);
    }
    return [];
  },

  async getProfile() {
    try {
      const res = await apiClient.get('/providers/profile');
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[providerService] API getProfile error:', err.message);
    }
    return null;
  },

  async updateProfile(profileData) {
    try {
      const res = await apiClient.put('/providers/profile', profileData);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[providerService] updateProfile error:', err.message);
      throw err;
    }
  },

  async getProviderTechnicians() {
    try {
      const res = await apiClient.get('/providers/technicians');
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[providerService] API getProviderTechnicians error:', err.message);
    }
    return [];
  },

  async acceptBooking(id) {
    try {
      const res = await apiClient.put(`/providers/bookings/${id}/accept`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[providerService] acceptBooking error:', err.message);
      throw err;
    }
  },

  async rejectBooking(id, reason = '') {
    try {
      const res = await apiClient.put(`/providers/bookings/${id}/reject`, { reason });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[providerService] rejectBooking error:', err.message);
      throw err;
    }
  },

  async assignTechnician(id, technicianId) {
    try {
      const res = await apiClient.put(`/providers/bookings/${id}/assign-technician`, { technicianId });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[providerService] assignTechnician error:', err.message);
      throw err;
    }
  },

  async getNearbyProviders(userLocation = "Tirunelveli") {
    try {
      const res = await apiClient.get('/providers', { city: userLocation });
      if (res && res.data && Array.isArray(res.data)) {
        return res.data.map(p => ({ ...p, isNearby: true }));
      }
    } catch (err) {
      console.warn('[providerService] API getNearbyProviders error:', err.message);
    }
    return staticProviders.map(p => ({
      ...p,
      isNearby: (p.city || '').toLowerCase() === userLocation.toLowerCase()
    }));
  }
};

export default providerService;

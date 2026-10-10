import { apiClient } from './api';

export const bookingService = {
  async getBookings(filters = {}) {
    try {
      const res = await apiClient.get('/bookings', filters);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[bookingService] API getBookings error:', err.message);
    }
    return [];
  },

  async getBookingById(id) {
    try {
      const res = await apiClient.get(`/bookings/${id}`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[bookingService] API getBookingById error:', err.message);
      throw err;
    }
  },

  async createBooking(bookingData) {
    try {
      const payload = {
        serviceId: bookingData.serviceId || bookingData.service?._id || bookingData.service?.serviceId,
        providerId: bookingData.providerId || bookingData.provider?._id || bookingData.provider?.providerId,
        bookingDate: bookingData.bookingDate || bookingData.date || new Date().toISOString().split('T')[0],
        bookingTime: bookingData.bookingTime || bookingData.timeSlot || '09:00 AM - 10:30 AM',
        serviceAddress: bookingData.serviceAddress || bookingData.address || 'Vannarpettai, Tirunelveli',
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        problemDescription: bookingData.problemDescription || bookingData.requirements || '',
        paymentMethod: bookingData.paymentMethod || 'Online',
        isMaintenanceRebooking: Boolean(bookingData.isMaintenanceRebooking)
      };

      const res = await apiClient.post('/bookings', payload);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[bookingService] API createBooking error:', err.message);
      throw err;
    }
  },

  async updateBookingStatus(id, newStatus, notes = '') {
    try {
      const res = await apiClient.put(`/bookings/${id}/status`, { status: newStatus, notes });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[bookingService] API updateBookingStatus error:', err.message);
    }
  },

  async cancelBooking(id, reason = 'Cancelled by customer') {
    try {
      const res = await apiClient.put(`/bookings/${id}/cancel`, { reason });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[bookingService] API cancelBooking error:', err.message);
      throw err;
    }
  },

  async updateChecklist(id, checklist) {
    try {
      const res = await apiClient.put(`/technicians/jobs/${id}/checklist`, { items: checklist });
      if (res && res.data) return res.data;
    } catch (err) {
      console.warn('[bookingService] API updateChecklist error:', err.message);
    }
    return { success: true, bookingId: id, checklist };
  },

  async addTechNotes(id, techNotes) {
    try {
      const res = await apiClient.put(`/technicians/jobs/${id}/notes`, { notes: techNotes });
      if (res && res.data) return res.data;
    } catch (err) {
      console.warn('[bookingService] API addTechNotes error:', err.message);
    }
    return { success: true, bookingId: id, techNotes };
  }
};

export default bookingService;

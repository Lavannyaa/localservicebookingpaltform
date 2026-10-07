import api from './api';
import { bookings as mockBookings } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const mockDelay = (data, ms = 450) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const bookingService = {
  async getBookings(customerId) {
    if (USE_MOCK) return mockDelay(mockBookings);
    const res = await api.get('/bookings', { params: { customerId } });
    return res.data;
  },

  async createBooking(payload) {
    if (USE_MOCK) return mockDelay({ ...payload, bookingId: Date.now() });
    const res = await api.post('/bookings', payload);
    return res.data;
  },

  async cancelBooking(id) {
    if (USE_MOCK) return mockDelay({ success: true });
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data;
  },

  async updateStatus(id, status) {
    if (USE_MOCK) return mockDelay({ success: true });
    const res = await api.put(`/bookings/${id}/status`, { status });
    return res.data;
  },
};

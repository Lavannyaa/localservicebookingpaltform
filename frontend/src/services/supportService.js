import { apiClient } from './api';

export const supportService = {
  async getTickets(filters = {}) {
    try {
      const res = await apiClient.get('/support/tickets', filters);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[supportService] getTickets API error:', err.message);
    }
    return [];
  },

  async getTicketById(id) {
    try {
      const res = await apiClient.get(`/support/tickets/${id}`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[supportService] getTicketById API error:', err.message);
      throw err;
    }
  },

  async createTicket(ticketData) {
    try {
      const res = await apiClient.post('/support/tickets', ticketData);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[supportService] createTicket API error:', err.message);
      throw err;
    }
  },

  async respondTicket(id, message) {
    try {
      const res = await apiClient.post(`/support/tickets/${id}/respond`, { message });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[supportService] respondTicket API error:', err.message);
      throw err;
    }
  },

  async updateTicketStatus(id, status, priority) {
    try {
      const res = await apiClient.put(`/support/tickets/${id}`, { status, priority });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[supportService] updateTicketStatus API error:', err.message);
      throw err;
    }
  }
};

export default supportService;

import { apiClient } from './api';

export const technicianService = {
  async getProfile() {
    try {
      const res = await apiClient.get('/technicians/profile');
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[technicianService] getProfile API error:', err.message);
    }
    return null;
  },

  async getJobs(filters = {}) {
    try {
      const res = await apiClient.get('/technicians/jobs', filters);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[technicianService] getJobs API error:', err.message);
    }
    return [];
  },

  async getJobById(id) {
    try {
      const res = await apiClient.get(`/technicians/jobs/${id}`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.warn('[technicianService] getJobById API error:', err.message);
      throw err;
    }
  },

  async acceptJob(id) {
    try {
      const res = await apiClient.put(`/technicians/jobs/${id}/accept`);
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[technicianService] acceptJob API error:', err.message);
      throw err;
    }
  },

  async updateJobStatus(id, status, notes = '') {
    try {
      const res = await apiClient.put(`/technicians/jobs/${id}/status`, { status, notes });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[technicianService] updateJobStatus API error:', err.message);
      throw err;
    }
  },

  async updateChecklist(id, items) {
    try {
      const res = await apiClient.put(`/technicians/jobs/${id}/checklist`, { items });
      if (res && res.data) return res.data;
    } catch (err) {
      console.error('[technicianService] updateChecklist API error:', err.message);
      throw err;
    }
  },

  async updateNotes(id, notes) {
    try {
      const res = await apiClient.put(`/technicians/jobs/${id}/notes`, { notes });
      if (res && res.data) return res.data;
    } catch (err) {
      console.error('[technicianService] updateNotes API error:', err.message);
      throw err;
    }
  },

  async completeJob(id, notes = '') {
    try {
      const res = await apiClient.put(`/technicians/jobs/${id}/complete`, { notes });
      if (res && res.data) return res.data;
      if (res) return res;
    } catch (err) {
      console.error('[technicianService] completeJob API error:', err.message);
      throw err;
    }
  }
};

export default technicianService;

import { complaints } from '../data/complaints';

let localComplaints = [...complaints];

export const complaintService = {
  async getComplaints() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...localComplaints]), 60);
    });
  },

  async updateComplaint(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localComplaints = localComplaints.map(c => c.ticketId === id ? { ...c, ...updates } : c);
        resolve(localComplaints.find(c => c.ticketId === id));
      }, 60);
    });
  }
};

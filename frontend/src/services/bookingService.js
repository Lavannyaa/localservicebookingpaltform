import { bookings } from '../data/bookings';

let localBookings = [...bookings];

export const bookingService = {
  async getBookings(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...localBookings];
        if (filters.customerId) {
          results = results.filter(b => b.customerId === filters.customerId);
        }
        if (filters.providerId) {
          results = results.filter(b => b.providerId === filters.providerId);
        }
        if (filters.technicianId) {
          results = results.filter(b => b.technicianId === filters.technicianId);
        }
        if (filters.status && filters.status !== 'all') {
          results = results.filter(b => b.status.toLowerCase() === filters.status.toLowerCase());
        }
        resolve(results);
      }, 80);
    });
  },

  async getBookingById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = localBookings.find(b => b.bookingId === id || b.bookingNumber === id);
        if (found) resolve(found);
        else reject(new Error('Booking not found'));
      }, 50);
    });
  },

  async createBooking(bookingData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newBooking = {
          bookingId: `BK-${randomNum}`,
          bookingNumber: `LS-2026-${randomNum}`,
          status: 'Pending',
          platformFee: 49,
          totalAmount: Number(bookingData.price || 499) + 49,
          createdAt: new Date().toISOString(),
          serviceChecklist: [
            {"item": "Initial parameter check", "done": false},
            {"item": "Service execution", "done": false},
            {"item": "Testing & verification", "done": false}
          ],
          techNotes: "",
          ...bookingData
        };
        localBookings = [newBooking, ...localBookings];
        resolve(newBooking);
      }, 100);
    });
  },

  async updateBookingStatus(id, newStatus, notes = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        localBookings = localBookings.map(b => {
          if (b.bookingId === id || b.bookingNumber === id) {
            return {
              ...b,
              status: newStatus,
              techNotes: notes ? (b.techNotes ? `${b.techNotes} | ${notes}` : notes) : b.techNotes
            };
          }
          return b;
        });
        const updated = localBookings.find(b => b.bookingId === id || b.bookingNumber === id);
        resolve(updated);
      }, 80);
    });
  },

  async updateChecklist(id, checklist) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localBookings = localBookings.map(b => (b.bookingId === id ? { ...b, serviceChecklist: checklist } : b));
        resolve({ success: true, bookingId: id, checklist });
      }, 50);
    });
  },

  async addTechNotes(id, techNotes) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localBookings = localBookings.map(b => (b.bookingId === id ? { ...b, techNotes } : b));
        resolve({ success: true, bookingId: id, techNotes });
      }, 50);
    });
  }
};

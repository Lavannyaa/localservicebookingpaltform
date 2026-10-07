import { services } from '../data/services';
import { categories } from '../data/categories';

let localServices = [...services];

export const serviceService = {
  async getServices(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...localServices];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(s =>
            s.serviceName.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.providerName.toLowerCase().includes(q)
          );
        }
        if (filters.category && filters.category !== 'all') {
          results = results.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
        }
        if (filters.minPrice) {
          results = results.filter(s => s.basePrice >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
          results = results.filter(s => s.basePrice <= Number(filters.maxPrice));
        }
        if (filters.rating) {
          results = results.filter(s => s.rating >= Number(filters.rating));
        }
        if (filters.availability && filters.availability !== 'all') {
          results = results.filter(s => s.availability.toLowerCase() === filters.availability.toLowerCase());
        }
        if (filters.location && filters.location !== 'all') {
          const loc = filters.location.toLowerCase();
          results = results.filter(s => (s.location || '').toLowerCase().includes(loc));
        }
        if (filters.sortBy) {
          if (filters.sortBy === 'price-low') results.sort((a, b) => a.basePrice - b.basePrice);
          if (filters.sortBy === 'price-high') results.sort((a, b) => b.basePrice - a.basePrice);
          if (filters.sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
          if (filters.sortBy === 'popular') results.sort((a, b) => b.reviewCount - a.reviewCount);
          if (filters.sortBy === 'name') results.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
        }
        resolve(results);
      }, 80);
    });
  },

  async getServiceById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = localServices.find(s => s.serviceId === id);
        if (found) resolve(found);
        else reject(new Error('Service not found'));
      }, 50);
    });
  },

  async getCategories() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(categories), 50);
    });
  },

  async createService(newService) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = {
          serviceId: `srv-${Date.now()}`,
          rating: 5.0,
          reviewCount: 0,
          availability: 'Available',
          status: 'active',
          benefits: ["Certified Commercial Technician", "Quality Assured", "Standardized Price", "30-Day Warranty"],
          availableSlots: ["09:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "02:00 PM - 03:30 PM"],
          checklist: ["Initial diagnostic check", "Replacement of components", "Testing and cleanup"],
          ...newService
        };
        localServices = [item, ...localServices];
        resolve(item);
      }, 100);
    });
  },

  async updateService(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localServices = localServices.map(s => s.serviceId === id ? { ...s, ...updates } : s);
        resolve(localServices.find(s => s.serviceId === id));
      }, 80);
    });
  },

  async deleteService(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localServices = localServices.filter(s => s.serviceId !== id);
        resolve({ success: true, serviceId: id });
      }, 80);
    });
  }
};

import { providers } from '../data/providers';

let localProviders = [...providers];

export const providerService = {
  async getProviders(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...localProviders];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(p =>
            p.shopName.toLowerCase().includes(q) ||
            p.specialization.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q)
          );
        }
        if (filters.city && filters.city !== 'all') {
          results = results.filter(p => p.city.toLowerCase() === filters.city.toLowerCase());
        }
        if (filters.availability && filters.availability !== 'all') {
          results = results.filter(p => p.availability.toLowerCase() === filters.availability.toLowerCase());
        }
        resolve(results);
      }, 80);
    });
  },

  async getProviderById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = localProviders.find(p => p.providerId === id);
        if (found) resolve(found);
        else reject(new Error('Provider shop not found'));
      }, 50);
    });
  },

  async getNearbyProviders(userLocation = "Tirunelveli") {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return shops with distance
        const results = localProviders.map(p => ({
          ...p,
          isNearby: p.city.toLowerCase() === userLocation.toLowerCase()
        }));
        resolve(results);
      }, 70);
    });
  },

  async updateShopProfile(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localProviders = localProviders.map(p => p.providerId === id ? { ...p, ...updates } : p);
        resolve(localProviders.find(p => p.providerId === id));
      }, 80);
    });
  },

  async updateAvailability(id, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localProviders = localProviders.map(p => p.providerId === id ? { ...p, availability: status } : p);
        resolve({ success: true, providerId: id, availability: status });
      }, 50);
    });
  }
};

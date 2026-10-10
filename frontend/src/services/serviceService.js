import { apiClient } from './api';
import { services as staticServices } from '../data/services';
import { categories as staticCategories } from '../data/categories';
import { providers as staticProviders } from '../data/providers';
import { calculateHaversineDistance } from './locationService';
import { findEligibleProviderForService } from '../utils/providerEligibility';

let localServices = [...staticServices];

export const serviceService = {
  async getServices(filters = {}) {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.rating) params.minRating = filters.rating;
      if (filters.availability && filters.availability !== 'all') params.availableOnly = filters.availability === 'Available';
      if (filters.sortBy) params.sort = filters.sortBy;
      if (filters.lat) params.lat = filters.lat;
      if (filters.lng) params.lng = filters.lng;
      if (filters.radius || filters.maxDistanceKm) params.maxDistanceKm = filters.radius || filters.maxDistanceKm;

      const res = await apiClient.get('/services', params);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn('[serviceService] API call failed, using local fallback dataset:', err.message);
    }

    // Local Fallback logic
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          let results = [...localServices];

          // Calculate client-side distance for all services using matching provider from static providers dataset
          const cLat = filters.lat ? parseFloat(filters.lat) : 8.7139;
          const cLng = filters.lng ? parseFloat(filters.lng) : 77.7567;

          results = results.map(s => {
            const provider = findEligibleProviderForService(s, staticProviders);
            const pLat = provider?.latitude || s.latitude || 8.7180;
            const pLng = provider?.longitude || s.longitude || 77.7490;
            const d = calculateHaversineDistance(cLat, cLng, pLat, pLng);
            return {
              ...s,
              providerId: provider ? (provider.providerId || provider._id) : s.providerId,
              providerName: provider ? (provider.shopName || provider.providerName) : s.providerName,
              location: provider ? provider.city : (s.location || 'Tirunelveli'),
              distanceKm: d !== null ? d : 1.1
            };
          });

          if (filters.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(s =>
              (s.serviceName && s.serviceName.toLowerCase().includes(q)) ||
              (s.description && s.description.toLowerCase().includes(q)) ||
              (s.category && s.category.toLowerCase().includes(q)) ||
              (s.providerName && s.providerName.toLowerCase().includes(q))
            );
          }
          if (filters.category && filters.category !== 'all') {
            const catFilter = filters.category.toLowerCase().trim();
            results = results.filter(s => {
              const itemCat = (s.category || '').toLowerCase().trim();
              if (itemCat === catFilter) return true;
              if (catFilter === 'gardening' && (itemCat.includes('garden') || itemCat.includes('lawn'))) return true;
              if (catFilter.includes('ac') && itemCat.includes('ac')) return true;
              if (catFilter.includes('electric') && itemCat.includes('electric')) return true;
              if (catFilter.includes('plumb') && itemCat.includes('plumb')) return true;
              return false;
            });
          }

          // Distance filter in local fallback
          const maxDist = filters.radius || filters.maxDistanceKm;
          if (maxDist && maxDist !== 'all') {
            const limitKm = Number(maxDist);
            if (!isNaN(limitKm)) {
              results = results.filter(s => (s.distanceKm || 0) <= limitKm);
            }
          }

          if (filters.minPrice) {
            results = results.filter(s => (s.basePrice || s.startingPrice || 0) >= Number(filters.minPrice));
          }
          if (filters.maxPrice) {
            results = results.filter(s => (s.basePrice || s.startingPrice || 0) <= Number(filters.maxPrice));
          }
          if (filters.rating) {
            results = results.filter(s => (s.rating || 0) >= Number(filters.rating));
          }
          if (filters.availability && filters.availability !== 'all') {
            const avail = filters.availability.toLowerCase();
            results = results.filter(s => (s.availability || 'Available').toLowerCase() === avail);
          }
          if (filters.location && filters.location !== 'all') {
            const loc = filters.location.toLowerCase();
            results = results.filter(s =>
              !s.location ||
              s.location.toLowerCase().includes(loc) ||
              s.location.toLowerCase() === 'all' ||
              loc === 'all'
            );
          }
          if (filters.sortBy) {
            if (filters.sortBy === 'nearest') results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
            if (filters.sortBy === 'price-low') results.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
            if (filters.sortBy === 'price-high') results.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
            if (filters.sortBy === 'rating') results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            if (filters.sortBy === 'popular') results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
            if (filters.sortBy === 'name') results.sort((a, b) => (a.serviceName || '').localeCompare(b.serviceName || ''));
          }
          resolve(results);
        } catch (err) {
          console.error('[serviceService] Filter error:', err);
          resolve(localServices);
        }
      }, 50);
    });
  },

  async getServiceById(id) {
    try {
      const res = await apiClient.get(`/services/${id}`);
      if (res && res.data) return res.data;
    } catch (err) {
      // fallback
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = localServices.find(s => s.serviceId === id || s._id === id);
        if (found) resolve(found);
        else resolve(localServices[0]);
      }, 50);
    });
  },

  async getCategories() {
    try {
      const res = await apiClient.get('/categories');
      if (res && res.data && Array.isArray(res.data)) return res.data;
    } catch (err) {
      // fallback
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(staticCategories), 50);
    });
  },

  async createService(newService) {
    try {
      const res = await apiClient.post('/services', newService);
      if (res && res.data) return res.data;
    } catch (err) {
      // fallback
    }
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
      }, 80);
    });
  },

  async updateService(id, updates) {
    try {
      const res = await apiClient.put(`/services/${id}`, updates);
      if (res && res.data) return res.data;
    } catch (err) {
      // fallback
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        localServices = localServices.map(s => (s.serviceId === id || s._id === id) ? { ...s, ...updates } : s);
        resolve(localServices.find(s => s.serviceId === id || s._id === id));
      }, 80);
    });
  },

  async deleteService(id) {
    try {
      await apiClient.delete(`/services/${id}`);
      return { success: true, serviceId: id };
    } catch (err) {
      // fallback
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        localServices = localServices.filter(s => s.serviceId !== id && s._id !== id);
        resolve({ success: true, serviceId: id });
      }, 80);
    });
  }
};

export default serviceService;

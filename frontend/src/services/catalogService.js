import api from './api';
import { services, categories, providers, reviews } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const mockDelay = (data, ms = 450) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const catalogService = {
  async getServices(params = {}) {
    if (USE_MOCK) {
      let list = [...services];
      if (params.q) list = list.filter((s) => s.serviceName.toLowerCase().includes(params.q.toLowerCase()));
      if (params.categoryId && params.categoryId !== 'all') list = list.filter((s) => s.categoryId === params.categoryId);
      return mockDelay(list);
    }
    const res = await api.get('/services', { params });
    return res.data;
  },

  async getServiceById(id) {
    if (USE_MOCK) return mockDelay(services.find((s) => s.serviceId === Number(id)));
    const res = await api.get(`/services/${id}`);
    return res.data;
  },

  async getCategories() {
    if (USE_MOCK) return mockDelay(categories);
    const res = await api.get('/categories');
    return res.data;
  },

  async getProviders() {
    if (USE_MOCK) return mockDelay(providers);
    const res = await api.get('/providers');
    return res.data;
  },

  async getProviderById(id) {
    if (USE_MOCK) return mockDelay(providers.find((p) => p.providerId === Number(id)));
    const res = await api.get(`/providers/${id}`);
    return res.data;
  },

  async getReviewsByProvider(providerId) {
    if (USE_MOCK) return mockDelay(reviews.filter((r) => r.providerId === Number(providerId)));
    const res = await api.get(`/providers/${providerId}/reviews`);
    return res.data;
  },
};

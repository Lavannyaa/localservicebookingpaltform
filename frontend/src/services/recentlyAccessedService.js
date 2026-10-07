import api from './api';

const STORAGE_PREFIX = 'localserve_recent_';

function getStorageKey(userId = 'guest') {
  return `${STORAGE_PREFIX}${userId || 'guest'}`;
}

export const recentlyAccessedService = {
  /**
   * Get recently accessed items for a specific user
   * Synchronizes with MongoDB via GET /api/recently-accessed
   */
  async getRecentItems(userId = 'guest') {
    // 1. Primary: Fetch from MongoDB Backend if authenticated
    try {
      const res = await api.get('/recently-accessed');
      if (res.data?.success && Array.isArray(res.data?.data)) {
        const mapped = res.data.data.map((item) => ({
          id: item.itemId || item._id,
          type: item.itemType,
          title: item.title,
          subtitle: item.subtitle || '',
          path: item.route,
          badge: item.itemType,
          price: item.metadata?.startingPrice || null,
          rating: item.metadata?.rating || null,
          userId: item.userId || userId,
          accessedAt: item.accessedAt || item.createdAt,
        }));
        return mapped;
      }
    } catch (apiErr) {
      console.warn('[recentlyAccessedService] API fetch fallback to local storage:', apiErr.message);
    }

    // 2. Fallback: LocalStorage
    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Save a newly accessed item for a specific user
   * Synchronizes with MongoDB via POST /api/recently-accessed
   */
  async recordAccess(userId = 'guest', item) {
    const entry = {
      id: item.id,
      type: item.type || 'Service',
      title: item.title,
      subtitle: item.subtitle || '',
      path: item.path,
      badge: item.badge || null,
      price: item.price || null,
      rating: item.rating || null,
      userId: userId || 'guest',
      role: item.role || 'customer',
      accessedAt: new Date().toISOString(),
    };

    // 1. Primary: Persist to MongoDB Backend
    try {
      await api.post('/recently-accessed', {
        itemId: item.id,
        itemType: (item.type || 'SERVICE').toUpperCase(),
        title: item.title,
        subtitle: item.subtitle || '',
        route: item.path,
        metadata: {
          startingPrice: item.price,
          rating: item.rating,
          badge: item.badge,
        },
      });
    } catch (apiErr) {
      console.warn('[recentlyAccessedService] API record fallback:', apiErr.message);
    }

    // 2. Persist locally as cache
    try {
      const key = getStorageKey(userId);
      const raw = localStorage.getItem(key);
      let items = raw ? JSON.parse(raw) : [];

      items = items.filter((i) => !(i.id === item.id && i.type === item.type));
      items.unshift(entry);
      items = items.slice(0, 20);

      localStorage.setItem(key, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to cache recently accessed item:', err);
    }

    return entry;
  },

  /**
   * Remove a single recently accessed item
   */
  async removeItem(userId = 'guest', id, type) {
    try {
      const key = getStorageKey(userId);
      const raw = localStorage.getItem(key);
      let items = raw ? JSON.parse(raw) : [];
      items = items.filter((i) => !(i.id === id && i.type === type));
      localStorage.setItem(key, JSON.stringify(items));
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  /**
   * Clear all recently accessed items for a user
   */
  async clearAll(userId = 'guest') {
    try {
      localStorage.removeItem(getStorageKey(userId));
      return { success: true };
    } catch {
      return { success: false };
    }
  },
};

export default recentlyAccessedService;

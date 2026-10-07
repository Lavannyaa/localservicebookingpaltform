import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchRecentlyAccessed,
  recordRecentlyAccessed,
  removeRecentlyAccessedItem,
  clearRecentlyAccessed as clearAllAction
} from '../store/slices/recentlyAccessedSlice';

// Helper to format ISO timestamp into relative human-readable time
export function formatAccessedTime(isoString) {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);

    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export const useRecentlyAccessed = (autoFetch = true) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;
  const userId = user?.userId || user?.id || (user?.email ? user.email.replace(/[@.]/g, '_') : 'guest');

  const { items, currentUserId, loading } = useSelector((state) => state.recentlyAccessed || { items: [] });

  // Auto-load items for current authenticated user
  useEffect(() => {
    if (autoFetch && (!currentUserId || currentUserId !== userId)) {
      dispatch(fetchRecentlyAccessed(userId));
    }
  }, [autoFetch, dispatch, userId, currentUserId]);

  const trackItem = useCallback((item) => {
    if (!item || !item.id) return;
    dispatch(recordRecentlyAccessed({
      userId,
      item: {
        ...item,
        role: user?.role || 'customer'
      }
    }));
  }, [dispatch, userId, user?.role]);

  const removeItem = useCallback((id, type) => {
    dispatch(removeRecentlyAccessedItem({ userId, id, type }));
  }, [dispatch, userId]);

  const clearItems = useCallback(() => {
    dispatch(clearAllAction(userId));
  }, [dispatch, userId]);

  return {
    recentlyAccessed: items || [],
    loading,
    trackItem,
    removeItem,
    clearRecentlyAccessed: clearItems,
    formatAccessedTime
  };
};

export default useRecentlyAccessed;

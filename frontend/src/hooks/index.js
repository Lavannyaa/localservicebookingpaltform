import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  loginUser,
  loginOAuthUser,
  registerUser,
  switchUserRole,
  logout,
  clearAuthError,
  requestPasswordReset,
  submitPasswordReset,
  refreshSession,
  checkSessionState,
  resetPasswordState
} from '../store/slices/authSlice';
import { fetchServices, fetchCategories, fetchServiceDetails, setFilter, resetFilters, addNewService } from '../store/slices/serviceSlice';
import { fetchProviders, fetchProviderDetails, fetchNearbyProviders, updateShopAvailability } from '../store/slices/providerSlice';
import { fetchBookings, fetchBookingById, createNewBooking, changeBookingStatus, setDraftBooking, resetDraft } from '../store/slices/bookingSlice';
import { fetchMaintenance, addMaintenanceSchedule } from '../store/slices/maintenanceSlice';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsRead, createNotification, notificationReceived } from '../store/slices/notificationSlice';
import { toggleFavoriteService, toggleFavoriteProvider } from '../store/slices/userSlice';
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { useLanguage as useLanguageContext } from '../context/LanguageContext';

export const useAuth = () => {
  const dispatch = useDispatch();
  const {
    user,
    role,
    token,
    tokenClaims,
    isAuthenticated,
    loading,
    error,
    sessionStatus,
    sessionTimeRemaining,
    passwordResetStatus
  } = useSelector((state) => state.auth);

  const login = useCallback((credentials) => dispatch(loginUser(credentials)), [dispatch]);
  const loginOAuth = useCallback((params) => dispatch(loginOAuthUser(params)), [dispatch]);
  const register = useCallback((userData) => dispatch(registerUser(userData)), [dispatch]);
  const switchRole = useCallback((newRole) => dispatch(switchUserRole(newRole)), [dispatch]);
  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);
  const forgotPassword = useCallback((data) => dispatch(requestPasswordReset(data)), [dispatch]);
  const resetPassword = useCallback((data) => dispatch(submitPasswordReset(data)), [dispatch]);
  const refresh = useCallback(() => dispatch(refreshSession()), [dispatch]);
  const checkSession = useCallback(() => dispatch(checkSessionState()), [dispatch]);
  const resetResetStatus = useCallback(() => dispatch(resetPasswordState()), [dispatch]);

  return {
    user,
    role,
    token,
    tokenClaims,
    isAuthenticated,
    loading,
    error,
    sessionStatus,
    sessionTimeRemaining,
    passwordResetStatus,
    login,
    loginOAuth,
    register,
    switchRole,
    logout: handleLogout,
    clearError,
    forgotPassword,
    resetPassword,
    refreshSession: refresh,
    checkSession,
    resetPasswordState: resetResetStatus
  };
};

export const useServices = (autoFetch = false) => {
  const dispatch = useDispatch();
  const { services, categories, activeService, filters, loading, error } = useSelector((state) => state.service);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchServices(filters));
    }
  }, [autoFetch, dispatch, JSON.stringify(filters)]);

  useEffect(() => {
    if (autoFetch && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [autoFetch, dispatch, categories.length]);

  const getServices = useCallback((newFilters) => dispatch(fetchServices(newFilters)), [dispatch]);
  const getCategories = useCallback(() => dispatch(fetchCategories()), [dispatch]);
  const getServiceDetails = useCallback((id) => dispatch(fetchServiceDetails(id)), [dispatch]);
  const setFilters = useCallback((f) => dispatch(setFilter(f)), [dispatch]);
  const clearFilters = useCallback(() => dispatch(resetFilters()), [dispatch]);
  const createService = useCallback((s) => dispatch(addNewService(s)), [dispatch]);

  return {
    services,
    categories,
    activeService,
    filters,
    loading,
    error,
    getServices,
    getCategories,
    getServiceDetails,
    setFilters,
    clearFilters,
    createService
  };
};

export const useProviders = (autoFetch = false) => {
  const dispatch = useDispatch();
  const { providers, currentShop, nearbyProviders, loading, error } = useSelector((state) => state.provider);

  useEffect(() => {
    if (autoFetch && providers.length === 0) {
      dispatch(fetchProviders());
    }
  }, [autoFetch, dispatch, providers.length]);

  const getProviders = useCallback((filters) => dispatch(fetchProviders(filters)), [dispatch]);
  const getProviderDetails = useCallback((id) => dispatch(fetchProviderDetails(id)), [dispatch]);
  const getNearby = useCallback((loc) => dispatch(fetchNearbyProviders(loc)), [dispatch]);
  const setAvailability = useCallback((status) => dispatch(updateShopAvailability(status)), [dispatch]);

  return {
    providers,
    currentShop,
    nearbyProviders,
    loading,
    error,
    getProviders,
    getProviderDetails,
    getNearby,
    setAvailability
  };
};

export const useBookings = () => {
  const dispatch = useDispatch();
  const { bookings, currentBooking, draftBooking, loading, error } = useSelector((state) => state.booking);

  const getBookings = useCallback((filters) => dispatch(fetchBookings(filters)), [dispatch]);
  const getBookingById = useCallback((id) => dispatch(fetchBookingById(id)), [dispatch]);
  const book = useCallback((data) => dispatch(createNewBooking(data)), [dispatch]);
  const updateStatus = useCallback((id, status, notes) => dispatch(changeBookingStatus({ id, status, notes })), [dispatch]);
  const setDraft = useCallback((draft) => dispatch(setDraftBooking(draft)), [dispatch]);
  const clearDraft = useCallback(() => dispatch(resetDraft()), [dispatch]);

  return {
    bookings,
    currentBooking,
    draftBooking,
    loading,
    error,
    getBookings,
    getBookingById,
    createBooking: book,
    updateStatus,
    setDraft,
    clearDraft
  };
};

export const useMaintenance = () => {
  const dispatch = useDispatch();
  const { schedules, loading } = useSelector((state) => state.maintenance);

  const getSchedules = useCallback(() => dispatch(fetchMaintenance()), [dispatch]);
  const addSchedule = useCallback((data) => dispatch(addMaintenanceSchedule(data)), [dispatch]);

  return { schedules, loading, getSchedules, addSchedule };
};

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notification);

  const getNotifications = useCallback((role) => dispatch(fetchNotifications(role)), [dispatch]);
  const markRead = useCallback((id) => dispatch(markNotificationAsRead(id)), [dispatch]);
  const markAllRead = useCallback((role) => dispatch(markAllNotificationsRead(role)), [dispatch]);
  const addNotification = useCallback((data) => dispatch(createNotification(data)), [dispatch]);

  useEffect(() => {
    const handleNotifAdded = (e) => {
      if (e.detail) {
        dispatch(notificationReceived(e.detail));
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('localserve_notification_added', handleNotifAdded);
      return () => window.removeEventListener('localserve_notification_added', handleNotifAdded);
    }
  }, [dispatch]);

  return { notifications, unreadCount, loading, getNotifications, markRead, markAllRead, addNotification };
};

export const useFavorites = () => {
  const dispatch = useDispatch();
  const { favorites, passport } = useSelector((state) => state.user);

  const toggleService = useCallback((id) => dispatch(toggleFavoriteService(id)), [dispatch]);
  const toggleProvider = useCallback((id) => dispatch(toggleFavoriteProvider(id)), [dispatch]);

  return { favorites, passport, toggleService, toggleProvider };
};

export const useTheme = useThemeContext;
export const useLanguage = useLanguageContext;
export { useRecentlyAccessed } from './useRecentlyAccessed';
export { useChatbot } from './useChatbot';
export { useUserSettings } from './useUserSettings';

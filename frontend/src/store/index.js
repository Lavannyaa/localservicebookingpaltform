import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceReducer from './slices/serviceSlice';
import providerReducer from './slices/providerSlice';
import bookingReducer from './slices/bookingSlice';
import technicianReducer from './slices/technicianSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import notificationReducer from './slices/notificationSlice';
import recentlyAccessedReducer from './slices/recentlyAccessedSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    service: serviceReducer,
    provider: providerReducer,
    booking: bookingReducer,
    technician: technicianReducer,
    maintenance: maintenanceReducer,
    notification: notificationReducer,
    recentlyAccessed: recentlyAccessedReducer,
    user: userReducer,
    chat: chatReducer
  }
});

export default store;

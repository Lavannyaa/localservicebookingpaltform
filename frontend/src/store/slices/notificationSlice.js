import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (role) => {
  return await notificationService.getNotifications(role);
});

export const markNotificationAsRead = createAsyncThunk('notifications/markRead', async (id) => {
  return await notificationService.markAsRead(id);
});

export const markAllNotificationsRead = createAsyncThunk('notifications/markAll', async (role) => {
  return await notificationService.markAllAsRead(role);
});

export const createNotification = createAsyncThunk('notifications/create', async (notifData) => {
  return await notificationService.addNotification(notifData);
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false
  },
  reducers: {
    notificationReceived: (state, action) => {
      if (!state.notifications.some(n => n.id === action.payload.id)) {
        state.notifications = [action.payload, ...state.notifications];
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map(n => n.id === action.payload.id ? { ...n, read: true } : n);
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        if (!state.notifications.some(n => n.id === action.payload.id)) {
          state.notifications = [action.payload, ...state.notifications];
        }
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      });
  }
});

export const { notificationReceived } = notificationSlice.actions;
export default notificationSlice.reducer;

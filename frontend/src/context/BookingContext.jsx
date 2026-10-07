import React, { createContext, useReducer } from 'react';
import { bookings as mockBookings, notifications as mockNotifications } from '../services/mockData';

export const BookingContext = createContext();

const initialState = {
  bookings: mockBookings,
  notifications: mockNotifications,
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.bookingId === action.payload ? { ...b, bookingStatus: 'Cancelled' } : b
        ),
      };
    case 'UPDATE_BOOKING_STATUS':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.bookingId === action.payload.id ? { ...b, bookingStatus: action.payload.status } : b
        ),
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.notificationId === action.payload ? { ...n, status: 'read' } : n
        ),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.notificationId !== action.payload),
      };
    case 'MARK_ALL_READ':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, status: 'read' })) };
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const addBooking = (booking) => dispatch({ type: 'ADD_BOOKING', payload: booking });
  const cancelBooking = (id) => dispatch({ type: 'CANCEL_BOOKING', payload: id });
  const updateBookingStatus = (id, status) => dispatch({ type: 'UPDATE_BOOKING_STATUS', payload: { id, status } });
  const markNotificationRead = (id) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  const deleteNotification = (id) => dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  const markAllRead = () => dispatch({ type: 'MARK_ALL_READ' });

  return (
    <BookingContext.Provider
      value={{
        bookings: state.bookings,
        notifications: state.notifications,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        markNotificationRead,
        deleteNotification,
        markAllRead,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

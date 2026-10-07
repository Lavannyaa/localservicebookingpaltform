import { notifications as initialNotifications } from '../data/notifications';

const STORAGE_KEY = 'localserve_notifications';

const loadStoredNotifications = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored notifications', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
  return [...initialNotifications];
};

let localNotifs = loadStoredNotifications();

export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: 'Booking Created',
  BOOKING_ACCEPTED: 'Booking Accepted',
  TECH_ASSIGNED: 'Technician Assigned',
  TECH_ON_THE_WAY: 'Technician On The Way',
  TECH_ARRIVED: 'Technician Arrived',
  SERVICE_STARTED: 'Service Started',
  SERVICE_COMPLETED: 'Service Completed',
  MAINTENANCE_DUE: 'Maintenance Due',
  REVIEW_REMINDER: 'Review Reminder',
  BOOKING_CANCELLED: 'Booking Cancelled'
};

export const notificationService = {
  async getNotifications(role = 'customer') {
    return new Promise((resolve) => {
      setTimeout(() => {
        localNotifs = loadStoredNotifications();
        resolve(localNotifs.filter(n => n.role === role || role === 'admin'));
      }, 40);
    });
  },

  async addNotification({
    type,
    title,
    message,
    role = 'customer',
    userId = 'user-cust-1',
    bookingId = null,
    metadata = {}
  }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localNotifs = loadStoredNotifications();
        const newNotif = {
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          role,
          type,
          title: title || type,
          message,
          bookingId,
          createdAt: new Date().toISOString(),
          read: false,
          ...metadata
        };

        localNotifs = [newNotif, ...localNotifs];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localNotifs));

        // Dispatch window event for live cross-component sync
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('localserve_notification_added', { detail: newNotif }));
        }

        resolve(newNotif);
      }, 30);
    });
  },

  async markAsRead(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localNotifs = loadStoredNotifications();
        localNotifs = localNotifs.map(n => n.id === id ? { ...n, read: true } : n);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localNotifs));
        resolve({ success: true, id });
      }, 30);
    });
  },

  async markAllAsRead(role = 'customer') {
    return new Promise((resolve) => {
      setTimeout(() => {
        localNotifs = loadStoredNotifications();
        localNotifs = localNotifs.map(n => (n.role === role || role === 'admin' ? { ...n, read: true } : n));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localNotifs));
        resolve({ success: true });
      }, 30);
    });
  },

  // Helper to trigger any of the 10 lifecycle events
  async triggerLifecycleEvent(eventType, booking) {
    let title = eventType;
    let message = '';
    const bNum = booking?.bookingNumber || 'LS-2026-1001';
    const sName = booking?.serviceName || 'Service';
    const pName = booking?.providerName || 'Partner Workshop';
    const tName = booking?.technicianName || 'S. Murugan';

    switch (eventType) {
      case NOTIFICATION_TYPES.BOOKING_CREATED:
        title = `Booking Created: #${bNum}`;
        message = `Your booking for ${sName} has been created and transmitted to ${pName}.`;
        break;
      case NOTIFICATION_TYPES.BOOKING_ACCEPTED:
        title = `Booking Accepted by ${pName}`;
        message = `${pName} confirmed your appointment for ${sName} (#${bNum}).`;
        break;
      case NOTIFICATION_TYPES.TECH_ASSIGNED:
        title = `Technician Assigned: ${tName}`;
        message = `${tName} has been assigned to your ${sName} booking (#${bNum}).`;
        break;
      case NOTIFICATION_TYPES.TECH_ON_THE_WAY:
        title = `Technician On The Way!`;
        message = `${tName} is en route to your address. Estimated arrival: 15-20 minutes.`;
        break;
      case NOTIFICATION_TYPES.TECH_ARRIVED:
        title = `Technician Arrived at Site`;
        message = `${tName} has arrived at your doorstep for #${bNum}. Please verify technician badge.`;
        break;
      case NOTIFICATION_TYPES.SERVICE_STARTED:
        title = `Service In Progress`;
        message = `Technician ${tName} has begun pre-service diagnostics and work on ${sName}.`;
        break;
      case NOTIFICATION_TYPES.SERVICE_COMPLETED:
        title = `Service Completed & Certified`;
        message = `${sName} (#${bNum}) is successfully finished. Passport logbook and 30-day warranty updated.`;
        break;
      case NOTIFICATION_TYPES.MAINTENANCE_DUE:
        title = `Upcoming Maintenance Due: ${sName}`;
        message = `Preventive maintenance overhaul for ${sName} is scheduled for this cycle. Book again to preserve warranty.`;
        break;
      case NOTIFICATION_TYPES.REVIEW_REMINDER:
        title = `Review Reminder: How was ${sName}?`;
        message = `Please share your rating & experience with ${pName} to assist other neighbours.`;
        break;
      case NOTIFICATION_TYPES.BOOKING_CANCELLED:
        title = `Booking Cancelled: #${bNum}`;
        message = `Your booking #${bNum} for ${sName} has been cancelled. Any pre-authorized charges refunded.`;
        break;
      default:
        title = `${eventType} - #${bNum}`;
        message = `Status update for ${sName}: ${eventType}`;
    }

    return this.addNotification({
      type: eventType,
      title,
      message,
      bookingId: booking?.bookingId || bNum,
      role: 'customer'
    });
  }
};

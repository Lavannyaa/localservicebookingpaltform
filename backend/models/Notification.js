const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ['CUSTOMER', 'PROVIDER', 'TECHNICIAN', 'SUPPORT_STAFF', 'ADMIN'],
      uppercase: true,
    },
    type: {
      type: String,
      enum: [
        'BOOKING_REQUESTED',
        'BOOKING_ACCEPTED',
        'BOOKING_REJECTED',
        'TECHNICIAN_ASSIGNED',
        'TECHNICIAN_ON_THE_WAY',
        'TECHNICIAN_ARRIVED',
        'SERVICE_STARTED',
        'SERVICE_COMPLETED',
        'MAINTENANCE_DUE',
        'REVIEW_REMINDER',
        'SUPPORT_RESPONSE',
        'SYSTEM',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientUserId: 1, isRead: 1 });
notificationSchema.index({ recipientRole: 1 });

module.exports = mongoose.model('Notification', notificationSchema);

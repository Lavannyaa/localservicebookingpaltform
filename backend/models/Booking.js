const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
    },
    shopName: {
      type: String,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
    },
    technicianName: {
      type: String,
    },
    technicianPhone: {
      type: String,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    bookingDate: {
      type: String,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    serviceAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Tirunelveli',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    problemDescription: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'PENDING',
        'ACCEPTED',
        'REJECTED',
        'TECHNICIAN_ASSIGNED',
        'TECHNICIAN_ACCEPTED',
        'ON_THE_WAY',
        'ARRIVED',
        'SERVICE_STARTED',
        'SERVICE_COMPLETED',
        'CANCELLED',
      ],
      default: 'PENDING',
      uppercase: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        notes: { type: String, default: '' },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'COD'],
      default: 'PENDING',
    },
    checklistProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    technicianNotes: {
      issuesFound: { type: String, default: '' },
      workPerformed: { type: String, default: '' },
      partsReplaced: { type: [String], default: [] },
      recommendations: { type: String, default: '' },
    },
    completedAt: {
      type: Date,
    },
    isMaintenanceRebooking: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ customerId: 1 });
bookingSchema.index({ providerId: 1 });
bookingSchema.index({ technicianId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    servicePassportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServicePassport',
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    serviceName: {
      type: String,
      required: true,
    },
    applianceName: {
      type: String,
      default: 'Home Appliance',
    },
    lastServiceDate: {
      type: Date,
      required: true,
    },
    nextMaintenanceDate: {
      type: Date,
      required: true,
    },
    intervalMonths: {
      type: Number,
      default: 3,
    },
    reminderStatus: {
      type: String,
      enum: ['UPCOMING', 'DUE', 'OVERDUE', 'SERVICED'],
      default: 'UPCOMING',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    canBookAgain: {
      type: Boolean,
      default: true,
    },
    lastBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    preferredProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
    },
  },
  {
    timestamps: true,
  }
);

maintenanceSchema.index({ customerId: 1 });
maintenanceSchema.index({ nextMaintenanceDate: 1 });
maintenanceSchema.index({ reminderStatus: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);

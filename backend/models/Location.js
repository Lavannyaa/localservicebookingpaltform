const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ['CUSTOMER', 'PROVIDER', 'TECHNICIAN'],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: 'Tirunelveli',
    },
    activeBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    permissionGranted: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({ entityType: 1, entityId: 1 });
locationSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Location', locationSchema);

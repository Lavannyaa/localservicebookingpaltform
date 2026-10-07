const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema(
  {
    technicianId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
    },
    technicianName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      default: 'AC & Refrigeration Certified Master',
    },
    experience: {
      type: Number,
      default: 6,
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'ON_JOB', 'OFFLINE'],
      default: 'AVAILABLE',
    },
    workingHours: {
      type: String,
      default: '09:00 AM - 07:00 PM',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    currentLatitude: {
      type: Number,
      default: 8.718,
    },
    currentLongitude: {
      type: Number,
      default: 77.76,
    },
    locationPermissionGranted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

technicianSchema.index({ userId: 1 });
technicianSchema.index({ providerId: 1 });

module.exports = mongoose.model('Technician', technicianSchema);

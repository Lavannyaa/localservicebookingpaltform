const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerName: {
      type: String,
      required: true,
      trim: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    shopAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Tirunelveli',
    },
    serviceArea: {
      type: String,
      default: 'Tirunelveli Urban & Suburbs (25 km radius)',
    },
    specialization: {
      type: [String],
      default: ['AC Repair', 'Electrical', 'Home Appliances'],
    },
    experience: {
      type: Number,
      default: 8,
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'AVAILABLE',
    },
    workingHours: {
      type: String,
      default: '08:00 AM - 08:00 PM',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      default: 8.7139,
    },
    longitude: {
      type: Number,
      default: 77.7567,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    servicesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
  },
  {
    timestamps: true,
  }
);

providerSchema.index({ userId: 1 });
providerSchema.index({ city: 1 });
providerSchema.index({ availabilityStatus: 1 });

module.exports = mongoose.model('Provider', providerSchema);

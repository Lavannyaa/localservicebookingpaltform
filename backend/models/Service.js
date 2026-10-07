const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    description: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedDuration: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    defaultChecklist: {
      type: [String],
      default: [
        'Initial diagnostic inspection',
        'Physical unit safety clearance check',
        'Component calibration and cleaning',
        'Operational post-service test run',
        'Customer satisfaction and sign-off',
      ],
    },
    recommendedMaintenanceIntervalMonths: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ name: 'text', description: 'text', category: 'text' });
serviceSchema.index({ category: 1 });
serviceSchema.index({ startingPrice: 1 });
serviceSchema.index({ rating: -1 });

module.exports = mongoose.model('Service', serviceSchema);

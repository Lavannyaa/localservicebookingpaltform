const mongoose = require('mongoose');

const recentlyAccessedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: [
        'Service',
        'Provider',
        'Category',
        'Booking',
        'Customer',
        'Assigned Job',
        'Management Record',
      ],
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    accessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

recentlyAccessedSchema.index({ userId: 1, itemType: 1, itemId: 1 });
recentlyAccessedSchema.index({ userId: 1, accessedAt: -1 });

module.exports = mongoose.model('RecentlyAccessed', recentlyAccessedSchema);

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
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
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    providerReply: {
      type: String,
      default: '',
    },
    replyDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ providerId: 1 });
reviewSchema.index({ customerId: 1 });

module.exports = mongoose.model('Review', reviewSchema);

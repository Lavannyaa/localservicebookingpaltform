const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isPart: {
    type: Boolean,
    default: false,
  },
});

const quoteSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    items: [quoteItemSchema],
    laborCharge: {
      type: Number,
      default: 0,
    },
    partsCharge: {
      type: Number,
      default: 0,
    },
    totalEstimated: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['ESTIMATED', 'APPROVED_BY_CUSTOMER', 'REJECTED'],
      default: 'ESTIMATED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quote', quoteSchema);

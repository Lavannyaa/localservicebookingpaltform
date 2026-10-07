const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  senderRole: {
    type: String,
    enum: ['CUSTOMER', 'PROVIDER', 'TECHNICIAN', 'SUPPORT_STAFF', 'ADMIN'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const complaintSchema = new mongoose.Schema(
  {
    complaintNumber: {
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
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
    },
    shopName: {
      type: String,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupportStaff',
    },
    issueType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_INVESTIGATION', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ customerId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ assignedStaffId: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);

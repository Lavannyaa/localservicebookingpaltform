const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  bookingNumber: String,
  serviceDate: {
    type: Date,
    default: Date.now,
  },
  providerName: String,
  shopName: String,
  technicianName: String,
  workCompleted: String,
  partsReplaced: [String],
  checklistSnapshot: [
    {
      task: String,
      completed: Boolean,
    },
  ],
  notes: String,
  recommendations: String,
  amountPaid: Number,
  warrantyMonths: {
    type: Number,
    default: 3,
  },
  nextMaintenanceDate: Date,
  completionStatus: {
    type: String,
    default: 'VERIFIED_COMPLETED',
  },
});

const servicePassportSchema = new mongoose.Schema(
  {
    passportNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applianceOrServiceName: {
      type: String,
      required: true,
      trim: true,
    },
    brandModel: {
      type: String,
      default: 'Standard Inverter Unit',
    },
    installationDate: {
      type: Date,
      default: Date.now,
    },
    serviceHistory: [serviceRecordSchema],
    totalServicesDone: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

servicePassportSchema.index({ customerId: 1 });

module.exports = mongoose.model('ServicePassport', servicePassportSchema);

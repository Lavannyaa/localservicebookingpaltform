const mongoose = require('mongoose');

const supportStaffSchema = new mongoose.Schema(
  {
    supportStaffId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    staffName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'Customer Grievances & Service Escalations',
    },
    status: {
      type: String,
      enum: ['ONLINE', 'AWAY', 'OFFLINE'],
      default: 'ONLINE',
    },
    assignedTicketsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

supportStaffSchema.index({ userId: 1 });

module.exports = mongoose.model('SupportStaff', supportStaffSchema);

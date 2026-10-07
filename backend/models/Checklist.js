const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
    },
    items: [
      {
        id: { type: String, required: true },
        task: { type: String, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        notes: { type: String, default: '' },
      },
    ],
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Checklist', checklistSchema);

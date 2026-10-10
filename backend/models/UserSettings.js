const mongoose = require('mongoose');

/**
 * UserSettings Model
 * Persists all 8 setting sections per user in MongoDB.
 * Linked to User via userId (ObjectId ref).
 * Synced from frontend via GET/PUT /api/users/settings
 */
const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // SECTION 1: Account Profile Details (subset — main profile is on User model)
    account: {
      deliveryAddress: { type: String, default: '' },
      workshopName: { type: String, default: '' },
      workshopGst: { type: String, default: '' },
      workshopAddress: { type: String, default: '' },
      tradeSpecialty: { type: String, default: '' },
      serviceZone: { type: String, default: '' },
      department: { type: String, default: '' },
    },

    // SECTION 2: Appearance — light | dark | system
    appearance: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    },

    // SECTION 3: Language — en | ta | hi | te | ml
    language: {
      code: { type: String, enum: ['en', 'ta', 'hi', 'te', 'ml'], default: 'en' },
    },

    // SECTION 4: Notifications
    notifications: {
      bookingUpdates: { type: Boolean, default: true },
      maintenanceReminders: { type: Boolean, default: true },
      serviceUpdates: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      offers: { type: Boolean, default: false },
      systemNotifications: { type: Boolean, default: true },
      channels: {
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
      },
    },

    // SECTION 5: Privacy
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'contacts', 'private'],
        default: 'contacts',
      },
      locationSharing: {
        type: String,
        enum: ['always', 'while_using', 'never'],
        default: 'while_using',
      },
      dataPreferences: {
        analytics: { type: Boolean, default: true },
        personalization: { type: Boolean, default: true },
        crashReporting: { type: Boolean, default: true },
      },
    },

    // SECTION 6: Security (sessions managed in-memory/JWT, only OAuth linkage persisted)
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      oauthLinked: {
        google: { type: Boolean, default: false },
        googleEmail: { type: String, default: '' },
        linkedDate: { type: String, default: '' },
      },
    },

    // SECTION 7: Accessibility
    accessibility: {
      fontSize: { type: String, enum: ['small', 'normal', 'large'], default: 'normal' },
      highContrast: { type: Boolean, default: false },
      reducedMotion: { type: Boolean, default: false },
    },

    // SECTION 8: Role-specific Preferences (flexible mixed object)
    preferences: {
      // Customer
      preferredSlot: { type: String, default: 'morning' },
      defaultPaymentMethod: { type: String, default: 'UPI / Online' },
      applianceReminderFrequency: { type: String, default: 'Every 3 Months' },
      autoReorderSupplies: { type: Boolean, default: false },
      // Provider
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifsc: { type: String, default: '' },
      upiId: { type: String, default: '' },
      serviceRadiusKm: { type: Number, default: 25 },
      workingHours: { type: String, default: '08:00 AM - 08:00 PM' },
      autoAcceptBookings: { type: Boolean, default: false },
      instantPayouts: { type: Boolean, default: true },
      // Technician
      maxTravelDistanceKm: { type: Number, default: 15 },
      offlineChecklistSync: { type: Boolean, default: true },
      emergencyDispatch: { type: Boolean, default: false },
      preferredNavigation: { type: String, default: 'google_maps' },
      vibrateOnAlert: { type: Boolean, default: true },
      autoDownloadJobSheets: { type: Boolean, default: true },
      // Support Staff
      autoAssignTickets: { type: Boolean, default: true },
      ticketRefreshIntervalSeconds: { type: Number, default: 30 },
      urgentAudioAlarm: { type: Boolean, default: true },
      cannedResponseLanguage: { type: String, default: 'en' },
      escalationSlaMinutes: { type: Number, default: 30 },
      // Admin
      platformFee: { type: Number, default: 49 },
      commissionRate: { type: Number, default: 10 },
      gstRate: { type: Number, default: 18 },
      escalationTimeoutMinutes: { type: Number, default: 45 },
      maintenanceMode: { type: Boolean, default: false },
      auditLogRetentionDays: { type: Number, default: 365 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserSettings', userSettingsSchema);

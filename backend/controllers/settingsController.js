const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserSettings = require('../models/UserSettings');

/**
 * GET /api/users/settings
 * Return current user's persisted settings from MongoDB.
 * If no document exists yet, create defaults and return.
 */
const getSettings = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      // Auto-create defaults on first access
      settings = await UserSettings.create({ userId });
    }

    // Also pull live profile fields from User model
    const user = await User.findById(userId).select('name email phone preferredLanguage profileImage role authProvider');

    res.status(200).json({
      success: true,
      data: {
        // Merge live user profile fields
        account: {
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          profileImage: user.profileImage || '',
          authProvider: user.authProvider,
          // Role-specific fields from settings
          ...settings.account,
        },
        appearance: settings.appearance,
        language: settings.language,
        notifications: settings.notifications,
        privacy: settings.privacy,
        security: settings.security,
        accessibility: settings.accessibility,
        preferences: settings.preferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/settings
 * Partial or full update of user settings in MongoDB.
 * Supports updating any combination of the 8 setting sections.
 */
const updateSettings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { account, appearance, language, notifications, privacy, security, accessibility, preferences } = req.body;

    // Build flat update object
    const updates = {};

    // Account — update User model for core fields, UserSettings for role-specific
    if (account) {
      const userUpdates = {};
      if (account.name) userUpdates.name = account.name.trim();
      if (account.phone !== undefined) userUpdates.phone = account.phone;
      if (account.preferredLanguage) userUpdates.preferredLanguage = account.preferredLanguage;
      if (account.profileImage !== undefined) userUpdates.profileImage = account.profileImage;

      if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(userId, userUpdates);
      }

      // Role-specific account fields go into UserSettings
      const roleAccountFields = ['deliveryAddress', 'workshopName', 'workshopGst', 'workshopAddress', 'tradeSpecialty', 'serviceZone', 'department'];
      roleAccountFields.forEach(field => {
        if (account[field] !== undefined) {
          updates[`account.${field}`] = account[field];
        }
      });
    }

    // Appearance
    if (appearance) {
      if (appearance.theme) updates['appearance.theme'] = appearance.theme;
    }

    // Language — also update User.preferredLanguage for persistence
    if (language) {
      if (language.code) {
        updates['language.code'] = language.code;
        await User.findByIdAndUpdate(userId, { preferredLanguage: language.code });
      }
    }

    // Notifications
    if (notifications) {
      const notifFields = ['bookingUpdates', 'maintenanceReminders', 'serviceUpdates', 'reviews', 'offers', 'systemNotifications'];
      notifFields.forEach(field => {
        if (notifications[field] !== undefined) {
          updates[`notifications.${field}`] = notifications[field];
        }
      });
      if (notifications.channels) {
        ['push', 'sms', 'email'].forEach(ch => {
          if (notifications.channels[ch] !== undefined) {
            updates[`notifications.channels.${ch}`] = notifications.channels[ch];
          }
        });
      }
    }

    // Privacy
    if (privacy) {
      if (privacy.profileVisibility) updates['privacy.profileVisibility'] = privacy.profileVisibility;
      if (privacy.locationSharing) updates['privacy.locationSharing'] = privacy.locationSharing;
      if (privacy.dataPreferences) {
        ['analytics', 'personalization', 'crashReporting'].forEach(pref => {
          if (privacy.dataPreferences[pref] !== undefined) {
            updates[`privacy.dataPreferences.${pref}`] = privacy.dataPreferences[pref];
          }
        });
      }
    }

    // Security — OAuth linkage only (password change is separate endpoint)
    if (security && security.oauthLinked) {
      if (security.oauthLinked.google !== undefined) updates['security.oauthLinked.google'] = security.oauthLinked.google;
      if (security.oauthLinked.googleEmail) updates['security.oauthLinked.googleEmail'] = security.oauthLinked.googleEmail;
      if (security.oauthLinked.linkedDate) updates['security.oauthLinked.linkedDate'] = security.oauthLinked.linkedDate;
    }

    // Accessibility
    if (accessibility) {
      if (accessibility.fontSize) updates['accessibility.fontSize'] = accessibility.fontSize;
      if (accessibility.highContrast !== undefined) updates['accessibility.highContrast'] = accessibility.highContrast;
      if (accessibility.reducedMotion !== undefined) updates['accessibility.reducedMotion'] = accessibility.reducedMotion;
    }

    // Preferences — flat update for all role-specific prefs
    if (preferences) {
      const prefFields = [
        // Customer
        'preferredSlot', 'defaultPaymentMethod', 'applianceReminderFrequency', 'autoReorderSupplies',
        // Provider
        'accountName', 'accountNumber', 'ifsc', 'upiId', 'serviceRadiusKm', 'workingHours', 'autoAcceptBookings', 'instantPayouts',
        // Technician
        'maxTravelDistanceKm', 'offlineChecklistSync', 'emergencyDispatch', 'preferredNavigation', 'vibrateOnAlert', 'autoDownloadJobSheets',
        // Support
        'autoAssignTickets', 'ticketRefreshIntervalSeconds', 'urgentAudioAlarm', 'cannedResponseLanguage', 'escalationSlaMinutes',
        // Admin
        'platformFee', 'commissionRate', 'gstRate', 'escalationTimeoutMinutes', 'maintenanceMode', 'auditLogRetentionDays',
      ];
      prefFields.forEach(field => {
        if (preferences[field] !== undefined) {
          updates[`preferences.${field}`] = preferences[field];
        }
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ success: true, message: 'No changes to apply.' });
    }

    const updatedSettings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings saved to MongoDB successfully.',
      data: updatedSettings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/change-password
 * Authenticated password change with current password verification.
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(422).json({
        success: false,
        message: 'Both current password and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(422).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(422).json({
        success: false,
        message: 'New passwords do not match.',
      });
    }

    // Retrieve user with passwordHash
    const user = await User.findById(req.user._id).select('+passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Google OAuth users may not have a local password
    if (user.authProvider === 'GOOGLE' && !user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'Your account was created via Google OAuth and has no local password. Use Google sign-in.',
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. All future logins will require the new password.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/profile
 * Return authenticated user's live profile (alias for /settings basic profile).
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings, changePassword, getProfile };

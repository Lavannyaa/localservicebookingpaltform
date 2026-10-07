/**
 * Settings Service Layer
 * 
 * Manages user settings, preferences, security sessions, and privacy configurations.
 * 
 * Prepared for Backend Persistence:
 * - When MongoDB backend is connected, persists to:
 *   GET    /api/v1/users/:userId/settings
 *   PUT    /api/v1/users/:userId/settings
 *   POST   /api/v1/users/:userId/change-password
 *   POST   /api/v1/users/:userId/oauth/link
 *   POST   /api/v1/users/:userId/oauth/unlink
 *   GET    /api/v1/users/:userId/sessions
 *   DELETE /api/v1/users/:userId/sessions/:sessionId
 * - Persists locally in localStorage partitioned by userId (localserve_settings_${userId})
 * - Provides tailored defaults for all 5 roles: customer, provider, technician, support, admin.
 */

const STORAGE_PREFIX = 'localserve_settings_';

export const getDefaultSettingsForRole = (role = 'customer', user = {}) => {
  const roleName = (role || 'customer').toLowerCase();

  const base = {
    account: {
      name: user.name || (roleName === 'customer' ? 'Rahul Sharma' :
             roleName === 'provider' ? 'Senthil Kumar' :
             roleName === 'technician' ? 'Murugan K' :
             roleName === 'support' ? 'Priya Raman' : 'Administrator'),
      email: user.email || (roleName === 'customer' ? 'rahul.sharma@example.com' :
             roleName === 'provider' ? 'senthil@frosttech.com' :
             roleName === 'technician' ? 'murugan.tech@localserve.in' :
             roleName === 'support' ? 'priya.support@localserve.in' : 'admin@localserve.in'),
      phone: user.phone || '+91 98401 23456',
      role: roleName,
      avatar: user.avatar || null,
      // Role-specific account fields
      passportNumber: roleName === 'customer' ? 'PASSPORT-TNV-2026-081' : undefined,
      deliveryAddress: roleName === 'customer' ? '12/4B South Bypass Road, Vannarpettai, Tirunelveli - 627003' : undefined,
      workshopName: roleName === 'provider' ? 'FrostTech AC & Electrical Solutions' : undefined,
      workshopRegNumber: roleName === 'provider' ? 'TN-07-2024-REG-98124' : undefined,
      workshopGst: roleName === 'provider' ? '33AAACF1234A1Z5' : undefined,
      workshopAddress: roleName === 'provider' ? '45 North Car Street, Tirunelveli - 627001' : undefined,
      technicianId: roleName === 'technician' ? 'TECH-TNV-042' : undefined,
      tradeSpecialty: roleName === 'technician' ? 'AC & Heavy Refrigeration Master' : undefined,
      serviceZone: roleName === 'technician' ? 'Tirunelveli Urban & Palayamkottai' : undefined,
      staffId: roleName === 'support' ? 'SUP-TNV-108' : undefined,
      department: roleName === 'support' ? 'Customer Grievances & Service Escalations' : undefined,
      adminId: roleName === 'admin' ? 'ADMIN-SYS-001' : undefined,
      clearanceLevel: roleName === 'admin' ? 'Level 5 (Super Governance)' : undefined,
    },
    appearance: {
      theme: 'light', // 'light' | 'dark' | 'system'
    },
    language: {
      code: 'en', // 'en' | 'ta' | 'hi' | 'te' | 'ml'
    },
    notifications: {
      bookingUpdates: true,
      maintenanceReminders: true,
      serviceUpdates: true,
      reviews: true,
      offers: roleName === 'customer',
      systemNotifications: true,
      channels: {
        push: true,
        sms: true,
        email: true,
      }
    },
    privacy: {
      profileVisibility: 'contacts', // 'public' | 'contacts' | 'private'
      locationSharing: roleName === 'technician' ? 'always' : 'while_using', // 'always' | 'while_using' | 'never'
      dataPreferences: {
        analytics: true,
        personalization: true,
        crashReporting: true,
      }
    },
    security: {
      twoFactorEnabled: false,
      oauthLinked: {
        google: true,
        googleEmail: user.email || 'user@example.com',
        linkedDate: '2026-01-15'
      },
      sessions: [
        {
          id: 'sess_curr_01',
          device: 'Chrome 128 / Windows 11',
          ip: '49.207.218.42',
          location: 'Tirunelveli, Tamil Nadu, India',
          lastActive: 'Active Now',
          isCurrent: true,
        },
        {
          id: 'sess_mob_02',
          device: 'LocalServe Mobile App / Android 14',
          ip: '49.207.199.10',
          location: 'Tirunelveli, Tamil Nadu, India',
          lastActive: '2 hours ago',
          isCurrent: false,
        }
      ]
    },
    accessibility: {
      fontSize: 'normal', // 'small' | 'normal' | 'large'
      highContrast: false,
      reducedMotion: false,
    },
    preferences: getRolePreferences(roleName)
  };

  return base;
};

function getRolePreferences(role) {
  switch (role) {
    case 'provider':
      return {
        accountName: 'FrostTech Solutions Commercial Account',
        accountNumber: '50200049281722',
        ifsc: 'HDFC0001824',
        upiId: 'frosttech@okhdfcbank',
        serviceRadiusKm: 25,
        autoAcceptBookings: true,
        workingHours: '08:00 AM - 08:00 PM',
        instantPayouts: true,
      };
    case 'technician':
      return {
        maxTravelDistanceKm: 15,
        offlineChecklistSync: true,
        emergencyDispatch: true,
        preferredNavigation: 'google_maps',
        vibrateOnAlert: true,
        autoDownloadJobSheets: true,
      };
    case 'support':
      return {
        autoAssignTickets: true,
        ticketRefreshIntervalSeconds: 30,
        urgentAudioAlarm: true,
        cannedResponseLanguage: 'en',
        escalationSlaMinutes: 30,
      };
    case 'admin':
      return {
        platformFee: 49,
        commissionRate: 10,
        gstRate: 18,
        escalationTimeoutMinutes: 45,
        maintenanceMode: false,
        auditLogRetentionDays: 365,
      };
    case 'customer':
    default:
      return {
        defaultAddress: '12/4B South Bypass Road, Vannarpettai, Tirunelveli - 627003',
        preferredSlot: 'morning', // 'morning' | 'afternoon' | 'evening'
        autoReorderSupplies: false,
        defaultPaymentMethod: 'UPI / Online',
        applianceReminderFrequency: 'Every 3 Months',
      };
  }
}

export const settingsService = {
  /**
   * Fetch settings for a specific authenticated user
   */
  async getSettings(userId = 'guest', role = 'customer', userObj = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
          const cached = localStorage.getItem(key);
          if (cached) {
            const parsed = JSON.parse(cached);
            resolve(parsed);
          } else {
            const defaults = getDefaultSettingsForRole(role, userObj);
            localStorage.setItem(key, JSON.stringify(defaults));
            resolve(defaults);
          }
        } catch {
          resolve(getDefaultSettingsForRole(role, userObj));
        }
      }, 50);
    });
  },

  /**
   * Persist full or partial settings update
   */
  async saveSettings(userId = 'guest', updatedSettings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
          localStorage.setItem(key, JSON.stringify(updatedSettings));
          resolve({ success: true, settings: updatedSettings });
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }, 50);
    });
  },

  /**
   * Change user password with security checks
   */
  async changePassword(userId = 'guest', { currentPassword, newPassword }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentPassword) {
          reject(new Error('Current password is required'));
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          reject(new Error('New password must be at least 6 characters long'));
          return;
        }
        resolve({
          success: true,
          message: 'Password updated successfully across all authenticated platforms.'
        });
      }, 80);
    });
  },

  /**
   * Connect or disconnect OAuth Google provider
   */
  async toggleOAuthProvider(userId = 'guest', provider = 'google', link = true, userEmail = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
          const cached = localStorage.getItem(key);
          const current = cached ? JSON.parse(cached) : getDefaultSettingsForRole('customer');
          
          if (!current.security) current.security = {};
          if (!current.security.oauthLinked) current.security.oauthLinked = {};

          current.security.oauthLinked[provider] = link;
          if (link) {
            current.security.oauthLinked[`${provider}Email`] = userEmail || 'user@example.com';
            current.security.oauthLinked.linkedDate = new Date().toISOString().split('T')[0];
          } else {
            delete current.security.oauthLinked[`${provider}Email`];
          }

          localStorage.setItem(key, JSON.stringify(current));
          resolve({ success: true, oauthLinked: current.security.oauthLinked });
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }, 60);
    });
  },

  /**
   * Terminate a specific session
   */
  async terminateSession(userId = 'guest', sessionId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
          const cached = localStorage.getItem(key);
          if (cached) {
            const current = JSON.parse(cached);
            if (current.security && current.security.sessions) {
              current.security.sessions = current.security.sessions.filter(s => s.id !== sessionId);
              localStorage.setItem(key, JSON.stringify(current));
              resolve({ success: true, sessions: current.security.sessions });
              return;
            }
          }
          resolve({ success: true, sessions: [] });
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }, 50);
    });
  },

  /**
   * Terminate all other sessions except current
   */
  async terminateAllOtherSessions(userId = 'guest') {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
          const cached = localStorage.getItem(key);
          if (cached) {
            const current = JSON.parse(cached);
            if (current.security && current.security.sessions) {
              current.security.sessions = current.security.sessions.filter(s => s.isCurrent);
              localStorage.setItem(key, JSON.stringify(current));
              resolve({ success: true, sessions: current.security.sessions });
              return;
            }
          }
          resolve({ success: true, sessions: [] });
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }, 50);
    });
  },

  /**
   * Export user privacy and personal data file
   */
  async exportUserData(userId = 'guest', role = 'customer') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `${STORAGE_PREFIX}${userId || 'guest'}`;
        const settings = localStorage.getItem(key);
        const dataExport = {
          exportTimestamp: new Date().toISOString(),
          userId,
          role,
          settings: settings ? JSON.parse(settings) : null,
          platform: 'LocalServe Hyperlocal Platform',
          compliance: 'Digital Personal Data Protection Act (DPDPA 2023)'
        };
        resolve(dataExport);
      }, 70);
    });
  }
};

export default settingsService;

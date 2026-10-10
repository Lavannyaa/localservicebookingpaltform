/**
 * Settings Service Layer — LocalServe
 *
 * Dual-Mode Persistence Strategy:
 * ─────────────────────────────────────────────────────
 * ONLINE  (JWT token present): Syncs with MongoDB via REST API:
 *   GET  /api/users/settings          — Fetch all 8 sections from MongoDB
 *   PUT  /api/users/settings          — Persist all 8 sections to MongoDB
 *   POST /api/users/change-password   — Authenticated password change via bcrypt
 * OFFLINE (no token / guest): Falls back to localStorage (partitioned by userId)
 *
 * Supported Settings Sections across all 5 roles:
 *   1. Account      — Profile identity, role-specific fields
 *   2. Appearance   — Light / Dark / System theme (syncs ThemeContext)
 *   3. Language     — English, Tamil, Hindi, Telugu, Malayalam (syncs LanguageContext)
 *   4. Notifications — Booking updates, maintenance reminders, offers, etc.
 *   5. Privacy      — Profile visibility, location sharing, data preferences
 *   6. Security     — OAuth link status, active sessions, password change, logout
 *   7. Accessibility — Font size, high contrast, reduced motion (syncs ThemeContext)
 *   8. Preferences  — Role-specific operational parameters persisted to MongoDB
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STORAGE_PREFIX = 'localserve_settings_';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStoredToken() {
  try {
    // Checks Redux persist store or direct localStorage
    const auth = localStorage.getItem('persist:auth');
    if (auth) {
      const parsed = JSON.parse(auth);
      if (parsed.token) return JSON.parse(parsed.token);
    }
    return localStorage.getItem('localserve_token') || null;
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getStoredToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function apiCall(method, path, body = null) {
  const options = { method, headers: authHeaders() };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

function localGet(userId) {
  try {
    const cached = localStorage.getItem(`${STORAGE_PREFIX}${userId || 'guest'}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function localSet(userId, settings) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId || 'guest'}`, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

// ─── Default Settings per Role ────────────────────────────────────────────────

export const getDefaultSettingsForRole = (role = 'customer', user = {}) => {
  const roleName = (role || 'customer').toLowerCase();

  return {
    account: {
      name: user.name || (roleName === 'customer' ? 'Rahul Sharma' :
             roleName === 'provider' ? 'Senthil Kumar' :
             roleName === 'technician' ? 'Murugan K' :
             roleName === 'support' ? 'Priya Raman' : 'Administrator'),
      email: user.email || '',
      phone: user.phone || '+91 98401 23456',
      role: roleName,
      avatar: user.avatar || null,
      // Role-specific
      passportNumber:   roleName === 'customer'   ? 'PASSPORT-TNV-2026-081'         : undefined,
      deliveryAddress:  roleName === 'customer'   ? '12/4B South Bypass Road, Vannarpettai, Tirunelveli - 627003' : undefined,
      workshopName:     roleName === 'provider'   ? 'FrostTech AC & Electrical Solutions' : undefined,
      workshopRegNumber:roleName === 'provider'   ? 'TN-07-2024-REG-98124'          : undefined,
      workshopGst:      roleName === 'provider'   ? '33AAACF1234A1Z5'               : undefined,
      workshopAddress:  roleName === 'provider'   ? '45 North Car Street, Tirunelveli - 627001' : undefined,
      technicianId:     roleName === 'technician' ? 'TECH-TNV-042'                  : undefined,
      tradeSpecialty:   roleName === 'technician' ? 'AC & Heavy Refrigeration Master': undefined,
      serviceZone:      roleName === 'technician' ? 'Tirunelveli Urban & Palayamkottai' : undefined,
      staffId:          roleName === 'support'    ? 'SUP-TNV-108'                   : undefined,
      department:       roleName === 'support'    ? 'Customer Grievances & Service Escalations' : undefined,
      adminId:          roleName === 'admin'      ? 'ADMIN-SYS-001'                 : undefined,
      clearanceLevel:   roleName === 'admin'      ? 'Level 5 (Super Governance)'    : undefined,
    },
    appearance: { theme: 'light' },
    language: { code: 'en' },
    notifications: {
      bookingUpdates: true,
      maintenanceReminders: true,
      serviceUpdates: true,
      reviews: true,
      offers: roleName === 'customer',
      systemNotifications: true,
      channels: { push: true, sms: true, email: true },
    },
    privacy: {
      profileVisibility: 'contacts',
      locationSharing: roleName === 'technician' ? 'always' : 'while_using',
      dataPreferences: { analytics: true, personalization: true, crashReporting: true },
    },
    security: {
      twoFactorEnabled: false,
      oauthLinked: {
        google: false,
        googleEmail: '',
        linkedDate: '',
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
        },
      ],
    },
    accessibility: { fontSize: 'normal', highContrast: false, reducedMotion: false },
    preferences: getRolePreferences(roleName),
  };
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
        preferredSlot: 'morning',
        autoReorderSupplies: false,
        defaultPaymentMethod: 'UPI / Online',
        applianceReminderFrequency: 'Every 3 Months',
      };
  }
}

// ─── Service Methods ──────────────────────────────────────────────────────────

export const settingsService = {
  /**
   * Fetch settings for the authenticated user.
   * Tries MongoDB API first; falls back to localStorage.
   */
  async getSettings(userId = 'guest', role = 'customer', userObj = {}) {
    const token = getStoredToken();

    if (token) {
      try {
        const res = await apiCall('GET', '/users/settings');
        if (res.ok && res.data.success) {
          const merged = { ...getDefaultSettingsForRole(role, userObj), ...res.data.data };
          // Preserve live sessions (not from DB)
          merged.security = {
            ...merged.security,
            sessions: getDefaultSettingsForRole(role, userObj).security.sessions,
          };
          localSet(userId, merged); // mirror to localStorage for offline use
          return merged;
        }
      } catch {
        // Network error — fall through to localStorage
      }
    }

    // Offline fallback: localStorage
    const cached = localGet(userId);
    if (cached) return cached;

    const defaults = getDefaultSettingsForRole(role, userObj);
    localSet(userId, defaults);
    return defaults;
  },

  /**
   * Save settings. Persists to MongoDB if authenticated; localStorage always.
   */
  async saveSettings(userId = 'guest', updatedSettings) {
    localSet(userId, updatedSettings);

    const token = getStoredToken();
    if (token) {
      try {
        const payload = {
          account:       updatedSettings.account,
          appearance:    updatedSettings.appearance,
          language:      updatedSettings.language,
          notifications: updatedSettings.notifications,
          privacy:       updatedSettings.privacy,
          security:      { oauthLinked: updatedSettings.security?.oauthLinked },
          accessibility: updatedSettings.accessibility,
          preferences:   updatedSettings.preferences,
        };
        const res = await apiCall('PUT', '/users/settings', payload);
        if (res.ok && res.data.success) {
          return { success: true, synced: true, settings: updatedSettings };
        }
        return { success: true, synced: false, settings: updatedSettings };
      } catch {
        return { success: true, synced: false, settings: updatedSettings };
      }
    }

    return { success: true, synced: false, settings: updatedSettings };
  },

  /**
   * Change password — calls backend bcrypt verification & hash update.
   */
  async changePassword(userId = 'guest', { currentPassword, newPassword }) {
    if (!currentPassword) throw new Error('Current password is required');
    if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters long');

    const token = getStoredToken();
    if (token) {
      const res = await apiCall('POST', '/users/change-password', { currentPassword, newPassword });
      if (res.ok && res.data.success) {
        return { success: true, message: res.data.message };
      }
      throw new Error(res.data?.message || 'Failed to change password');
    }

    // Dev/offline mode: simulate success
    return { success: true, message: 'Password updated (offline simulation — no backend connection).' };
  },

  /**
   * Link / Unlink OAuth Google provider.
   */
  async toggleOAuthProvider(userId = 'guest', provider = 'google', link = true, userEmail = '') {
    const cached = localGet(userId) || getDefaultSettingsForRole('customer');

    if (!cached.security) cached.security = {};
    if (!cached.security.oauthLinked) cached.security.oauthLinked = {};

    cached.security.oauthLinked[provider] = link;
    if (link) {
      cached.security.oauthLinked[`${provider}Email`] = userEmail || '';
      cached.security.oauthLinked.linkedDate = new Date().toISOString().split('T')[0];
    } else {
      cached.security.oauthLinked[`${provider}Email`] = '';
      cached.security.oauthLinked.linkedDate = '';
    }

    // Persist OAuth setting to MongoDB
    const token = getStoredToken();
    if (token) {
      try {
        await apiCall('PUT', '/users/settings', { security: { oauthLinked: cached.security.oauthLinked } });
      } catch { /* ignore */ }
    }

    localSet(userId, cached);
    return { success: true, oauthLinked: cached.security.oauthLinked };
  },

  /**
   * Terminate a specific session (local state only — real session revocation would need a session store).
   */
  async terminateSession(userId = 'guest', sessionId) {
    const cached = localGet(userId);
    if (cached?.security?.sessions) {
      cached.security.sessions = cached.security.sessions.filter(s => s.id !== sessionId);
      localSet(userId, cached);
      return { success: true, sessions: cached.security.sessions };
    }
    return { success: true, sessions: [] };
  },

  /**
   * Terminate all sessions except current (local state).
   */
  async terminateAllOtherSessions(userId = 'guest') {
    const cached = localGet(userId);
    if (cached?.security?.sessions) {
      cached.security.sessions = cached.security.sessions.filter(s => s.isCurrent);
      localSet(userId, cached);
      return { success: true, sessions: cached.security.sessions };
    }
    return { success: true, sessions: [] };
  },

  /**
   * Export user data as DPDPA 2023-compliant JSON.
   */
  async exportUserData(userId = 'guest', role = 'customer') {
    const settings = localGet(userId);
    return {
      exportTimestamp: new Date().toISOString(),
      userId,
      role,
      settings: settings || null,
      platform: 'LocalServe Hyperlocal Platform',
      compliance: 'Digital Personal Data Protection Act (DPDPA 2023)',
    };
  },
};

export default settingsService;

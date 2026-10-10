import React from 'react';
import { UnifiedSettingsView } from '../../components/settings/UnifiedSettingsView';

/**
 * AdminSettingsPage
 * 
 * Full Settings management for the ADMIN role.
 * All 8 sections: Account, Appearance, Language, Notifications, Privacy,
 * Security (Change Password / OAuth / Sessions / Logout), Accessibility, Preferences.
 * 
 * Preferences section for ADMIN exposes:
 * - Fixed Platform Booking Fee (₹)
 * - Workshop Commission Rate (%)
 * - Applicable GST (%)
 * - SLA Auto-Escalation Window (mins)
 * - Platform Maintenance Mode toggle
 * - Audit Log Retention Days
 * 
 * Settings persist via Context API (Appearance/Language/Accessibility) and
 * MongoDB (all 8 sections) through PUT /api/users/settings.
 */
export const AdminSettingsPage = () => {
  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '1120px' }}>
        <UnifiedSettingsView
          role="admin"
          title="Platform Governance & Admin Preferences"
          subtitle="Configure master admin credentials, platform fee architecture, commission splits, GST parameters, SLA escalation policies, and maintenance mode governance."
        />
      </div>
    </div>
  );
};

export default AdminSettingsPage;

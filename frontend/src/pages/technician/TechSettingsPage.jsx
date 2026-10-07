import React from 'react';
import { UnifiedSettingsView } from '../../components/settings/UnifiedSettingsView';

export const TechSettingsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <UnifiedSettingsView
        role="technician"
        title="Technician Device & Shift Settings"
        subtitle="Configure field service area, offline checklist caching, vibration alerts, live GPS location sharing, and security credentials."
      />
    </div>
  );
};

export default TechSettingsPage;

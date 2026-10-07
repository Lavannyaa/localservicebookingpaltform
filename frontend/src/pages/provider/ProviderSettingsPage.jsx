import React from 'react';
import { UnifiedSettingsView } from '../../components/settings/UnifiedSettingsView';

export const ProviderSettingsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <UnifiedSettingsView
        role="provider"
        title="Workshop Operational & Payout Settings"
        subtitle="Manage commercial workshop registration, direct settlement bank accounts, dispatch radius, staff security, and alert notifications."
      />
    </div>
  );
};

export default ProviderSettingsPage;

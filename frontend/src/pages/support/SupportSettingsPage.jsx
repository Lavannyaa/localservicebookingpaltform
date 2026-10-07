import React from 'react';
import { UnifiedSettingsView } from '../../components/settings/UnifiedSettingsView';

export const SupportSettingsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <UnifiedSettingsView
        role="support"
        title="Support Desk Routing & SLA Rules"
        subtitle="Manage agent credentials, grievance queue auto-assignment, urgent escalation sound chimes, and response dictionaries."
      />
    </div>
  );
};

export default SupportSettingsPage;

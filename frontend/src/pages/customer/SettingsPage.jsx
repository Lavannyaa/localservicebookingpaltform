import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { UnifiedSettingsView } from '../../components/settings/UnifiedSettingsView';

export const SettingsPage = () => {
  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '1120px' }}>
        <Breadcrumb items={[
          { label: 'Home', path: '/home' },
          { label: 'Customer Settings' }
        ]} />

        <UnifiedSettingsView
          role="customer"
          title="Customer Account & Preferences"
          subtitle="Configure your service delivery address, live appearance palette, language dictionaries, security credentials, and repair reminders."
        />
      </div>
    </div>
  );
};

export default SettingsPage;

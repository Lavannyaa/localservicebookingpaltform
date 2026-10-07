import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProviderSidebar } from '../components/provider/ProviderSidebar';
import { ProviderHeader } from '../components/provider/ProviderHeader';

export const ProviderLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <ProviderHeader />
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;

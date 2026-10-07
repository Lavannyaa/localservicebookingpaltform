import React from 'react';
import { Outlet } from 'react-router-dom';
import { SupportSidebar } from '../components/support/SupportSidebar';
import { SupportHeader } from '../components/support/SupportHeader';

export const SupportLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <SupportSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <SupportHeader />
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupportLayout;

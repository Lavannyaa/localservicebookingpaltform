import React from 'react';
import { Outlet } from 'react-router-dom';
import { TechSidebar } from '../components/technician/TechSidebar';
import { TechHeader } from '../components/technician/TechHeader';

export const TechnicianLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <TechSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <TechHeader />
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TechnicianLayout;

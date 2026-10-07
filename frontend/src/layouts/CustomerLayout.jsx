import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from '../components/customer/CustomerNavbar';
import { CustomerFooter } from '../components/customer/CustomerFooter';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';

export const CustomerLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
      <CustomerNavbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <CustomerFooter />
      <ChatbotWidget />
    </div>
  );
};

export default CustomerLayout;

import React from 'react';
import { Bell } from 'lucide-react';

export const SupportNotificationsPage = () => {
  const alerts = [
    { title: 'SLA Breach Warning', message: 'Ticket TCK-401 approaching 4-hour SLA threshold.', time: '10 mins ago' },
    { title: 'New Customer Escalation', message: 'Rahul Sharma requested support intervention for delay.', time: '1 hour ago' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Support Desk Alerts
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time alerts for incoming disputes and SLA breach notifications.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((a, idx) => (
          <div key={idx} style={{ background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{a.title}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{a.message}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportNotificationsPage;

import React from 'react';
import { Button } from '../../components/common/Button';
import { Bell, Briefcase, Calendar, Check } from 'lucide-react';

export const TechNotificationsPage = () => {
  const alerts = [
    { title: 'New Job Dispatched', message: 'You have been assigned BK-1001 (AC Jet Wash) in Vannarpettai.', time: '15 mins ago', unread: true },
    { title: 'Customer Reschedule Confirmation', message: 'Booking BK-1002 slot confirmed for 2:30 PM today.', time: '2 hours ago', unread: false },
    { title: 'Workshop Announcement', message: 'Monthly safety gear audit on Saturday 5:00 PM at FrostTech workshop.', time: 'Yesterday', unread: false }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Technician Alerts & Notifications
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Dispatch instructions, schedule updates, and workshop alerts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((a, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: a.unread ? '1px solid var(--primary-300)' : '1px solid var(--border-light)',
            borderLeft: a.unread ? '4px solid var(--primary-600)' : '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{a.title}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{a.message}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechNotificationsPage;

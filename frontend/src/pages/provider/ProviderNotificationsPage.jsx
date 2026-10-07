import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { Button } from '../../components/common/Button';
import { Bell, Check, Trash2, CalendarCheck, Star, AlertTriangle } from 'lucide-react';

export const ProviderNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationService.getNotifications().then(data => {
      // Provider notifications
      setNotifications(data.filter(n => n.role === 'provider' || n.role === 'all'));
    });
  }, []);

  const markAllRead = () => {
    notificationService.markAllAsRead('provider').then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Workshop Alerts & Notifications
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Dispatch updates, customer requests, and SLA status alerts.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={markAllRead}>
          <Check size={14} /> Mark All as Read
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: n.read ? '1px solid var(--border-light)' : '1px solid var(--primary-300)',
            borderLeft: n.read ? '1px solid var(--border-light)' : '4px solid var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {n.title}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {n.message}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderNotificationsPage;

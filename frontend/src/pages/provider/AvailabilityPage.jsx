import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import {
  ToggleLeft, CheckCircle2, Clock, AlertTriangle, Calendar,
  Building2, Users, ShieldCheck, Check
} from 'lucide-react';

const CURRENT_SHOP_NAME = 'Kumar Electricals';

export const AvailabilityPage = () => {
  const [currentStatus, setCurrentStatus] = useState('Available');
  const [allowEmergency, setAllowEmergency] = useState(true);
  const [dailySlotsLimit, setDailySlotsLimit] = useState('16');
  const [schedule, setSchedule] = useState([
    { day: 'Monday', open: '08:30 AM', close: '08:30 PM', isOpen: true },
    { day: 'Tuesday', open: '08:30 AM', close: '08:30 PM', isOpen: true },
    { day: 'Wednesday', open: '08:30 AM', close: '08:30 PM', isOpen: true },
    { day: 'Thursday', open: '08:30 AM', close: '08:30 PM', isOpen: true },
    { day: 'Friday', open: '08:30 AM', close: '08:30 PM', isOpen: true },
    { day: 'Saturday', open: '08:30 AM', close: '07:30 PM', isOpen: true },
    { day: 'Sunday', open: '09:00 AM', close: '02:00 PM', isOpen: false }
  ]);
  const [saved, setSaved] = useState(false);

  const statuses = [
    {
      id: 'Available',
      label: 'Open & Accepting Bookings',
      desc: 'All customer booking requests will be routed to your workshop and technicians can be dispatched.',
      badge: 'badge-success'
    },
    {
      id: 'Busy',
      label: 'At Full Capacity (Buffer Added)',
      desc: 'Slots will be spread out by 45 minutes to prevent technician fatigue and travel delays.',
      badge: 'badge-warning'
    },
    {
      id: 'Offline',
      label: 'Closed / Offline',
      desc: 'No immediate bookings accepted. Customers can only pre-book for tomorrow onwards.',
      badge: 'badge-danger'
    }
  ];

  const handleToggleDay = (idx) => {
    setSchedule(prev => prev.map((item, i) => i === idx ? { ...item, isOpen: !item.isOpen } : item));
  };

  const handleUpdate = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Workshop Operational Availability
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Control live customer booking intake for {CURRENT_SHOP_NAME}, emergency callout capability, and weekly working hours.
        </p>
      </div>

      {saved && (
        <div style={{
          background: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Check size={18} /> Workshop availability settings synchronized across LocalServe customer search!
        </div>
      )}

      {/* Live Status Selector */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '26px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Live Workshop Status</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {statuses.map(st => (
            <div
              key={st.id}
              onClick={() => setCurrentStatus(st.id)}
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: currentStatus === st.id ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: currentStatus === st.id ? 'var(--primary-50)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{st.label}</span>
                  <span className={`badge ${st.badge}`}>{st.id}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {st.desc}
                </div>
              </div>
              <input
                type="radio"
                name="status_radio"
                checked={currentStatus === st.id}
                onChange={() => setCurrentStatus(st.id)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>
          ))}
        </div>

        {/* Emergency Dispatch Settings */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Accept Emergency 60-Minute Breakdown Calls</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Power short-circuit trips, main switchgear burnout, or commercial refrigerator breakdowns.
            </div>
          </div>
          <input
            type="checkbox"
            checked={allowEmergency}
            onChange={e => setAllowEmergency(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        {/* Max Daily Bookings */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Maximum Daily Booking Cap</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Workshop automatically marks as "At Full Capacity" when this threshold is reached today.
            </div>
          </div>
          <input
            type="number"
            min="1"
            max="50"
            value={dailySlotsLimit}
            onChange={e => setDailySlotsLimit(e.target.value)}
            style={{ width: '80px', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', textAlign: 'center', fontWeight: 700 }}
          />
        </div>
      </div>

      {/* Weekly Operating Hours Schedule */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '26px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Weekly Operating Hours Schedule</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {schedule.map((item, idx) => (
            <div
              key={item.day}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: item.isOpen ? 'var(--bg-muted)' : 'transparent',
                border: '1px solid var(--border-light)',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '140px' }}>
                <input
                  type="checkbox"
                  checked={item.isOpen}
                  onChange={() => handleToggleDay(idx)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.day}</span>
              </div>

              {item.isOpen ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem' }}>
                  <span>{item.open}</span>
                  <span style={{ color: 'var(--text-muted)' }}>to</span>
                  <span>{item.close}</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>Closed for regular bookings</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <Button variant="primary" onClick={handleUpdate}>
            Save Availability & Hours
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;

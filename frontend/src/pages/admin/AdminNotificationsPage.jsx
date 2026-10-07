import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Bell, Send, Check } from 'lucide-react';

export const AdminNotificationsPage = () => {
  const [target, setTarget] = useState('all');
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setSent(true);
    setTitle('');
    setMsg('');
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Platform Broadcast Dispatcher
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Transmit system notices to Customers, Commercial Workshops, or Field Technicians.
        </p>
      </div>

      {sent && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '14px 20px', borderRadius: 'var(--radius-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Check size={18} /> System broadcast sent across platform channels!
        </div>
      )}

      <form onSubmit={handleBroadcast} style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Target Audience</label>
          <select value={target} onChange={e => setTarget(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <option value="all">All Platform Users (Customers, Workshops, Techs, Support)</option>
            <option value="customer">Customers Only</option>
            <option value="provider">Workshops & Providers Only</option>
            <option value="technician">Field Technicians Only</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Announcement Title</label>
          <input
            required
            type="text"
            placeholder="e.g. Monsoon Service Advisory & Surge Pricing Notice"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Message Content</label>
          <textarea
            required
            rows={4}
            placeholder="Write announcement details..."
            value={msg}
            onChange={e => setMsg(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="primary" type="submit">
            <Send size={16} /> Broadcast Now
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminNotificationsPage;

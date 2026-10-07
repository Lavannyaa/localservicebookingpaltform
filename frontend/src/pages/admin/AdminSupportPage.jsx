import React from 'react';
import { Button } from '../../components/common/Button';
import { Headphones, ShieldCheck, Clock } from 'lucide-react';

export const AdminSupportPage = () => {
  const staff = [
    { id: 'supp-1', name: 'Ananya Deshmukh', email: 'support@localserve.com', phone: '+91 98111 22334', dept: 'Dispute Resolution & Operations', shift: 'General (09:00 - 18:00)', resolved: 342, slaRate: '98.8%' },
    { id: 'supp-2', name: 'Vikram Malhotra', email: 'vikram.supp@localserve.com', phone: '+91 98111 22335', dept: 'Escalations & Legal Mediation', shift: 'Afternoon (14:00 - 22:00)', resolved: 280, slaRate: '99.1%' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Support Staff & Agents Roster
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Customer mediation officers and SLA compliance monitors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {staff.map(s => (
          <div key={s.id} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headphones size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{s.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.dept}</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div><strong>Shift:</strong> {s.shift}</div>
              <div><strong>Resolved Tickets:</strong> {s.resolved}</div>
              <div><strong>SLA Compliance:</strong> {s.slaRate}</div>
            </div>

            <Button variant="secondary" size="sm" style={{ width: '100%' }}>View Performance Audit</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSupportPage;

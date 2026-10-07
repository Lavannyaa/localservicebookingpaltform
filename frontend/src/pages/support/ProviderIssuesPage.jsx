import React from 'react';
import { Button } from '../../components/common/Button';
import { Building2, AlertTriangle, CheckCircle2, Phone } from 'lucide-react';

export const ProviderIssuesPage = () => {
  const issues = [
    {
      id: 'PRV-801',
      workshop: 'Kumar Electricals',
      subject: 'Customer address unreachable / phone disconnected',
      bookingNumber: 'LS-2026-1002',
      techName: 'K. Arumugam',
      status: 'In Investigation',
      time: '35 mins ago'
    },
    {
      id: 'PRV-802',
      workshop: 'FrostTech AC Solutions',
      subject: 'Severe rain delay for outdoor condenser hoist',
      bookingNumber: 'LS-2026-1001',
      techName: 'S. Murugan',
      status: 'Resolved',
      time: '3 hours ago'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Workshop & Provider Escalations
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Issues reported by commercial service workshops regarding client availability, parts delays, or site access.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {issues.map(iss => (
          <div key={iss.id} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{iss.subject}</span>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Escalation #{iss.id} · Workshop: <strong>{iss.workshop}</strong> · Tech: {iss.techName}
                </div>
              </div>
              <span className={`badge ${iss.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>{iss.status}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <Button variant="secondary" size="sm">Contact Customer</Button>
              <Button variant="primary" size="sm">Resolve Escalation</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderIssuesPage;

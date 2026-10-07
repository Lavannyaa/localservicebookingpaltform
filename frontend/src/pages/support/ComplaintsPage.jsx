import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    complaintService.getComplaints().then(setComplaints);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Formal Grievance Desk
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Customer and workshop grievances governed under standard SLA resolution guidelines.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {complaints.map(c => (
          <div key={c.ticketId} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{c.subject}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {c.ticketId}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Priority: <strong>{c.priority}</strong> · Raised: {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span className={`badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-danger'}`}>{c.status}</span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '12px 0 16px 0', lineHeight: 1.5 }}>
              "{c.description}"
            </p>

            <div style={{ background: 'var(--bg-muted)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <strong>Support Resolution Log:</strong> {c.supportNotes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsPage;

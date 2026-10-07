import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { Users, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';

export const CustomerIssuesPage = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    complaintService.getComplaints().then(data => {
      setIssues(data.filter(t => t.category.includes('Customer') || t.category.includes('Billing')));
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Customer Support Inquiries & Tickets
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Issues reported by platform customers regarding booking delays, service quality, or billing.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {issues.map(item => (
          <div key={item.ticketId} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{item.subject}</span>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Ticket #{item.ticketId} · Raised by {item.customerName} for Booking {item.bookingNumber}
                </div>
              </div>
              <span className={`badge ${item.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '10px 0 14px 0' }}>
              "{item.description}"
            </p>

            {item.supportNotes && (
              <div style={{ background: 'var(--bg-muted)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Support Action Taken:</strong> {item.supportNotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerIssuesPage;

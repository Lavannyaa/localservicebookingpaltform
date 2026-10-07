import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { LifeBuoy, Check, AlertCircle, MessageSquare } from 'lucide-react';

export const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    complaintService.getComplaints().then(data => {
      setTickets(data);
      setSelectedTicket(data[0] || null);
    });
  }, []);

  const handleResolve = () => {
    if (!selectedTicket) return;
    complaintService.updateComplaintStatus(selectedTicket.ticketId, 'Resolved', reply || 'Resolved by Support Officer Ananya Deshmukh').then(updated => {
      setTickets(prev => prev.map(t => t.ticketId === selectedTicket.ticketId ? updated : t));
      setSelectedTicket(updated);
      setReply('');
      alert("Ticket status updated to Resolved!");
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Support Ticket Management Console
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Inspect ticket conversations, add internal investigation notes, and issue platform compensation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Ticket List */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tickets.map(t => (
            <div
              key={t.ticketId}
              onClick={() => setSelectedTicket(t)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: selectedTicket?.ticketId === t.ticketId ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: selectedTicket?.ticketId === t.ticketId ? 'var(--primary-50)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t.subject}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {t.ticketId} · {t.customerName}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Ticket Workbench */}
        {selectedTicket && (
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{selectedTicket.subject}</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ticket #{selectedTicket.ticketId} · Customer: {selectedTicket.customerName}</span>
              </div>
              <span className={`badge ${selectedTicket.status === 'Resolved' ? 'badge-success' : 'badge-danger'}`}>{selectedTicket.status}</span>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedTicket.description}
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Support Resolution Record:</div>
              <div style={{ fontSize: '0.86rem' }}>{selectedTicket.supportNotes || 'No notes added yet.'}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Add Resolution / Note</label>
              <textarea
                rows={3}
                placeholder="Enter final resolution note or platform compensation voucher details..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="success" onClick={handleResolve}>
                  <Check size={16} /> Mark as Resolved & Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketsPage;

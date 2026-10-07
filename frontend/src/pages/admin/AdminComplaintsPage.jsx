import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useRecentlyAccessed } from '../../hooks';
import {
  AlertTriangle, CheckCircle2, ShieldAlert, Headphones, Search,
  Filter, UserCheck, MessageSquare, Clock, ArrowRight, Shield
} from 'lucide-react';

export const AdminComplaintsPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'open' | 'investigating' | 'resolved'
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [assignedStaff, setAssignedStaff] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [supportNote, setSupportNote] = useState('');

  const supportStaffList = [
    'Ananya Deshmukh (Dispute Resolution)',
    'Vikram Sethi (Quality Assurance)',
    'K. Priya (Customer Care Lead)',
    'Suresh R. (Field Escalations)',
    'Chief Governance Admin'
  ];

  const statusOptions = [
    'Open',
    'Under Investigation',
    'In Mediation',
    'Resolved',
    'Escalated to HQ'
  ];

  useEffect(() => {
    complaintService.getComplaints().then(data => {
      setComplaints(data.map(c => ({
        ...c,
        assignedStaff: c.assignedStaff || 'Ananya Deshmukh (Dispute Resolution)'
      })));
    });
  }, []);

  const handleOpenAssignModal = (c) => {
    setActiveComplaint(c);
    setAssignedStaff(c.assignedStaff || supportStaffList[0]);
    setNewStatus(c.status || 'Open');
    setSupportNote(c.supportNotes || '');

    // Track accessed management record
    trackItem({
      id: `admin-ticket-${c.ticketId}`,
      type: 'Management Record',
      title: `Complaint #${c.ticketId}: ${c.subject}`,
      subtitle: `Officer: ${c.assignedStaff || 'Unassigned'} · Ref: ${c.bookingId || 'LS-2026-1001'}`,
      path: '/admin/complaints',
      badge: c.status,
      role: 'admin'
    });
  };

  const handleSaveResolution = (e) => {
    e.preventDefault();
    if (!activeComplaint) return;

    setComplaints(prev => prev.map(c => {
      if (c.ticketId === activeComplaint.ticketId) {
        return {
          ...c,
          status: newStatus,
          assignedStaff,
          supportNotes: supportNote.trim() || c.supportNotes
        };
      }
      return c;
    }));
    setActiveComplaint(null);
  };

  const filtered = complaints.filter(c => {
    const matchSearch =
      c.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      (c.customerName && c.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

    if (filter === 'open') return matchSearch && c.status === 'Open';
    if (filter === 'investigating') return matchSearch && (c.status.includes('Investigation') || c.status.includes('Mediation'));
    if (filter === 'resolved') return matchSearch && c.status === 'Resolved';
    return matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Master Grievance & SLA Oversight ({complaints.length} Tickets)
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Customer dispute resolution, workshop mediation, support officer assignment, and status updates.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by Ticket ID, customer issue, or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: `All Tickets (${complaints.length})` },
            { id: 'open', label: 'Open' },
            { id: 'investigating', label: 'In Mediation' },
            { id: 'resolved', label: 'Resolved' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: filter === f.id ? '1px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: filter === f.id ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: filter === f.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(c => {
          const isResolved = c.status === 'Resolved';
          return (
            <div
              key={c.ticketId}
              style={{
                background: 'var(--bg-surface)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                border: isResolved ? '1px solid var(--border-light)' : '1.5px solid #fecaca',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-700)' }}>
                    #{c.ticketId}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                    {c.subject}
                  </span>
                </div>
                <span className={`badge ${isResolved ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.78rem' }}>
                  {c.status}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '8px 0 14px 0' }}>
                {c.description}
              </p>

              {/* Support Staff & Mediation Details */}
              <div style={{
                background: 'var(--bg-muted)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginBottom: '14px',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div>
                    <strong>Assigned Support Officer:</strong> <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{c.assignedStaff}</span>
                  </div>
                  <div>
                    <strong>Booking Ref:</strong> <code>{c.bookingId || 'LS-2026-1001'}</code>
                  </div>
                </div>
                <div>
                  <strong>Resolution Notes:</strong> {c.supportNotes || 'Customer contacted. Awaiting workshop manager response.'}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenAssignModal(c)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                >
                  <Headphones size={14} /> Assign Staff & Update Status
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Support Staff & Update Status Modal */}
      {activeComplaint && (
        <Modal
          isOpen={!!activeComplaint}
          onClose={() => setActiveComplaint(null)}
          title={`Grievance Governance: #${activeComplaint.ticketId}`}
          maxWidth="520px"
        >
          <form onSubmit={handleSaveResolution} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--bg-muted)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <div><strong>Subject:</strong> {activeComplaint.subject}</div>
              <div style={{ marginTop: '4px' }}><strong>Issue:</strong> {activeComplaint.description}</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Assign Support Staff Member
              </label>
              <select
                value={assignedStaff}
                onChange={e => setAssignedStaff(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-input)',
                  fontSize: '0.88rem'
                }}
              >
                {supportStaffList.map((st, idx) => (
                  <option key={idx} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Update Grievance Status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-input)',
                  fontSize: '0.88rem'
                }}
              >
                {statusOptions.map((st, idx) => (
                  <option key={idx} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Mediation & Resolution Log
              </label>
              <textarea
                rows={3}
                value={supportNote}
                onChange={e => setSupportNote(e.target.value)}
                placeholder="Log notes on workshop communication, customer compensation, or resolution agreement..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-input)',
                  fontSize: '0.86rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <Button variant="secondary" onClick={() => setActiveComplaint(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Apply Assignment & Update Status
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminComplaintsPage;

import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRecentlyAccessed } from '../../hooks';
import {
  CalendarCheck, Search, Filter, Download, ArrowUpRight,
  Eye, CheckCircle2, Clock, MapPin, User, Building2, HardHat,
  RefreshCw, ArrowRight, ShieldCheck, FileCheck
} from 'lucide-react';

export const AdminBookingsPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const lifecycleStages = [
    'Booking Created',
    'Booking Accepted',
    'Technician Assigned',
    'On The Way',
    'Technician Arrived',
    'Service Started',
    'Service Completed',
    'Booking Cancelled'
  ];

  useEffect(() => {
    bookingService.getBookings().then(setBookings);
  }, []);

  const handleOpenStatusModal = (b) => {
    setStatusModalBooking(b);
    setNewStatus(b.status || 'Pending');
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!statusModalBooking || !newStatus) return;

    bookingService.updateBookingStatus(statusModalBooking.bookingId, newStatus).then(() => {
      setBookings(prev => prev.map(b => {
        if (b.bookingId === statusModalBooking.bookingId) {
          return { ...b, status: newStatus };
        }
        return b;
      }));
      setStatusModalBooking(null);
    });
  };

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (b.providerName && b.providerName.toLowerCase().includes(search.toLowerCase()));

    if (statusFilter === 'pending') {
      return matchSearch && (b.status === 'Pending' || b.status === 'Booking Created');
    }
    if (statusFilter === 'accepted') {
      return matchSearch && (b.status === 'Accepted' || b.status === 'Booking Accepted' || b.status === 'Technician Assigned');
    }
    if (statusFilter === 'in_progress') {
      return matchSearch && (b.status.includes('Way') || b.status.includes('Arrived') || b.status.includes('Started'));
    }
    if (statusFilter === 'completed') {
      return matchSearch && (b.status.includes('Completed'));
    }
    if (statusFilter === 'cancelled') {
      return matchSearch && (b.status.includes('Cancel'));
    }
    return matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Master Platform Bookings Ledger
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Full 8-stage lifecycle supervision, technician dispatches, and administrative status transitions.
          </p>
        </div>
        <Button variant="secondary" onClick={() => alert("Exporting master CSV ledger...")}>
          <Download size={14} /> Export CSV Ledger
        </Button>
      </div>

      {/* Search & Status Filters */}
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
            placeholder="Search by booking #, customer, service, or workshop..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'pending', label: 'Pending' },
            { id: 'accepted', label: 'Accepted / Dispatched' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: statusFilter === f.id ? '1px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: statusFilter === f.id ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: statusFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px 18px' }}>Booking #</th>
              <th style={{ padding: '14px 18px' }}>Service Name</th>
              <th style={{ padding: '14px 18px' }}>Customer</th>
              <th style={{ padding: '14px 18px' }}>Workshop Partner</th>
              <th style={{ padding: '14px 18px' }}>Technician</th>
              <th style={{ padding: '14px 18px' }}>Amount</th>
              <th style={{ padding: '14px 18px' }}>Lifecycle Status</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.bookingId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>
                  {b.bookingNumber}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 600 }}>{b.serviceName}</td>
                <td style={{ padding: '14px 18px' }}>{b.customerName}</td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem' }}>{b.providerName}</td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {b.technicianName || 'Pending Assignment'}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>
                  ₹{b.totalAmount || b.price}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <StatusBadge status={b.status} />
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(b);
                        trackItem({
                          id: `admin-bk-${b.bookingId}`,
                          type: 'Management Record',
                          title: `Booking: #${b.bookingNumber}`,
                          subtitle: `${b.serviceName} · Customer: ${b.customerName}`,
                          path: '/admin/bookings',
                          badge: b.status,
                          role: 'admin'
                        });
                      }}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <Eye size={12} /> Inspect
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenStatusModal(b)} style={{ fontSize: '0.78rem' }}>
                      Update Status
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Details & 8-Stage Lifecycle Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Lifecycle Oversight: #${selectedBooking.bookingNumber}`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-muted)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
              <div><strong>Service:</strong> {selectedBooking.serviceName}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedBooking.status} /></div>
              <div><strong>Customer:</strong> {selectedBooking.customerName} ({selectedBooking.phone || '+91 98765 43210'})</div>
              <div><strong>Workshop:</strong> {selectedBooking.providerName}</div>
              <div><strong>Assigned Tech:</strong> {selectedBooking.technicianName || 'S. Murugan (#TN-4410)'}</div>
              <div><strong>Scheduled Slot:</strong> {selectedBooking.bookingDate} ({selectedBooking.bookingTime || '10:30 AM'})</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Doorstep Address:</strong> {selectedBooking.address || 'Flat 402, Green Valley Apartments, Vannarpettai'}</div>
              <div><strong>Standard Fee:</strong> ₹{selectedBooking.totalAmount || selectedBooking.price}</div>
              <div><strong>Warranty:</strong> 30-Day Workmanship Guarantee</div>
            </div>

            {/* Beyond CRUD: 8-Stage Lifecycle Progression */}
            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '14px', background: 'var(--bg-surface)' }}>
              <strong style={{ fontSize: '0.86rem', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                8-Stage Lifecycle Progression:
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                {[
                  '1. Booking Created & Order Transmitted to Workshop',
                  '2. Booking Accepted by Workshop Manager',
                  '3. Certified Field Technician Assigned',
                  '4. Technician On The Way (Live GPS Tracking)',
                  '5. Doorstep Arrival & Badge OTP Verification',
                  '6. Service In Progress (Checklist Diagnostic Execution)',
                  '7. Work Completed & Digital Service Passport Logged',
                  '8. Customer Review & Automated 3-Month Maintenance Cycle'
                ].map((stg, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span>{stg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => { setStatusModalBooking(selectedBooking); setSelectedBooking(null); }}>
                Update Lifecycle Status
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Status Modal */}
      {statusModalBooking && (
        <Modal
          isOpen={!!statusModalBooking}
          onClose={() => setStatusModalBooking(null)}
          title={`Update Status: #${statusModalBooking.bookingNumber}`}
          maxWidth="460px"
        >
          <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '0.86rem' }}>
              Current Status: <strong>{statusModalBooking.status}</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Select New Lifecycle State
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
                {lifecycleStages.map((stg, idx) => (
                  <option key={idx} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setStatusModalBooking(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Apply Status Transition
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminBookingsPage;

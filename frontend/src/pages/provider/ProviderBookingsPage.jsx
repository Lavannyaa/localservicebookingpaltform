import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRecentlyAccessed } from '../../hooks';
import {
  Search, Filter, Calendar, MapPin, Eye, CheckCircle2, Phone,
  Clock, User, CheckSquare, FileText, Wrench, ShieldCheck, ChevronRight
} from 'lucide-react';

const CURRENT_PROVIDER_ID = 'prov-1';
const CURRENT_SHOP_NAME = 'Kumar Electricals';

export const ProviderBookingsPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Selected Booking Details / Tracking Modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [completionNotes, setCompletionNotes] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    bookingService.getBookings().then(data => {
      // Filter bookings for Kumar Electricals or show all
      const shopBookings = data.filter(
        b => b.providerId === CURRENT_PROVIDER_ID || b.providerName === CURRENT_SHOP_NAME
      );
      setBookings(shopBookings.length > 0 ? shopBookings : data);
    });
  }, []);

  useEffect(() => {
    let res = [...bookings];
    if (statusFilter !== 'All') {
      res = res.filter(b => (b.status || '').toLowerCase() === statusFilter.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(b =>
        (b.bookingNumber && b.bookingNumber.toLowerCase().includes(q)) ||
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.serviceName && b.serviceName.toLowerCase().includes(q)) ||
        (b.technicianName && b.technicianName.toLowerCase().includes(q))
      );
    }
    setFiltered(res);
  }, [statusFilter, search, bookings]);

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setChecklist(
      booking.serviceChecklist || [
        { item: 'Initial diagnostic & electrical safety inspection', done: true },
        { item: 'Component repair / wire conduit calibration', done: booking.status === 'Completed' },
        { item: 'Voltage & live load test', done: booking.status === 'Completed' },
        { item: 'Job site cleanup and customer sign-off', done: booking.status === 'Completed' }
      ]
    );
    setCompletionNotes(booking.techNotes || '');
    setShowDetailsModal(true);

    // Track recently accessed booking
    trackItem({
      id: booking.bookingId || booking.bookingNumber,
      type: 'Booking',
      title: `${booking.bookingNumber} · ${booking.serviceName}`,
      subtitle: `Customer: ${booking.customerName} · ₹${booking.price}`,
      path: '/provider/bookings',
      badge: booking.status
    });

    // Track recently accessed customer
    if (booking.customerName) {
      trackItem({
        id: `cust-${booking.customerName.replace(/\s+/g, '_')}`,
        type: 'Customer',
        title: booking.customerName,
        subtitle: `${booking.customerPhone || 'Customer'} · ${booking.address || 'Doorstep Service'}`,
        path: '/provider/bookings',
        badge: 'Customer'
      });
    }
  };

  const handleToggleChecklist = (index) => {
    setChecklist(prev => prev.map((item, i) => i === index ? { ...item, done: !item.done } : item));
  };

  const updateStatus = (id, newStatus, note = '') => {
    bookingService.updateBookingStatus(id, newStatus, note).then(updated => {
      setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: newStatus, techNotes: note || b.techNotes } : b));
      if (selectedBooking && selectedBooking.bookingId === id) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus, techNotes: note || prev.techNotes }));
      }
      showNotice(`Booking status progressed to "${newStatus}"!`);
    });
  };

  const handleCompleteService = () => {
    if (!selectedBooking) return;
    updateStatus(selectedBooking.bookingId, 'Completed', completionNotes || 'Job completed to quality compliance standards.');
    setShowDetailsModal(false);
  };

  const statuses = ['All', 'Technician Assigned', 'In Progress', 'Completed', 'Confirmed', 'Cancelled'];

  // Calculate flow step index (0: Confirmed/Assigned, 1: In Progress, 2: Completed)
  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending':
      case 'Confirmed':
        return 0;
      case 'Technician Assigned':
        return 1;
      case 'In Progress':
        return 2;
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '4px' }}>
            STEP 2: TRACK & COMPLETE
          </span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Workshop Service Bookings & Field Tracking
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Monitor live job execution across {CURRENT_SHOP_NAME}, track assigned technicians, and record quality sign-offs.
        </p>
      </div>

      {notification && (
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
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* Filters Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search booking #, customer, service, or technician..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: statusFilter === st ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: statusFilter === st ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px' }}>Booking #</th>
                <th style={{ padding: '14px 18px' }}>Service</th>
                <th style={{ padding: '14px 18px' }}>Customer</th>
                <th style={{ padding: '14px 18px' }}>Date / Slot</th>
                <th style={{ padding: '14px 18px' }}>Assigned Tech</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Job Progression</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.bookingId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>
                    <button
                      onClick={() => handleOpenDetails(b)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary-700)', fontWeight: 800, cursor: 'pointer', textAlign: 'left', padding: 0 }}
                    >
                      {b.bookingNumber}
                    </button>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.serviceName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>₹{b.price} · {b.category}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div>{b.bookingDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.bookingTime}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {b.technicianName || <span style={{ color: '#f59e0b' }}>Awaiting Dispatch</span>}
                    </div>
                    {b.technicianPhone && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.technicianPhone}</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <StatusBadge status={b.status} />
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                      {/* Step 1 -> Step 2 */}
                      {b.status === 'Technician Assigned' && (
                        <Button size="sm" variant="secondary" onClick={() => updateStatus(b.bookingId, 'In Progress')}>
                          Start Job
                        </Button>
                      )}
                      {/* Step 2 -> Step 3 */}
                      {b.status === 'In Progress' && (
                        <Button size="sm" variant="success" onClick={() => handleOpenDetails(b)}>
                          <CheckCircle2 size={14} /> Complete Job
                        </Button>
                      )}
                      {b.status === 'Completed' && (
                        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={13} /> Finished
                        </span>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleOpenDetails(b)} title="View Track & Checklist">
                        <Eye size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRACKING & COMPLETION MODAL */}
      {showDetailsModal && selectedBooking && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`Job Tracking: ${selectedBooking.bookingNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Visual Step Timeline Tracker */}
            <div style={{ background: 'var(--bg-muted)', padding: '18px 20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                {[
                  { step: 0, label: 'Requested', icon: Calendar },
                  { step: 1, label: 'Tech Assigned', icon: User },
                  { step: 2, label: 'In Progress', icon: Wrench },
                  { step: 3, label: 'Completed', icon: CheckCircle2 }
                ].map((s, idx) => {
                  const currentIdx = getStepIndex(selectedBooking.status);
                  const isDone = currentIdx >= s.step;
                  const isCurrent = currentIdx === s.step;
                  const Icon = s.icon;

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isDone ? 'var(--primary-600)' : 'var(--border-medium)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrent ? '0 0 0 4px var(--primary-100)' : 'none'
                      }}>
                        <Icon size={18} />
                      </div>
                      <span style={{ fontSize: '0.74rem', fontWeight: isDone ? 700 : 500, color: isDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '0.86rem' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>CUSTOMER DETAILS</span>
                <strong style={{ fontSize: '0.94rem' }}>{selectedBooking.customerName}</strong>
                <div style={{ color: 'var(--text-secondary)' }}>{selectedBooking.customerPhone}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedBooking.address}</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>ASSIGNED TECHNICIAN</span>
                <strong style={{ fontSize: '0.94rem' }}>{selectedBooking.technicianName || 'Unassigned'}</strong>
                <div style={{ color: 'var(--text-secondary)' }}>{selectedBooking.technicianPhone || 'N/A'}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-700)', marginTop: '4px' }}>{CURRENT_SHOP_NAME} Fleet</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>SERVICE & BILLING</span>
                <strong style={{ fontSize: '0.94rem' }}>{selectedBooking.serviceName}</strong>
                <div style={{ color: 'var(--primary-700)', fontWeight: 800 }}>Total Fee: ₹{selectedBooking.totalAmount || selectedBooking.price}</div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px' }}>✓ Direct Workshop Settlement</div>
              </div>
            </div>

            {/* Quality SOP Checklist */}
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 10px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={16} color="var(--primary-600)" /> Mandatory Quality SOP Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                {checklist.map((item, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklist(idx)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {item.item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Completion Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Technician Field Notes & Findings</label>
              <textarea
                rows={2}
                placeholder="Log voltage readings, replaced capacitors/fittings, warranty remarks..."
                value={completionNotes}
                onChange={e => setCompletionNotes(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedBooking.status === 'Technician Assigned' && (
                  <Button variant="primary" onClick={() => updateStatus(selectedBooking.bookingId, 'In Progress')}>
                    Start Service Execution
                  </Button>
                )}
                {selectedBooking.status === 'In Progress' && (
                  <Button variant="success" onClick={handleCompleteService} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Mark Completed & Sign-off
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProviderBookingsPage;

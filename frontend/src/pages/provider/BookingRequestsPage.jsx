import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { technicians as allTechnicians } from '../../data/technicians';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Calendar, Clock, MapPin, User, Check, X, UserCheck, AlertTriangle,
  ArrowRight, ShieldCheck, Phone, CheckCircle2, Building2
} from 'lucide-react';
import { notificationService, NOTIFICATION_TYPES } from '../../services/notificationService';
import { useRecentlyAccessed } from '../../hooks';

const CURRENT_PROVIDER_ID = 'prov-1';
const CURRENT_SHOP_NAME = 'Kumar Electricals';

export const BookingRequestsPage = () => {
  const navigate = useNavigate();
  const { trackItem } = useRecentlyAccessed();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState('tech-2');

  // Reject Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectBooking, setRejectBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('Full technician schedule for the requested time slot');

  const [notification, setNotification] = useState(null);

  // Shop Technicians
  const shopTechnicians = allTechnicians.filter(
    t => t.providerId === CURRENT_PROVIDER_ID || t.shopName === CURRENT_SHOP_NAME
  );

  useEffect(() => {
    bookingService.getBookings().then(data => {
      // Pending requests or requests awaiting dispatch
      const pendingOrNew = data.filter(
        b => b.status === 'Pending' || (b.status === 'Confirmed' && !b.technicianName)
      );
      setRequests(pendingOrNew);
      setLoading(false);
    });
  }, []);

  const handleOpenAssign = (booking) => {
    setSelectedBooking(booking);
    // Pre-select first available technician
    const available = shopTechnicians.find(t => t.status === 'Available');
    setSelectedTechId(available ? available.techId : shopTechnicians[0]?.techId || 'tech-2');
    setShowAssignModal(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedBooking) return;
    const tech = shopTechnicians.find(t => t.techId === selectedTechId) || shopTechnicians[0];

    bookingService.updateBookingStatus(
      selectedBooking.bookingId,
      'Technician Assigned',
      `Assigned to certified technician ${tech.name} (${tech.phone})`
    ).then(() => {
      // Remove from requests list
      setRequests(prev => prev.filter(b => b.bookingId !== selectedBooking.bookingId));
      setShowAssignModal(false);

      // Track recently accessed booking
      trackItem({
        id: selectedBooking.bookingId || selectedBooking.bookingNumber,
        type: 'Booking',
        title: `${selectedBooking.bookingNumber} · ${selectedBooking.serviceName}`,
        subtitle: `Customer: ${selectedBooking.customerName} · Assigned: ${tech.name}`,
        path: '/provider/bookings',
        badge: 'Technician Assigned'
      });

      // Track recently accessed customer
      if (selectedBooking.customerName) {
        trackItem({
          id: `cust-${selectedBooking.customerName.replace(/\s+/g, '_')}`,
          type: 'Customer',
          title: selectedBooking.customerName,
          subtitle: `${selectedBooking.customerPhone || 'Customer'} · ${selectedBooking.address || 'Address'}`,
          path: '/provider/bookings',
          badge: 'Customer'
        });
      }

      setNotification({
        type: 'success',
        bookingNumber: selectedBooking.bookingNumber,
        techName: tech.name,
        message: `Booking ${selectedBooking.bookingNumber} accepted! Assigned to ${tech.name}.`
      });

      // Trigger lifecycle notifications
      notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.BOOKING_ACCEPTED, selectedBooking);
      notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.TECH_ASSIGNED, { ...selectedBooking, technicianName: tech.name });
    });
  };

  const handleOpenReject = (booking) => {
    setRejectBooking(booking);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectBooking) return;
    bookingService.updateBookingStatus(
      rejectBooking.bookingId,
      'Cancelled',
      `Declined by workshop: ${rejectReason}`
    ).then(() => {
      notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.BOOKING_CANCELLED, rejectBooking);
      setRequests(prev => prev.filter(b => b.bookingId !== rejectBooking.bookingId));
      setShowRejectModal(false);
      setNotification({
        type: 'info',
        message: `Booking request ${rejectBooking.bookingNumber} was declined.`
      });
      setTimeout(() => setNotification(null), 4000);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '4px' }}>
              STEP 1: INCOMING REQUESTS
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Booking Requests & Dispatch Queue
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review new customer service requests, accept or decline, and dispatch certified {CURRENT_SHOP_NAME} technicians.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={() => navigate('/provider/bookings')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          View All Workshop Bookings <ArrowRight size={14} />
        </Button>
      </div>

      {/* Notification banner */}
      {notification && (
        <div style={{
          background: notification.type === 'success' ? '#ecfdf5' : '#fef3c7',
          color: notification.type === 'success' ? '#065f46' : '#92400e',
          border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fde68a'}`,
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color={notification.type === 'success' ? '#10b981' : '#f59e0b'} />
            <span>{notification.message}</span>
          </div>
          {notification.type === 'success' && (
            <Button variant="primary" size="sm" onClick={() => navigate('/provider/bookings')}>
              Track in My Bookings <ArrowRight size={14} />
            </Button>
          )}
        </div>
      )}

      {/* Request Queue Cards */}
      {requests.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <Check size={48} color="var(--primary-600)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0' }}>All Caught Up!</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 16px 0', fontSize: '0.9rem' }}>
            No pending customer booking requests waiting for workshop confirmation right now.
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/provider/bookings')}>
            Monitor Active Jobs in Field
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map(req => (
            <div
              key={req.bookingId}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                      {req.serviceName}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '6px' }}>
                      {req.bookingNumber}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Category: <strong>{req.category}</strong> · Upfront Rate: <strong style={{ color: 'var(--primary-700)', fontSize: '1.05rem' }}>₹{req.price}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>
                  Requested for: <strong>{req.bookingDate}</strong>
                </div>
              </div>

              {/* Customer & Slot Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
                background: 'var(--bg-muted)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={18} color="var(--primary-600)" />
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Customer</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{req.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{req.customerPhone}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="var(--primary-600)" />
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Date & Slot</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{req.bookingDate}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{req.bookingTime}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} color="var(--primary-600)" />
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Service Address</div>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{req.address}</div>
                  </div>
                </div>
              </div>

              {req.requirements && (
                <div style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-surface)',
                  border: '1px dashed var(--border-light)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Customer Problem Description / Notes:</strong> "{req.requirements}"
                </div>
              )}

              {/* Action Buttons: Accept / Reject */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <Button variant="danger" size="sm" onClick={() => handleOpenReject(req)}>
                  <X size={16} /> Decline Request
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleOpenAssign(req)}>
                  <Check size={16} /> Accept & Dispatch Technician
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TECHNICIAN ASSIGNMENT MODAL */}
      {showAssignModal && selectedBooking && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title={`Dispatch Technician for Booking ${selectedBooking.bookingNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ background: 'var(--primary-50)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.86rem', color: 'var(--primary-900)' }}>
              <strong>Service:</strong> {selectedBooking.serviceName} · <strong>Customer:</strong> {selectedBooking.customerName} ({selectedBooking.bookingDate}, {selectedBooking.bookingTime})
            </div>

            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Select a certified technician from {CURRENT_SHOP_NAME} to execute this job:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shopTechnicians.map(tech => {
                const isSelected = selectedTechId === tech.techId;
                const isAvailable = tech.status === 'Available';

                return (
                  <label
                    key={tech.techId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--primary-50)' : 'transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="tech"
                        checked={isSelected}
                        onChange={() => setSelectedTechId(tech.techId)}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.94rem' }}>{tech.name}</span>
                          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                            {tech.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {tech.specialization} · {tech.experience} Exp
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ★ {tech.rating} · {tech.completedJobs} Completed Jobs · {tech.phone}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Jobs Today</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{tech.assignedToday} active</strong>
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmAssign} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={16} /> Confirm Assignment & Accept
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* DECLINE CONFIRMATION MODAL */}
      {showRejectModal && rejectBooking && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title={`Decline Booking ${rejectBooking.bookingNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Please specify the reason for declining this request from {rejectBooking.customerName}. The customer will be promptly notified.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Decline Reason</label>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              >
                <option value="Full technician schedule for the requested time slot">Full technician schedule for the requested time slot</option>
                <option value="Requested service location is outside active coverage radius">Requested service location is outside active coverage radius</option>
                <option value="Specialized replacement parts unavailable immediately">Specialized replacement parts unavailable immediately</option>
                <option value="Customer requested cancellation via phone call">Customer requested cancellation via phone call</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleConfirmReject}>
                Confirm Decline
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingRequestsPage;

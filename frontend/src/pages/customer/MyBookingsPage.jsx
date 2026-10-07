import { Filter } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { BookingCard } from '../../components/customer/BookingCard';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { RatingStars } from '../../components/common/RatingStars';
import { EmptyState } from '../../components/common/EmptyState';
import { useBookings, useAuth } from '../../hooks';
import { reviewService } from '../../services/reviewService';
import { notificationService, NOTIFICATION_TYPES } from '../../services/notificationService';

export const MyBookingsPage = () => {
  const { user } = useAuth();
  const { bookings, getBookings, updateStatus } = useBookings();

  const [activeTab, setActiveTab] = useState('all');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    getBookings({ customerId: user?.userId });
  }, [getBookings, user]);

  const tabs = [
    { id: 'all', label: `All (${bookings.length})` },
    { id: 'active', label: 'Active & In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const filtered = bookings.filter(b => {
    if (activeTab === 'active') return ['Pending', 'Accepted', 'Technician Assigned', 'On the Way', 'Arrived', 'Service Started'].includes(b.status);
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'cancelled') return ['Cancelled', 'Rejected'].includes(b.status);
    return true;
  });

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    await updateStatus(selectedBooking.bookingId, 'Cancelled', 'Cancelled by customer');
    notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.BOOKING_CANCELLED, selectedBooking);
    setCancelModalOpen(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    await reviewService.addReview({
      serviceId: selectedBooking.serviceId,
      serviceName: selectedBooking.serviceName,
      providerId: selectedBooking.providerId,
      providerName: selectedBooking.providerName,
      customerName: user?.name || 'Rahul Sharma',
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewModalOpen(false);
    alert('Thank you! Your verified rating and review have been submitted.');
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'My Bookings' }]} />

          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
              My Bookings & Service Requests
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
              Live lifecycle status tracking: Pending → Accepted → Technician Assigned → On the Way → Arrived → Service Started → Completed.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '24px', overflowX: 'auto' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--primary-600)' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No bookings in this tab" description="You have no services currently scheduled under this filter." />
          ) : (
            <div>
              {filtered.map((b) => (
                <BookingCard
                  key={b.bookingId}
                  booking={b}
                  onCancel={(item) => { setSelectedBooking(item); setCancelModalOpen(true); }}
                  onReview={(item) => { setSelectedBooking(item); setReviewModalOpen(true); }}
                />
              ))}
            </div>
          )}
        </div>

      <ConfirmationDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking #${selectedBooking?.bookingNumber}? The workshop will be notified immediately.`}
        confirmText="Yes, Cancel Booking"
        danger
      />

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`Review ${selectedBooking?.serviceName}`} maxWidth="480px">
        <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Rate Your Experience:</label>
            <RatingStars rating={reviewRating} interactive size={26} onRatingChange={setReviewRating} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Your Feedback & Comments:</label>
            <textarea
              required
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was the punctuality, diagnostic accuracy, and cleanliness?"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Verified Review</Button>
          </div>
        </form>
      </Modal>

      </div>
  );
};

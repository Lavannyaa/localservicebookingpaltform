import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import {
  Calendar, Clock, MapPin, Building2, FileText, UserCheck,
  RefreshCw, BookOpen
} from 'lucide-react';

export const BookingCard = ({ booking, onCancel, onReview }) => {
  const navigate = useNavigate();

  const handleBookAgain = () => {
    let nextDate = '';
    try {
      if (booking.bookingDate) {
        const d = new Date(booking.bookingDate);
        d.setMonth(d.getMonth() + 3);
        nextDate = d.toISOString().split('T')[0];
      }
    } catch {
      nextDate = '';
    }

    const params = new URLSearchParams({
      mode: 'book-again',
      serviceId: booking.serviceId || 'srv-3',
      providerName: booking.providerName || '',
      appliance: booking.serviceName || '',
      previousBooking: booking.bookingNumber || '',
      lastDate: booking.bookingDate || '',
      nextSuggestedDate: nextDate
    });
    navigate(`/booking/${booking.serviceId || 'srv-3'}?${params.toString()}`);
  };

  return (
    <Card hoverable style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>BOOKING ID</span>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-700)' }}>{booking.bookingNumber}</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <StatusBadge status={booking.status} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{booking.totalAmount || booking.price}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <div>
          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{booking.serviceName}</strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{booking.category}</span>
        </div>
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Building2 size={14} color="var(--primary-600)" /> {booking.providerName}</span>
          {booking.technicianName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--success-text)', fontWeight: 600, marginTop: '2px' }}>
              <UserCheck size={14} /> Assigned: {booking.technicianName}
            </span>
          )}
        </div>
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} color="var(--primary-600)" /> {booking.bookingDate}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--text-muted)' }}><Clock size={14} /> {booking.bookingTime}</span>
        </div>
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} color="var(--primary-600)" /> {booking.address}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', flexWrap: 'wrap' }}>
        <Button variant="secondary" size="sm" icon={FileText} onClick={() => navigate(`/bookings/${booking.bookingId}`)}>
          Invoice & Tracker
        </Button>

        {['Pending', 'Accepted'].includes(booking.status) && onCancel && (
          <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>
            Cancel Booking
          </Button>
        )}

        {booking.status === 'Completed' && onReview && (
          <Button variant="outline" size="sm" onClick={() => onReview(booking)}>
            Rate & Review
          </Button>
        )}

        {/* Closed-Loop Service Passport & Book Again Triggers */}
        {booking.status === 'Completed' && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/passport')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <BookOpen size={13} /> Passport
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookAgain}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={13} /> Book Again
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

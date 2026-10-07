import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useBookings } from '../../hooks';
import {
  CheckCircle2, ArrowRight, ShieldCheck, Award, Calendar, RefreshCw,
  Clock, MapPin, Building2, BookOpen
} from 'lucide-react';

export const BookingConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('id');
  const mode = searchParams.get('mode');
  const { bookings } = useBookings();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (bookingId && bookings.length > 0) {
      const found = bookings.find(b => b.bookingId === bookingId) || bookings[0];
      setBooking(found);
    }
  }, [bookingId, bookings]);

  // Calculate estimated next maintenance (3 months from booking date)
  const calculateNextMaintenance = (dateStr) => {
    if (!dateStr) return '28 December 2026';
    try {
      const d = new Date(dateStr);
      d.setMonth(d.getMonth() + 3);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return '28 December 2026';
    }
  };

  const isBookAgain = mode === 'book-again';

  return (
    <div style={{ flex: 1, padding: '50px 20px', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
        {/* Success Icon */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'var(--success-bg)',
          color: 'var(--success-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          border: '2px solid var(--success-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {isBookAgain ? 'Maintenance Appointment Confirmed!' : 'Booking Confirmed & Dispatched!'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '28px' }}>
          Your service request has been transmitted directly to the partner workshop. A verified technician will be assigned shortly.
        </p>

        {/* Booking Details Card */}
        {booking && (
          <Card style={{ textAlign: 'left', marginBottom: '24px', padding: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  BOOKING REFERENCE NUMBER
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-700)', margin: '2px 0 0 0' }}>
                  {booking.bookingNumber}
                </h3>
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                {booking.status || 'Pending'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>SERVICE REQUESTED</span>
                <strong style={{ color: 'var(--text-primary)' }}>{booking.serviceName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>ASSIGNED WORKSHOP</span>
                <strong style={{ color: 'var(--text-primary)' }}>{booking.providerName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>SCHEDULED WINDOW</span>
                <strong style={{ color: 'var(--text-primary)' }}>{booking.bookingDate} ({booking.bookingTime})</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>DOORSTEP LOCATION</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>{booking.address}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Amount:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-700)' }}>
                ₹{booking.totalAmount || booking.price}
              </span>
            </div>
          </Card>
        )}

        {/* Digital Service Passport & Maintenance Enrolled Card (Closed-Loop Lifecycle) */}
        <div style={{
          background: 'linear-gradient(135deg, #2e1065 0%, var(--primary-900) 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          textAlign: 'left',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Award size={22} color="#fde047" />
            <h4 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: '#fef08a' }}>
              Digital Service Passport & Maintenance Enrolled
            </h4>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#e9d5ff', lineHeight: 1.5, margin: '0 0 14px 0' }}>
            This service appointment is automatically linked to your Digital Service Passport (<strong>#PASSPORT-TNV-2026-081</strong>). Upon completion, diagnostic checklists, proof photos, and technician stamps are permanently archived.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            fontSize: '0.84rem'
          }}>
            <div>
              <span style={{ opacity: 0.8, display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Warranty Protection</span>
              <strong style={{ color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> 30-Day Workmanship
              </strong>
            </div>
            <div>
              <span style={{ opacity: 0.8, display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Next Maintenance Cycle</span>
              <strong style={{ color: '#fed7aa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Due: {booking ? calculateNextMaintenance(booking.bookingDate) : 'In 3 Months'}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => navigate('/home')}>
            Return Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/maintenance')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} /> Maintenance Schedule
          </Button>
          <Button variant="secondary" onClick={() => navigate('/passport')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={15} /> Service Passport
          </Button>
          <Button variant="primary" onClick={() => navigate('/bookings')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Track in My Bookings <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
};

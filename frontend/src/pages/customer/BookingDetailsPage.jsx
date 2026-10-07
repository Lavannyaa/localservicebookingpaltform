import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ServiceLifecycleTracker } from '../../components/customer/ServiceLifecycleTracker';
import { useBookings } from '../../hooks';
import {
  Printer, CheckCircle2, UserCheck, Clock, MapPin, Building2, Phone,
  Award, ShieldCheck, RefreshCw, BookOpen, Calendar
} from 'lucide-react';

export const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, getBookings } = useBookings();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (bookings.length > 0) {
      const found = bookings.find(b => b.bookingId === id || b.bookingNumber === id) || bookings[0];
      setBooking(found);
    } else {
      getBookings();
    }
  }, [id, bookings, getBookings]);

  if (!booking) return null;

  const steps = [
    'Order Placed',
    'Workshop Accepted',
    'Technician Dispatched',
    'Technician On The Way',
    'Arrived At Site',
    'Service In Progress',
    'Quality Checklist',
    'Completed & Certified'
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Accepted': return 1;
      case 'Technician Assigned': return 2;
      case 'On the Way':
      case 'On The Way': return 3;
      case 'Arrived': return 4;
      case 'Service Started':
      case 'In Progress': return 5;
      case 'Checklist In Progress': return 6;
      case 'Service Completed':
      case 'Completed': return 7;
      default: return 2;
    }
  };

  const currentIdx = getStageIndex(booking.status);

  const calculateNextMaintenance = (dateStr) => {
    if (!dateStr) return '28 December 2026';
    try {
      const d = new Date(dateStr);
      d.setMonth(d.getMonth() + 3);
      return d.toISOString().split('T')[0];
    } catch {
      return '2026-12-28';
    }
  };

  const handleBookAgain = () => {
    const nextDate = calculateNextMaintenance(booking.bookingDate);
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
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <Breadcrumb items={[
          { label: 'Bookings', path: '/bookings' },
          { label: `Invoice #${booking.bookingNumber}` }
        ]} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>OFFICIAL SERVICE INVOICE</span>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              {booking.bookingNumber}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
              Print Receipt
            </Button>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* 8-Stage Lifecycle Progress Timeline */}
        <Card style={{ marginBottom: '24px', padding: '22px' }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '18px' }}>Service Progression Timeline</h4>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: '8px', textAlign: 'center' }}>
            {steps.map((st, i) => {
              const isPassed = currentIdx >= i && booking.status !== 'Cancelled';
              return (
                <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isPassed ? 'var(--primary-600)' : 'var(--bg-muted)',
                    color: isPassed ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    marginBottom: '6px'
                  }}>
                    {isPassed ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: isPassed ? 700 : 500, color: isPassed ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.2 }}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Closed-Loop Passport & Maintenance Banner (if Completed) */}
        {booking.status === 'Completed' && (
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Award size={20} color="#fde047" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                    DIGITAL SERVICE PASSPORT VERIFIED
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  Archived in Passport: #PASSPORT-TNV-2026-081
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#c7d2fe', margin: 0 }}>
                  This completed overhaul has been recorded with technician diagnostic checklists, before/after proof stamps, and 30-day warranty coverage.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/passport')}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <BookOpen size={14} /> View Passport
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBookAgain}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <RefreshCw size={14} /> Book Again
                </Button>
              </div>
            </div>

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
                <span style={{ opacity: 0.8, display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Warranty Guarantee</span>
                <strong style={{ color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> 30-Day Workmanship Warranty Active
                </strong>
              </div>
              <div>
                <span style={{ opacity: 0.8, display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Next Maintenance Due</span>
                <strong style={{ color: '#fed7aa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {calculateNextMaintenance(booking.bookingDate)} (Quarterly)
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Body */}
        <Card style={{ padding: '26px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>BILLED TO:</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '2px 0 6px 0' }}>{booking.customerName}</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 2px 0' }}>{booking.address}</p>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Phone: {booking.customerPhone}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>WORKSHOP PARTNER:</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '2px 0 6px 0' }}>{booking.providerName}</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 2px 0' }}>Date: {booking.bookingDate} ({booking.bookingTime})</p>
              {booking.technicianName && (
                <p style={{ fontSize: '0.86rem', color: 'var(--success-text)', fontWeight: 700, margin: 0 }}>
                  Technician: {booking.technicianName} ({booking.technicianPhone || '+91 94431 88201'})
                </p>
              )}
            </div>
          </div>

          {/* Checklist items if technician checked any */}
          {booking.serviceChecklist && booking.serviceChecklist.length > 0 && (
            <div style={{ marginBottom: '20px', background: 'var(--bg-muted)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>Technician Verified Checklist:</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.84rem' }}>
                {booking.serviceChecklist.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: c.done ? 'var(--success-text)' : 'var(--text-muted)' }}>
                    <CheckCircle2 size={14} /> <span>{c.item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itemized Table */}
          <div className="table-container" style={{ marginBottom: '20px' }}>
            <table>
              <thead>
                <tr>
                  <th>Service Description</th>
                  <th>Schedule</th>
                  <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>{booking.serviceName}</td>
                  <td>{booking.bookingDate} ({booking.bookingTime})</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{booking.price}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ width: '240px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                <span>Service Base:</span>
                <span>₹{booking.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                <span>Platform Fee:</span>
                <span>₹{booking.platformFee || 49}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-light)', paddingTop: '8px', fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-700)' }}>
                <span>Total Paid:</span>
                <span>₹{booking.totalAmount || booking.price}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

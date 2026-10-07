import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { CalendarCheck, MapPin, Phone, User, Clock, AlertCircle } from 'lucide-react';

export const ActiveBookingsOversightPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingService.getBookings().then(data => {
      setBookings(data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Live Field Dispatch & Bookings Radar
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time oversight of ongoing customer bookings and field technician progress.
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px 18px' }}>Booking #</th>
              <th style={{ padding: '14px 18px' }}>Service & Workshop</th>
              <th style={{ padding: '14px 18px' }}>Customer</th>
              <th style={{ padding: '14px 18px' }}>Field Technician</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.bookingId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-700)' }}>{b.bookingNumber}</td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.providerName}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div>{b.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ fontWeight: 600 }}>{b.technicianName || 'Pending'}</span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <StatusBadge status={b.status} />
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <Button variant="secondary" size="sm">Oversight Call</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveBookingsOversightPage;

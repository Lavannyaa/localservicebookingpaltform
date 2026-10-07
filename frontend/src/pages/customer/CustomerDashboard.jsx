import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RecentlyAccessedSection } from '../../components/customer/RecentlyAccessedSection';
import { useAuth, useBookings, useMaintenance, useFavorites } from '../../hooks';
import {
  CalendarCheck, Clock, Heart, FileCheck, ArrowRight,
  ShieldCheck, Wrench, Plus, CheckCircle2
} from 'lucide-react';

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, getBookings } = useBookings();
  const { schedules, getSchedules } = useMaintenance();
  const { favorites, passport } = useFavorites();

  useEffect(() => {
    getBookings({ customerId: user?.userId });
    getSchedules();
  }, [getBookings, getSchedules, user]);

  const activeBookings = bookings.filter(b => !['Completed', 'Cancelled'].includes(b.status));

  return (
    <div style={{ flex: 1, padding: '36px 0', background: 'var(--bg-app)' }}>
        <div className="container">
          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-700) 0%, #3b0764 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: 'var(--shadow-purple)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                CUSTOMER OVERVIEW
              </span>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '8px', marginBottom: '4px' }}>
                Welcome back, {user?.name || 'Rahul Sharma'}!
              </h1>
              <p style={{ color: '#ddd6fe', fontSize: '0.92rem' }}>
                Service Passport ID: <strong>{user?.passportNumber || 'PASSPORT-TNV-2026-081'}</strong> · Delivery Address: Vannarpettai, Tirunelveli
              </p>
            </div>

            <Button size="md" style={{ background: '#ffffff', color: 'var(--primary-800)', fontWeight: 700 }} onClick={() => navigate('/services')}>
              <Plus size={16} /> Book New Service
            </Button>
          </div>

          {/* Metric Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '32px' }}>
            <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarCheck size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE BOOKINGS</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeBookings.length}</div>
              </div>
            </Card>

            <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', color: 'var(--success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>PASSPORT ENTRIES</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{passport?.verifiedEntries?.length || 2}</div>
              </div>
            </Card>

            <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--warning-bg)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>MAINTENANCE ACTIVE</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{schedules.length}</div>
              </div>
            </Card>

            <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>SAVED FAVORITES</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{favorites.services.length}</div>
              </div>
            </Card>
          </div>

          {/* Active Bookings Tracking */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Active Service Progression ({activeBookings.length})
              </h3>
              <Link to="/bookings" style={{ fontSize: '0.86rem', color: 'var(--primary-600)', fontWeight: 700 }}>
                View All Bookings
              </Link>
            </div>

            {activeBookings.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                No active bookings right now. Explore 80+ services to schedule a technician.
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeBookings.map((b) => (
                  <Card key={b.bookingId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{b.serviceName}</h4>
                        <StatusBadge status={b.status} />
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Workshop: <strong>{b.providerName}</strong> · Scheduled: {b.bookingDate} ({b.bookingTime})
                      </p>
                      {b.technicianName && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--success-text)', fontWeight: 600 }}>
                          Technician Assigned: {b.technicianName} ({b.technicianPhone})
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹{b.totalAmount || b.price}</span>
                      <Button size="sm" onClick={() => navigate(`/bookings/${b.bookingId}`)}>
                        Track Job Live
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Customer Recently Accessed History */}
          <RecentlyAccessedSection />
        </div>
      </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { bookingService } from '../../services/bookingService';
import { Button } from '../../components/common/Button';
import {
  Headphones, AlertTriangle, LifeBuoy, Users, Building2,
  CalendarCheck, Clock, CheckCircle2, ArrowRight, ShieldAlert
} from 'lucide-react';

export const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    complaintService.getComplaints().then(setTickets);
    bookingService.getBookings().then(setBookings);
  }, []);

  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'Investigating');
  const activeBookings = bookings.filter(b => b.status === 'In Progress' || b.status === 'Technician Assigned');

  const stats = [
    { label: 'Open Grievances', value: openTickets.length || '3', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
    { label: 'Active In-Field', value: activeBookings.length || '4', icon: CalendarCheck, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'SLA Compliance', value: '98.6%', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Avg Resolution Time', value: '18 Mins', icon: Clock, color: 'var(--primary-600)', bg: 'var(--primary-50)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Headphones size={20} color="#93c5fd" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>
              CUSTOMER & WORKSHOP SUPPORT OPERATIONS
            </span>
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px 0', color: '#fff' }}>
            Officer: Ananya Deshmukh
          </h1>
          <p style={{ margin: 0, color: '#bfdbfe', fontSize: '0.88rem' }}>
            Dispute Resolution & Field Dispatch Desk · Live Escalation Queue
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/support/complaints">
            <Button variant="primary" style={{ background: '#fff', color: '#1e3a8a', fontWeight: 700 }}>
              Grievance Desk
            </Button>
          </Link>
          <Link to="/support/active-bookings">
            <Button variant="outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              Field Oversight Radar
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} style={{ background: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Priority Tickets & Live Bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Urgent Tickets */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Escalation & Dispute Tickets</h3>
            <Link to="/support/tickets" style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map(t => (
              <div key={t.ticketId} style={{ padding: '16px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-700)' }}>{t.ticketId}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.subject}</span>
                  </div>
                  <span className={`badge ${t.status === 'Resolved' ? 'badge-success' : 'badge-danger'}`}>{t.status}</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Customer: <strong>{t.customerName}</strong> · Booking: <strong>{t.bookingNumber}</strong>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  "{t.description}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Active Ops Radar */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--primary-600)" /> Live Field Watch
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeBookings.slice(0, 4).map(b => (
              <div key={b.bookingId} style={{ padding: '12px 14px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{b.serviceName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Tech: <strong>{b.technicianName}</strong> · Status: <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>

          <Link to="/support/active-bookings" style={{ display: 'block', marginTop: '16px', textAlign: 'center', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-600)' }}>
            Open Oversight Radar →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;

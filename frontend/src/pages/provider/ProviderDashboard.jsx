import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck, Inbox, Clock, CheckCircle2, Star, TrendingUp,
  ArrowRight, Users, Wrench, AlertCircle, Phone, MapPin, History, User
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useRecentlyAccessed } from '../../hooks';

export const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { recentlyAccessed, formatAccessedTime } = useRecentlyAccessed();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getBookings().then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const pending = bookings.filter(b => b.status === 'Pending');
  const inProgress = bookings.filter(b => b.status === 'In Progress' || b.status === 'Technician Assigned');
  const completed = bookings.filter(b => b.status === 'Completed');

  const stats = [
    { label: 'Total Bookings', value: bookings.length || '142', icon: CalendarCheck, color: 'var(--primary-600)', bg: 'var(--primary-50)' },
    { label: 'Pending Requests', value: pending.length || '3', icon: Inbox, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Active in Field', value: inProgress.length || '2', icon: Clock, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Completed Jobs', value: completed.length || '136', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Shop Rating', value: '4.88 ⭐', icon: Star, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Month Revenue', value: '₹48,950', icon: TrendingUp, color: '#059669', bg: '#d1fae5' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              VERIFIED WORKSHOP
            </span>
            <span style={{ fontSize: '0.85rem', color: '#e9d5ff' }}>License: TN-ELEC-4421</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px 0', color: '#fff' }}>Kumar Electricals Workshop</h1>
          <p style={{ margin: 0, color: '#f3e8ff', fontSize: '0.92rem' }}>
            45 West Car Street, Tirunelveli · 10 Active Technicians on Duty
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/provider/requests">
            <Button variant="primary" style={{ background: '#fff', color: 'var(--primary-800)', fontWeight: 700 }}>
              View {pending.length} Pending Requests
            </Button>
          </Link>
          <Link to="/provider/services">
            <Button variant="outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              Manage Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px' }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                <Icon size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Accessed Records (Mandatory Provider Feature) */}
      {recentlyAccessed && recentlyAccessed.length > 0 && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <History size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Recently Accessed Records
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Quick continuity for recently inspected bookings and customer profiles
                </span>
              </div>
            </div>
            <Link
              to="/provider/recently-accessed"
              style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All History ({recentlyAccessed.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {recentlyAccessed.slice(0, 4).map((item, idx) => (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                style={{
                  background: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 16px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '1px 6px',
                      borderRadius: '3px',
                      background: item.type === 'Customer' ? '#dbeafe' : 'var(--primary-100)',
                      color: item.type === 'Customer' ? '#1e40af' : 'var(--primary-800)'
                    }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {formatAccessedTime(item.accessedAt)}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.subtitle}
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(item.path || '/provider/bookings')}
                  style={{ fontSize: '0.74rem', padding: '6px 10px', flexShrink: 0 }}
                >
                  View Again
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Recent Bookings & Technician Squad */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Bookings Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Recent Service Bookings</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest workshop jobs and dispatches</p>
            </div>
            <Link to="/provider/bookings" style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '12px 18px' }}>Booking ID</th>
                  <th style={{ padding: '12px 18px' }}>Service</th>
                  <th style={{ padding: '12px 18px' }}>Customer</th>
                  <th style={{ padding: '12px 18px' }}>Slot</th>
                  <th style={{ padding: '12px 18px' }}>Status</th>
                  <th style={{ padding: '12px 18px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 6).map((b) => (
                  <tr key={b.bookingId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-700)' }}>{b.bookingNumber}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{b.price}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div>{b.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '0.82rem' }}>
                      <div>{b.bookingDate}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{b.bookingTime}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <StatusBadge status={b.status} />
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <Link to="/provider/bookings">
                        <Button variant="secondary" size="sm">Manage</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Squad & Quick Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Field Technicians */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--primary-600)" /> Workshop Squad
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>K. Arumugam</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Master Electrician (Grade-A)</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Available</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>S. Murugan</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HVAC & Gas Specialist</div>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>On Job (BK-1001)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>R. Vignesh</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Appliance & Pump Care</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Available</span>
              </div>
            </div>
            <Link to="/provider/availability" style={{ display: 'block', marginTop: '14px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              Manage Squad Rosters →
            </Link>
          </div>

          {/* Quality SOP Card */}
          <div style={{ background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--primary-100)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-900)', fontWeight: 800 }}>Standard Service Checklist</h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: 'var(--primary-800)', lineHeight: 1.5 }}>
              Technicians must complete verified digital SOP checklist for electrical wiring and AC maintenance before job completion.
            </p>
            <Link to="/provider/checklist">
              <Button variant="primary" size="sm" style={{ width: '100%' }}>Inspect Checklist SOP</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useNotifications } from '../../hooks';
import { useLanguage } from '../../context/LanguageContext';
import { notificationService, NOTIFICATION_TYPES } from '../../services/notificationService';
import {
  Bell, CheckCheck, CalendarCheck, Clock, ShieldCheck, CheckCircle2,
  Filter, RefreshCw, BookOpen, ArrowRight, Wrench, AlertTriangle,
  Star, MapPin, UserCheck, Truck, Play, XCircle, Trash2, Sparkles,
  Zap, Info, ExternalLink
} from 'lucide-react';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { notifications, unreadCount, markRead, markAllRead, getNotifications } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [simulating, setSimulating] = useState(null);

  // The 10 Mandatory Notification Types
  const mandatoryEvents = [
    { type: NOTIFICATION_TYPES.BOOKING_CREATED, icon: Clock, color: '#3b82f6', bg: '#eff6ff', label: 'Booking Created' },
    { type: NOTIFICATION_TYPES.BOOKING_ACCEPTED, icon: CalendarCheck, color: '#059669', bg: '#ecfdf5', label: 'Booking Accepted' },
    { type: NOTIFICATION_TYPES.TECH_ASSIGNED, icon: UserCheck, color: '#6366f1', bg: '#eef2ff', label: 'Technician Assigned' },
    { type: NOTIFICATION_TYPES.TECH_ON_THE_WAY, icon: Truck, color: '#d97706', bg: '#fffbeb', label: 'Technician On The Way' },
    { type: NOTIFICATION_TYPES.TECH_ARRIVED, icon: MapPin, color: '#ea580c', bg: '#fff7ed', label: 'Technician Arrived' },
    { type: NOTIFICATION_TYPES.SERVICE_STARTED, icon: Play, color: '#2563eb', bg: '#eff6ff', label: 'Service Started' },
    { type: NOTIFICATION_TYPES.SERVICE_COMPLETED, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4', label: 'Service Completed' },
    { type: NOTIFICATION_TYPES.MAINTENANCE_DUE, icon: RefreshCw, color: '#d97706', bg: '#fffbeb', label: 'Maintenance Due' },
    { type: NOTIFICATION_TYPES.REVIEW_REMINDER, icon: Star, color: '#9333ea', bg: '#faf5ff', label: 'Review Reminder' },
    { type: NOTIFICATION_TYPES.BOOKING_CANCELLED, icon: XCircle, color: '#dc2626', bg: '#fef2f2', label: 'Booking Cancelled' }
  ];

  const handleSimulateEvent = async (eventType) => {
    setSimulating(eventType);
    const sampleBooking = {
      bookingId: 'bk-1001',
      bookingNumber: 'LS-2026-1001',
      serviceName: 'Daikin Inverter AC Jet Wash',
      providerName: 'FrostTech AC Solutions',
      technicianName: 'S. Murugan (#TN-4410)'
    };
    await notificationService.triggerLifecycleEvent(eventType, sampleBooking);
    // Reload state from hook
    if (getNotifications) await getNotifications('customer');
    setTimeout(() => setSimulating(null), 300);
  };

  const filtered = notifications.filter(n => {
    const tLower = (n.type || '').toLowerCase();
    if (filter === 'booking') return tLower.includes('booking');
    if (filter === 'technician') return tLower.includes('technician') || tLower.includes('started');
    if (filter === 'maintenance') return tLower.includes('maintenance');
    if (filter === 'completed') return tLower.includes('completed');
    if (filter === 'reviews') return tLower.includes('review');
    return true;
  });

  const handleBookAgainFromNotif = (notif) => {
    const params = new URLSearchParams({
      mode: 'book-again',
      serviceId: 'srv-3',
      providerName: 'FrostTech AC Solutions',
      appliance: 'Daikin Inverter 1.5T Split AC',
      previousBooking: notif.bookingId || 'LS-2026-1001',
      lastDate: '2026-09-28',
      nextSuggestedDate: '2026-12-28'
    });
    navigate(`/booking/srv-3?${params.toString()}`);
  };

  const getEventConfig = (type = '') => {
    const found = mandatoryEvents.find(e => e.type.toLowerCase() === type.toLowerCase());
    if (found) return found;
    return {
      type,
      icon: Bell,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)',
      label: type
    };
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <Breadcrumb items={[{ label: t('notificationsTitle', 'Notifications') }]} />

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-600) 0%, #4338ca 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}>
                <Bell size={20} />
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {t('notificationsTitle', 'Notifications & Updates')}
              </h1>
            </div>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Live real-time alerts across all 10 booking, technician, and maintenance lifecycle milestones.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={CheckCheck}
                onClick={() => markAllRead('customer')}
                style={{ fontWeight: 700 }}
              >
                {t('markAllRead', 'Mark All Read')} ({unreadCount})
              </Button>
            )}
          </div>
        </div>

        {/* Interactive 10-Milestone Test Simulation Panel */}
        <Card style={{
          padding: '16px 20px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(30, 27, 75, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#fde047" />
              <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                10-Event Lifecycle Simulator & Navbar Badge Tester
              </strong>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#c7d2fe', background: 'rgba(255,255,255,0.12)', padding: '3px 8px', borderRadius: '12px' }}>
              Click any button to trigger live notification + navbar counter
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '8px'
          }}>
            {mandatoryEvents.map((evt) => {
              const Icon = evt.icon;
              const isBusy = simulating === evt.type;
              return (
                <button
                  key={evt.type}
                  onClick={() => handleSimulateEvent(evt.type)}
                  disabled={isBusy}
                  style={{
                    background: isBusy ? '#4338ca' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isBusy ? '#4338ca' : 'rgba(255, 255, 255, 0.1)'; }}
                >
                  <Icon size={14} color="#fde047" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {evt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {[
            { id: 'all', label: `All Alerts (${notifications.length})` },
            { id: 'booking', label: 'Bookings' },
            { id: 'technician', label: 'Technician Progress' },
            { id: 'completed', label: 'Completed & Certified' },
            { id: 'maintenance', label: 'Maintenance Cycles' },
            { id: 'reviews', label: 'Reviews' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                background: filter === f.id ? 'var(--primary-600)' : 'var(--bg-card)',
                color: filter === f.id ? '#ffffff' : 'var(--text-secondary)',
                border: filter === f.id ? '1px solid var(--primary-600)' : '1px solid var(--border-light)',
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification Stream */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No notifications in this view"
            description="Use the simulator buttons above or create a booking to test live events."
            icon={Bell}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((n) => {
              const cfg = getEventConfig(n.type);
              const Icon = cfg.icon;
              const isMaintenance = (n.type || '').toLowerCase().includes('maintenance');
              const isCompleted = (n.type || '').toLowerCase().includes('completed');
              const isReview = (n.type || '').toLowerCase().includes('review');
              const isCancelled = (n.type || '').toLowerCase().includes('cancelled');
              const isTechnician = (n.type || '').toLowerCase().includes('technician') || (n.type || '').toLowerCase().includes('started') || (n.type || '').toLowerCase().includes('accepted');

              return (
                <Card
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px 20px',
                    borderLeft: n.read ? '2px solid var(--border-light)' : `5px solid ${cfg.color}`,
                    background: n.read ? 'var(--bg-card)' : 'var(--primary-50)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Status Milestone Icon */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: cfg.bg,
                    color: cfg.color,
                    border: `1.5px solid ${cfg.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={20} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                          {n.title}
                        </h4>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 9px',
                          borderRadius: '12px',
                          background: cfg.bg,
                          color: cfg.color,
                          border: `1px solid ${cfg.color}40`
                        }}>
                          {n.type}
                        </span>
                        {!n.read && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--primary-600)'
                          }} />
                        )}
                      </div>

                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
                      {n.message}
                    </p>

                    {/* Contextual Action Buttons tailored to each of the 10 milestone events */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {isMaintenance && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleBookAgainFromNotif(n); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                          >
                            <RefreshCw size={13} /> Book Again (Pre-filled)
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); navigate('/maintenance'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <CalendarCheck size={13} /> Maintenance Schedule
                          </Button>
                        </>
                      )}

                      {isCompleted && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); navigate('/service-passport'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                          >
                            <BookOpen size={13} /> Open Service Passport
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); navigate('/reviews'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Star size={13} /> Rate Service
                          </Button>
                        </>
                      )}

                      {isReview && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); navigate('/reviews'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                        >
                          <Star size={13} /> Submit Verified Review
                        </Button>
                      )}

                      {isCancelled && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); navigate('/services'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <RefreshCw size={13} /> Browse & Re-book Service
                        </Button>
                      )}

                      {isTechnician && !isCompleted && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); navigate(`/bookings/${n.bookingId || 'bk-1001'}`); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                        >
                          Live 8-Stage Tracker <ArrowRight size={13} />
                        </Button>
                      )}

                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCheck size={13} /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import {
  Briefcase, Calendar, CheckSquare, Clock, MapPin, Phone,
  ArrowRight, CheckCircle2, Star, HardHat, Navigation, Building2,
  ShieldCheck, AlertCircle, History
} from 'lucide-react';
import { useRecentlyAccessed } from '../../hooks';

export const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { recentlyAccessed, formatAccessedTime } = useRecentlyAccessed();
  const [activeJob, setActiveJob] = useState(null);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [notification, setNotification] = useState('');

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  useEffect(() => {
    bookingService.getBookings().then(data => {
      // Find technician Murugan jobs or all open jobs
      const jobs = data.filter(b =>
        b.technicianId === 'tech-1' ||
        ['assigned', 'technician assigned', 'accepted', 'on the way', 'arrived', 'service started', 'in progress'].includes((b.status || '').toLowerCase().trim())
      );
      setAssignedJobs(jobs.length > 0 ? jobs : data.slice(0, 4));
      // First active job in progress or first assigned
      const current = jobs.find(j => ['service started', 'in progress', 'arrived', 'on the way', 'accepted'].includes((j.status || '').toLowerCase().trim())) || jobs[0];
      setActiveJob(current || data[0]);
    });
  }, []);

  const advanceActiveJob = (nextStatus) => {
    if (!activeJob) return;
    bookingService.updateBookingStatus(activeJob.bookingId, nextStatus).then(updated => {
      setActiveJob(prev => ({ ...prev, status: nextStatus }));
      setAssignedJobs(prev => prev.map(j => j.bookingId === activeJob.bookingId ? { ...j, status: nextStatus } : j));
      showNotice(`Work order #${activeJob.bookingNumber} moved to "${nextStatus}"!`);
    });
  };

  const stats = [
    { label: "Today's Schedule", value: "4 Assigned", icon: Calendar, color: '#d97706', bg: '#fef3c7' },
    { label: "Current Work Order", value: activeJob ? activeJob.bookingNumber : "None", icon: Briefcase, color: 'var(--primary-600)', bg: 'var(--primary-50)' },
    { label: "Completed All-Time", value: "420 Jobs", icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
    { label: "Customer Rating", value: "4.90 ⭐", icon: Star, color: '#8b5cf6', bg: '#f5f3ff' }
  ];

  const currentSt = (activeJob?.status || '').toLowerCase().trim();
  const isAssigned = currentSt === 'assigned' || currentSt === 'technician assigned' || currentSt === 'pending';
  const isAccepted = currentSt === 'accepted';
  const isOnTheWay = currentSt === 'on the way';
  const isArrived = currentSt === 'arrived';
  const isStarted = currentSt === 'service started' || currentSt === 'in progress';
  const isCompleted = currentSt === 'completed' || currentSt === 'service completed';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
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
            <HardHat size={20} color="#fde68a" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>
              FIELD TECHNICIAN ON ACTIVE DUTY
            </span>
            <span style={{ fontSize: '0.82rem', color: '#fde68a' }}>Lic: TN-HVAC-4410</span>
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px 0', color: '#fff' }}>S. Murugan</h1>
          <p style={{ margin: 0, color: '#fef3c7', fontSize: '0.88rem' }}>
            Attached Commercial Workshops: FrostTech AC Solutions & Kumar Electricals
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/technician/location">
            <Button variant="primary" style={{ background: '#fff', color: '#78350f', fontWeight: 700 }}>
              <Navigation size={16} /> GPS Navigation
            </Button>
          </Link>
          <Link to="/technician/checklist">
            <Button variant="outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              <CheckSquare size={16} /> Quality Checklists
            </Button>
          </Link>
        </div>
      </div>

      {notification && (
        <div style={{
          background: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} style={{ background: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: 'var(--shadow-sm)' }}>
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

      {/* Active Work Order Card with 6-stage Actions */}
      {activeJob && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--primary-600)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: '8px', display: 'inline-block' }}>
                CURRENT ACTIVE WORK ORDER IN PIPELINE
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>
                {activeJob.serviceName}
              </h2>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Order #{activeJob.bookingNumber} · Slot: <strong>{activeJob.bookingDate} ({activeJob.bookingTime})</strong> · Workshop: <strong>{activeJob.providerName || 'FrostTech AC Solutions'}</strong>
              </div>
            </div>
            <StatusBadge status={activeJob.status} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Customer</div>
              <div style={{ fontWeight: 700 }}>{activeJob.customerName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600 }}>{activeJob.customerPhone}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Address</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{activeJob.address}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Equipment / Problem Description</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{activeJob.requirements || "Regular diagnostic servicing"}</div>
            </div>
          </div>

          {/* 6-Stage Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isAssigned && (
                <Button variant="primary" size="sm" onClick={() => advanceActiveJob('Accepted')}>
                  Accept Job
                </Button>
              )}
              {isAccepted && (
                <Button variant="primary" size="sm" onClick={() => advanceActiveJob('On The Way')} style={{ background: '#d97706', borderColor: '#d97706' }}>
                  <Navigation size={14} /> Mark On The Way
                </Button>
              )}
              {isOnTheWay && (
                <Button variant="primary" size="sm" onClick={() => advanceActiveJob('Arrived')} style={{ background: '#2563eb', borderColor: '#2563eb' }}>
                  <MapPin size={14} /> Mark Arrived At Site
                </Button>
              )}
              {isArrived && (
                <Button variant="primary" size="sm" onClick={() => advanceActiveJob('Service Started')}>
                  Start Service Execution
                </Button>
              )}
              {isStarted && (
                <Button variant="success" size="sm" onClick={() => navigate(`/technician/jobs/${activeJob.bookingId}`)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Complete & Upload Proof
                </Button>
              )}
              {isCompleted && (
                <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} /> Service Completed
                </span>
              )}

              <Link to="/technician/location">
                <Button variant="secondary" size="sm">
                  <MapPin size={14} /> GPS Route
                </Button>
              </Link>
              <Link to="/technician/checklist">
                <Button variant="secondary" size="sm">
                  <CheckSquare size={14} /> SOP Checklist
                </Button>
              </Link>
            </div>

            <Link to={`/technician/jobs/${activeJob.bookingId}`}>
              <Button variant="outline" size="sm">
                Full Work Order & Proof <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recently Accessed Assigned Jobs (Mandatory Technician Feature) */}
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
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <History size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Recently Accessed Assigned Jobs
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Rapid recall for field work orders and inspection reports you recently opened
                </span>
              </div>
            </div>
            <Link to="/technician/jobs" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>View All Assigned ({recentlyAccessed.length})</span>
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
                      background: '#e0e7ff',
                      color: '#3730a3'
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
                  onClick={() => navigate(item.path || `/technician/jobs/${item.id}`)}
                  style={{ fontSize: '0.74rem', padding: '6px 10px', flexShrink: 0 }}
                >
                  View Again
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Schedule Queue */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Assigned Jobs Pipeline for Today</h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>Quick actions across daily work orders</p>
          </div>
          <Link to="/technician/jobs">
            <Button variant="secondary" size="sm">View All Assigned Jobs</Button>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assignedJobs.map(job => (
            <div key={job.bookingId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{job.serviceName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {job.bookingNumber} · Customer: {job.customerName} · {job.bookingDate} ({job.bookingTime})
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <StatusBadge status={job.status} />
                <Link to={`/technician/jobs/${job.bookingId}`}>
                  <Button variant="secondary" size="sm">Manage Job</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;

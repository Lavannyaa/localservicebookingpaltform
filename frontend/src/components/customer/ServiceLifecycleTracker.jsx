import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Calendar, CheckCircle2, UserCheck, Activity,
  Navigation, ShieldCheck, CheckSquare, FileText, Camera, FileBadge2,
  Clock, Bell, RefreshCw, ChevronRight
} from 'lucide-react';

export const ServiceLifecycleTracker = ({
  currentStage = 6, // 1 to 15
  bookingId,
  serviceName,
  providerName,
  technicianName,
  eta = '18 Mins',
  verificationOtp = '4829',
  maintenanceDate = '24 Dec 2026'
}) => {
  const lifecycleStages = [
    { id: 1, label: 'Search Service', icon: Search, desc: 'Service discovered & selected' },
    { id: 2, label: 'Shop Discovery', icon: MapPin, desc: `${providerName || 'Nearby Certified Workshop'}` },
    { id: 3, label: 'Booking Placed', icon: Calendar, desc: 'Slot & requirements submitted' },
    { id: 4, label: 'Workshop Accepted', icon: CheckCircle2, desc: 'Workshop confirmed job' },
    { id: 5, label: 'Tech Assigned', icon: UserCheck, desc: `${technicianName || 'Field Specialist'}` },
    { id: 6, label: 'Live Status', icon: Activity, desc: 'Real-time telemetry stream' },
    { id: 7, label: 'Location & ETA', icon: Navigation, desc: `En route — ETA: ${eta}` },
    { id: 8, label: 'OTP Verification', icon: ShieldCheck, desc: `Security OTP: ${verificationOtp}` },
    { id: 9, label: 'Service Checklist', icon: CheckSquare, desc: 'Standard diagnostic protocol' },
    { id: 10, label: 'Technician Notes', icon: FileText, desc: 'Observations & parts replaced' },
    { id: 11, label: 'Completion Proof', icon: Camera, desc: 'Before/After photo log' },
    { id: 12, label: 'Service Passport', icon: FileBadge2, desc: 'Digital appliance passport updated' },
    { id: 13, label: 'Maintenance Due', icon: Clock, desc: `Due: ${maintenanceDate}` },
    { id: 14, label: 'Service Reminder', icon: Bell, desc: 'Automated 15-day alert' },
    { id: 15, label: 'Book Again', icon: RefreshCw, desc: '1-Click recurring servicing' }
  ];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      margin: '20px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-600)', letterSpacing: '0.5px' }}>
            END-TO-END SERVICE LIFECYCLE
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
            15-Point Digital Assurance Pipeline
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Stage {currentStage} of 15
          </span>
          <div style={{ width: '100px', height: '8px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${(currentStage / 15) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-600) 0%, #10b981 100%)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>
      </div>

      {/* Horizontal Lifecycle Timeline */}
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '14px',
        scrollbarWidth: 'thin'
      }}>
        {lifecycleStages.map((stage) => {
          const Icon = stage.icon;
          const isPassed = stage.id < currentStage;
          const isCurrent = stage.id === currentStage;
          const isPending = stage.id > currentStage;

          return (
            <div
              key={stage.id}
              style={{
                minWidth: '150px',
                maxWidth: '160px',
                padding: '12px 10px',
                borderRadius: 'var(--radius-md)',
                background: isCurrent ? 'var(--primary-50)' : isPassed ? 'var(--bg-muted)' : 'var(--bg-surface)',
                border: isCurrent ? '2px solid var(--primary-600)' : isPassed ? '1px solid #10b981' : '1px dashed var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isCurrent ? 'var(--primary-600)' : isPassed ? '#10b981' : 'var(--bg-muted)',
                  color: isCurrent || isPassed ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {isPassed ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: isCurrent ? 'var(--primary-700)' : isPassed ? '#059669' : 'var(--text-muted)' }}>
                  #{stage.id}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCurrent ? 'var(--primary-900)' : 'var(--text-primary)', display: 'block' }}>
                  {stage.label}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3, display: 'block', marginTop: '2px' }}>
                  {stage.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>Every stage is timestamped & backed by 30-Day Platform Warranty</span>
        </div>
        <Link
          to="/service-passport"
          style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>Open Digital Service Passport</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ServiceLifecycleTracker;

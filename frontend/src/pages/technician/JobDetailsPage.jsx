import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { servicePassportService } from '../../services/servicePassportService';
import { notificationService, NOTIFICATION_TYPES } from '../../services/notificationService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRecentlyAccessed } from '../../hooks';
import {
  MapPin, Phone, Calendar, Clock, CheckSquare, StickyNote, CheckCircle2,
  ShieldCheck, ArrowLeft, Navigation, Building2, User, Camera, Upload,
  FileText, Check, AlertCircle, ChevronRight, Award, Trash2, Eye, Printer
} from 'lucide-react';

const SERVICE_CHECKLIST_TEMPLATES = {
  'AC & Appliances': [
    { id: 'chk-ac-1', item: 'Check cooling temperature pre-service (Recorded)', done: true },
    { id: 'chk-ac-2', item: 'Clean filter and chemical jet wash indoor coil', done: true },
    { id: 'chk-ac-3', item: 'Check gas pressure (Target: 120-130 PSI R32)', done: false },
    { id: 'chk-ac-4', item: 'Check electrical connections & capacitor ratings', done: false },
    { id: 'chk-ac-5', item: 'Inspect outdoor unit condenser fins & fan motor', done: false },
    { id: 'chk-ac-6', item: 'Final cooling test & airflow velocity check', done: false }
  ],
  'Electrical': [
    { id: 'chk-el-1', item: 'Main MCB/DB isolation safety test', done: true },
    { id: 'chk-el-2', item: 'Earth leakage & line voltage calibration (220-240V)', done: true },
    { id: 'chk-el-3', item: 'Inspect wire insulation for scorch or overheat marks', done: false },
    { id: 'chk-el-4', item: 'Tighten all terminal screws to rated torque', done: false },
    { id: 'chk-el-5', item: 'High-amp load stress test with diagnostics tool', done: false },
    { id: 'chk-el-6', item: 'Digital multimeter verification and safety sign-off', done: false }
  ],
  'Plumbing': [
    { id: 'chk-pl-1', item: 'Main shutoff valve inspection & line isolation', done: true },
    { id: 'chk-pl-2', item: 'Pressure test for concealed pipe leakage', done: true },
    { id: 'chk-pl-3', item: 'Replace worn washers, gaskets, or valve cartridges', done: false },
    { id: 'chk-pl-4', item: 'Clear drain pipe blockage with mechanical snake', done: false },
    { id: 'chk-pl-5', item: 'High-pressure water tightness & flow rate test', done: false },
    { id: 'chk-pl-6', item: 'Customer satisfaction flow sign-off', done: false }
  ],
  'default': [
    { id: 'chk-df-1', item: 'Initial diagnostic & site inspection', done: true },
    { id: 'chk-df-2', item: 'Customer requirement verification', done: true },
    { id: 'chk-df-3', item: 'Component repair / replacement execution', done: false },
    { id: 'chk-df-4', item: 'Functional calibration and load testing', done: false },
    { id: 'chk-df-5', item: 'Workplace cleanup & debris removal', done: false },
    { id: 'chk-df-6', item: 'Final customer handover & warranty stamp', done: false }
  ]
};

export const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackItem } = useRecentlyAccessed();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, checklist, notes, proof

  // Service Checklist State
  const [checklist, setChecklist] = useState([]);

  // Service Notes State
  const [notes, setNotes] = useState({
    workPerformed: 'Deep chemical wash performed on indoor evaporator coils. Condensate drain cleared. Measured suction pressure at 125 PSI. Cleaned outdoor condenser.',
    customerRequirements: 'Low cooling in bedroom AC. Water dripping from front louver.',
    additionalObservations: 'Compressor capacitor operating near lower threshold. Recommended replacement within 6 months.',
    recommendedMaintenance: 'Quarterly antibacterial coil rinse and outdoor unit condenser flush.',
    nextMaintenanceDate: '2026-12-28'
  });

  // Service Completion Proof State (Unique Feature)
  const [proof, setProof] = useState({
    beforeImages: [
      {
        id: 'proof-b-1',
        title: 'Initial Evaporator Coil Mold & Dust Accumulation',
        time: '10:35 AM · On-site arrival',
        dataUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
      }
    ],
    afterImages: [
      {
        id: 'proof-a-1',
        title: 'Chemical Jet Cleaned Coil & 16.5°C Cooling Output',
        time: '11:45 AM · Post-service verification',
        dataUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'
      }
    ],
    beforeNotes: 'Severe dust buildup on blower wheel causing airflow restriction and moisture backup.',
    afterNotes: 'Airflow velocity increased to 480 CFM. Temperature drop measured at 10.5°C across coil. No water leakage.',
    technicianSignature: 'S. Murugan (Certified HVAC #TN-4410)',
    signedAt: '2026-09-24T11:50:00Z',
    customerSignature: 'Rahul Sharma (Customer Confirmed)',
    warrantyPeriod: '30-Day LocalServe Work Warranty'
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [notification, setNotification] = useState('');

  // 6-step lifecycle
  const jobFlowSteps = [
    { id: 'Assigned', label: '1. Assigned', desc: 'Dispatched by shop' },
    { id: 'Accepted', label: '2. Accepted', desc: 'Tech confirmed' },
    { id: 'On The Way', label: '3. On The Way', desc: 'En route to site' },
    { id: 'Arrived', label: '4. Arrived', desc: 'At customer location' },
    { id: 'Service Started', label: '5. Service Started', desc: 'Work in progress' },
    { id: 'Service Completed', label: '6. Service Completed', desc: 'Passed & stamped' }
  ];

  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase().trim();
    if (s === 'assigned' || s === 'technician assigned') return 0;
    if (s === 'accepted') return 1;
    if (s === 'on the way') return 2;
    if (s === 'arrived') return 3;
    if (s === 'service started' || s === 'in progress') return 4;
    if (s === 'service completed' || s === 'completed') return 5;
    return 0;
  };

  useEffect(() => {
    const targetId = id || 'BK-1001';
    bookingService.getBookingById(targetId).then(data => {
      setBooking(data);
      const categoryTemplate = SERVICE_CHECKLIST_TEMPLATES[data.category] || SERVICE_CHECKLIST_TEMPLATES['default'];
      setChecklist(data.serviceChecklist || categoryTemplate);
      setLoading(false);

      // Track accessed assigned job
      trackItem({
        id: data.bookingId || data.bookingNumber || targetId,
        type: 'Assigned Job',
        title: `#${data.bookingNumber} · ${data.serviceName}`,
        subtitle: `Customer: ${data.customerName} · ${data.address}`,
        path: `/technician/jobs/${data.bookingId || data.bookingNumber}`,
        badge: data.status,
        role: 'technician'
      });
    }).catch(() => {
      bookingService.getBookings().then(all => {
        const found = all[0];
        setBooking(found);
        const categoryTemplate = SERVICE_CHECKLIST_TEMPLATES[found.category] || SERVICE_CHECKLIST_TEMPLATES['default'];
        setChecklist(found.serviceChecklist || categoryTemplate);
        setLoading(false);

        // Track accessed assigned job
        trackItem({
          id: found.bookingId || found.bookingNumber || targetId,
          type: 'Assigned Job',
          title: `#${found.bookingNumber} · ${found.serviceName}`,
          subtitle: `Customer: ${found.customerName} · ${found.address}`,
          path: `/technician/jobs/${found.bookingId || found.bookingNumber}`,
          badge: found.status,
          role: 'technician'
        });
      });
    });
  }, [id, trackItem]);

  const advanceStatus = (newStatus) => {
    if (!booking) return;
    bookingService.updateBookingStatus(booking.bookingId, newStatus).then(updated => {
      setBooking(prev => ({ ...prev, status: newStatus }));
      setNotification(`Job status progressed to: "${newStatus}"`);
      setTimeout(() => setNotification(''), 3500);

      // Trigger lifecycle notifications based on technician progress
      if (newStatus === 'Accepted') {
        notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.BOOKING_ACCEPTED, booking);
      } else if (newStatus === 'On The Way') {
        notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.TECH_ON_THE_WAY, booking);
      } else if (newStatus === 'Arrived') {
        notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.TECH_ARRIVED, booking);
      } else if (newStatus === 'Service Started') {
        notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.SERVICE_STARTED, booking);
      }

      // If completing, show completion proof certificate modal and record in Service Passport
      if (newStatus === 'Service Completed' || newStatus === 'Completed') {
        setShowCompletionModal(true);
        servicePassportService.recordCompletedService({
          bookingNumber: booking.bookingNumber,
          serviceId: booking.serviceId || 'srv-3',
          serviceName: booking.serviceName || 'AC Jet Wash & Comprehensive Service',
          applianceName: booking.serviceName || 'Daikin Inverter 1.5T Split AC',
          category: booking.category || 'AC & Appliances',
          providerName: booking.providerName || 'A. Joseph Fernandez',
          shopName: booking.providerName || 'FrostTech AC Solutions',
          technicianName: booking.technicianName || 'S. Murugan (Certified HVAC #TN-4410)',
          serviceDate: new Date().toISOString().split('T')[0],
          workCompleted: notes?.workPerformed || 'Precision service and component overhaul executed according to SOP guidelines.',
          checklist: checklist.map(c => ({ item: c.item, passed: c.done })),
          notes: notes?.additionalObservations || 'Verified all electrical ratings, coil cleanliness, and refrigerant operating levels.',
          amount: booking.totalAmount || booking.price || 899,
          warranty: '30-Day Work Warranty',
          maintenanceIntervalMonths: 3,
          proofPhotos: {
            before: proof.beforeImages?.[0]?.dataUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
            after: proof.afterImages?.[0]?.dataUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'
          }
        });

        // Trigger Service Completed, Maintenance Due, and Review Reminder
        notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.SERVICE_COMPLETED, booking);
        setTimeout(() => {
          notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.MAINTENANCE_DUE, booking);
          notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.REVIEW_REMINDER, booking);
        }, 1000);
      }
    });
  };

  const handleToggleChecklistItem = (idx) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, done: !item.done } : item));
  };

  const completedChecklistCount = checklist.filter(c => c.done).length;
  const checklistProgressPercent = checklist.length > 0 ? Math.round((completedChecklistCount / checklist.length) * 100) : 0;

  // File Upload Handlers (Simulated with local object URLs for future backend storage)
  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const newImage = {
      id: `proof-${Date.now()}`,
      title: file.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dataUrl: fakeUrl
    };

    if (type === 'before') {
      setProof(prev => ({ ...prev, beforeImages: [...prev.beforeImages, newImage] }));
    } else {
      setProof(prev => ({ ...prev, afterImages: [...prev.afterImages, newImage] }));
    }
  };

  const handleRemoveProofImage = (type, imgId) => {
    if (type === 'before') {
      setProof(prev => ({ ...prev, beforeImages: prev.beforeImages.filter(i => i.id !== imgId) }));
    } else {
      setProof(prev => ({ ...prev, afterImages: prev.afterImages.filter(i => i.id !== imgId) }));
    }
  };

  if (loading || !booking) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading work order details...</div>;
  }

  const currentStep = getStepIndex(booking.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/technician/jobs">
            <Button variant="secondary" size="sm"><ArrowLeft size={16} /> All Assigned Jobs</Button>
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Work Order #{booking.bookingNumber}
              </h1>
              <StatusBadge status={booking.status} />
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Assigned to Technician S. Murugan · Workshop: <strong>{booking.providerName || 'FrostTech AC Solutions'}</strong>
            </span>
          </div>
        </div>

        {/* Next Flow Action Button */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {currentStep === 0 && (
            <Button variant="primary" onClick={() => advanceStatus('Accepted')}>
              Accept Job
            </Button>
          )}
          {currentStep === 1 && (
            <Button variant="primary" onClick={() => advanceStatus('On The Way')} style={{ background: '#d97706', borderColor: '#d97706' }}>
              <Navigation size={15} /> Mark On The Way
            </Button>
          )}
          {currentStep === 2 && (
            <Button variant="primary" onClick={() => advanceStatus('Arrived')} style={{ background: '#2563eb', borderColor: '#2563eb' }}>
              <MapPin size={15} /> Mark Arrived At Customer Site
            </Button>
          )}
          {currentStep === 3 && (
            <Button variant="primary" onClick={() => advanceStatus('Service Started')}>
              Start Service Execution
            </Button>
          )}
          {currentStep === 4 && (
            <Button variant="success" onClick={() => advanceStatus('Service Completed')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Complete Service & Generate Proof
            </Button>
          )}
          {currentStep === 5 && (
            <Button variant="secondary" onClick={() => setShowCompletionModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> View Completion Certificate
            </Button>
          )}
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
          <Check size={18} /> {notification}
        </div>
      )}

      {/* 6-Step Visual Job Flow Stepper */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
          MANDATORY FIELD JOB FLOW: ASSIGNED → ACCEPTED → ON THE WAY → ARRIVED → SERVICE STARTED → SERVICE COMPLETED
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          position: 'relative'
        }}>
          {jobFlowSteps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isFuture = currentStep < idx;

            return (
              <div
                key={step.id}
                style={{
                  background: isCurrent ? 'var(--primary-50)' : isCompleted ? '#ecfdf5' : 'var(--bg-muted)',
                  border: isCurrent ? '2px solid var(--primary-600)' : isCompleted ? '1px solid #10b981' : '1px solid var(--border-light)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: isCurrent ? 'var(--primary-700)' : isCompleted ? '#059669' : 'var(--text-muted)'
                  }}>
                    STEP {idx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 size={16} color="#10b981" />}
                </div>

                <div style={{
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  color: isCurrent ? 'var(--primary-900)' : isCompleted ? '#065f46' : 'var(--text-primary)'
                }}>
                  {step.id}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Selector: Overview, Checklist, Notes, Completion Proof */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '2px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Job & Customer Details' },
          { id: 'checklist', label: `Service Checklist (${completedChecklistCount}/${checklist.length})` },
          { id: 'notes', label: 'Technical Service Notes' },
          { id: 'proof', label: 'Service Completion Proof (Before / After / Report)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.88rem',
              fontWeight: activeTab === tab.id ? 800 : 500,
              color: activeTab === tab.id ? 'var(--primary-700)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary-600)' : '3px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & JOB DETAILS */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Service & Requirements Card */}
            <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                    {booking.category}
                  </span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '6px 0 2px 0', color: 'var(--text-primary)' }}>
                    {booking.serviceName}
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>SERVICE RATE</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-700)' }}>₹{booking.price}</span>
                </div>
              </div>

              {/* Requirements */}
              <div style={{ background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Customer Problem Description & Requirements:
                </span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  "{booking.requirements || 'Regular servicing & diagnostic inspection requested by customer.'}"
                </p>
              </div>

              {/* Schedule and Shop Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="var(--primary-600)" />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'block' }}>SCHEDULED DATE</span>
                    <strong>{booking.bookingDate}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} color="var(--primary-600)" />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'block' }}>ARRIVAL WINDOW</span>
                    <strong>{booking.bookingTime}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={18} color="var(--primary-600)" />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'block' }}>PROVIDER WORKSHOP</span>
                    <strong>{booking.providerName || 'FrostTech AC Solutions'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => setActiveTab('checklist')}>
                <CheckSquare size={16} /> Open SOP Checklist ({checklistProgressPercent}%)
              </Button>
              <Button variant="secondary" onClick={() => setActiveTab('notes')}>
                <StickyNote size={16} /> Technical Notes
              </Button>
              <Button variant="primary" onClick={() => setActiveTab('proof')}>
                <Camera size={16} /> Upload Completion Proof
              </Button>
            </div>
          </div>

          {/* Customer & Address Side Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="var(--primary-600)" /> Customer Contact
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'block' }}>CUSTOMER NAME</span>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>{booking.customerName}</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'block' }}>DIRECT PHONE NUMBER</span>
                  <a href={`tel:${booking.customerPhone}`} style={{ color: 'var(--primary-700)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> {booking.customerPhone}
                  </a>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'block' }}>SERVICE ADDRESS</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>
                    {booking.address}
                  </div>
                </div>

                <div style={{ marginTop: '6px' }}>
                  <Link to="/technician/location">
                    <Button variant="secondary" size="sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Navigation size={14} /> Open Live GPS Route
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE CHECKLIST */}
      {activeTab === 'checklist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Progress Card */}
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Service-Specific Quality SOP: {booking.category}
                </h3>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Check off each required diagnostic item as you perform work on site.
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-700)' }}>
                  {completedChecklistCount} of {checklist.length} Completed ({checklistProgressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '10px', background: 'var(--bg-muted)', borderRadius: '5px', overflow: 'hidden', marginTop: '12px' }}>
              <div style={{
                width: `${checklistProgressPercent}%`,
                height: '100%',
                background: checklistProgressPercent === 100 ? '#10b981' : 'var(--primary-600)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Checklist Items */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {checklist.map((c, idx) => (
              <div
                key={c.id || idx}
                onClick={() => handleToggleChecklistItem(idx)}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: c.done ? '1px solid var(--primary-300)' : '1px solid var(--border-light)',
                  borderLeft: c.done ? '4px solid #10b981' : '4px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={c.done}
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: c.done ? 700 : 500,
                    color: c.done ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: c.done ? 'line-through' : 'none'
                  }}>
                    {c.item}
                  </span>
                </div>
                <span className={`badge ${c.done ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                  {c.done ? 'Passed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TECHNICAL SERVICE NOTES */}
      {activeTab === 'notes' && (
        <form onSubmit={e => { e.preventDefault(); setNotification('Diagnostic notes saved successfully!'); setTimeout(() => setNotification(''), 3000); }} style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
              1. Work Performed (Detailed Technical Action Taken)
            </label>
            <textarea
              rows={3}
              value={notes.workPerformed}
              onChange={e => setNotes({ ...notes, workPerformed: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
              2. Customer Requirements / Reported Symptoms
            </label>
            <input
              type="text"
              value={notes.customerRequirements}
              onChange={e => setNotes({ ...notes, customerRequirements: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
              3. Additional Observations & Component Health
            </label>
            <textarea
              rows={2}
              value={notes.additionalObservations}
              onChange={e => setNotes({ ...notes, additionalObservations: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
                4. Recommended Maintenance Routine
              </label>
              <input
                type="text"
                value={notes.recommendedMaintenance}
                onChange={e => setNotes({ ...notes, recommendedMaintenance: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
                5. Next Maintenance Date
              </label>
              <input
                type="date"
                value={notes.nextServiceDate}
                onChange={e => setNotes({ ...notes, nextServiceDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button variant="primary" type="submit">
              Save Technical Service Notes
            </Button>
          </div>
        </form>
      )}

      {/* TAB 4: SERVICE COMPLETION PROOF (Unique Feature) */}
      {activeTab === 'proof' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--primary-50)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--primary-700)" />
              Service Completion Proof & Digital Warranty Stamp
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--primary-800)' }}>
              Capture photographic proof before and after work execution. This generates the permanent digital Service Passport report for customer verification and dispute protection.
            </p>
          </div>

          {/* Before & After Upload Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {/* BEFORE SERVICE */}
            <div style={{ background: 'var(--bg-surface)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    1. Before Service Inspection Proof
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Baseline condition on arrival</span>
                </div>
                <label style={{ cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'before')} style={{ display: 'none' }} />
                  <span className="badge badge-purple" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <Camera size={13} /> Add Photo
                  </span>
                </label>
              </div>

              {/* Photos List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                {proof.beforeImages.map(img => (
                  <div key={img.id} style={{ display: 'flex', gap: '12px', background: 'var(--bg-muted)', padding: '10px', borderRadius: 'var(--radius-sm)', alignItems: 'center' }}>
                    <img src={img.dataUrl} alt={img.title} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{img.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{img.time}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProofImage('before', img.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Baseline Condition Notes</label>
                <textarea
                  rows={2}
                  value={proof.beforeNotes}
                  onChange={e => setProof({ ...proof, beforeNotes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            {/* AFTER SERVICE */}
            <div style={{ background: 'var(--bg-surface)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    2. After Service Verification Proof
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completed work & verified metrics</span>
                </div>
                <label style={{ cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'after')} style={{ display: 'none' }} />
                  <span className="badge badge-purple" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <Camera size={13} /> Add Photo
                  </span>
                </label>
              </div>

              {/* Photos List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                {proof.afterImages.map(img => (
                  <div key={img.id} style={{ display: 'flex', gap: '12px', background: 'var(--bg-muted)', padding: '10px', borderRadius: 'var(--radius-sm)', alignItems: 'center' }}>
                    <img src={img.dataUrl} alt={img.title} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{img.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{img.time}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProofImage('after', img.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Post-Service Metrics & Result</label>
                <textarea
                  rows={2}
                  value={proof.afterNotes}
                  onChange={e => setProof({ ...proof, afterNotes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.84rem' }}
                />
              </div>
            </div>
          </div>

          {/* Action to view / generate Completion Report */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="primary" onClick={() => setShowCompletionModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> Generate Official Service Completion Certificate
            </Button>
          </div>
        </div>
      )}

      {/* COMPLETION REPORT MODAL / CERTIFICATE (Unique Feature) */}
      {showCompletionModal && (
        <Modal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          title={`Digital Service Completion Passport · #${booking.bookingNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%)',
              color: '#fff',
              padding: '20px 24px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#e9d5ff', fontWeight: 700 }}>LOCALSERVE VERIFIED DIGITAL PASSPORT</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.3rem', color: '#fff' }}>{booking.serviceName}</h3>
                <span style={{ fontSize: '0.84rem', color: '#f3e8ff' }}>Client: {booking.customerName} · {booking.address}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success">30-Day Warranty Active</span>
              </div>
            </div>

            {/* Before vs After Visual Comparison */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.94rem', fontWeight: 800 }}>Before & After Proof Verification</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ border: '1px solid var(--border-light)', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-muted)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--danger)', display: 'block', marginBottom: '6px' }}>BEFORE SERVICE</span>
                  {proof.beforeImages[0] && (
                    <img src={proof.beforeImages[0].dataUrl} alt="Before" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                  )}
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{proof.beforeNotes}</p>
                </div>

                <div style={{ border: '1px solid var(--border-light)', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-muted)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', display: 'block', marginBottom: '6px' }}>AFTER SERVICE (RESTORED)</span>
                  {proof.afterImages[0] && (
                    <img src={proof.afterImages[0].dataUrl} alt="After" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                  )}
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{proof.afterNotes}</p>
                </div>
              </div>
            </div>

            {/* Diagnostics Summary */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>Work Performed Summary:</div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{notes.workPerformed}</div>
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>Next Recommended Service:</div>
              <div style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{notes.recommendedMaintenance} ({notes.nextServiceDate})</div>
            </div>

            {/* Sign-off Stamps */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '14px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>TECHNICIAN STAMP</span>
                <strong>{proof.technicianSignature}</strong>
                <div style={{ fontSize: '0.74rem', color: '#10b981' }}>✓ Digitally Signed & Stamped</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>CUSTOMER HANDOVER</span>
                <strong>{proof.customerSignature}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Verified via OTP / Handover</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={15} /> Print / Export PDF
              </Button>
              <Button variant="primary" onClick={() => setShowCompletionModal(false)}>
                Close Certificate
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobDetailsPage;

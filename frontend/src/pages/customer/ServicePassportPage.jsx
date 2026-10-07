import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { servicePassportService } from '../../services/servicePassportService';
import {
  FileCheck, ShieldCheck, Printer, CheckCircle2, Calendar, Clock,
  Wrench, Building2, User, ChevronRight, ArrowRight, RefreshCw,
  QrCode, AlertCircle, Award, CheckSquare, Sparkles, Phone, Eye
} from 'lucide-react';

export const ServicePassportPage = () => {
  const navigate = useNavigate();
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplianceId, setSelectedApplianceId] = useState('all');

  // Inspection Modal for viewing full proof certificate
  const [inspectEntry, setInspectEntry] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    servicePassportService.getPassportAppliances().then(data => {
      setAppliances(data);
      setLoading(false);
    });
  }, []);

  const totalEntries = appliances.reduce((acc, app) => acc + (app.serviceHistory?.length || 0), 0);

  const filteredAppliances = selectedApplianceId === 'all'
    ? appliances
    : appliances.filter(a => a.applianceId === selectedApplianceId);

  // BOOK AGAIN ACTION: Connects Previous Service -> Pre-filled Service -> Select Provider -> Select Date/Time -> Confirm
  const handleBookAgain = (entry, appliance) => {
    const params = new URLSearchParams({
      mode: 'book-again',
      serviceId: entry.serviceId || 'srv-3',
      providerName: entry.shopName,
      appliance: appliance.applianceName,
      previousBooking: entry.bookingNumber,
      lastDate: entry.serviceDate,
      nextSuggestedDate: entry.nextMaintenanceDate
    });
    navigate(`/booking/${entry.serviceId || 'srv-3'}?${params.toString()}`);
  };

  const handleOpenCertificate = (entry, appliance) => {
    setInspectEntry({ ...entry, applianceName: appliance.applianceName, model: appliance.model });
    setShowCertificateModal(true);
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <Breadcrumb items={[{ label: 'Service Passport' }]} />

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                IMMUTABLE SERVICE LOGBOOK
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Digital Service Passport
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: '4px 0 0 0' }}>
              Permanent verified record of appliance overhauls, technician diagnostics, warranty coverage, and automated maintenance cycles.
            </p>
          </div>

          <Button variant="secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} /> Print Passport Logbook
          </Button>
        </div>

        {/* Identification Passport Card (Gold/Purple Theme) */}
        <div style={{
          background: 'linear-gradient(135deg, #2e1065 0%, var(--primary-800) 50%, #4c1d95 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={24} color="#fde68a" />
              </div>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.5px' }}>LOCALSERVE APPLIANCE SERVICE PASSPORT</span>
                <span style={{ display: 'block', fontSize: '0.74rem', color: '#e9d5ff' }}>Verified Customer Asset Identification Document</span>
              </div>
            </div>
            <span style={{ fontSize: '0.76rem', background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: 'var(--radius-full)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> CERTIFIED IMMUTABLE LOG
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Passport Serial #</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.5px' }}>PASSPORT-TNV-2026-081</span>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Card Holder</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Rahul Sharma</span>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Registered Appliances</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{appliances.length} Registered Units</span>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Verified Overhauls</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a7f3d0' }}>{totalEntries} Completed Services</span>
            </div>
          </div>
        </div>

        {/* Hierarchical Structure: Customer -> Appliance -> Service History -> Maintenance Schedule */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Select Appliance / Service Track:
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Structure: Customer → Appliance → Service History → Maintenance Schedule
            </span>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            <button
              onClick={() => setSelectedApplianceId('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: selectedApplianceId === 'all' ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: selectedApplianceId === 'all' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              All Appliances ({appliances.length})
            </button>
            {appliances.map(app => (
              <button
                key={app.applianceId}
                onClick={() => setSelectedApplianceId(app.applianceId)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedApplianceId === app.applianceId ? 'var(--primary-600)' : 'var(--bg-muted)',
                  color: selectedApplianceId === app.applianceId ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {app.applianceName}
              </button>
            ))}
          </div>
        </div>

        {/* Appliance Blocks with Complete Service Passport Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filteredAppliances.map(app => (
            <div
              key={app.applianceId}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* 1. Appliance Header */}
              <div style={{
                background: 'var(--bg-muted)',
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {app.applianceName}
                    </h2>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{app.currentHealthScore}</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Location: <strong>{app.locationInHouse}</strong> · Model: <strong>{app.model}</strong> · QR Code: <code>{app.qrCodeId}</code>
                  </div>
                </div>

                {/* 2. Associated Maintenance Schedule Block */}
                {app.maintenanceSchedule && (
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--primary-200)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                        NEXT SCHEDULED MAINTENANCE ({app.maintenanceSchedule.interval})
                      </span>
                      <strong style={{ fontSize: '0.96rem', color: 'var(--primary-700)' }}>
                        {app.maintenanceSchedule.nextServiceDate}
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
                        {app.maintenanceSchedule.reminderStatus}
                      </span>
                    </div>

                    {/* Book Again Trigger */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBookAgain(app.serviceHistory[0], app)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                    >
                      <RefreshCw size={13} /> Book Again
                    </Button>
                  </div>
                )}
              </div>

              {/* 3. Service History: Mandatory Fields for Every Completed Service */}
              <div style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={16} color="var(--primary-600)" />
                  Chronological Overhaul History ({app.serviceHistory?.length || 0} Records)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {app.serviceHistory.map(entry => (
                    <div
                      key={entry.historyId}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {/* Entry Top Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.12rem', color: 'var(--text-primary)' }}>
                              {entry.serviceName}
                            </span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              {entry.bookingNumber}
                            </span>
                            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                              <CheckCircle2 size={12} /> Work Verified
                            </span>
                          </div>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                            Service Completed on <strong>{entry.serviceDate}</strong>
                          </span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-700)' }}>
                            ₹{entry.amount}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.76rem', color: '#10b981', fontWeight: 700 }}>
                            {entry.warranty}
                          </span>
                        </div>
                      </div>

                      {/* 11 Mandatory Fields Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '10px',
                        fontSize: '0.84rem',
                        background: 'var(--bg-muted)',
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', fontWeight: 700 }}>PROVIDER LEAD</span>
                          <strong>{entry.providerName}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', fontWeight: 700 }}>COMMERCIAL SHOP</span>
                          <strong>{entry.shopName}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', fontWeight: 700 }}>CERTIFIED TECHNICIAN</span>
                          <strong>{entry.technicianName}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', fontWeight: 700 }}>NEXT MAINTENANCE</span>
                          <strong style={{ color: 'var(--primary-700)' }}>{entry.nextMaintenanceDate} ({entry.maintenanceInterval})</strong>
                        </div>
                      </div>

                      {/* Work Completed */}
                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                          Work Completed:
                        </span>
                        <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {entry.workCompleted}
                        </p>
                      </div>

                      {/* Checklist */}
                      {entry.checklist && entry.checklist.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                            Quality SOP Checklist ({entry.checklist.length} Passed):
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {entry.checklist.map((chk, i) => (
                              <span key={i} style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '3px 9px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={12} color="#10b981" /> {chk.item || chk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Notes */}
                      {entry.notes && (
                        <div style={{ background: 'var(--primary-50)', borderLeft: '3px solid var(--primary-600)', padding: '10px 14px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.84rem', color: 'var(--primary-900)' }}>
                          <strong>Technician Diagnostic Notes:</strong> "{entry.notes}"
                        </div>
                      )}

                      {/* Entry Bottom Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                        <Button variant="outline" size="sm" onClick={() => handleOpenCertificate(entry, app)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye size={14} /> View Stamped Certificate
                        </Button>

                        {/* BOOK AGAIN BUTTON: Complete flow trigger */}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookAgain(entry, app)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <RefreshCw size={14} /> Book Again for Next Maintenance
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CERTIFICATE MODAL */}
        {showCertificateModal && inspectEntry && (
          <Modal
            isOpen={showCertificateModal}
            onClose={() => setShowCertificateModal(false)}
            title={`Certified Service Passport · #${inspectEntry.bookingNumber}`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%)',
                color: '#fff',
                padding: '20px 24px',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ fontSize: '0.74rem', color: '#e9d5ff', fontWeight: 700 }}>LOCALSERVE IMMUTABLE PASSPORT LOG</span>
                <h3 style={{ margin: '4px 0 2px 0', fontSize: '1.25rem', color: '#fff' }}>{inspectEntry.applianceName}</h3>
                <span style={{ fontSize: '0.82rem', color: '#f3e8ff' }}>{inspectEntry.serviceName} · Completed on {inspectEntry.serviceDate}</span>
              </div>

              {/* Before & After Proof Photos */}
              {inspectEntry.proofPhotos && (
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 800 }}>Before & After Proof Verification</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'var(--bg-muted)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--danger)', display: 'block', marginBottom: '4px' }}>BEFORE SERVICE</span>
                      <img src={inspectEntry.proofPhotos.before} alt="Before" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px' }} />
                    </div>
                    <div style={{ background: 'var(--bg-muted)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', display: 'block', marginBottom: '4px' }}>AFTER SERVICE (RESTORED)</span>
                      <img src={inspectEntry.proofPhotos.after} alt="After" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'var(--bg-muted)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 800, marginBottom: '2px' }}>Work Completed:</div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{inspectEntry.workCompleted}</div>

                <div style={{ fontWeight: 800, marginBottom: '2px' }}>Technician Diagnostic Notes:</div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{inspectEntry.notes}</div>

                <div style={{ fontWeight: 800, marginBottom: '2px' }}>Maintenance Interval & Next Due Date:</div>
                <div style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
                  Every {inspectEntry.maintenanceInterval} · Due on {inspectEntry.nextMaintenanceDate}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>TECHNICIAN STAMP</span>
                  <strong>{inspectEntry.technicianName}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#10b981' }}>✓ Certified Inspection</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>WORKSHOP REGISTRATION</span>
                  <strong>{inspectEntry.shopName}</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Authorized Service Depot</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <Button variant="secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Printer size={15} /> Print Certificate
                </Button>
                <Button variant="primary" onClick={() => setShowCertificateModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ServicePassportPage;

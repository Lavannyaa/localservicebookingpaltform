import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { servicePassportService } from '../../services/servicePassportService';
import { useServices, useProviders } from '../../hooks';
import {
  Clock, Calendar, ShieldCheck, Plus, CheckCircle2, RefreshCw,
  Bell, AlertCircle, ArrowRight, Wrench, Building2, History, Check
} from 'lucide-react';

export const MaintenancePage = () => {
  const navigate = useNavigate();
  const { services } = useServices(true);
  const { providers } = useProviders(true);

  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, history
  const [schedules, setSchedules] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Maintenance Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newApplianceName, setNewApplianceName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [intervalMonths, setIntervalMonths] = useState(3);
  const [lastDate, setLastDate] = useState(new Date().toISOString().split('T')[0]);
  const [notification, setNotification] = useState('');

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const loadData = () => {
    Promise.all([
      servicePassportService.getMaintenanceSchedules(),
      servicePassportService.getPassportAppliances()
    ]).then(([schedList, appList]) => {
      setSchedules(schedList);
      setAppliances(appList);
      if (services.length > 0 && !selectedServiceId) {
        setSelectedServiceId(services[0].serviceId);
      }
      if (providers.length > 0 && !selectedProviderId) {
        setSelectedProviderId(providers[0].providerId);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [services, providers]);

  // BOOK AGAIN FLOW: Connects Previous Service -> Book Again -> Pre-filled Service -> Select Provider -> Select Date/Time -> Confirm
  const handleBookAgain = (schedule) => {
    const params = new URLSearchParams({
      mode: 'book-again',
      serviceId: schedule.serviceId || 'srv-3',
      providerId: schedule.providerId || 'prov-2',
      providerName: schedule.shopName,
      appliance: schedule.appliance,
      lastDate: schedule.lastServiceDate,
      nextSuggestedDate: schedule.nextServiceDate
    });
    navigate(`/booking/${schedule.serviceId || 'srv-3'}?${params.toString()}`);
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const srv = services.find(s => s.serviceId === selectedServiceId) || services[0];
    const prov = providers.find(p => p.providerId === selectedProviderId) || providers[0];

    await servicePassportService.recordCompletedService({
      serviceId: srv.serviceId,
      serviceName: srv.serviceName,
      applianceName: newApplianceName || srv.serviceName,
      providerName: prov.ownerName,
      shopName: prov.shopName,
      technicianName: 'To be assigned on dispatch',
      serviceDate: lastDate,
      workCompleted: `Scheduled recurring maintenance initialized for ${newApplianceName || srv.serviceName}.`,
      amount: srv.basePrice || 799,
      maintenanceIntervalMonths: intervalMonths
    });

    setModalOpen(false);
    setNewApplianceName('');
    showNotice(`New ${intervalMonths}-month maintenance cycle initialized successfully!`);
    loadData();
  };

  // Compile Maintenance History entries from all appliances
  const maintenanceHistory = [];
  appliances.forEach(app => {
    (app.serviceHistory || []).forEach(hist => {
      maintenanceHistory.push({
        ...hist,
        applianceName: app.applianceName,
        locationInHouse: app.locationInHouse
      });
    });
  });

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <Breadcrumb items={[{ label: 'Maintenance Module' }]} />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                AUTOMATED APPLIANCE UPKEEP
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Preventive Maintenance Scheduler
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: '4px 0 0 0' }}>
              Automated service intervals, reminder alerts, and seamless one-click <strong>Book Again</strong> recurring upkeep.
            </p>
          </div>

          <Button variant="primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Schedule Appliance Plan
          </Button>
        </div>

        {notification && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <Check size={18} /> {notification}
          </div>
        )}

        {/* Lifecycle Explanation Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-50) 0%, #f5f3ff 100%)',
          border: '1px solid var(--primary-200)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.96rem', fontWeight: 800, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={18} color="var(--primary-600)" />
            COMPLETE CLOSED-LOOP LIFECYCLE BEYOND CRUD:
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.86rem',
            color: 'var(--primary-800)',
            fontWeight: 700
          }}>
            <span>1. Booking Completed</span>
            <span>→</span>
            <span>2. Service Passport Entry</span>
            <span>→</span>
            <span>3. Maintenance Scheduled</span>
            <span>→</span>
            <span>4. Timely Notification Sent</span>
            <span>→</span>
            <span>5. One-Click Book Again</span>
          </div>
        </div>

        {/* Tabs: Upcoming Maintenance vs Maintenance History */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '2px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'upcoming' ? 800 : 600,
              color: activeTab === 'upcoming' ? 'var(--primary-700)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'upcoming' ? '3px solid var(--primary-600)' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            Upcoming Maintenance ({schedules.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'history' ? 800 : 600,
              color: activeTab === 'history' ? 'var(--primary-700)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'history' ? '3px solid var(--primary-600)' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            Maintenance History ({maintenanceHistory.length})
          </button>
        </div>

        {/* TAB 1: UPCOMING MAINTENANCE */}
        {activeTab === 'upcoming' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {schedules.map(item => {
              const isDueSoon = (item.status || '').toLowerCase().includes('due') || (item.reminderStatus || '').toLowerCase().includes('due in');

              return (
                <Card
                  key={item.scheduleId}
                  hoverable
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isDueSoon ? '2px solid #f59e0b' : '1px solid var(--border-light)',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>
                        {item.interval} Interval
                      </span>
                      <StatusBadge status={item.status || 'Active'} />
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                      {item.appliance}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--primary-700)', fontWeight: 600, margin: '0 0 14px 0' }}>
                      {item.serviceName}
                    </p>

                    {/* Metadata Box with Next Service Date & Reminder Status */}
                    <div style={{
                      background: 'var(--bg-muted)',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.84rem',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Assigned Workshop:</span>
                        <strong>{item.shopName}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Last Serviced:</span>
                        <span>{item.lastServiceDate}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Next Service Date:</span>
                        <strong style={{ color: isDueSoon ? '#d97706' : 'var(--primary-700)', fontSize: '0.94rem' }}>
                          {item.nextServiceDate}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: isDueSoon ? '#b45309' : 'var(--primary-700)', marginTop: '2px' }}>
                        <Bell size={13} /> {item.reminderStatus}
                      </div>
                    </div>
                  </div>

                  {/* BOOK AGAIN BUTTON: Connects previous service into pre-filled checkout */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Retain 30-day warranty
                    </span>

                    <Button
                      variant={isDueSoon ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleBookAgain(item)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RefreshCw size={14} /> Book Again
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* TAB 2: MAINTENANCE HISTORY */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {maintenanceHistory.map(entry => (
              <div
                key={entry.historyId}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '22px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {entry.applianceName}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {entry.bookingNumber}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} /> Executed & Verified
                    </span>
                  </div>

                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    {entry.serviceName} · Workshop: <strong>{entry.shopName}</strong> · Tech: <strong>{entry.technicianName}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Serviced on {entry.serviceDate} · Next Due: <strong style={{ color: 'var(--primary-700)' }}>{entry.nextMaintenanceDate}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-700)' }}>₹{entry.amount}</span>
                    <span style={{ display: 'block', fontSize: '0.74rem', color: '#10b981' }}>{entry.warranty}</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBookAgain({
                      serviceId: entry.serviceId,
                      shopName: entry.shopName,
                      appliance: entry.applianceName,
                      lastServiceDate: entry.serviceDate,
                      nextServiceDate: entry.nextMaintenanceDate
                    })}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={13} /> Book Again
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL: SCHEDULE NEW APPLIANCE MAINTENANCE */}
        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Schedule Appliance Recurring Maintenance Plan"
          >
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Appliance Name & Room *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Daikin Inverter AC (Living Room) or Kent RO (Kitchen)"
                  value={newApplianceName}
                  onChange={e => setNewApplianceName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Service Catalog Item *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={e => setSelectedServiceId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                  >
                    {services.slice(0, 15).map(s => (
                      <option key={s.serviceId} value={s.serviceId}>{s.serviceName} (₹{s.basePrice})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Preferred Workshop *
                  </label>
                  <select
                    value={selectedProviderId}
                    onChange={e => setSelectedProviderId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                  >
                    {providers.map(p => (
                      <option key={p.providerId} value={p.providerId}>{p.shopName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Recurring Maintenance Interval *
                  </label>
                  <select
                    value={intervalMonths}
                    onChange={e => setIntervalMonths(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                  >
                    <option value={1}>1 Month (Monthly Upkeep)</option>
                    <option value={3}>3 Months (Quarterly Standard - Recommended for AC/RO)</option>
                    <option value={6}>6 Months (Bi-annual - Recommended for Inverter/Tanks)</option>
                    <option value={12}>12 Months (Annual Complete Overhaul)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Baseline Service Date
                  </label>
                  <input
                    type="date"
                    value={lastDate}
                    onChange={e => setLastDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Initialize Maintenance Plan</Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;

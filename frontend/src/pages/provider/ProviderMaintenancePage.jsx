import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { Button } from '../../components/common/Button';
import { Calendar, Clock, CheckCircle2, AlertCircle, RefreshCw, User, ShieldCheck } from 'lucide-react';

export const ProviderMaintenancePage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maintenanceService.getMaintenancePlans().then(data => {
      setPlans(data);
      setLoading(false);
    });
  }, []);

  const handleRenew = (id) => {
    maintenanceService.updateMaintenanceStatus(id, 'Scheduled').then(updated => {
      setPlans(prev => prev.map(p => p.maintId === id ? updated : p));
      alert("Annual Maintenance Service Visit Scheduled successfully!");
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Annual Maintenance Contracts (AMC)
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Monitor recurring contracts, scheduled visits, and warranty renewals for Kumar Electricals clients.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {plans.map(p => {
          const isDue = p.status === 'Due Soon';
          return (
            <div key={p.maintId} style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: isDue ? '1px solid #f59e0b' : '1px solid var(--border-light)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className={`badge ${isDue ? 'badge-warning' : 'badge-success'}`}>
                    {p.status}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {p.frequency} Plan
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  {p.appliance}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                  {p.serviceName}
                </p>

                <div style={{ background: 'var(--bg-muted)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Tech:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{p.technicianName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Last Serviced:</span>
                    <span>{p.lastServiceDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Next Due Date:</span>
                    <strong style={{ color: isDue ? '#d97706' : 'var(--text-primary)' }}>{p.nextServiceDate}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <ShieldCheck size={16} /> {p.warranty}
                </div>
              </div>

              <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                <Button
                  variant={isDue ? 'primary' : 'secondary'}
                  size="sm"
                  style={{ width: '100%' }}
                  onClick={() => handleRenew(p.maintId)}
                >
                  <RefreshCw size={14} /> Schedule Service Visit
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderMaintenancePage;

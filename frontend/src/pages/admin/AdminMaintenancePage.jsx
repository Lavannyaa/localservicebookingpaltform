import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { Button } from '../../components/common/Button';
import { Clock, ShieldCheck, RefreshCw } from 'lucide-react';

export const AdminMaintenancePage = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    maintenanceService.getMaintenancePlans().then(setPlans);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Annual Maintenance Contracts (AMC) Governance
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Overview of active recurring maintenance subscriptions and SLA compliance.
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px 18px' }}>Appliance / Unit</th>
              <th style={{ padding: '14px 18px' }}>Maintenance Service</th>
              <th style={{ padding: '14px 18px' }}>Workshop</th>
              <th style={{ padding: '14px 18px' }}>Frequency</th>
              <th style={{ padding: '14px 18px' }}>Next Due</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Warranty</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p.maintId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 700 }}>{p.appliance}</td>
                <td style={{ padding: '14px 18px' }}>{p.serviceName}</td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem' }}>{p.providerName}</td>
                <td style={{ padding: '14px 18px' }}>{p.frequency}</td>
                <td style={{ padding: '14px 18px', fontWeight: 600 }}>{p.nextServiceDate}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge ${p.status === 'Due Soon' ? 'badge-warning' : 'badge-success'}`}>{p.status}</span>
                </td>
                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{p.warranty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMaintenancePage;

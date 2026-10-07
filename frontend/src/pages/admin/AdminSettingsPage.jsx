import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Settings, Shield, IndianRupee, Check } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [platformFee, setPlatformFee] = useState(49);
  const [commissionRate, setCommissionRate] = useState(10);
  const [gstRate, setGstRate] = useState(18);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Platform Governance Parameters
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Configure fixed booking fees, commission splits, and security parameters.
        </p>
      </div>

      {saved && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '14px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          Platform fee parameters updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Fee Architecture</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Fixed Platform Fee (₹)</label>
            <input
              type="number"
              value={platformFee}
              onChange={e => setPlatformFee(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Workshop Commission Rate (%)</label>
            <input
              type="number"
              value={commissionRate}
              onChange={e => setCommissionRate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Applicable GST (%)</label>
            <input
              type="number"
              value={gstRate}
              onChange={e => setGstRate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <Button variant="primary" type="submit">Update Platform Governance Parameters</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;

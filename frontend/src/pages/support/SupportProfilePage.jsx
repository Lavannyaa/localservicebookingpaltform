import React from 'react';
import { User, Headphones, ShieldCheck, Mail, Phone } from 'lucide-react';

export const SupportProfilePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Support Officer Credentials
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Officer profile and dispute mediation authority clearance.
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headphones size={30} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Ananya Deshmukh</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Senior Dispute Resolution Officer · Operations Command
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '0.88rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Staff ID</div>
            <div style={{ fontWeight: 700 }}>SUPP-OPS-402</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Clearance</div>
            <div style={{ fontWeight: 700 }}>Tier-2 Escalation & Refund Authority</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Contact</div>
            <div style={{ fontWeight: 700 }}>support@localserve.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportProfilePage;

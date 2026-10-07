import React from 'react';
import { User, HardHat, Award, ShieldCheck, Phone, Mail, Building2 } from 'lucide-react';

export const TechProfilePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Field Technician Credential Profile
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Professional certifications, workshop affiliation, and service rating badge.
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HardHat size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>S. Murugan</h2>
              <span className="badge badge-success">Active Field Tech</span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Senior HVAC & Refrigeration Technician · 8 Years Field Experience
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', fontSize: '0.88rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Technician ID</div>
            <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>TECH-HVAC-1092</div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Assigned Workshop</div>
            <div style={{ fontWeight: 700 }}>FrostTech AC Solutions</div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Primary Phone</div>
            <div style={{ fontWeight: 700 }}>+91 98421 99001</div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>License Certification</div>
            <div style={{ fontWeight: 700 }}>Grade-A Wireman & Refrigeration Cert</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechProfilePage;

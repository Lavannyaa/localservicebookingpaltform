import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { ShieldCheck, Award, Building2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <Breadcrumb items={[{ label: 'About Us' }]} />

          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '10px' }}>COMMERCIAL EXCELLENCE</span>
            <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              About LocalServe
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Standardizing local repair, maintenance, and technical services across Indian metropolitan hubs.
            </p>
          </div>

          <Card style={{ padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)', marginBottom: '12px' }}>
              Our Commercial Guarantee
            </h3>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              Unlike unvetted freelance portals, LocalServe works exclusively with established business workshops and commercial repair centers. Each provider operates a verifiable physical shop with specialized diagnostic tools, experienced technicians, and itemized invoice accountability.
            </p>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              From AC jet washing in Tirunelveli and plumbing overhauls in Chennai to turnkey civil construction in Bengaluru, LocalServe guarantees transparency, reliability, and peace of mind.
            </p>
          </Card>
        </div>
      </div>
  );
};

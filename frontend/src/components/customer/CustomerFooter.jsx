import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, Award, Phone, Mail } from 'lucide-react';

export const CustomerFooter = () => {
  return (
    <footer style={{ background: '#111827', color: '#f3f4f6', paddingTop: '50px', paddingBottom: '30px', marginTop: 'auto', borderTop: '1px solid #1f2937' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Wrench size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>LocalServe</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '16px' }}>
              LocalServe connects neighbourhoods with verified commercial repair workshops, certified trade specialists, and structured digital service tracking.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: '#9ca3af' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="var(--primary-400)" /> 1800-425-9988 (Toll Free)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color="var(--primary-400)" /> support@localserve.com</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: 700, marginBottom: '14px' }}>Core Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#9ca3af' }}>
              <Link to="/services?category=AC%20%26%20Appliances" style={{ color: 'inherit' }}>AC & Refrigeration</Link>
              <Link to="/services?category=Electrical" style={{ color: 'inherit' }}>Electrical Wiring & Repairs</Link>
              <Link to="/services?category=Plumbing" style={{ color: 'inherit' }}>Plumbing & Pipe Leakage</Link>
              <Link to="/services?category=Cleaning" style={{ color: 'inherit' }}>Deep Home Sanitization</Link>
              <Link to="/services?category=Construction" style={{ color: 'inherit' }}>Masonry & Waterproofing</Link>
              <Link to="/services?category=Vehicle%20Services" style={{ color: 'inherit' }}>Doorstep Auto & Towing</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: 700, marginBottom: '14px' }}>Customer Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#9ca3af' }}>
              <Link to="/service-passport" style={{ color: 'inherit' }}>Digital Service Passport</Link>
              <Link to="/maintenance" style={{ color: 'inherit' }}>Preventive Maintenance</Link>
              <Link to="/nearby-providers" style={{ color: 'inherit' }}>Nearby Provider Shops</Link>
              <Link to="/help-support" style={{ color: 'inherit' }}>Help & Support / FAQs</Link>
              <Link to="/about" style={{ color: 'inherit' }}>About LocalServe</Link>
              <Link to="/contact" style={{ color: 'inherit' }}>Contact Office</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: 700, marginBottom: '14px' }}>Platform Guarantees</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: '#9ca3af' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>Verified Business Workshops</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#10b981" />
                <span>On-Time Arrival Guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#10b981" />
                <span>30-Day Work Warranty</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem', color: '#6b7280' }}>
          <span>© 2026 LocalServe Technologies Inc. All rights reserved.</span>
          <span>Made for Tirunelveli, Chennai, Bengaluru, Madurai & Metropolitan Hubs.</span>
        </div>
      </div>
    </footer>
  );
};

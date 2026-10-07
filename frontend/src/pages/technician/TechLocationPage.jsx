import React from 'react';
import { Button } from '../../components/common/Button';
import { MapPin, Navigation, Compass, Phone, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TechLocationPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Job Site Navigation & Route
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time GPS direction guidance to customer site in Vannarpettai, Tirunelveli.
        </p>
      </div>

      {/* Map Card */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{
          height: '380px',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          position: 'relative',
          padding: '24px'
        }}>
          {/* Animated Route simulation */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={28} color="#fff" />
            </div>
          </div>

          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 800 }}>En Route to Customer Site</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Flat 402, Green Valley Apartments, Vannarpettai, Tirunelveli
          </p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', background: 'rgba(255,255,255,0.08)', padding: '12px 24px', borderRadius: '30px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a78bfa' }}>Distance: 4.2 km</span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>ETA: 12 Mins</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Customer: Rahul Sharma</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>+91 98765 43210 · Landmark: Opp. District Library Gate</div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="tel:+919876543210" style={{ textDecoration: 'none' }}>
              <Button variant="secondary">
                <Phone size={16} /> Call Client
              </Button>
            </a>
            <Link to="/technician/checklist">
              <Button variant="primary">
                Arrived at Site <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechLocationPage;

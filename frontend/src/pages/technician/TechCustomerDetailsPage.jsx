import React from 'react';
import { Button } from '../../components/common/Button';
import {
  User, Phone, MapPin, Calendar, Clock, MessageSquare, Navigation, History
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TechCustomerDetailsPage = () => {
  const customer = {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'customer@localserve.com',
    address: 'Flat 402, Green Valley Apartments, Near Town Hall, Vannarpettai, Tirunelveli - 627003',
    landmark: 'Opposite District Library Gate',
    membership: 'LocalServe Gold Customer',
    previousServices: [
      { date: '2026-06-20', service: 'AC Gas Charging & Pressure Test', workshop: 'FrostTech AC Solutions' },
      { date: '2026-04-10', service: 'Inverter Battery Terminal Check', workshop: 'Kumar Electricals' }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Customer Service Dossier
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Customer details and equipment service history for current active booking.
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
              RS
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{customer.name}</h2>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{customer.membership}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a href={`tel:${customer.phone}`} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm">
                <Phone size={14} /> Call Customer
              </Button>
            </a>
            <Link to="/technician/location">
              <Button variant="secondary" size="sm">
                <Navigation size={14} /> Navigate
              </Button>
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone Number</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary-700)' }}>{customer.phone}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivery / Job Address</div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{customer.address}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Key Landmark</div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{customer.landmark}</div>
          </div>
        </div>

        {/* Appliance Service History */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800 }}>Past Equipment Service Passport History</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {customer.previousServices.map((s, idx) => (
              <div key={idx} style={{ padding: '12px 16px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.service}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Workshop: {s.workshop}</div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{s.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechCustomerDetailsPage;

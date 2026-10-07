import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Calendar, Clock, MapPin, CheckCircle2, ChevronLeft, ChevronRight,
  Navigation, ArrowRight, User, Building2, Phone, Briefcase
} from 'lucide-react';

export const SchedulePage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Today, Sep 29, 2026');

  const slots = [
    {
      id: 'BK-1001',
      time: '09:00 AM - 10:30 AM',
      job: 'AC Jet Wash & Comprehensive Service',
      category: 'AC & Appliances',
      customer: 'Rahul Sharma',
      phone: '+91 98765 43210',
      address: 'Flat 402, Green Valley Apts, Vannarpettai, Tirunelveli',
      status: 'Service Started',
      provider: 'FrostTech AC Solutions',
      notes: 'Water dripping from indoor blower unit.'
    },
    {
      id: 'BK-1002',
      time: '11:30 AM - 01:00 PM',
      job: 'RO Water Purifier Membrane & Sediment Filter Replacement',
      category: 'AC & Appliances',
      customer: 'Priya Sundaram',
      phone: '+91 98421 88412',
      address: '12 South Car Street, Palayamkottai, Tirunelveli',
      status: 'Accepted',
      provider: 'Kumar Electricals',
      notes: 'Filter replacement alert blinking on Kent Grand Plus.'
    },
    {
      id: 'BK-1003',
      time: '02:30 PM - 04:00 PM',
      job: 'Inverter & Tubular Battery Inspection',
      category: 'Electrical',
      customer: 'M. Ganesh',
      phone: '+91 94431 22910',
      address: '88 High Ground Road, Tirunelveli Junction',
      status: 'Assigned',
      provider: 'Kumar Electricals',
      notes: 'Frequent tripping during grid power cut.'
    },
    {
      id: 'BK-1004',
      time: '04:30 PM - 06:00 PM',
      job: 'Buffer / Travel & Spare Part Procurement',
      category: 'Operations',
      customer: 'FrostTech Workshop Depot',
      phone: '+91 94431 88920',
      address: '18 North Bypass Road, Vannarpettai, Tirunelveli',
      status: 'Scheduled',
      provider: 'FrostTech AC Solutions',
      notes: 'Inventory restock: R32 refrigerant canisters & 3.15uF capacitors.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Today's Field Duty Schedule
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Chronological timeline of daily appointments, customer locations, and transit buffers for technician S. Murugan.
        </p>
      </div>

      {/* Date Switcher */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={20} color="var(--primary-600)" />
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{selectedDay}</span>
          <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>4 SLOTS ASSIGNED</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button style={{ padding: '6px 12px', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {slots.map((s, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: s.status === 'Service Started' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
              borderLeft: s.status === 'Service Started' ? '6px solid var(--primary-600)' : '4px solid var(--border-medium)',
              padding: '22px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '18px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flex: 1, minWidth: '300px' }}>
              <div style={{
                background: 'var(--primary-50)',
                color: 'var(--primary-800)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}>
                <Clock size={15} /> {s.time}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {s.job}
                  </span>
                  <StatusBadge status={s.status} />
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} color="var(--primary-600)" /> {s.customer} ({s.phone})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--primary-600)" /> {s.address}
                  </span>
                </div>

                {s.notes && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                    Note: "{s.notes}"
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link to="/technician/location">
                <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={14} /> GPS Route
                </Button>
              </Link>
              <Link to={`/technician/jobs/${s.id}`}>
                <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Open Job <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;

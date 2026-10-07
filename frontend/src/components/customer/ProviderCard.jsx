import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RatingStars } from '../common/RatingStars';
import { StatusBadge } from '../common/StatusBadge';
import { Building2, MapPin, Clock, Award, ShieldCheck } from 'lucide-react';

export const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '22px'
      }}
    >
      <div>
        {/* Workshop Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid var(--primary-200)',
            flexShrink: 0
          }}>
            <Building2 size={26} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
              <h3
                onClick={() => navigate(`/providers/${provider.providerId}`)}
                style={{
                  fontSize: '1.12rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {provider.shopName}
              </h3>
              <StatusBadge status={provider.availability || 'Available'} />
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600, display: 'block' }}>
              {provider.specialization}
            </span>
          </div>
        </div>

        {/* Metadata Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <MapPin size={14} color="var(--primary-600)" />
            <span>{provider.location} ({provider.distance || '1.5 km'} away)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Clock size={14} color="var(--primary-600)" />
            <span>{provider.workingHours || '08:00 AM - 08:30 PM'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Award size={14} color="var(--primary-600)" />
            <span>{provider.experience || '12+ Years'} Commercial Experience</span>
          </div>
        </div>

        {/* Services Offered Tags */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '6px' }}>
            Services Offered:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(provider.servicesOffered || []).slice(0, 4).map((srv, i) => (
              <span key={i} style={{ background: 'var(--bg-muted)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {srv}
              </span>
            ))}
            {(provider.servicesOffered || []).length > 4 && (
              <span style={{ fontSize: '0.76rem', color: 'var(--primary-600)', fontWeight: 700, alignSelf: 'center' }}>
                +{provider.servicesOffered.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <RatingStars rating={provider.rating || 4.8} reviewCount={provider.reviewCount || 120} size={15} />
          <span style={{ fontSize: '0.78rem', color: 'var(--success-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={15} /> Certified Workshop
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Button variant="outline" size="sm" onClick={() => navigate(`/providers/${provider.providerId}`)}>
            View Shop
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate(`/services?providerId=${provider.providerId}`)}>
            View Services
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;

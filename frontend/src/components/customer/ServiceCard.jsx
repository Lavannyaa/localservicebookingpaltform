import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RatingStars } from '../common/RatingStars';
import { StatusBadge } from '../common/StatusBadge';
import { useFavorites } from '../../hooks';
import { Clock, Building2, Heart, ShieldCheck } from 'lucide-react';

export const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { favorites, toggleService } = useFavorites();
  const isFav = favorites?.services?.includes(service.serviceId);

  return (
    <Card
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        padding: '20px'
      }}
    >
      <div>
        {/* Top Header: Category & Favorite */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <span className="badge badge-purple">{service.category}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleService(service.serviceId);
            }}
            style={{
              background: isFav ? 'var(--danger-bg)' : 'var(--bg-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)'
            }}
            title={isFav ? "Remove from favorites" : "Save to favorites"}
            aria-label="Toggle favorite"
          >
            <Heart size={16} color={isFav ? 'var(--danger)' : 'var(--text-muted)'} fill={isFav ? 'var(--danger)' : 'none'} />
          </button>
        </div>

        {/* Service Title */}
        <h3
          onClick={() => navigate(`/services/${service.serviceId}`)}
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            lineHeight: 1.35,
            cursor: 'pointer'
          }}
        >
          {service.serviceName}
        </h3>

        {/* Short Description */}
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {service.description}
        </p>

        {/* Workshop Attribution Tag */}
        <div style={{
          background: 'var(--bg-muted)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px',
          fontSize: '0.82rem'
        }}>
          <Building2 size={15} color="var(--primary-600)" />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {service.providerName}
          </span>
        </div>

        {/* Rating and Duration */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
          <RatingStars rating={service.rating} reviewCount={service.reviewCount} size={14} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {service.estimatedDuration}
          </span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block' }}>
              Starting from
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-700)', lineHeight: 1.1 }}>
              ₹{service.basePrice}
            </div>
          </div>
          <StatusBadge status={service.availability || 'Available'} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Button variant="outline" size="sm" onClick={() => navigate(`/services/${service.serviceId}`)}>
            View Details
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate(`/booking/${service.serviceId}`)}>
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;

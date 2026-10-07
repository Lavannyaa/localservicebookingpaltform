import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RatingStars } from '../../components/common/RatingStars';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useProviders, useServices, useRecentlyAccessed } from '../../hooks';
import {
  Building2, MapPin, Clock, Award, ShieldCheck, Phone, Mail,
  CheckCircle2, Star, User
} from 'lucide-react';

export const ProviderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { providers, getProviders } = useProviders(true);
  const { services, getServices } = useServices(true);
  const { trackItem } = useRecentlyAccessed();

  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (providers.length > 0) {
      const found = providers.find(p => p.providerId === id) || providers[0];
      setProvider(found);

      // Track live access for customer
      trackItem({
        id: found.providerId,
        type: 'Provider',
        title: found.shopName,
        subtitle: found.specialization || found.location,
        path: `/providers/${found.providerId}`,
        badge: found.availability,
        rating: found.rating
      });
    }
  }, [id, providers, trackItem]);

  if (!provider) {
    return (
      <div style={{ flex: 1, padding: '60px 0' }}><LoadingSpinner message="Loading workshop profile..." /></div>
    );
  }

  const shopServices = services.filter(s => s.providerId === provider.providerId);

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container">
          <Breadcrumb items={[
            { label: 'Providers', path: '/providers' },
            { label: provider.shopName }
          ]} />

          {/* Shop Header Card */}
          <Card style={{ marginBottom: '32px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--primary-300)',
                flexShrink: 0
              }}>
                <Building2 size={40} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {provider.shopName}
                  </h1>
                  <span className="badge badge-success">
                    <ShieldCheck size={14} /> Verified Commercial Partner
                  </span>
                  <StatusBadge status={provider.availability} />
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', margin: '6px 0 14px 0' }}>
                  {provider.about}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)', background: 'var(--bg-muted)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div><strong>Owner / Manager:</strong> {provider.ownerName}</div>
                  <div><strong>Trade Specialization:</strong> {provider.specialization}</div>
                  <div><strong>Location:</strong> {provider.location}</div>
                  <div><strong>Coverage Radius:</strong> {provider.serviceArea}</div>
                  <div><strong>Business Hours:</strong> {provider.workingHours}</div>
                  <div><strong>Experience:</strong> {provider.experience}</div>
                  <div><strong>License Reg:</strong> {provider.licenseNo}</div>
                  <div><strong>Helpline:</strong> {provider.phone}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Services Offered By This Workshop */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>
              Standardized Services by {provider.shopName} ({shopServices.length})
            </h3>

            {shopServices.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No standalone catalog services assigned.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '22px' }}>
                {shopServices.map((service) => (
                  <ServiceCard key={service.serviceId} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

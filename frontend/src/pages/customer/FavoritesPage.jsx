import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { ProviderCard } from '../../components/customer/ProviderCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useFavorites, useServices, useProviders } from '../../hooks';
import { Heart } from 'lucide-react';

export const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { services } = useServices(true);
  const { providers } = useProviders(true);

  const favServices = services.filter(s => favorites.services.includes(s.serviceId));
  const favProviders = providers.filter(p => favorites.providers.includes(p.providerId));

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Saved Favorites' }]} />

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
              My Favorite Services & Shops
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Quickly rebook preferred technicians and keep trusted neighbourhood shops saved for easy access.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={20} color="#ef4444" fill="#ef4444" />
              Saved Services ({favServices.length})
            </h3>
            {favServices.length === 0 ? (
              <EmptyState title="No saved services" description="Click the heart icon on any service card to save it for rapid one-click booking." />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '22px' }}>
                {favServices.map(s => (<ServiceCard key={s.serviceId} service={s} />))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Saved Workshop Partners ({favProviders.length})
            </h3>
            {favProviders.length === 0 ? (
              <EmptyState title="No saved provider shops" description="Save your favorite workshops to contact them directly whenever repairs arise." />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
                {favProviders.map(p => (<ProviderCard key={p.providerId} provider={p} />))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

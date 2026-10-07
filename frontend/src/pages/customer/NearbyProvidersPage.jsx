import React, { useState } from 'react';
import { ProviderCard } from '../../components/customer/ProviderCard';
import { MapPlaceholder } from '../../components/customer/MapPlaceholder';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Select } from '../../components/common/Select';
import { useProviders } from '../../hooks';

export const NearbyProvidersPage = () => {
  const { providers } = useProviders(true);
  const [selectedCity, setSelectedCity] = useState('Tirunelveli');

  const filtered = providers.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Nearby Providers' }]} />

          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Nearby Commercial Workshops
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Real-time proximity discovery of certified repair workshops and rapid emergency service units.
            </p>
          </div>

          <MapPlaceholder centerLocation={`${selectedCity}, Tamil Nadu`} nearbyCount={filtered.length} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Available Workshops in {selectedCity}</h3>
            <div style={{ width: '200px' }}>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                options={[
                  { value: 'Tirunelveli', label: 'Tirunelveli' },
                  { value: 'Chennai', label: 'Chennai' },
                  { value: 'Madurai', label: 'Madurai' },
                  { value: 'Bengaluru', label: 'Bengaluru' },
                  { value: 'Hyderabad', label: 'Hyderabad' },
                  { value: 'Mumbai', label: 'Mumbai' }
                ]}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
            {filtered.map(p => (
              <ProviderCard key={p.providerId} provider={p} />
            ))}
          </div>
        </div>
      </div>
  );
};

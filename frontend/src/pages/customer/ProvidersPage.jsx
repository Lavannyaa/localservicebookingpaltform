import React, { useState } from 'react';
import { ProviderCard } from '../../components/customer/ProviderCard';
import { SearchBar } from '../../components/customer/SearchBar';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Select } from '../../components/common/Select';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useProviders } from '../../hooks';

export const ProvidersPage = () => {
  const { providers, loading } = useProviders(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [availFilter, setAvailFilter] = useState('all');

  const filtered = providers.filter(p => {
    const matchesSearch = !search ||
      p.shopName.toLowerCase().includes(search.toLowerCase()) ||
      p.specialization.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === 'all' || p.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesAvail = availFilter === 'all' || p.availability.toLowerCase() === availFilter.toLowerCase();
    return matchesSearch && matchesCity && matchesAvail;
  });

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Provider Workshops' }]} />

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Commercial Provider Workshops ({providers.length})
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Verified business workshops and specialized commercial facilities — individual unverified freelancers are excluded.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '28px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shop name, trade, or location..."
              style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
            />

            <Select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Cities' },
                { value: 'Tirunelveli', label: 'Tirunelveli' },
                { value: 'Chennai', label: 'Chennai' },
                { value: 'Madurai', label: 'Madurai' },
                { value: 'Bengaluru', label: 'Bengaluru' },
                { value: 'Hyderabad', label: 'Hyderabad' },
                { value: 'Mumbai', label: 'Mumbai' }
              ]}
            />

            <Select
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'available', label: 'Available Now' },
                { value: 'busy', label: 'Busy' }
              ]}
            />
          </div>

          {loading ? (
            <LoadingSpinner message="Locating verified partner workshops..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
              {filtered.map(p => (
                <ProviderCard key={p.providerId} provider={p} />
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

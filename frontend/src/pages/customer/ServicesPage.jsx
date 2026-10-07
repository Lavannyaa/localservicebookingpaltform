import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { FilterPanel } from '../../components/customer/FilterPanel';
import { SearchBar } from '../../components/customer/SearchBar';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { useServices, useRecentlyAccessed } from '../../hooks';
import { X, Wrench } from 'lucide-react';

export const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { services, categories, filters, setFilters, clearFilters, loading } = useServices(true);
  const { trackItem } = useRecentlyAccessed();

  // Track category if filtered
  useEffect(() => {
    if (filters.category && filters.category !== 'all') {
      trackItem({
        id: `cat-${filters.category}`,
        type: 'Category',
        title: filters.category,
        subtitle: 'Standardized Trade Category',
        path: `/services?category=${encodeURIComponent(filters.category)}`
      });
    }
  }, [filters.category, trackItem]);

  // Sync URL search params with Redux filters
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    const loc = searchParams.get('location');

    const updates = {};
    if (cat) updates.category = cat;
    if (q) updates.search = q;
    if (loc) updates.location = loc;

    if (Object.keys(updates).length > 0) {
      setFilters(updates);
    }
  }, [searchParams, setFilters]);

  const providerIdParam = searchParams.get('providerId');

  // Derived filtered & sorted services using useMemo strictly
  const displayedServices = useMemo(() => {
    let result = [...services];

    // 1. Search Query Filter
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(s =>
        (s.serviceName && s.serviceName.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.providerName && s.providerName.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(s =>
        s.category && s.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // 3. Price Filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-500':
          result = result.filter(s => Number(s.basePrice) < 500);
          break;
        case '500-1000':
          result = result.filter(s => Number(s.basePrice) >= 500 && Number(s.basePrice) <= 1000);
          break;
        case '1000-2500':
          result = result.filter(s => Number(s.basePrice) > 1000 && Number(s.basePrice) <= 2500);
          break;
        case 'above-2500':
          result = result.filter(s => Number(s.basePrice) > 2500);
          break;
        default:
          break;
      }
    }

    // Min & Max Price numeric filters if set
    if (filters.minPrice) {
      result = result.filter(s => Number(s.basePrice) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(s => Number(s.basePrice) <= Number(filters.maxPrice));
    }

    // 4. Rating Filter
    if (filters.rating) {
      const minR = Number(filters.rating);
      result = result.filter(s => Number(s.rating) >= minR);
    }

    // 5. Availability Filter
    if (filters.availability && filters.availability !== 'all') {
      result = result.filter(s =>
        s.availability && s.availability.toLowerCase() === filters.availability.toLowerCase()
      );
    }

    // 6. Location Filter
    if (filters.location && filters.location !== 'all') {
      const locQ = filters.location.toLowerCase();
      result = result.filter(s =>
        s.location && s.location.toLowerCase().includes(locQ)
      );
    }

    // 7. Workshop / Provider Filter
    if (providerIdParam) {
      result = result.filter(s => s.providerId === providerIdParam);
    }

    // 8. Sorting
    const sortBy = filters.sortBy || 'popular';
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
        break;
      case 'price-high':
        result.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
        break;
      case 'rating':
        result.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'name':
        result.sort((a, b) => (a.serviceName || '').localeCompare(b.serviceName || ''));
        break;
      case 'popular':
      default:
        result.sort((a, b) => Number(b.reviewCount || 0) - Number(a.reviewCount || 0));
        break;
    }

    return result;
  }, [services, filters, providerIdParam]);

  const activeFilterCount = [
    filters.search,
    filters.category !== 'all' && filters.category,
    filters.priceRange !== 'all' && filters.priceRange,
    filters.rating,
    filters.availability !== 'all' && filters.availability,
    filters.location !== 'all' && filters.location,
    providerIdParam
  ].filter(Boolean).length;

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Service Catalog' }]} />

        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Standardized Commercial Services ({displayedServices.length})
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Over 80+ realistic residential, technical, and commercial repair services at upfront INR rates with 30-day warranty.
              </p>
            </div>

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={X}
                onClick={clearFilters}
              >
                Clear Filters ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <SearchBar
            initialQuery={filters.search}
            initialLocation={filters.location !== 'all' ? filters.location : 'Tirunelveli'}
            onSearch={({ query, location }) => setFilters({ search: query, location: location || 'all' })}
          />
        </div>

        {providerIdParam && (
          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--primary-900)', fontWeight: 600 }}>
              Filtering services belonging to workshop: <strong>{providerIdParam}</strong>
            </span>
            <button
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete('providerId');
                setSearchParams(next);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary-700)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <X size={14} /> Clear Workshop Filter
            </button>
          </div>
        )}

        {/* Filter Panel */}
        <FilterPanel
          categories={categories}
          filters={filters}
          onChange={(newF) => setFilters(newF)}
          onReset={clearFilters}
        />

        {/* Services Grid or Empty/Loading States */}
        {loading ? (
          <LoadingSpinner message="Filtering 80+ commercial services..." />
        ) : displayedServices.length === 0 ? (
          <EmptyState
            title="No services match your filters"
            description="Try broadening your search keywords, lowering the rating filter, or choosing 'All Categories'."
            actionLabel="Reset All Filters"
            onAction={clearFilters}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '22px' }}>
            {displayedServices.map((service) => (
              <ServiceCard key={service.serviceId} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;

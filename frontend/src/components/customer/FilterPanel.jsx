import React from 'react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { RotateCcw, Filter, MapPin, Tag, Star, DollarSign, Clock, ArrowDownUp } from 'lucide-react';

export const FilterPanel = ({
  categories = [],
  filters = {},
  onChange,
  onReset
}) => {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--primary-600)" />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Filter & Refine Services
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={onReset}
        >
          Reset All Filters
        </Button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '14px',
        alignItems: 'flex-end'
      }}>
        {/* Category Filter */}
        <Select
          label="Category"
          value={filters.category || 'all'}
          onChange={(e) => onChange({ category: e.target.value })}
          options={[
            { value: 'all', label: 'All 18 Categories' },
            ...categories.map(c => ({ value: c.name, label: c.name }))
          ]}
        />

        {/* Price Range Filter */}
        <Select
          label="Price Range"
          value={filters.priceRange || 'all'}
          onChange={(e) => onChange({ priceRange: e.target.value })}
          options={[
            { value: 'all', label: 'Any Price (INR)' },
            { value: 'under-500', label: 'Under ₹500' },
            { value: '500-1000', label: '₹500 - ₹1,000' },
            { value: '1000-2500', label: '₹1,000 - ₹2,500' },
            { value: 'above-2500', label: 'Above ₹2,500' }
          ]}
        />

        {/* Rating Filter */}
        <Select
          label="Customer Rating"
          value={filters.rating || ''}
          onChange={(e) => onChange({ rating: e.target.value })}
          options={[
            { value: '', label: 'Any Rating' },
            { value: '4.0', label: '4.0★ & above' },
            { value: '4.5', label: '4.5★ & above' },
            { value: '4.8', label: '4.8★ & above' }
          ]}
        />

        {/* Availability Filter */}
        <Select
          label="Availability"
          value={filters.availability || 'all'}
          onChange={(e) => onChange({ availability: e.target.value })}
          options={[
            { value: 'all', label: 'All Availabilities' },
            { value: 'Available', label: 'Available Now' },
            { value: 'Busy', label: 'Busy / Next Slot' }
          ]}
        />

        {/* Distance Filter (Radius) */}
        <Select
          label="Distance Radius"
          value={filters.radius || filters.maxDistanceKm || 'all'}
          onChange={(e) => onChange({ radius: e.target.value, maxDistanceKm: e.target.value })}
          options={[
            { value: 'all', label: 'All Nearby Providers' },
            { value: '2', label: 'Within 2 km' },
            { value: '5', label: 'Within 5 km' },
            { value: '10', label: 'Within 10 km' },
            { value: '25', label: 'Within 25 km' }
          ]}
        />

        {/* Location Filter */}
        <Select
          label="Service Hub"
          value={filters.location || 'all'}
          onChange={(e) => onChange({ location: e.target.value })}
          options={[
            { value: 'all', label: 'All Cities' },
            { value: 'Tirunelveli', label: 'Tirunelveli' },
            { value: 'Chennai', label: 'Chennai' },
            { value: 'Bengaluru', label: 'Bengaluru' },
            { value: 'Madurai', label: 'Madurai' },
            { value: 'Coimbatore', label: 'Coimbatore' }
          ]}
        />

        {/* Sort Order */}
        <Select
          label="Sort By"
          value={filters.sortBy || 'popular'}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          options={[
            { value: 'nearest', label: '📍 Nearest First' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'name', label: 'Name: A to Z' }
          ]}
        />
      </div>
    </div>
  );
};

export default FilterPanel;

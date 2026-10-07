import React, { useState } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export const SearchBar = ({
  onSearch,
  initialQuery = '',
  initialLocation = 'Tirunelveli',
  placeholder,
  locationPlaceholder,
  buttonText
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ query, location });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '6px 8px 6px 16px',
        boxShadow: 'var(--shadow-lg)',
        border: '1.5px solid var(--border-light)',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '8px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
        <Search size={20} color="var(--primary-600)" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('searchPlaceholder', 'What service do you need?')}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', background: 'transparent', color: 'var(--text-primary)', fontWeight: 500 }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px' }}>
        <MapPin size={18} color="var(--text-muted)" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={locationPlaceholder || t('locationPlaceholder', 'Choose your location')}
          style={{ border: 'none', outline: 'none', fontSize: '0.9rem', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, width: '150px' }}
        />
      </div>

      <Button type="submit" size="md" icon={ArrowRight} style={{ borderRadius: 'var(--radius-full)' }}>
        {buttonText || t('searchButton', 'Search Services')}
      </Button>
    </form>
  );
};

import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { CategoryCard } from '../../components/customer/CategoryCard';
import { useServices } from '../../hooks';

export const CategoriesPage = () => {
  const { categories } = useServices(true);

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Service Categories' }]} />

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Service Taxonomy & Categories ({categories.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem' }}>
            Explore our 18 commercial domains covering over 80+ professional residential, civil, and technical trades.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
};

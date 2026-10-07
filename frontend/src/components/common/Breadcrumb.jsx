import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', flexWrap: 'wrap' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
        <Home size={15} />
        <span>Home</span>
      </Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={14} />
          {item.path ? (
            <Link to={item.path} style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

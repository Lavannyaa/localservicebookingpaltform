import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { useRecentlyAccessed } from '../../hooks';
import {
  Wrench, Zap, Droplet, Wind, Sparkles, ShieldAlert, Trees,
  HardHat, Hammer, Paintbrush, PenTool, Car, Laptop, UserCheck,
  Home, Heart, Truck, Calendar, ArrowRight
} from 'lucide-react';

const iconMap = {
  Wrench, Zap, Droplet, Wind, Sparkles, ShieldAlert, Trees,
  HardHat, Hammer, Paintbrush, PenTool, Car, Laptop, UserCheck,
  Home, Heart, Truck, Calendar
};

export const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { trackItem } = useRecentlyAccessed();
  const Icon = iconMap[category.icon] || Wrench;

  const handleClick = () => {
    trackItem({
      id: `cat-${category.id || category.categoryId || category.name}`,
      type: 'Category',
      title: category.name,
      subtitle: `${category.serviceCount || 8}+ Standardized Services`,
      path: `/services?category=${encodeURIComponent(category.name)}`
    });
    navigate(`/services?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '22px',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <div>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--primary-50)',
          color: 'var(--primary-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px'
        }}>
          <Icon size={26} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          {category.name}
        </h3>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px' }}>
          {category.description}
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="badge badge-purple">{category.serviceCount || 8}+ Services</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
          Browse <ArrowRight size={14} />
        </span>
      </div>
    </Card>
  );
};

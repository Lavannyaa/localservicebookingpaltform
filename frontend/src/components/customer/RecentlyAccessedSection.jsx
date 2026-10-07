import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecentlyAccessed } from '../../hooks';
import { Clock, Trash2, ArrowRight, Wrench, Building2, Layers } from 'lucide-react';

export const RecentlyAccessedSection = () => {
  const navigate = useNavigate();
  const { recentlyAccessed, clearRecentlyAccessed, formatAccessedTime } = useRecentlyAccessed();

  if (!recentlyAccessed || recentlyAccessed.length === 0) {
    return null;
  }

  const getTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'category') return <Layers size={11} />;
    if (t === 'provider') return <Building2 size={11} />;
    return <Wrench size={11} />;
  };

  const getTypeColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'category') return { bg: '#f5f3ff', color: '#7c3aed' };
    if (t === 'provider') return { bg: '#ecfdf5', color: '#059669' };
    return { bg: 'var(--primary-50)', color: 'var(--primary-700)' };
  };

  return (
    <section style={{ margin: '36px 0 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={16} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Recently Accessed
          </h3>
          <span style={{ fontSize: '0.76rem', background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {recentlyAccessed.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/recently-accessed"
            style={{ fontSize: '0.84rem', color: 'var(--primary-600)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View All History</span>
            <ArrowRight size={14} />
          </Link>

          <button
            onClick={clearRecentlyAccessed}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        paddingBottom: '12px',
        scrollbarWidth: 'thin'
      }}>
        {recentlyAccessed.map((item, idx) => {
          const typeStyle = getTypeColor(item.type);
          const targetPath = item.path || (
            (item.type || '').toLowerCase() === 'provider'
              ? `/providers/${item.id}`
              : (item.type || '').toLowerCase() === 'category'
                ? `/services?category=${encodeURIComponent(item.title)}`
                : `/services/${item.id}`
          );

          return (
            <div
              key={`${item.type}-${item.id}-${idx}`}
              style={{
                minWidth: '250px',
                maxWidth: '270px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-card)',
                flexShrink: 0
              }}
            >
              <div>
                {/* Type Header Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: typeStyle.color,
                    background: typeStyle.bg,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {getTypeIcon(item.type)}
                    {item.type || 'Service'}
                  </span>
                  {item.price && (
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-700)' }}>
                      ₹{item.price}
                    </span>
                  )}
                </div>

                {/* Item Title */}
                <h4
                  onClick={() => navigate(targetPath)}
                  style={{
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    margin: '0 0 4px 0',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={item.title || item.serviceName}
                >
                  {item.title || item.serviceName}
                </h4>

                {/* Subtitle / Details */}
                {(item.subtitle || item.providerName) && (
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 6px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.subtitle || item.providerName}
                  </p>
                )}

                {/* Accessed Time */}
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={11} />
                  <span>{formatAccessedTime(item.accessedAt)}</span>
                </span>
              </div>

              {/* View Again Button */}
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  to={targetPath}
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--primary-600)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                >
                  <span>View Again</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentlyAccessedSection;

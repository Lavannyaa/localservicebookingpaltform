import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useRecentlyAccessed } from '../../hooks';
import {
  Clock, Trash2, ArrowRight, Wrench, Building2, Eye, Calendar,
  ShieldCheck, RefreshCw, ShoppingBag, Grid, X, Search, Sparkles
} from 'lucide-react';

export const RecentlyAccessedPage = () => {
  const navigate = useNavigate();
  const { recentlyAccessed, removeItem, clearRecentlyAccessed, formatAccessedTime } = useRecentlyAccessed();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Tab filtering
  const filteredItems = useMemo(() => {
    return recentlyAccessed.filter((item) => {
      const typeLower = (item.type || '').toLowerCase();
      
      // Tab filter
      let matchesTab = true;
      if (activeTab === 'service') matchesTab = typeLower === 'service';
      else if (activeTab === 'provider') matchesTab = typeLower === 'provider';
      else if (activeTab === 'category') matchesTab = typeLower === 'category';

      if (!matchesTab) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (item.title || item.serviceName || '').toLowerCase().includes(q);
        const subMatch = (item.subtitle || item.providerName || '').toLowerCase().includes(q);
        const typeMatch = (item.type || '').toLowerCase().includes(q);
        return titleMatch || subMatch || typeMatch;
      }

      return true;
    });
  }, [recentlyAccessed, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: recentlyAccessed.length,
      service: recentlyAccessed.filter(i => (i.type || '').toLowerCase() === 'service').length,
      provider: recentlyAccessed.filter(i => (i.type || '').toLowerCase() === 'provider').length,
      category: recentlyAccessed.filter(i => (i.type || '').toLowerCase() === 'category').length,
    };
  }, [recentlyAccessed]);

  const getTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'provider') return <Building2 size={20} />;
    if (t === 'category') return <Grid size={20} />;
    return <Wrench size={20} />;
  };

  const getTypeStyle = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'provider') {
      return {
        bg: '#ecfdf5',
        color: '#059669',
        border: '1px solid #a7f3d0',
        badgeBg: 'rgba(5, 150, 105, 0.1)',
        badgeColor: '#059669'
      };
    }
    if (t === 'category') {
      return {
        bg: '#eff6ff',
        color: '#2563eb',
        border: '1px solid #bfdbfe',
        badgeBg: 'rgba(37, 99, 235, 0.1)',
        badgeColor: '#2563eb'
      };
    }
    return {
      bg: 'var(--primary-50)',
      color: 'var(--primary-700)',
      border: '1px solid var(--primary-200)',
      badgeBg: 'var(--primary-50)',
      badgeColor: 'var(--primary-700)'
    };
  };

  const getTargetUrl = (item) => {
    if (item.path) return item.path;
    const t = (item.type || '').toLowerCase();
    if (t === 'provider') return `/providers/${item.id}`;
    if (t === 'category') return `/services?category=${encodeURIComponent(item.title || item.name || '')}`;
    return `/services/${item.id}`;
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <Breadcrumb items={[
          { label: 'Home', path: '/home' },
          { label: 'Recently Accessed' }
        ]} />

        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} />
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Recently Accessed
              </h1>
              <span style={{
                fontSize: '0.82rem',
                background: 'var(--bg-muted)',
                padding: '3px 12px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                color: 'var(--text-secondary)'
              }}>
                {recentlyAccessed.length} items
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0 }}>
              Live interaction history tracking your recently viewed services, workshops, and trade categories.
            </p>
          </div>

          {recentlyAccessed.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={clearRecentlyAccessed}
              >
                Clear Recent History
              </Button>
            </div>
          )}
        </div>

        {/* Tabs and Search Bar */}
        {recentlyAccessed.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px'
          }}>
            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: '6px',
              background: 'var(--bg-surface)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              overflowX: 'auto'
            }}>
              {[
                { id: 'all', label: 'All Items', count: counts.all },
                { id: 'service', label: 'Services', count: counts.service },
                { id: 'provider', label: 'Workshops', count: counts.provider },
                { id: 'category', label: 'Categories', count: counts.category },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--primary-600)' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.74rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-muted)',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)'
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Filter Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              width: '260px'
            }}>
              <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Filter recent items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)',
                  width: '100%'
                }}
              />
              {searchQuery && (
                <X
                  size={14}
                  color="var(--text-muted)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSearchQuery('')}
                />
              )}
            </div>
          </div>
        )}

        {/* Content List */}
        {recentlyAccessed.length === 0 ? (
          <Card style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--bg-muted)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}>
              <Eye size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              No Recently Accessed Items Yet
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              maxWidth: '460px',
              margin: '0 auto 22px auto',
              lineHeight: 1.5
            }}>
              Items you explore—such as standard trade services, verified local workshops, or service categories—will appear here automatically with their access time for fast re-access.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button onClick={() => navigate('/services')}>Explore Services</Button>
              <Button variant="secondary" onClick={() => navigate('/providers')}>Find Workshops</Button>
            </div>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
              No recently accessed records match your selected filter or search term.
            </p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredItems.map((item, idx) => {
              const itemType = item.type || 'Service';
              const isService = itemType.toLowerCase() === 'service';
              const style = getTypeStyle(itemType);
              const targetPath = getTargetUrl(item);
              const displayTime = formatAccessedTime(item.accessedAt);

              return (
                <Card
                  key={`${item.type}-${item.id}-${idx}`}
                  hoverable
                  style={{
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  {/* Left: Icon & Item Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '300px', flex: 1 }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: style.bg,
                      color: style.color,
                      border: style.border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getTypeIcon(itemType)}
                    </div>

                    <div style={{ flex: 1 }}>
                      {/* Type Badge & Price / Tag */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: style.badgeBg,
                          color: style.badgeColor
                        }}>
                          {itemType}
                        </span>
                        {item.price && (
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                            · ₹{item.price}
                          </span>
                        )}
                      </div>

                      {/* Item Title */}
                      <h3
                        onClick={() => navigate(targetPath)}
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          margin: 0,
                          cursor: 'pointer'
                        }}
                      >
                        {item.title || item.serviceName || 'Unnamed Record'}
                      </h3>

                      {/* Subtitle & Accessed Time */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginTop: '4px',
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)'
                      }}>
                        {(item.subtitle || item.providerName) && (
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {item.subtitle || item.providerName}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                          <Clock size={13} />
                          Accessed: <strong style={{ color: 'var(--text-secondary)' }}>{displayTime}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Book Again, View Again, Remove) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isService && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/booking/${item.id}`)}
                      >
                        Book Again
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={() => navigate(targetPath)}
                    >
                      View Again
                    </Button>
                    <button
                      title="Remove from recent history"
                      onClick={() => removeItem(item.id, item.type)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyAccessedPage;


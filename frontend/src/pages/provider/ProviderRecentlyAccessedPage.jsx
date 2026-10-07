import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useRecentlyAccessed } from '../../hooks';
import {
  History, Calendar, User, Clock, ArrowRight, Trash2,
  ExternalLink, Building2, CheckSquare
} from 'lucide-react';

export const ProviderRecentlyAccessedPage = () => {
  const navigate = useNavigate();
  const { recentlyAccessed, clearRecentlyAccessed, removeItem, formatAccessedTime } = useRecentlyAccessed();
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = (recentlyAccessed || []).filter(item => {
    if (activeTab === 'all') return true;
    return (item.type || '').toLowerCase() === activeTab.toLowerCase();
  });

  const getIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'customer') {
      return <User size={20} color="#2563eb" />;
    }
    return <Calendar size={20} color="var(--primary-600)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '4px' }}>
              WORKSHOP AUDIT LOGS
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={26} color="var(--primary-600)" />
            Recently Accessed Records
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live interaction trail of recently inspected customer bookings, client profiles, and dispatched jobs.
          </p>
        </div>

        {recentlyAccessed.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={() => {
                if (window.confirm('Clear all workshop recently accessed records?')) {
                  clearRecentlyAccessed();
                }
              }}
            >
              Clear Recent History
            </Button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: `All Activity (${recentlyAccessed.length})` },
          { id: 'booking', label: `Bookings (${recentlyAccessed.filter(i => (i.type || '').toLowerCase() === 'booking').length})` },
          { id: 'customer', label: `Customers (${recentlyAccessed.filter(i => (i.type || '').toLowerCase() === 'customer').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--primary-600)' : 'var(--bg-muted)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Standard Display Table / Cards */}
      {filteredItems.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <History size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            No Recently Accessed Records
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            As you inspect customer bookings or client profiles across your workshop portal, they will automatically appear here with exact timestamps for rapid continuation.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button variant="primary" size="sm" onClick={() => navigate('/provider/bookings')}>
              Inspect Bookings
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/provider/requests')}>
              View Booking Requests
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '14px 18px', width: '40%' }}>Item</th>
                  <th style={{ padding: '14px 18px', width: '20%' }}>Type</th>
                  <th style={{ padding: '14px 18px', width: '22%' }}>Accessed time</th>
                  <th style={{ padding: '14px 18px', width: '18%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => {
                  const targetPath = item.path || '/provider/bookings';
                  return (
                    <tr key={`${item.type}-${item.id}-${idx}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      {/* 1. Item Column */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: item.type === 'Customer' ? '#eff6ff' : 'var(--primary-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getIcon(item.type)}
                          </div>
                          <div>
                            <div
                              onClick={() => navigate(targetPath)}
                              style={{ fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.94rem' }}
                            >
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Type Column */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: item.type === 'Customer' ? '#dbeafe' : 'var(--primary-100)',
                          color: item.type === 'Customer' ? '#1e40af' : 'var(--primary-800)'
                        }}>
                          {item.type}
                        </span>
                        {item.badge && item.badge !== 'Customer' && (
                          <span style={{ marginLeft: '6px' }}>
                            <StatusBadge status={item.badge} />
                          </span>
                        )}
                      </td>

                      {/* 3. Accessed Time Column */}
                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} color="var(--primary-600)" />
                          <span>{formatAccessedTime(item.accessedAt)}</span>
                        </div>
                      </td>

                      {/* 4. View Again Button Column */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(targetPath)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
                          >
                            <span>View Again</span>
                            <ArrowRight size={13} />
                          </Button>
                          <button
                            onClick={() => removeItem(item.id, item.type)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="Remove from history"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRecentlyAccessedPage;

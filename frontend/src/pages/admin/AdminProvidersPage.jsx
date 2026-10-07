import React, { useState, useEffect } from 'react';
import { providerService } from '../../services/providerService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useRecentlyAccessed } from '../../hooks';
import {
  Building2, ShieldCheck, MapPin, Phone, CheckCircle2, Search,
  Plus, Edit3, Trash2, Power, Star, Wrench, Navigation, Clock
} from 'lucide-react';

export const AdminProvidersPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeProvider, setActiveProvider] = useState(null);

  const [formData, setFormData] = useState({
    shopName: '',
    specialization: 'Multi-Trade Commercial Workshop',
    phone: '',
    email: '',
    location: '',
    city: 'Tirunelveli',
    licenseNumber: 'TN-COMM-2026',
    hours: '8:30 AM - 8:30 PM',
    status: 'Active',
    rating: 4.8
  });

  useEffect(() => {
    providerService.getProviders().then(data => {
      // Ensure each provider has status
      setProviders(data.map(p => ({
        ...p,
        status: p.status || 'Active'
      })));
    });
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      shopName: '',
      specialization: 'AC & Electrical Works',
      phone: '+91 98421 ',
      email: '',
      location: 'Vannarpettai',
      city: 'Tirunelveli',
      licenseNumber: `TN-COMM-${Math.floor(1000 + Math.random() * 9000)}`,
      hours: '8:30 AM - 8:30 PM',
      status: 'Active',
      rating: 4.8
    });
    setModalMode('add');
  };

  const handleOpenEdit = (p) => {
    setActiveProvider(p);
    setFormData({
      shopName: p.shopName || '',
      specialization: p.specialization || p.category || '',
      phone: p.phone || '',
      email: p.email || `${p.shopName.toLowerCase().replace(/\s+/g, '')}@localserve.com`,
      location: p.location || p.area || '',
      city: p.city || 'Tirunelveli',
      licenseNumber: p.licenseNumber || 'TN-COMM-2026',
      hours: p.hours || '8:30 AM - 8:30 PM',
      status: p.status || 'Active',
      rating: p.rating || 4.8
    });
    setModalMode('edit');

    // Track accessed management record
    trackItem({
      id: `admin-prov-${p.providerId}`,
      type: 'Management Record',
      title: `Workshop: ${p.shopName}`,
      subtitle: `${p.specialization || p.location} · Lic: ${p.licenseNumber || 'TN-COMM-2026'}`,
      path: '/admin/providers',
      badge: p.status || 'Active',
      role: 'admin'
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.shopName.trim()) return;

    if (modalMode === 'add') {
      const newProvider = {
        providerId: `prov-${Date.now()}`,
        shopName: formData.shopName.trim(),
        specialization: formData.specialization,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        area: formData.location,
        city: formData.city,
        licenseNumber: formData.licenseNumber,
        hours: formData.hours,
        status: 'Active',
        rating: 4.8,
        reviewCount: 1,
        availability: 'Available'
      };
      setProviders(prev => [newProvider, ...prev]);
    } else if (modalMode === 'edit' && activeProvider) {
      setProviders(prev => prev.map(p => {
        if (p.providerId === activeProvider.providerId) {
          return {
            ...p,
            ...formData
          };
        }
        return p;
      }));
    }
    setModalMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently remove this provider workshop?')) {
      setProviders(prev => prev.filter(p => p.providerId !== id));
    }
  };

  const toggleActivate = (id) => {
    setProviders(prev => prev.map(p => {
      if (p.providerId === id) {
        const nextStatus = p.status === 'Active' ? 'Deactivated' : 'Active';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const filtered = providers.filter(p => {
    const matchSearch = p.shopName.toLowerCase().includes(search.toLowerCase()) ||
      (p.specialization && p.specialization.toLowerCase().includes(search.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(search.toLowerCase()));

    if (filter === 'active') return matchSearch && p.status === 'Active';
    if (filter === 'inactive') return matchSearch && p.status !== 'Active';
    return matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Commercial Workshop Providers Directory
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Registered physical service shops, commercial trade licenses, dispatch radii, and capacity governance.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <Plus size={16} /> Register New Workshop
        </Button>
      </div>

      {/* Search & Filters */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by workshop name, trade specialization, or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: `All Workshops (${providers.length})` },
            { id: 'active', label: 'Active Partners' },
            { id: 'inactive', label: 'Deactivated' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: filter === f.id ? '1px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: filter === f.id ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: filter === f.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Providers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map(p => {
          const isActive = p.status === 'Active';
          return (
            <div
              key={p.providerId}
              style={{
                background: 'var(--bg-surface)',
                padding: '22px',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '1px solid var(--border-light)' : '1.5px dashed #fca5a5',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                opacity: isActive ? 1 : 0.75,
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> {isActive ? 'Verified Commercial Partner' : 'Deactivated'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                    ★ {p.rating} ({p.reviewCount || 12} reviews)
                  </span>
                </div>

                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {p.shopName}
                </h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {p.specialization}
                </p>

                {/* Beyond CRUD Metadata: Physical Workshop info, GPS dispatch radius */}
                <div style={{
                  background: 'var(--bg-muted)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '14px',
                  border: '1px solid var(--border-light)'
                }}>
                  <div><strong>Commercial License:</strong> <code>{p.licenseNumber || 'TN-COMM-2026'}</code></div>
                  <div><strong>Location:</strong> {p.location || p.area}, {p.city}</div>
                  <div><strong>Support Hotline:</strong> {p.phone}</div>
                  <div><strong>Operating Hours:</strong> {p.hours || '8:30 AM - 8:30 PM'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-700)', fontWeight: 600 }}>
                    <Navigation size={12} /> Nearby Dispatch Radius: 15 km
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit, Delete, Activate/Deactivate */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '14px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <Button
                  variant={isActive ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => toggleActivate(p.providerId)}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderColor: isActive ? '#fca5a5' : undefined,
                    color: isActive ? '#dc2626' : undefined
                  }}
                >
                  <Power size={13} /> {isActive ? 'Deactivate' : 'Activate'}
                </Button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(p)} style={{ fontSize: '0.78rem' }}>
                    <Edit3 size={13} /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(p.providerId)} style={{ fontSize: '0.78rem', borderColor: '#fecaca', color: '#dc2626' }}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Provider Modal */}
      {modalMode && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'add' ? 'Register New Commercial Workshop' : `Edit Workshop: ${activeProvider?.shopName}`}
          maxWidth="560px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Workshop / Shop Name"
              icon={Building2}
              required
              placeholder="e.g. FrostTech AC Solutions"
              value={formData.shopName}
              onChange={e => setFormData({ ...formData, shopName: e.target.value })}
            />

            <Input
              label="Trade Specialization"
              icon={Wrench}
              required
              placeholder="e.g. Split AC Chemical Wash, Multi-Brand Refrigeration"
              value={formData.specialization}
              onChange={e => setFormData({ ...formData, specialization: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Commercial License #"
                icon={ShieldCheck}
                required
                placeholder="TN-COMM-XXXX"
                value={formData.licenseNumber}
                onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
              <Input
                label="Dispatch Hotline Phone"
                icon={Phone}
                required
                placeholder="+91 98421 XXXXX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Street Area / Landmark"
                icon={MapPin}
                required
                placeholder="e.g. Vannarpettai"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
              <Input
                label="City / District"
                icon={MapPin}
                placeholder="Tirunelveli"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <Input
              label="Operating Working Hours"
              icon={Clock}
              placeholder="8:30 AM - 8:30 PM (Mon-Sat)"
              value={formData.hours}
              onChange={e => setFormData({ ...formData, hours: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === 'add' ? 'Confirm & Register Workshop' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminProvidersPage;

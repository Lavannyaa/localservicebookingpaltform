import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useRecentlyAccessed } from '../../hooks';
import {
  Wrench, Plus, Search, Trash2, Edit3, Power, CheckCircle2,
  FileCheck, IndianRupee, Clock, Layers, Star
} from 'lucide-react';

export const AdminServicesPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Deactivated'
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeService, setActiveService] = useState(null);

  const [form, setForm] = useState({
    serviceName: '',
    category: 'AC & Appliances',
    basePrice: 499,
    duration: '60 Mins',
    description: '',
    providerName: 'Kumar Electricals',
    checklist: 'Pre-service diagnostics, Safety inspection, Primary repair, Functional verification test'
  });

  useEffect(() => {
    serviceService.getServices().then(data => {
      setServices(data.map(s => ({
        ...s,
        status: s.status || 'Active'
      })));
    });
    serviceService.getCategories().then(setCategories);
  }, []);

  const handleOpenAdd = () => {
    setForm({
      serviceName: '',
      category: categories[0]?.name || 'AC & Appliances',
      basePrice: 599,
      duration: '60-90 Mins',
      description: 'Standardized doorstep commercial service with certified workmanship warranty.',
      providerName: 'FrostTech AC Solutions',
      checklist: 'Pre-service check, Chemical cleaning, Gas pressure check, Electrical test, Final cooling verification'
    });
    setModalMode('add');
  };

  const handleOpenEdit = (s) => {
    setActiveService(s);
    setForm({
      serviceName: s.serviceName || '',
      category: s.category || 'AC & Appliances',
      basePrice: s.basePrice || 499,
      duration: s.duration || '60 Mins',
      description: s.description || '',
      providerName: s.providerName || 'LocalServe Partner',
      checklist: Array.isArray(s.checklist) ? s.checklist.join(', ') : (s.checklist || 'Standard inspection, Service execution, Quality verification')
    });
    setModalMode('edit');

    // Track accessed management record
    trackItem({
      id: `admin-srv-${s.serviceId}`,
      type: 'Management Record',
      title: `Service: ${s.serviceName}`,
      subtitle: `${s.category} · ₹${s.basePrice} · ${s.providerName || 'Standard'}`,
      path: '/admin/services',
      badge: s.status || 'Active',
      role: 'admin'
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.serviceName.trim()) return;

    if (modalMode === 'add') {
      const newSrv = {
        serviceId: `srv-${Date.now()}`,
        serviceName: form.serviceName.trim(),
        category: form.category,
        basePrice: Number(form.basePrice) || 499,
        duration: form.duration,
        description: form.description,
        providerName: form.providerName,
        rating: 4.9,
        reviewCount: 1,
        status: 'Active',
        checklist: form.checklist.split(',').map(item => item.trim()).filter(Boolean)
      };
      setServices(prev => [newSrv, ...prev]);
    } else if (modalMode === 'edit' && activeService) {
      setServices(prev => prev.map(s => {
        if (s.serviceId === activeService.serviceId) {
          return {
            ...s,
            serviceName: form.serviceName.trim(),
            category: form.category,
            basePrice: Number(form.basePrice) || s.basePrice,
            duration: form.duration,
            description: form.description,
            providerName: form.providerName,
            checklist: form.checklist.split(',').map(item => item.trim()).filter(Boolean)
          };
        }
        return s;
      }));
    }
    setModalMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Archive and permanently delete this service from the global catalog?")) {
      serviceService.deleteService(id).then(() => {
        setServices(prev => prev.filter(s => s.serviceId !== id));
      });
    }
  };

  const toggleActivate = (id) => {
    setServices(prev => prev.map(s => {
      if (s.serviceId === id) {
        const nextStatus = s.status === 'Active' ? 'Deactivated' : 'Active';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const filtered = services.filter(s => {
    const matchCat = categoryFilter === 'All' || s.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchSearch = s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      (s.providerName && s.providerName.toLowerCase().includes(search.toLowerCase()));

    if (statusFilter === 'Active') return matchCat && matchSearch && s.status === 'Active';
    if (statusFilter === 'Deactivated') return matchCat && matchSearch && s.status === 'Deactivated';
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Global Service Catalog ({services.length} Services Listed)
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive directory of all 85+ verified commercial services across 18 trade sectors.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <Plus size={16} /> Add New Catalog Service
        </Button>
      </div>

      {/* Search & Category Filter */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search services, categories, or default workshop..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.85rem' }}
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.85rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Deactivated">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px 18px' }}>Service Name</th>
              <th style={{ padding: '14px 18px' }}>Category</th>
              <th style={{ padding: '14px 18px' }}>Default Workshop</th>
              <th style={{ padding: '14px 18px' }}>Base Price</th>
              <th style={{ padding: '14px 18px' }}>Duration</th>
              <th style={{ padding: '14px 18px' }}>Rating</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map(s => {
              const isActive = s.status === 'Active';
              return (
                <tr key={s.serviceId} style={{ borderBottom: '1px solid var(--border-light)', opacity: isActive ? 1 : 0.7 }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{s.serviceName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ID: {s.serviceId}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {s.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.84rem' }}>{s.providerName}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>₹{s.basePrice}</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.duration}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>★ {s.rating}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                      {isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(s)} style={{ fontSize: '0.78rem' }}>
                        <Edit3 size={13} /> Edit
                      </Button>
                      <Button
                        variant={isActive ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => toggleActivate(s.serviceId)}
                        style={{
                          fontSize: '0.78rem',
                          borderColor: isActive ? '#fca5a5' : undefined,
                          color: isActive ? '#dc2626' : undefined
                        }}
                      >
                        <Power size={13} /> {isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(s.serviceId)}
                        style={{ borderColor: '#fecaca', color: '#dc2626' }}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length > 30 && (
          <div style={{ padding: '14px 18px', textAlign: 'center', background: 'var(--bg-muted)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing 30 of {filtered.length} services matching criteria.
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {modalMode && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'add' ? 'Publish New Standardized Service' : `Edit Service: ${activeService?.serviceName}`}
          maxWidth="560px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Service Name"
              icon={Wrench}
              required
              placeholder="e.g. Inverter AC Chemical Foam Jet Wash"
              value={form.serviceName}
              onChange={e => setForm({ ...form, serviceName: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Trade Category
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', fontSize: '0.88rem' }}
                >
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Standardized Base Price (₹)"
                icon={IndianRupee}
                type="number"
                required
                value={form.basePrice}
                onChange={e => setForm({ ...form, basePrice: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Standard Job Duration"
                icon={Clock}
                placeholder="e.g. 60-90 Mins"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
              />
              <Input
                label="Default Lead Workshop"
                icon={Wrench}
                placeholder="FrostTech AC Solutions"
                value={form.providerName}
                onChange={e => setForm({ ...form, providerName: e.target.value })}
              />
            </div>

            {/* Beyond CRUD: Service Inspection Checklist */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Service Quality Checklist (Comma Separated)
              </label>
              <textarea
                rows={3}
                value={form.checklist}
                onChange={e => setForm({ ...form, checklist: e.target.value })}
                placeholder="Check cooling, Clean filter, Check gas pressure, Electrical inspection, Final test"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-input)',
                  fontSize: '0.86rem',
                  fontFamily: 'inherit'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Field technicians must sign off each of these checklist items before completing the job in their app.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === 'add' ? 'Publish to Global Catalog' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminServicesPage;

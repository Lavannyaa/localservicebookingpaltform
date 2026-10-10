import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Plus, Edit3, Trash2, CheckCircle2, Clock, IndianRupee, Layers, Filter,
  Building2, Search, AlertCircle, Check, PauseCircle, PlayCircle, ShieldCheck
} from 'lucide-react';

import { providerService } from '../../services/providerService';

export const MyServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Form State
  const [form, setForm] = useState({
    serviceName: '',
    category: 'Electrical Repair & Installation',
    basePrice: '',
    estimatedDuration: '45-60 mins',
    description: '',
    warranty: '30-Day Work Warranty'
  });

  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadData = () => {
    Promise.all([
      serviceService.getServices(),
      serviceService.getCategories(),
      providerService.getProfile()
    ]).then(([allServices, allCategories, profileData]) => {
      setProviderProfile(profileData);
      const provId = profileData?._id || profileData?.providerId;
      const provName = profileData?.shopName;

      const shopServices = (allServices || []).filter(
        s => (provId && (s.providerId === provId || s.providerId?._id === provId)) ||
             (provName && s.providerName === provName)
      );
      setServices(shopServices.length > 0 ? shopServices : (allServices || []).slice(0, 6));
      setCategories(allCategories || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentShopName = providerProfile?.shopName || 'Workshop Storefront';
  const currentProviderId = providerProfile?.providerId || 'PRV-TNV-001';

  // 1. ADD SERVICE
  const handleOpenAdd = () => {
    setForm({
      serviceName: '',
      category: 'Electrical',
      basePrice: '',
      estimatedDuration: '45-60 mins',
      description: '',
      warranty: '30-Day Work Warranty'
    });
    setShowAddModal(true);
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!form.serviceName.trim() || !form.basePrice) return;

    const newSrv = {
      serviceName: form.serviceName.trim(),
      category: form.category,
      basePrice: Number(form.basePrice),
      estimatedDuration: form.estimatedDuration || '60 mins',
      description: form.description.trim() || 'Standard commercial service performed by certified technicians.',
      providerId: currentProviderId,
      providerName: currentShopName,
      location: 'Tirunelveli',
      availability: 'Available',
      status: 'active',
      rating: 5.0,
      reviewCount: 0,
      benefits: [
        'Certified Commercial Technician',
        form.warranty || '30-Day Work Warranty',
        'Standardized Transparent Rate Card',
        'Digital Job Sign-off'
      ]
    };

    serviceService.createService(newSrv).then(created => {
      setServices(prev => [created, ...prev]);
      setShowAddModal(false);
      showNotification(`"${created.serviceName}" has been published to your workshop catalog!`);
    });
  };

  // 2. EDIT SERVICE
  const handleOpenEdit = (srv) => {
    setSelectedService(srv);
    setForm({
      serviceName: srv.serviceName,
      category: srv.category,
      basePrice: srv.basePrice,
      estimatedDuration: srv.estimatedDuration || '60 mins',
      description: srv.description || '',
      warranty: srv.benefits?.[1] || '30-Day Work Warranty'
    });
    setShowEditModal(true);
  };

  const handleUpdateService = (e) => {
    e.preventDefault();
    if (!selectedService) return;

    const updates = {
      serviceName: form.serviceName.trim(),
      category: form.category,
      basePrice: Number(form.basePrice),
      estimatedDuration: form.estimatedDuration,
      description: form.description.trim()
    };

    serviceService.updateService(selectedService.serviceId, updates).then(updated => {
      setServices(prev => prev.map(s => s.serviceId === updated.serviceId ? updated : s));
      setShowEditModal(false);
      showNotification(`"${updated.serviceName}" details updated successfully!`);
    });
  };

  // 3. ACTIVATE / DEACTIVATE (Toggle Status)
  const handleToggleStatus = (service) => {
    const isCurrentlyActive = (service.availability || 'Available').toLowerCase() === 'available';
    const nextAvailability = isCurrentlyActive ? 'Unavailable' : 'Available';
    const nextStatus = isCurrentlyActive ? 'inactive' : 'active';

    serviceService.updateService(service.serviceId, {
      availability: nextAvailability,
      status: nextStatus
    }).then(updated => {
      setServices(prev => prev.map(s => s.serviceId === updated.serviceId ? updated : s));
      showNotification(`Service status changed to ${nextAvailability}!`);
    });
  };

  // 4. REMOVE (Delete)
  const handleDelete = (service) => {
    if (window.confirm(`Are you sure you want to remove "${service.serviceName}" from your shop catalog?`)) {
      serviceService.deleteService(service.serviceId).then(() => {
        setServices(prev => prev.filter(s => s.serviceId !== service.serviceId));
        showNotification(`Service "${service.serviceName}" removed from catalog.`);
      });
    }
  };

  // Filtered Services
  const filteredServices = services.filter(s => {
    const matchesSearch = !search.trim() ||
      s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;

    const matchesStatus = filterStatus === 'All' ||
      (filterStatus === 'Active' && (s.availability || 'Available') === 'Available') ||
      (filterStatus === 'Paused' && s.availability === 'Unavailable');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = services.filter(s => (s.availability || 'Available') === 'Available').length;
  const pausedCount = services.length - activeCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Relationship Visualization */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: 'var(--primary-50)',
              color: 'var(--primary-700)',
              fontWeight: 800,
              fontSize: '0.78rem',
              padding: '3px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Building2 size={13} /> ONE SHOP → MULTIPLE SERVICES
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Workshop ID: <strong>{currentProviderId}</strong>
            </span>
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            {currentShopName} Service Catalog
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage the standardized services offered by your workshop. Add, edit pricing, pause availability, or remove listings.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New Service
        </Button>
      </div>

      {notification && (
        <div style={{
          background: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Check size={18} /> {notification}
        </div>
      )}

      {/* Filter and Stats Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search service name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-muted)',
              color: 'var(--text-secondary)',
              fontSize: '0.84rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Status Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-muted)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
            {[
              { id: 'All', label: `All (${services.length})` },
              { id: 'Active', label: `Active (${activeCount})` },
              { id: 'Paused', label: `Paused (${pausedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterStatus === tab.id ? 'var(--primary-600)' : 'transparent',
                  color: filterStatus === tab.id ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <Wrench size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0' }}>No Services Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 16px 0', fontSize: '0.9rem' }}>
            No services matched your current filters. Add a new service to start accepting bookings.
          </p>
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add First Service
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredServices.map(s => {
            const isAvail = (s.availability || 'Available').toLowerCase() === 'available';

            return (
              <div
                key={s.serviceId}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: isAvail ? '1px solid var(--border-light)' : '1px dashed var(--border-medium)',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isAvail ? 1 : 0.82
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--primary-700)',
                      background: 'var(--primary-50)',
                      padding: '3px 9px',
                      borderRadius: '6px'
                    }}>
                      {s.category}
                    </span>
                    <span className={`badge ${isAvail ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                      {isAvail ? 'Active / Available' : 'Paused / Inactive'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.12rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    {s.serviceName}
                  </h3>

                  <p style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 14px 0',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {s.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-muted)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>BASE RATE</span>
                      <span style={{ color: 'var(--primary-700)', fontSize: '1.25rem', fontWeight: 900 }}>₹{s.basePrice}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>DURATION</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.86rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {s.estimatedDuration || '60 Mins'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Edit, Activate/Deactivate, Remove */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '14px',
                  gap: '8px'
                }}>
                  {/* Activate / Deactivate Toggle Button */}
                  <Button
                    variant={isAvail ? 'secondary' : 'success'}
                    size="sm"
                    onClick={() => handleToggleStatus(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {isAvail ? (
                      <>
                        <PauseCircle size={14} /> Deactivate
                      </>
                    ) : (
                      <>
                        <PlayCircle size={14} /> Activate
                      </>
                    )}
                  </Button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {/* Edit Service Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(s)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={14} /> Edit
                    </Button>

                    {/* Remove Service Button */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(s)}
                      title="Remove from workshop catalog"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Service to Workshop Catalog">
          <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--primary-50)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--primary-900)' }}>
              Service will be linked to: <strong>{currentShopName}</strong> ({currentProviderId})
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Service Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. Inverter Wiring & Battery Overhaul"
                value={form.serviceName}
                onChange={e => setForm({ ...form, serviceName: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                >
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Base Price (₹) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="e.g. 799"
                  value={form.basePrice}
                  onChange={e => setForm({ ...form, basePrice: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Estimated Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 45-60 mins"
                  value={form.estimatedDuration}
                  onChange={e => setForm({ ...form, estimatedDuration: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Warranty Period</label>
                <input
                  type="text"
                  placeholder="e.g. 30-Day Work Warranty"
                  value={form.warranty}
                  onChange={e => setForm({ ...form, warranty: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Service Scope & Details</label>
              <textarea
                rows={3}
                placeholder="Detail what is included in this commercial workshop service..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Publish to Catalog</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT SERVICE MODAL */}
      {showEditModal && selectedService && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit: ${selectedService.serviceName}`}>
          <form onSubmit={handleUpdateService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Service Title *</label>
              <input
                required
                type="text"
                value={form.serviceName}
                onChange={e => setForm({ ...form, serviceName: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                >
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Base Price (₹) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.basePrice}
                  onChange={e => setForm({ ...form, basePrice: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Estimated Duration</label>
              <input
                type="text"
                value={form.estimatedDuration}
                onChange={e => setForm({ ...form, estimatedDuration: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Service Scope & Details</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyServicesPage;

import React, { useState, useEffect } from 'react';
import { technicians as initialTechnicians } from '../../data/technicians';
import { providerService } from '../../services/providerService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useRecentlyAccessed } from '../../hooks';
import {
  HardHat, ShieldCheck, Award, Plus, Edit3, Power, Building2,
  Phone, Search, CheckCircle2, UserCheck, Star, FileText
} from 'lucide-react';

export const AdminTechniciansPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [techList, setTechList] = useState(initialTechnicians.map(t => ({
    ...t,
    status: t.status || 'Available',
    isActive: true
  })));
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'available' | 'on_duty' | 'inactive'

  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'assign' | null
  const [activeTech, setActiveTech] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: 'AC Jet Wash & Refrigeration',
    shopName: 'FrostTech AC Solutions',
    providerId: 'prov-2',
    profileBadge: 'Master Certified (Level 3)',
    status: 'Available'
  });

  useEffect(() => {
    providerService.getProviders().then(setProviders);
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '+91 98421 ',
      specialization: 'AC & Cooling Diagnostic Specialist',
      shopName: providers[0]?.shopName || 'FrostTech AC Solutions',
      providerId: providers[0]?.providerId || 'prov-2',
      profileBadge: 'Certified Field Specialist',
      status: 'Available'
    });
    setModalMode('add');
  };

  const handleOpenEdit = (t) => {
    setActiveTech(t);
    setFormData({
      name: t.name,
      phone: t.phone,
      specialization: t.specialization,
      shopName: t.shopName,
      providerId: t.providerId || 'prov-2',
      profileBadge: t.profileBadge || 'Certified Technician',
      status: t.status
    });
    setModalMode('edit');

    // Track accessed management record
    trackItem({
      id: `admin-tech-${t.techId}`,
      type: 'Management Record',
      title: `Technician: ${t.name}`,
      subtitle: `${t.specialization} · Shop: ${t.shopName}`,
      path: '/admin/technicians',
      badge: t.isActive ? t.status : 'Deactivated',
      role: 'admin'
    });
  };

  const handleOpenAssign = (t) => {
    setActiveTech(t);
    setFormData({
      ...formData,
      shopName: t.shopName,
      providerId: t.providerId || 'prov-2'
    });
    setModalMode('assign');

    // Track accessed management record
    trackItem({
      id: `admin-tech-${t.techId}`,
      type: 'Management Record',
      title: `Technician: ${t.name}`,
      subtitle: `${t.specialization} · Reassigning Workshop`,
      path: '/admin/technicians',
      badge: t.isActive ? t.status : 'Deactivated',
      role: 'admin'
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (modalMode === 'add') {
      const newTech = {
        techId: `tech-${Date.now()}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        specialization: formData.specialization,
        shopName: formData.shopName,
        providerId: formData.providerId,
        profileBadge: formData.profileBadge,
        status: formData.status,
        rating: 4.9,
        completedJobs: 0,
        badgeNumber: `TN-${Math.floor(1000 + Math.random() * 9000)}`,
        checklistCompletionRate: '100%',
        isActive: true
      };
      setTechList(prev => [newTech, ...prev]);
    } else if (modalMode === 'edit' && activeTech) {
      setTechList(prev => prev.map(t => {
        if (t.techId === activeTech.techId) {
          return {
            ...t,
            ...formData
          };
        }
        return t;
      }));
    } else if (modalMode === 'assign' && activeTech) {
      const selectedShop = providers.find(p => p.providerId === formData.providerId);
      setTechList(prev => prev.map(t => {
        if (t.techId === activeTech.techId) {
          return {
            ...t,
            providerId: formData.providerId,
            shopName: selectedShop ? selectedShop.shopName : formData.shopName
          };
        }
        return t;
      }));
    }
    setModalMode(null);
  };

  const toggleActivate = (id) => {
    setTechList(prev => prev.map(t => {
      if (t.techId === id) {
        return {
          ...t,
          isActive: !t.isActive,
          status: !t.isActive ? 'Available' : 'Deactivated'
        };
      }
      return t;
    }));
  };

  const filtered = techList.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.shopName.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase());

    if (filter === 'available') return matchSearch && t.isActive && t.status === 'Available';
    if (filter === 'on_duty') return matchSearch && t.isActive && t.status !== 'Available';
    if (filter === 'inactive') return matchSearch && !t.isActive;
    return matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Certified Field Technicians Roster
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage certified field staff, assign partner workshops, track checklist execution, and activate/deactivate technicians.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <Plus size={16} /> Enroll New Technician
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
            placeholder="Search by technician name, workshop, or trade specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: `All Technicians (${techList.length})` },
            { id: 'available', label: 'Available On-Duty' },
            { id: 'on_duty', label: 'Assigned / In Progress' },
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

      {/* Technicians Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px 18px' }}>Technician & ID</th>
              <th style={{ padding: '14px 18px' }}>Assigned Commercial Workshop</th>
              <th style={{ padding: '14px 18px' }}>Specialization</th>
              <th style={{ padding: '14px 18px' }}>Certification Badge</th>
              <th style={{ padding: '14px 18px' }}>Completed Jobs</th>
              <th style={{ padding: '14px 18px' }}>Rating</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.techId} style={{ borderBottom: '1px solid var(--border-light)', opacity: t.isActive ? 1 : 0.7 }}>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--primary-700)', fontWeight: 700 }}>
                    Badge #{t.badgeNumber || 'TN-4410'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.phone}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.shopName}</div>
                  <button
                    onClick={() => handleOpenAssign(t)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary-600)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px',
                      textDecoration: 'underline'
                    }}
                  >
                    Reassign Workshop
                  </button>
                </td>
                <td style={{ padding: '14px 18px' }}>{t.specialization}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={12} /> {t.profileBadge}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                  {t.completedJobs} Jobs
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                    Checklist Rate: 98%
                  </div>
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>
                  ★ {t.rating}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge ${t.isActive ? (t.status === 'Available' ? 'badge-success' : 'badge-warning') : 'badge-danger'}`}>
                    {t.isActive ? t.status : 'Deactivated'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(t)} style={{ fontSize: '0.78rem' }}>
                      <Edit3 size={12} /> Edit
                    </Button>
                    <Button
                      variant={t.isActive ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => toggleActivate(t.techId)}
                      style={{
                        fontSize: '0.78rem',
                        borderColor: t.isActive ? '#fca5a5' : undefined,
                        color: t.isActive ? '#dc2626' : undefined
                      }}
                    >
                      <Power size={12} /> {t.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Technician Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title={modalMode === 'add' ? 'Enroll New Field Technician' : `Edit Technician: ${activeTech?.name}`}
          maxWidth="540px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Technician Full Name"
              icon={HardHat}
              required
              placeholder="e.g. S. Murugan"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Direct Mobile Phone"
              icon={Phone}
              required
              placeholder="+91 98421 XXXXX"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Trade Specialization"
              icon={Award}
              required
              placeholder="e.g. Inverter Split AC Diagnostic & Chemical Wash"
              value={formData.specialization}
              onChange={e => setFormData({ ...formData, specialization: e.target.value })}
            />

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Affiliated Commercial Workshop
              </label>
              <select
                value={formData.providerId}
                onChange={e => {
                  const p = providers.find(prov => prov.providerId === e.target.value);
                  setFormData({
                    ...formData,
                    providerId: e.target.value,
                    shopName: p ? p.shopName : formData.shopName
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-input)',
                  fontSize: '0.88rem'
                }}
              >
                {providers.map(p => (
                  <option key={p.providerId} value={p.providerId}>
                    {p.shopName} ({p.location || p.city})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Certification Credentials / Badge Title"
              icon={ShieldCheck}
              placeholder="Master Certified (Level 3)"
              value={formData.profileBadge}
              onChange={e => setFormData({ ...formData, profileBadge: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === 'add' ? 'Confirm Enrollment' : 'Save Details'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Provider Workshop Modal */}
      {modalMode === 'assign' && activeTech && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title={`Assign Commercial Workshop: ${activeTech.name}`}
          maxWidth="480px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-muted)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <div>Currently Assigned to: <strong>{activeTech.shopName}</strong></div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                Reassigning will redirect all incoming job dispatches to the newly selected workshop.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Select New Commercial Workshop
              </label>
              <select
                value={formData.providerId}
                onChange={e => {
                  const p = providers.find(prov => prov.providerId === e.target.value);
                  setFormData({
                    ...formData,
                    providerId: e.target.value,
                    shopName: p ? p.shopName : formData.shopName
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-input)',
                  fontSize: '0.88rem'
                }}
              >
                {providers.map(p => (
                  <option key={p.providerId} value={p.providerId}>
                    {p.shopName} — {p.location}, {p.city}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Confirm Reassignment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminTechniciansPage;

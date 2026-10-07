import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useRecentlyAccessed } from '../../hooks';
import {
  Layers, ShieldCheck, Plus, Edit3, Trash2, Search, CheckCircle2,
  Tag, FileText
} from 'lucide-react';

export const AdminCategoriesPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeCategory, setActiveCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceCount: 5,
    status: 'Active'
  });

  useEffect(() => {
    serviceService.getCategories().then(data => {
      setCategories(data.map(c => ({
        ...c,
        status: c.status || 'Active'
      })));
    });
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      description: 'Standardized trade vertical covering home & commercial maintenance.',
      serviceCount: 0,
      status: 'Active'
    });
    setModalMode('add');
  };

  const handleOpenEdit = (c) => {
    setActiveCategory(c);
    setFormData({
      name: c.name || '',
      description: c.description || 'Specialized commercial trade vertical.',
      serviceCount: c.serviceCount || 6,
      status: c.status || 'Active'
    });
    setModalMode('edit');

    // Track accessed management record
    trackItem({
      id: `admin-cat-${c.categoryId}`,
      type: 'Management Record',
      title: `Category: ${c.name}`,
      subtitle: `${c.serviceCount || 6} Services Listed`,
      path: '/admin/categories',
      badge: c.status || 'Active',
      role: 'admin'
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (modalMode === 'add') {
      const newCat = {
        categoryId: `cat-${Date.now()}`,
        name: formData.name.trim(),
        description: formData.description,
        serviceCount: 0,
        status: 'Active'
      };
      setCategories(prev => [newCat, ...prev]);
    } else if (modalMode === 'edit' && activeCategory) {
      setCategories(prev => prev.map(c => {
        if (c.categoryId === activeCategory.categoryId) {
          return {
            ...c,
            name: formData.name.trim(),
            description: formData.description
          };
        }
        return c;
      }));
    }
    setModalMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete category? Services associated with this category will need reallocation.')) {
      setCategories(prev => prev.filter(c => c.categoryId !== id));
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Platform Trade Categories Hierarchy
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure and govern all 18 market sectors across Tamil Nadu commercial service operations.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <Plus size={16} /> Add Trade Category
        </Button>
      </div>

      {/* Search */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
        />
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {filtered.map(c => (
          <div
            key={c.categoryId}
            style={{
              background: 'var(--bg-surface)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Layers size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {c.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 700 }}>
                      {c.serviceCount || '4-8'} Catalog Services
                    </span>
                  </div>
                </div>

                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                  Active Sector
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '8px 0 14px 0' }}>
                {c.description || 'Verified commercial trade category supported across regional repair networks.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(c)} style={{ fontSize: '0.78rem' }}>
                <Edit3 size={13} /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(c.categoryId)} style={{ fontSize: '0.78rem', borderColor: '#fecaca', color: '#dc2626' }}>
                <Trash2 size={13} /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {modalMode && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'add' ? 'Add Trade Category' : `Edit Category: ${activeCategory?.name}`}
          maxWidth="480px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Category Name"
              icon={Tag}
              required
              placeholder="e.g. Solar & Renewable Maintenance"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Category Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Scope of services covered under this sector..."
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
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === 'add' ? 'Add Sector' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCategoriesPage;

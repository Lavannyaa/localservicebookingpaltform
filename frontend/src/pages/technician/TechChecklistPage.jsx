import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import {
  CheckSquare, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle,
  Plus, Check, RefreshCw, Layers
} from 'lucide-react';

const SERVICE_CHECKLISTS = {
  'AC Repair & Jet Wash': {
    category: 'AC & Appliances',
    items: [
      'Check cooling temperature pre-service',
      'Clean filter and indoor blower wheel',
      'Check gas pressure (Target: 120-130 PSI R32)',
      'Check electrical connections and run capacitor',
      'Inspect outdoor unit condenser fins & coil',
      'Final cooling test & temperature differential check'
    ]
  },
  'Electrical Wiring & Short Circuit Fix': {
    category: 'Electrical',
    items: [
      'Main MCB/DB isolation safety test',
      'Measure phase-neutral & earth voltage (220-240V)',
      'Inspect copper conductor gauge & insulation scorch marks',
      'Tighten distribution board terminal screws',
      'High-amp appliance load test',
      'Digital multimeter continuity verification sign-off'
    ]
  },
  'Plumbing & Pipe Leakage Repair': {
    category: 'Plumbing',
    items: [
      'Main inlet shutoff valve isolation',
      'Hydrostatic pressure test for concealed pipe joint leaks',
      'Replace worn washers, O-rings, and angle valves',
      'Clear drain trap & waste pipe blockage',
      'High-pressure water flow & tightness test',
      'Customer leak-free inspection sign-off'
    ]
  },
  'Deep Cleaning & Sanitization': {
    category: 'Cleaning',
    items: [
      'Industrial HEPA vacuum dust extraction',
      'Degrease kitchen countertops & exhaust hood',
      'Acid-free chemical descaling of bathroom tiles',
      'Antibacterial sanitization fogging / spray',
      'Floor buffing & microfiber dry mop',
      'Customer final quality sign-off'
    ]
  }
};

export const TechChecklistPage = () => {
  const [selectedService, setSelectedService] = useState('AC Repair & Jet Wash');
  const [checklistData, setChecklistData] = useState(() => {
    const initial = {};
    Object.keys(SERVICE_CHECKLISTS).forEach(key => {
      initial[key] = SERVICE_CHECKLISTS[key].items.map((item, idx) => ({
        id: `${key}-${idx}`,
        text: item,
        done: idx < 2 // first 2 done by default
      }));
    });
    return initial;
  });

  const [newItemText, setNewItemText] = useState('');
  const [signed, setSigned] = useState(false);
  const [notification, setNotification] = useState('');

  const currentItems = checklistData[selectedService] || [];
  const completedItems = currentItems.filter(i => i.done);
  const pendingItems = currentItems.filter(i => !i.done);
  const progressPercent = currentItems.length > 0 ? Math.round((completedItems.length / currentItems.length) * 100) : 0;

  const toggleItem = (id) => {
    setChecklistData(prev => ({
      ...prev,
      [selectedService]: prev[selectedService].map(it => it.id === id ? { ...it, done: !it.done } : it)
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      done: false
    };

    setChecklistData(prev => ({
      ...prev,
      [selectedService]: [...prev[selectedService], newItem]
    }));
    setNewItemText('');
  };

  const handleSignOff = () => {
    setSigned(true);
    setNotification('SOP Checklist digitally signed and submitted for job verification!');
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Service-Specific Quality SOP Checklists
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Procedural technical steps required for standardized on-site execution and warranty compliance.
          </p>
        </div>

        {/* Category / Service Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Service Type:</span>
          <select
            value={selectedService}
            onChange={(e) => { setSelectedService(e.target.value); setSigned(false); }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              outline: 'none'
            }}
          >
            {Object.keys(SERVICE_CHECKLISTS).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
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
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* Progress Metric Card */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '10px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {selectedService}
            </h3>
            <span style={{ fontSize: '0.84rem', color: 'var(--primary-700)', fontWeight: 600 }}>
              Category: {SERVICE_CHECKLISTS[selectedService].category} · Assigned to Technician S. Murugan
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: progressPercent === 100 ? '#10b981' : 'var(--primary-700)', lineHeight: 1 }}>
              {progressPercent}%
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {completedItems.length} of {currentItems.length} items verified
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ height: '10px', background: 'var(--bg-muted)', borderRadius: '5px', overflow: 'hidden', marginTop: '8px' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: progressPercent === 100 ? '#10b981' : 'var(--primary-600)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Completed vs Pending summary chips */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.86rem' }}>
          <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Completed: {completedItems.length} items
          </span>
          <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={16} /> Pending: {pendingItems.length} items
          </span>
        </div>
      </div>

      {/* Two Column Layout: Completed Items vs Pending Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* PENDING ITEMS SECTION */}
        <div style={{
          background: 'var(--bg-surface)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#f59e0b" /> Pending Quality Items ({pendingItems.length})
          </h4>

          {pendingItems.length === 0 ? (
            <div style={{ background: '#ecfdf5', color: '#065f46', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>
              ✓ All items for this service have been executed and verified!
            </div>
          ) : (
            pendingItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => {}}
                    style={{ width: '17px', height: '17px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.text}
                  </span>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Pending</span>
              </div>
            ))
          )}

          {/* Add custom check item */}
          <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Add custom inspection step..."
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.84rem' }}
            />
            <Button variant="secondary" size="sm" type="submit">
              <Plus size={14} /> Add Step
            </Button>
          </form>
        </div>

        {/* COMPLETED ITEMS SECTION */}
        <div style={{
          background: 'var(--bg-surface)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" /> Completed Quality Items ({completedItems.length})
          </h4>

          {completedItems.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>
              No items verified yet. Click pending items as work proceeds.
            </div>
          ) : (
            completedItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--primary-50)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--primary-200)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {}}
                    style={{ width: '17px', height: '17px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-900)', textDecoration: 'line-through' }}>
                    {item.text}
                  </span>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Verified</span>
              </div>
            ))
          )}

          {signed ? (
            <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '14px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <ShieldCheck size={18} /> Digitally Signed & Stamped by S. Murugan (Tech ID: tech-1)
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button
                variant="primary"
                disabled={completedItems.length < currentItems.length}
                onClick={handleSignOff}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ShieldCheck size={16} /> Sign-off & Stamp SOP Checklist
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechChecklistPage;

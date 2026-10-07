import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { CheckSquare, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ServiceChecklistPage = () => {
  const [checklists, setChecklists] = useState([
    {
      id: 'chk-1',
      title: 'Standard Electrical Wiring & MCB Inspection SOP',
      category: 'Electrical',
      items: [
        'Check phase and neutral voltage with multimeter (220V - 240V range)',
        'Inspect MCB trip sensitivity and earth leakage resistance',
        'Verify copper conductor gauge and check for burnt insulation',
        'Tighten all distribution board terminal screws to specified torque',
        'Perform live load test with high-amp appliance',
        'Clean work area and hand over digital test report to customer'
      ]
    },
    {
      id: 'chk-2',
      title: 'HVAC / AC Jet Wash & Gas Pressure Checklist',
      category: 'AC & Appliances',
      items: [
        'Record pre-service suction and discharge cooling temperature',
        'Unmount indoor casing and fit waterproof pressure-cleaning bag',
        'Apply antibacterial coil detergent and pressure jet wash',
        'Flush condensate drain pipe and clear mold blockages',
        'Measure outdoor compressor running current (Amperes)',
        'Inspect R32 / R410A suction pressure with gauge manifold'
      ]
    }
  ]);

  const [newItemText, setNewItemText] = useState('');
  const [activeChecklistId, setActiveChecklistId] = useState('chk-1');

  const activeChecklist = checklists.find(c => c.id === activeChecklistId);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setChecklists(prev => prev.map(c => {
      if (c.id === activeChecklistId) {
        return { ...c, items: [...c.items, newItemText.trim()] };
      }
      return c;
    }));
    setNewItemText('');
  };

  const handleRemoveItem = (idx) => {
    setChecklists(prev => prev.map(c => {
      if (c.id === activeChecklistId) {
        return { ...c, items: c.items.filter((_, i) => i !== idx) };
      }
      return c;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Workshop Quality SOP Checklists
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Mandatory procedural checklists that field technicians must execute and sign off on site.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Sidebar Checklist Selector */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>CHECKLIST TEMPLATES</h4>
          {checklists.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveChecklistId(c.id)}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeChecklistId === c.id ? 'var(--primary-50)' : 'transparent',
                color: activeChecklistId === c.id ? 'var(--primary-800)' : 'var(--text-primary)',
                fontWeight: activeChecklistId === c.id ? 700 : 500,
                cursor: 'pointer',
                borderLeft: activeChecklistId === c.id ? '3px solid var(--primary-600)' : '3px solid transparent'
              }}
            >
              <div style={{ fontSize: '0.86rem' }}>{c.title}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>{c.items.length} Step SOP</div>
            </button>
          ))}
        </div>

        {/* Checklist Content */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '6px' }}>
                {activeChecklist.category}
              </span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>{activeChecklist.title}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
              <ShieldCheck size={18} /> Verified Workshop Standard
            </div>
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {activeChecklist.items.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
                </div>
                <button onClick={() => handleRemoveItem(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Item */}
          <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Add next quality verification step..."
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
            <Button variant="primary" type="submit">
              <Plus size={16} /> Add Step
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceChecklistPage;

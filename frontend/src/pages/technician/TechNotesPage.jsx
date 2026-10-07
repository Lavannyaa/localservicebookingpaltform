import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import {
  StickyNote, ShieldCheck, Check, Calendar, Wrench, AlertCircle,
  FileText, User, Building2
} from 'lucide-react';

const INITIAL_NOTES_BY_JOB = {
  'LS-2026-1001': {
    jobTitle: 'AC Jet Wash & Comprehensive Service',
    customer: 'Rahul Sharma',
    address: 'Flat 402, Green Valley Apartments, Vannarpettai',
    workPerformed: 'Indoor cooling coil deep pressure cleaned with chemical foam. Condensate tray descaled and drainage flushed. Outdoor condenser fins rinsed of road grime. Suction pressure calibrated at 125 PSI R32.',
    customerRequirements: 'Low cooling in master bedroom and water dripping from the front air deflector louver.',
    additionalObservations: 'Dual run capacitor measuring 28.5 uF against rated 35 uF (-18% degradation). Fan motor bearings in healthy condition.',
    recommendedMaintenance: 'Quarterly antibacterial coil rinse and outdoor unit condenser flush before peak summer.',
    nextMaintenanceDate: '2026-12-28'
  },
  'LS-2026-1002': {
    jobTitle: 'Electrical Wiring & Circuit Inspection',
    customer: 'Priya Sundaram',
    address: '12 South Car Street, Palayamkottai',
    workPerformed: 'Concealed conduit short-circuit troubleshooting. Re-insulated overheated neutral wire at distribution board terminal. Replaced 16A MCB breaker with Schneider C-Curve unit.',
    customerRequirements: 'Frequent tripping of kitchen circuit breaker whenever microwave and induction stove run simultaneously.',
    additionalObservations: 'Distribution board neutral link terminal was slightly loose, causing localized heating. Tightened to 2.5 Nm torque.',
    recommendedMaintenance: 'Annual main breaker trip sensitivity test and earth rod moisture salting.',
    nextMaintenanceDate: '2027-03-24'
  }
};

export const TechNotesPage = () => {
  const [selectedJob, setSelectedJob] = useState('LS-2026-1001');
  const [allNotes, setAllNotes] = useState(() => {
    const saved = localStorage.getItem('localserve_tech_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_NOTES_BY_JOB; }
    }
    return INITIAL_NOTES_BY_JOB;
  });

  const [saved, setSaved] = useState(false);

  const currentNote = allNotes[selectedJob] || {
    jobTitle: 'General Field Service',
    customer: 'Customer',
    address: 'Site Address',
    workPerformed: '',
    customerRequirements: '',
    additionalObservations: '',
    recommendedMaintenance: '',
    nextMaintenanceDate: ''
  };

  const handleFieldChange = (field, val) => {
    setAllNotes(prev => ({
      ...prev,
      [selectedJob]: {
        ...prev[selectedJob],
        [field]: val
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('localserve_tech_notes', JSON.stringify(allNotes));
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Technical Service Notes & Equipment Passport
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Record diagnostic actions, customer requirements, observations, and preventive maintenance dates for customer Service Passport entries.
          </p>
        </div>

        {/* Work Order Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Work Order:</span>
          <select
            value={selectedJob}
            onChange={e => setSelectedJob(e.target.value)}
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
            {Object.keys(allNotes).map(jobNo => (
              <option key={jobNo} value={jobNo}>{jobNo} ({allNotes[jobNo].customer})</option>
            ))}
          </select>
        </div>
      </div>

      {saved && (
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
          <Check size={18} /> Diagnostic notes and maintenance recommendation saved to customer's permanent Service Passport!
        </div>
      )}

      {/* Job Context Strip */}
      <div style={{
        background: 'var(--primary-50)',
        border: '1px solid var(--primary-200)',
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '0.86rem'
      }}>
        <div>
          <span style={{ color: 'var(--primary-900)', fontWeight: 800, fontSize: '0.96rem' }}>
            {selectedJob} · {currentNote.jobTitle}
          </span>
          <div style={{ color: 'var(--primary-700)', marginTop: '2px' }}>
            Customer: <strong>{currentNote.customer}</strong> · {currentNote.address}
          </div>
        </div>
        <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>
          Certified Tech Entry: S. Murugan
        </span>
      </div>

      {/* Main Form for 5 Mandatory Fields */}
      <form onSubmit={handleSave} style={{
        background: 'var(--bg-surface)',
        padding: '28px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Field 1: Work performed */}
        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
            1. Work Performed (Technical Procedures & Diagnostics) *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what was disassembled, repaired, calibrated, or replaced..."
            value={currentNote.workPerformed}
            onChange={e => handleFieldChange('workPerformed', e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem', lineHeight: 1.5 }}
          />
        </div>

        {/* Field 2: Customer requirements */}
        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
            2. Customer Requirements & Reported Symptoms *
          </label>
          <textarea
            required
            rows={2}
            placeholder="Reported problem description given by client during booking..."
            value={currentNote.customerRequirements}
            onChange={e => handleFieldChange('customerRequirements', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem', lineHeight: 1.5 }}
          />
        </div>

        {/* Field 3: Additional observations */}
        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
            3. Additional Observations & Equipment Health *
          </label>
          <textarea
            required
            rows={2}
            placeholder="Secondary issues noticed, wear & tear, component degradation ratings..."
            value={currentNote.additionalObservations}
            onChange={e => handleFieldChange('additionalObservations', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem', lineHeight: 1.5 }}
          />
        </div>

        {/* Field 4 & 5: Recommended maintenance & Next maintenance date */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              4. Recommended Maintenance Routine *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Quarterly chemical coil wash & pressure check"
              value={currentNote.recommendedMaintenance}
              onChange={e => handleFieldChange('recommendedMaintenance', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              5. Next Maintenance Date *
            </label>
            <input
              type="date"
              required
              value={currentNote.nextMaintenanceDate}
              onChange={e => handleFieldChange('nextMaintenanceDate', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} /> Save Notes & Update Service Passport
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TechNotesPage;

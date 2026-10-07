import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRecentlyAccessed } from '../../hooks';
import {
  Users, Search, ShieldCheck, Mail, Phone, Lock, Unlock,
  FileCheck, Calendar, IndianRupee, MapPin, Eye, CheckCircle2,
  XCircle, Filter, Sparkles
} from 'lucide-react';

export const AdminCustomersPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [customers, setCustomers] = useState([
    {
      id: 'user-cust-1',
      name: 'Rahul Sharma',
      email: 'customer@localserve.com',
      phone: '+91 98765 43210',
      city: 'Tirunelveli',
      address: 'Flat 402, Green Valley Apartments, Vannarpettai',
      bookings: 6,
      spent: 4890,
      status: 'Active',
      joinedDate: '15 Jan 2026',
      appliances: ['Daikin Inverter 1.5T Split AC', 'Kent Grand+ RO Water Purifier', 'Havells 25L Storage Geyser'],
      passportId: 'PASSPORT-TNV-2026-081',
      lastServiceDate: '28 Sep 2026'
    },
    {
      id: 'user-cust-2',
      name: 'Priya Sundaram',
      email: 'priya@gmail.com',
      phone: '+91 98765 11223',
      city: 'Tirunelveli',
      address: 'Plot 18, NGO Colony, Palayamkottai',
      bookings: 4,
      spent: 3250,
      status: 'Active',
      joinedDate: '20 Feb 2026',
      appliances: ['Voltas 1.5T Window AC', 'LG Smart Inverter Washing Machine'],
      passportId: 'PASSPORT-TNV-2026-092',
      lastServiceDate: '14 Aug 2026'
    },
    {
      id: 'user-cust-3',
      name: 'M. Ganesh',
      email: 'ganesh.m@yahoo.com',
      phone: '+91 98765 33445',
      city: 'Tirunelveli',
      address: '12 South Car Street, Town',
      bookings: 3,
      spent: 2499,
      status: 'Suspended',
      joinedDate: '05 Mar 2026',
      appliances: ['Samsung 253L Double Door Refrigerator'],
      passportId: 'PASSPORT-TNV-2026-105',
      lastServiceDate: '02 Jun 2026'
    },
    {
      id: 'user-cust-4',
      name: 'K. Balaji',
      email: 'balaji.k@gmail.com',
      phone: '+91 98765 55667',
      city: 'Tirunelveli',
      address: '77 High Grounds, Perumalpuram',
      bookings: 5,
      spent: 5120,
      status: 'Active',
      joinedDate: '12 Jan 2026',
      appliances: ['Hitachi 2T Split AC', 'AquaGuard Geneus RO'],
      passportId: 'PASSPORT-TNV-2026-077',
      lastServiceDate: '19 Sep 2026'
    },
    {
      id: 'user-cust-5',
      name: 'S. Meenakshi',
      email: 'meenakshi@gmail.com',
      phone: '+91 98765 77889',
      city: 'Tirunelveli',
      address: '33 North Bypass Road, Vannarpettai',
      bookings: 2,
      spent: 1598,
      status: 'Active',
      joinedDate: '25 Apr 2026',
      appliances: ['Bajaj 15L Geyser'],
      passportId: 'PASSPORT-TNV-2026-118',
      lastServiceDate: '10 Jul 2026'
    }
  ]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'suspended' | 'high_value'
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const toggleStatus = (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? {
      ...c,
      status: c.status === 'Active' ? 'Suspended' : 'Active'
    } : c));
  };

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);

    if (filter === 'active') return matchSearch && c.status === 'Active';
    if (filter === 'suspended') return matchSearch && c.status === 'Suspended';
    if (filter === 'high_value') return matchSearch && c.spent >= 3000;
    return matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Customer Accounts Governance
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Search, filter, view Service Passport history, and activate/deactivate customer accounts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-purple" style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}>
            {customers.filter(c => c.status === 'Active').length} Active Accounts
          </span>
        </div>
      </div>

      {/* Search and Filters */}
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
            placeholder="Search by customer name, email, or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: `All (${customers.length})` },
            { id: 'active', label: 'Active' },
            { id: 'suspended', label: 'Suspended' },
            { id: 'high_value', label: 'VIP (Spent ₹3000+)' }
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

      {/* Customers Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px 18px' }}>Customer Name</th>
              <th style={{ padding: '14px 18px' }}>Contact Information</th>
              <th style={{ padding: '14px 18px' }}>Location</th>
              <th style={{ padding: '14px 18px' }}>Bookings</th>
              <th style={{ padding: '14px 18px' }}>Lifetime Spend</th>
              <th style={{ padding: '14px 18px' }}>Passport Logbook</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Member since {c.joinedDate}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ color: 'var(--text-primary)' }}>{c.email}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.phone}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.84rem' }}>{c.city}</div>
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                  {c.bookings} orders
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>
                  ₹{c.spent.toLocaleString()}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'var(--primary-50)',
                    color: 'var(--primary-800)',
                    border: '1px solid var(--primary-200)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <FileCheck size={12} /> {c.passportId}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(c);
                        trackItem({
                          id: `admin-cust-${c.id}`,
                          type: 'Management Record',
                          title: `Customer: ${c.name}`,
                          subtitle: `${c.email} · ${c.city} (${c.bookings} bookings)`,
                          path: '/admin/customers',
                          badge: c.status,
                          role: 'admin'
                        });
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={13} /> Details
                    </Button>
                    <Button
                      variant={c.status === 'Active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => toggleStatus(c.id)}
                      style={{
                        borderColor: c.status === 'Active' ? '#fca5a5' : undefined,
                        color: c.status === 'Active' ? '#dc2626' : undefined
                      }}
                    >
                      {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal (Beyond CRUD: Service Passport & Appliance Logbook) */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Audit: ${selectedCustomer.name}`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-muted)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
              <div><strong>Email:</strong> {selectedCustomer.email}</div>
              <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
              <div><strong>City:</strong> {selectedCustomer.city}</div>
              <div><strong>Status:</strong> <span className={`badge ${selectedCustomer.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{selectedCustomer.status}</span></div>
              <div style={{ gridColumn: 'span 2' }}><strong>Service Address:</strong> {selectedCustomer.address}</div>
            </div>

            {/* Service Passport Integration */}
            <div style={{ border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '14px', background: 'var(--primary-50)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--primary-900)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCheck size={16} /> Digital Service Passport Logbook
                </strong>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  #{selectedCustomer.passportId}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary-800)', margin: '0 0 10px 0' }}>
                Tracked Appliances under Preventive Maintenance:
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {selectedCustomer.appliances.map((app, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    <strong>{app}</strong>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '10px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Last Completed Lifecycle Service: {selectedCustomer.lastServiceDate}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button
                variant={selectedCustomer.status === 'Active' ? 'outline' : 'primary'}
                onClick={() => {
                  toggleStatus(selectedCustomer.id);
                  setSelectedCustomer(prev => ({
                    ...prev,
                    status: prev.status === 'Active' ? 'Suspended' : 'Active'
                  }));
                }}
              >
                {selectedCustomer.status === 'Active' ? 'Deactivate Customer' : 'Activate Customer'}
              </Button>
              <Button variant="secondary" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminCustomersPage;

import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRecentlyAccessed } from '../../hooks';
import {
  CalendarCheck, Search, Filter, Download, ArrowUpRight,
  Eye, CheckCircle2, Clock, MapPin, User, Building2, HardHat,
  RefreshCw, ArrowRight, ShieldCheck, FileCheck, AlertTriangle
} from 'lucide-react';

export const AdminBookingsPage = () => {
  const { trackItem } = useRecentlyAccessed();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
  // Provider Assignment State
  const [eligibleProviders, setEligibleProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [assignNotice, setAssignNotice] = useState(null);

  const categories = [
    'Air Conditioner Services',
    'Electrical Repair & Installation',
    'Plumbing Services',
    'Carpentry Services',
    'Gardening & Plant Care',
    'Home Cleaning & Sanitization',
    'Construction & Masonry',
    'Vehicle Breakdown Repair',
    'Pest Control Services'
  ];

  const lifecycleStages = [
    'PENDING',
    'ACCEPTED',
    'TECHNICIAN_ASSIGNED',
    'ON_THE_WAY',
    'ARRIVED',
    'SERVICE_STARTED',
    'SERVICE_COMPLETED',
    'CANCELLED'
  ];

  const loadBookings = () => {
    bookingService.getBookings().then(data => {
      setBookings(data || []);
    });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleInspect = async (b) => {
    setSelectedBooking(b);
    setAssignNotice(null);
    setSelectedProviderId(b.providerId?._id || b.providerId || '');
    setLoadingProviders(true);
    try {
      const providers = await adminService.getEligibleProviders(b._id || b.bookingId || b.bookingNumber);
      setEligibleProviders(providers || []);
    } catch (err) {
      console.warn('Failed to fetch eligible providers:', err);
      setEligibleProviders([]);
    } finally {
      setLoadingProviders(false);
    }

    trackItem({
      id: `admin-bk-${b._id || b.bookingId}`,
      type: 'Management Record',
      title: `Booking: #${b.bookingNumber}`,
      subtitle: `${b.serviceName} · Customer: ${b.customerName}`,
      path: '/admin/bookings',
      badge: b.status,
      role: 'admin'
    });
  };

  const handleAssignProvider = async () => {
    if (!selectedBooking || !selectedProviderId) return;
    const targetId = selectedBooking._id || selectedBooking.bookingId || selectedBooking.bookingNumber;
    try {
      const res = await adminService.assignProvider(targetId, selectedProviderId);
      setAssignNotice({
        type: 'success',
        message: res.message || 'Provider assigned successfully!'
      });
      loadBookings();
      setSelectedBooking(prev => ({
        ...prev,
        providerId: selectedProviderId,
        shopName: eligibleProviders.find(p => String(p._id || p.providerId) === String(selectedProviderId))?.shopName || prev?.shopName,
        status: prev?.status === 'PENDING' ? 'ACCEPTED' : prev?.status
      }));
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Assignment failed.';
      setAssignNotice({ type: 'error', message: errMsg });
    }
  };

  const handleOpenStatusModal = (b) => {
    setStatusModalBooking(b);
    setNewStatus(b.status || 'PENDING');
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!statusModalBooking || !newStatus) return;

    const targetId = statusModalBooking._id || statusModalBooking.bookingId || statusModalBooking.bookingNumber;
    bookingService.updateBookingStatus(targetId, newStatus).then(() => {
      setBookings(prev => prev.map(b => {
        if ((b._id || b.bookingId || b.bookingNumber) === targetId) {
          return { ...b, status: newStatus };
        }
        return b;
      }));
      setStatusModalBooking(null);
    });
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (b.bookingNumber && b.bookingNumber.toLowerCase().includes(q)) ||
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.serviceName && b.serviceName.toLowerCase().includes(q)) ||
      (b.shopName && b.shopName.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q));

    const matchCategory = categoryFilter === 'all' || (b.category || '').toLowerCase().includes(categoryFilter.toLowerCase());
    const matchCity = cityFilter === 'all' || (b.city || 'Tirunelveli').toLowerCase() === cityFilter.toLowerCase();

    let matchStatus = true;
    const st = (b.status || '').toUpperCase();
    if (statusFilter === 'pending') {
      matchStatus = st === 'PENDING' || st === 'CREATED';
    } else if (statusFilter === 'accepted') {
      matchStatus = st === 'ACCEPTED' || st === 'TECHNICIAN_ASSIGNED';
    } else if (statusFilter === 'in_progress') {
      matchStatus = ['ON_THE_WAY', 'ARRIVED', 'SERVICE_STARTED'].includes(st);
    } else if (statusFilter === 'completed') {
      matchStatus = st === 'SERVICE_COMPLETED' || st === 'COMPLETED';
    } else if (statusFilter === 'cancelled') {
      matchStatus = st === 'CANCELLED' || st === 'REJECTED';
    }

    return matchSearch && matchCategory && matchCity && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Master Platform Bookings Ledger
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Cross-category supervision, provider assignment validation, and administrative status transitions.
          </p>
        </div>
        <Button variant="secondary" onClick={() => alert("Exporting master CSV ledger...")}>
          <Download size={14} /> Export CSV Ledger
        </Button>
      </div>

      {/* Multi-Parameter Filter Controls */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '18px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by booking #, customer, service, category, or workshop..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-input)',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            {/* City / Location Filter */}
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-input)',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <option value="all">All Cities / Locations</option>
              <option value="tirunelveli">Tirunelveli</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
          {[
            { id: 'all', label: `All Bookings (${bookings.length})` },
            { id: 'pending', label: 'Pending Assignment' },
            { id: 'accepted', label: 'Accepted / Dispatched' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: statusFilter === f.id ? '1px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: statusFilter === f.id ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: statusFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px 18px' }}>Booking #</th>
              <th style={{ padding: '14px 18px' }}>Category & Service</th>
              <th style={{ padding: '14px 18px' }}>Customer Details</th>
              <th style={{ padding: '14px 18px' }}>Assigned Provider Shop</th>
              <th style={{ padding: '14px 18px' }}>Technician</th>
              <th style={{ padding: '14px 18px' }}>Amount</th>
              <th style={{ padding: '14px 18px' }}>Lifecycle Status</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No bookings found matching your selected category, location, or status filter.
                </td>
              </tr>
            ) : (
              filtered.map(b => (
                <tr key={b._id || b.bookingId || b.bookingNumber} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>
                    {b.bookingNumber}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.serviceName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--primary-700)', background: 'var(--primary-50)', display: 'inline-block', padding: '2px 6px', borderRadius: '4px', marginTop: '2px' }}>
                      {b.category}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{b.city || 'Tirunelveli'}</div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.84rem' }}>
                    {b.shopName ? (
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.shopName}</span>
                    ) : (
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>Unassigned Shop</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {b.technicianName || 'Pending Dispatch'}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>
                    ₹{b.totalAmount || b.price}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <StatusBadge status={b.status} />
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleInspect(b)}
                        style={{ fontSize: '0.78rem' }}
                      >
                        <Eye size={12} /> Inspect / Assign
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenStatusModal(b)} style={{ fontSize: '0.78rem' }}>
                        Update Status
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BOOKING INSPECT & ELIGIBLE PROVIDER ASSIGNMENT MODAL */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Oversight & Provider Assignment: #${selectedBooking.bookingNumber}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {assignNotice && (
              <div style={{
                background: assignNotice.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: assignNotice.type === 'success' ? '#065f46' : '#991b1b',
                border: `1px solid ${assignNotice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {assignNotice.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {assignNotice.message}
              </div>
            )}

            {/* Comprehensive Booking Details Summary */}
            <div style={{
              background: 'var(--bg-muted)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.84rem'
            }}>
              <div><strong>Requested Category:</strong> <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{selectedBooking.category}</span></div>
              <div><strong>Service Name:</strong> {selectedBooking.serviceName}</div>
              <div><strong>Customer Name:</strong> {selectedBooking.customerName} ({selectedBooking.customerPhone || '+91 98401 23456'})</div>
              <div><strong>Scheduled Date & Time:</strong> {selectedBooking.bookingDate} ({selectedBooking.bookingTime})</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Service Delivery Address:</strong> {selectedBooking.serviceAddress || selectedBooking.address}</div>
              <div><strong>Current Lifecycle Status:</strong> <StatusBadge status={selectedBooking.status} /></div>
              <div><strong>Currently Assigned Shop:</strong> {selectedBooking.shopName || 'None'}</div>
            </div>

            {/* Provider Eligibility Assignment Section */}
            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px', background: 'var(--bg-surface)' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={18} color="var(--primary-600)" /> Assign Eligible Provider Shop
              </h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Shows providers registered in database offering <strong>{selectedBooking.category}</strong>. Assignment to non-matching categories is strictly blocked.
              </p>

              {loadingProviders ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Evaluating database eligibility rules for {selectedBooking.category}...
                </div>
              ) : eligibleProviders.length === 0 ? (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  color: '#b45309',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <AlertTriangle size={20} />
                  <span>No eligible registered providers in <strong>{selectedBooking.city || 'Tirunelveli'}</strong> found offering <strong>{selectedBooking.category}</strong>.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {eligibleProviders.map(p => {
                    const idVal = p.providerId || p._id;
                    const isSelected = String(selectedProviderId) === String(idVal) || String(selectedProviderId) === String(p._id);
                    const specs = Array.isArray(p.specialization) ? p.specialization.join(', ') : p.specialization;

                    return (
                      <label
                        key={idVal}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          background: isSelected ? 'var(--primary-50)' : 'transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="radio"
                            name="eligibleProvider"
                            checked={isSelected}
                            onChange={() => setSelectedProviderId(p._id || p.providerId)}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                              {p.shopName}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {p.shopAddress}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--primary-700)', marginTop: '2px', fontWeight: 600 }}>
                              Category Trade: {specs}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', fontSize: '0.78rem' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            ★ {p.rating || 4.8} Verified
                          </span>
                        </div>
                      </label>
                    );
                  })}

                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" onClick={handleAssignProvider} disabled={!selectedProviderId}>
                      Assign Provider to Booking
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Status Modal */}
      {statusModalBooking && (
        <Modal
          isOpen={!!statusModalBooking}
          onClose={() => setStatusModalBooking(null)}
          title={`Update Status: #${statusModalBooking.bookingNumber}`}
          maxWidth="460px"
        >
          <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '0.86rem' }}>
              Current Status: <strong>{statusModalBooking.status}</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Select New Lifecycle State
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-input)',
                  fontSize: '0.88rem'
                }}
              >
                {lifecycleStages.map((stg, idx) => (
                  <option key={idx} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setStatusModalBooking(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Apply Status Transition
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminBookingsPage;

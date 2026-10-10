import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { technicianService } from '../../services/technicianService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import {
  Briefcase, Calendar, MapPin, Phone, ArrowRight, Search, Filter,
  CheckCircle2, Navigation, Clock, Building2, CheckSquare, ShieldCheck
} from 'lucide-react';

export const AssignedJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState('');

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  useEffect(() => {
    technicianService.getJobs().then(data => {
      setJobs(data || []);
      setFiltered(data || []);
    });
  }, []);

  useEffect(() => {
    let res = [...jobs];
    if (statusFilter !== 'All') {
      res = res.filter(j => {
        const st = (j.status || '').toLowerCase().trim();
        if (statusFilter === 'Assigned') return st === 'assigned' || st === 'technician assigned';
        if (statusFilter === 'Active') return ['accepted', 'on the way', 'arrived', 'service started', 'in progress'].includes(st);
        if (statusFilter === 'Completed') return st === 'completed' || st === 'service completed';
        return st === statusFilter.toLowerCase();
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(j =>
        (j.bookingNumber && j.bookingNumber.toLowerCase().includes(q)) ||
        (j.serviceName && j.serviceName.toLowerCase().includes(q)) ||
        (j.customerName && j.customerName.toLowerCase().includes(q)) ||
        (j.address && j.address.toLowerCase().includes(q))
      );
    }
    setFiltered(res);
  }, [statusFilter, search, jobs]);

  const advanceJobStatus = (bookingId, nextStatus) => {
    bookingService.updateBookingStatus(bookingId, nextStatus).then(updated => {
      setJobs(prev => prev.map(j => j.bookingId === bookingId ? { ...j, status: nextStatus } : j));
      showNotice(`Work order updated to "${nextStatus}"!`);
    });
  };

  const statuses = ['All', 'Assigned', 'Active', 'Accepted', 'On The Way', 'Arrived', 'Service Started', 'Completed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Assigned Work Orders
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Field service tasks dispatched to technician S. Murugan by FrostTech AC Solutions & Kumar Electricals.
          </p>
        </div>

        <Link to="/technician/schedule">
          <Button variant="secondary" size="sm">
            <Calendar size={15} /> View Today's Schedule
          </Button>
        </Link>
      </div>

      {notification && (
        <div style={{
          background: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* Filter and Search Bar */}
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
            placeholder="Search work order #, customer name, address, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: statusFilter === st ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: statusFilter === st ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Job Orders List */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            No Assigned Jobs Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            No work orders matched your search or status filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(job => {
            const st = (job.status || '').toLowerCase().trim();
            const isAssigned = st === 'assigned' || st === 'technician assigned' || st === 'pending';
            const isAccepted = st === 'accepted';
            const isOnTheWay = st === 'on the way';
            const isArrived = st === 'arrived';
            const isStarted = st === 'service started' || st === 'in progress';
            const isCompleted = st === 'completed' || st === 'service completed';

            return (
              <div
                key={job.bookingId}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: isStarted ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                  padding: '22px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '18px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                      {job.serviceName}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                      {job.bookingNumber}
                    </span>
                    <StatusBadge status={job.status} />
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Attached Workshop: <strong>{job.providerName || 'FrostTech AC Solutions'}</strong> · Rate: <strong style={{ color: 'var(--primary-700)' }}>₹{job.price}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} color="var(--primary-600)" /> {job.bookingDate} ({job.bookingTime})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="var(--primary-600)" /> {job.address}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Phone size={14} color="var(--primary-600)" /> {job.customerName} ({job.customerPhone})
                    </span>
                  </div>
                </div>

                {/* Flow Action Triggers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {isAssigned && (
                    <Button variant="primary" size="sm" onClick={() => advanceJobStatus(job.bookingId, 'Accepted')}>
                      Accept Job
                    </Button>
                  )}
                  {isAccepted && (
                    <Button variant="primary" size="sm" onClick={() => advanceJobStatus(job.bookingId, 'On The Way')} style={{ background: '#d97706', borderColor: '#d97706' }}>
                      <Navigation size={14} /> Mark On The Way
                    </Button>
                  )}
                  {isOnTheWay && (
                    <Button variant="primary" size="sm" onClick={() => advanceJobStatus(job.bookingId, 'Arrived')} style={{ background: '#2563eb', borderColor: '#2563eb' }}>
                      <MapPin size={14} /> Mark Arrived
                    </Button>
                  )}
                  {isArrived && (
                    <Button variant="primary" size="sm" onClick={() => advanceJobStatus(job.bookingId, 'Service Started')}>
                      Start Service
                    </Button>
                  )}
                  {isStarted && (
                    <Button variant="success" size="sm" onClick={() => navigate(`/technician/jobs/${job.bookingId}`)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Complete Service
                    </Button>
                  )}
                  {isCompleted && (
                    <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={16} /> Certified Complete
                    </span>
                  )}

                  <Link to={`/technician/jobs/${job.bookingId}`}>
                    <Button variant="outline" size="sm">
                      Job Details <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedJobsPage;

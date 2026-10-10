import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, Wrench, RefreshCw, XCircle } from 'lucide-react';

export const StatusBadge = ({ status = 'Unknown', showIcon = true, size = 'sm', className = '', style = {} }) => {
  const raw = String(status || '').trim();
  const s = raw.toLowerCase().replace(/_/g, ' ').trim();

  let badgeClass = 'badge-purple';
  let IconComponent = Wrench;

  if ([
    'completed', 'service completed', 'available', 'active', 'resolved', 'top rated',
    'verified', 'confirmed', 'success', 'paid', 'approved', 'pass'
  ].includes(s)) {
    badgeClass = 'badge-success';
    IconComponent = CheckCircle2;
  } else if ([
    'pending', 'on the way', 'technician assigned', 'technician accepted', 'busy',
    'due soon', 'medium', 'scheduled', 'in progress', 'service started',
    'assigned', 'dispatched'
  ].includes(s)) {
    badgeClass = 'badge-warning';
    IconComponent = Clock;
  } else if ([
    'accepted', 'arrived', 'warranty', 'guaranteed', 'certified'
  ].includes(s)) {
    badgeClass = 'badge-purple';
    IconComponent = ShieldCheck;
  } else if ([
    'cancelled', 'rejected', 'offline', 'inactive', 'high', 'urgent',
    'closed', 'failed', 'overdue', 'expired'
  ].includes(s)) {
    badgeClass = 'badge-danger';
    IconComponent = XCircle;
  }

  // Format label nicely (e.g. TECHNICIAN_ASSIGNED -> Technician Assigned)
  const displayLabel = raw
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`badge ${badgeClass} ${className}`.trim()} style={style}>
      {showIcon && <IconComponent size={iconSize} />}
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useServices, useProviders, useBookings, useAuth } from '../../hooks';
import { isProviderEligible, findEligibleProviderForService } from '../../utils/providerEligibility';
import {
  Calendar, Clock, MapPin, Building2, ShieldCheck, CheckCircle2, ArrowRight,
  RefreshCw, Award, History, Sparkles
} from 'lucide-react';
import { notificationService, NOTIFICATION_TYPES } from '../../services/notificationService';

export const BookingPage = () => {
  const { serviceId, id } = useParams();
  const [searchParams] = useSearchParams();
  const activeId = serviceId || id || searchParams.get('serviceId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { services } = useServices(true);
  const { providers } = useProviders(true);
  const { draftBooking, createBooking } = useBookings();

  // Book Again parameters
  const isBookAgain = searchParams.get('mode') === 'book-again';
  const paramAppliance = searchParams.get('appliance') || '';
  const paramProviderName = searchParams.get('providerName') || '';
  const paramProviderId = searchParams.get('providerId') || '';
  const paramLastDate = searchParams.get('lastDate') || '';
  const paramNextSuggestedDate = searchParams.get('nextSuggestedDate') || '';
  const paramPreviousBooking = searchParams.get('previousBooking') || '';

  const [service, setService] = useState(draftBooking.service);
  const [provider, setProvider] = useState(draftBooking.provider);
  const [date, setDate] = useState(
    paramNextSuggestedDate || draftBooking.date || new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState(draftBooking.timeSlot || '09:00 AM - 10:30 AM');
  const [address, setAddress] = useState(draftBooking.address || 'Flat 402, Green Valley Apartments, Vannarpettai, Tirunelveli');
  const [requirements, setRequirements] = useState(
    draftBooking.requirements ||
    (isBookAgain && paramAppliance
      ? `Scheduled preventive maintenance overhaul for ${paramAppliance}. Please review previous checklist and calibrate operating parameters.`
      : '')
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadBookingDetails() {
      if (!activeId) return;

      let s = services.find(
        x => x.serviceId === activeId ||
             (x._id && x._id.toString() === activeId.toString()) ||
             (x.serviceName && x.serviceName.toLowerCase() === activeId.toLowerCase()) ||
             (x.name && x.name.toLowerCase() === activeId.toLowerCase())
      ) || draftBooking.service;

      if (!s) {
        try {
          s = await serviceService.getServiceById(activeId);
        } catch (err) {
          console.warn('[BookingPage] Failed to fetch service by ID:', err);
        }
      }

      if (s) {
        setService(s);

        let p = null;
        if (paramProviderId) {
          p = providers.find(x => x.providerId === paramProviderId);
        } else if (paramProviderName) {
          p = providers.find(x => x.shopName.toLowerCase() === paramProviderName.toLowerCase());
        }
        if (!p || !isProviderEligible(p, s)) {
          const eligibleProv = findEligibleProviderForService(s, providers);
          p = eligibleProv || (isProviderEligible(draftBooking.provider, s) ? draftBooking.provider : null);
        }
        setProvider(p);
      }
    }

    loadBookingDetails();
  }, [activeId, services, providers, draftBooking, paramProviderId, paramProviderName]);

  if (!service) return null;

  const platformFee = 49;
  const totalAmount = Number(service.basePrice) + platformFee;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const newBooking = await createBooking({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      category: service.category,
      providerId: provider?.providerId || null,
      providerName: provider?.shopName || 'No eligible provider assigned',
      customerId: user?.userId || 'user-cust-1',
      customerName: user?.name || 'Rahul Sharma',
      customerPhone: user?.phone || '+91 98765 43210',
      address,
      bookingDate: date,
      bookingTime: timeSlot,
      price: service.basePrice,
      platformFee,
      totalAmount,
      requirements,
      bookingType: isBookAgain ? 'Preventive Maintenance Routine' : 'Standard Service',
      applianceTracked: paramAppliance || service.serviceName,
      previousBookingRef: paramPreviousBooking || null
    });
    // Trigger lifecycle notification: Booking Created
    notificationService.triggerLifecycleEvent(NOTIFICATION_TYPES.BOOKING_CREATED, newBooking);
    setSubmitting(false);
    navigate(`/booking/confirmation?id=${newBooking.bookingId}&mode=${isBookAgain ? 'book-again' : 'standard'}`);
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        <Breadcrumb items={[
          { label: 'Services', path: '/services' },
          { label: service.serviceName, path: `/services/${service.serviceId}` },
          { label: isBookAgain ? 'Book Again (Maintenance)' : 'Booking Checkout' }
        ]} />

        {/* Highlight Banner if Book Again Mode */}
        {isBookAgain && (
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RefreshCw size={24} color="#93c5fd" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                  BOOK AGAIN · PRE-FILLED MAINTENANCE OVERHAUL
                </span>
                {paramPreviousBooking && (
                  <span style={{ fontSize: '0.74rem', color: '#bfdbfe' }}>
                    Ref Booking: <strong>#{paramPreviousBooking}</strong>
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                Preventive Cycle for {paramAppliance || service.serviceName}
              </h2>
              <div style={{ fontSize: '0.86rem', color: '#dbeafe', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {paramLastDate && <span>Last Overhaul: <strong>{paramLastDate}</strong></span>}
                {paramNextSuggestedDate && <span>Recommended Target Date: <strong>{paramNextSuggestedDate}</strong></span>}
                <span>Passport ID: <strong>PASSPORT-TNV-2026-081</strong></span>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {isBookAgain ? 'Confirm Maintenance Appointment' : 'Book Service Appointment'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            {isBookAgain
              ? 'Your previous service records, appliance specifications, and preferred workshop have been pre-filled.'
              : 'Select arrival schedule, confirm location, and review standardized invoice breakdown.'}
          </p>
        </div>

        <form onSubmit={handleConfirm} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Selected Service & Shop Summary */}
            <Card>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--primary-600)" />
                Service & Workshop Partner
              </h3>
              <div style={{ background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>{service.serviceName}</h4>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Assigned Shop: <strong>{provider?.shopName}</strong> ({provider?.area || 'Tirunelveli Central'})
                  </span>
                  {isBookAgain && (
                    <div style={{ marginTop: '4px', fontSize: '0.78rem', color: 'var(--success-text)', fontWeight: 700 }}>
                      ✓ Pre-matched with previous certified workshop
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-700)' }}>₹{service.basePrice}</span>
              </div>
            </Card>

            {/* Schedule Selection */}
            <Card>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--primary-600)" />
                Preferred Arrival Window
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <Input
                  label="Service Date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Select
                  label="Time Window"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  options={(service.availableSlots || [
                    "09:00 AM - 10:30 AM",
                    "10:30 AM - 12:00 PM",
                    "02:00 PM - 03:30 PM",
                    "03:30 PM - 05:00 PM"
                  ]).map(s => ({ value: s, label: s }))}
                />
              </div>
              {isBookAgain && paramNextSuggestedDate && (
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                  💡 Auto-set to the recommended {paramAppliance ? paramAppliance : 'appliance'} overhaul date ({paramNextSuggestedDate}). You can adjust if preferred.
                </div>
              )}
            </Card>

            {/* Address and Notes */}
            <Card>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="var(--primary-600)" />
                Service Delivery Address
              </h3>
              <Input
                label="Doorstep Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/Flat No, Apartment, Street, City"
                style={{ marginBottom: '14px' }}
              />

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Specific Appliance Issue / Job Requirements
                </label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g. Model, error codes, specific symptoms..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Right: Invoice Summary */}
          <Card style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Service Base Fee:</span>
                <span style={{ fontWeight: 600 }}>₹{service.basePrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Platform Insurance:</span>
                <span style={{ fontWeight: 600 }}>₹{platformFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                <span>Total Payable:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div style={{
              background: 'var(--success-bg)',
              color: 'var(--success-text)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> Covered by 30-Day LocalServe Warranty
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', opacity: 0.9 }}>
                <CheckCircle2 size={14} /> Automatically logged to Service Passport
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth loading={submitting}>
              {isBookAgain ? 'Confirm & Schedule Maintenance' : 'Confirm & Dispatch'}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
};

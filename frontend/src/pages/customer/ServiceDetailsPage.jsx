import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { RatingStars } from '../../components/common/RatingStars';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useServices, useProviders, useBookings, useRecentlyAccessed } from '../../hooks';
import { findEligibleProviderForService } from '../../utils/providerEligibility';
import { serviceService } from '../../services/serviceService';
import {
  Clock, ShieldCheck, Building2, MapPin, CheckCircle2,
  Award, Phone, Calendar, ArrowRight, Star
} from 'lucide-react';

export const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services } = useServices(true);
  const { providers } = useProviders(true);
  const { setDraft } = useBookings();
  const { trackItem } = useRecentlyAccessed();

  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("09:00 AM - 10:30 AM");

  useEffect(() => {
    let isMounted = true;
    async function loadServiceDetails() {
      if (!id) return;

      let found = services.find(
        s => s.serviceId === id ||
             (s._id && s._id.toString() === id.toString()) ||
             (s.serviceName && s.serviceName.toLowerCase() === id.toLowerCase()) ||
             (s.name && s.name.toLowerCase() === id.toLowerCase())
      );

      if (!found) {
        try {
          found = await serviceService.getServiceById(id);
        } catch (err) {
          console.warn('[ServiceDetailsPage] API getServiceById failed:', err);
        }
      }

      if (isMounted && found) {
        setService(found);

        const prov = findEligibleProviderForService(found, providers);
        setProvider(prov);

        if (found.availableSlots && found.availableSlots.length > 0) {
          setSelectedSlot(found.availableSlots[0]);
        }

        // Track live access for customer
        trackItem({
          id: found.serviceId || found._id,
          type: 'Service',
          title: found.serviceName || found.name,
          subtitle: prov?.shopName || found.category,
          path: `/services/${found.serviceId || found._id}`,
          price: found.basePrice || found.startingPrice,
          rating: found.rating
        });
      }
    }

    loadServiceDetails();
    return () => { isMounted = false; };
  }, [id, services, providers, trackItem]);

  if (!service) {
    return (
      <div style={{ flex: 1, padding: '60px 0' }}><LoadingSpinner message="Loading service details..." /></div>
    );
  }

  const platformFee = 49;
  const totalAmount = Number(service.basePrice) + platformFee;

  const handleBookNow = () => {
    setDraft({
      service,
      provider,
      timeSlot: selectedSlot
    });
    navigate(`/booking/${service.serviceId}`);
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container">
          <Breadcrumb items={[
            { label: 'Services', path: '/services' },
            { label: service.category, path: `/services?category=${encodeURIComponent(service.category)}` },
            { label: service.serviceName }
          ]} />

          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '30px', alignItems: 'flex-start' }}>
            {/* Left Column: Details, Benefits, Provider Card, Checklist */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-purple">{service.category}</span>
                <StatusBadge status={service.availability} />
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.25 }}>
                {service.serviceName}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <RatingStars rating={service.rating} reviewCount={service.reviewCount} size={18} />
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={16} color="var(--primary-600)" /> Estimated {service.estimatedDuration}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--success-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} /> 30-Day Work Warranty
                </span>
              </div>

              {/* Description Card */}
              <Card style={{ marginBottom: '26px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>Scope of Work & Technical Diagnostic</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  {service.description}
                </p>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px' }}>Key Service Benefits:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {(service.benefits || [
                    "Certified Commercial Technician",
                    "Quality Assured Diagnostic",
                    "On-Time Arrival Guarantee",
                    "30-Day Work Warranty"
                  ]).map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} color="var(--success-text)" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Assigned Commercial Workshop Section */}
              {provider ? (
                <Card style={{ marginBottom: '26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={26} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{provider.shopName}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>{Array.isArray(provider.specialization) ? provider.specialization.join(', ') : provider.specialization}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" size="sm" onClick={() => navigate('/nearby-providers')}>
                        Nearby Providers
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/providers/${provider.providerId}`)}>
                        View Shop Profile
                      </Button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)', background: 'var(--bg-muted)', padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
                    <div><strong>Location:</strong> {provider.location || provider.city}</div>
                    <div><strong>Service Radius:</strong> {provider.serviceArea || '15 km radius'}</div>
                    <div><strong>Hours:</strong> {provider.workingHours}</div>
                    <div><strong>Experience:</strong> {provider.experience}</div>
                  </div>
                </Card>
              ) : (
                <Card style={{ marginBottom: '26px', background: '#fffbe8', border: '1px solid #fde047' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#854d0e', fontWeight: 700, fontSize: '0.92rem' }}>
                    <Building2 size={20} color="#ca8a04" />
                    <span>No verified providers are currently available for this service.</span>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column: Pricing Breakdown & Instant Booking Drawer */}
            <Card style={{ position: 'sticky', top: '90px' }}>
              <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>UPFRONT FIXED RATE</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary-700)' }}>₹{service.basePrice}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Starting Base Fee</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--success-text)', fontWeight: 600, marginTop: '4px' }}>
                  ✓ Transparent rate card with zero surge fees
                </p>
              </div>

              {/* Available Slots */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Select Arrival Window:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {(service.availableSlots || [
                    "09:00 AM - 10:30 AM",
                    "10:30 AM - 12:00 PM",
                    "02:00 PM - 03:30 PM",
                    "03:30 PM - 05:00 PM"
                  ]).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedSlot === slot ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                        background: selectedSlot === slot ? 'var(--primary-50)' : 'var(--bg-surface)',
                        color: selectedSlot === slot ? 'var(--primary-800)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: selectedSlot === slot ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: 'var(--bg-muted)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Service Base Charge:</span>
                  <span style={{ fontWeight: 600 }}>₹{service.basePrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Platform & Insurance Fee:</span>
                  <span style={{ fontWeight: 600 }}>₹{platformFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '8px', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  <span>Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <Button size="lg" fullWidth onClick={handleBookNow} icon={ArrowRight}>
                Book Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
  );
};

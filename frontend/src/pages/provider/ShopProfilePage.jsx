import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RatingStars } from '../../components/common/RatingStars';
import {
  Building2, ShieldCheck, Check, MessageSquare, Wrench, Edit3, Save, Plus, Compass
} from 'lucide-react';

export const ShopProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    shopName: 'Kumar Electricals & Rewinding Works',
    ownerName: 'Ravi Kumar',
    address: '124 South Bypass Road, Palayamkottai, Tirunelveli - 627005',
    city: 'Tirunelveli',
    serviceArea: 'Palayamkottai & Perumalpuram (15 km radius)',
    specialization: 'Electrical Repair, Rewinding & Appliances',
    experience: 12,
    workingHours: '08:30 AM - 08:30 PM',
    availability: 'AVAILABLE',
    rating: 4.85,
    reviewCount: 38,
    licenseNo: 'PRV-TNV-002',
    gstin: '33AABCU9603R1ZM',
    phone: '+91 98421 23456',
    email: 'kumar.electricals@localserve.com',
    latitude: 8.7180,
    longitude: 77.7490,
    tagline: 'Master Electrical Contractor & Workshop',
    servicesOffered: [
      'Electrical Wiring & Short Circuit Fix',
      'Fan Installation & Rewinding',
      'Switch & Socket Repair',
      'AC Comprehensive Service'
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newServiceTag, setNewServiceTag] = useState('');
  const [, setLoading] = useState(true);
  const [shopServices, setShopServices] = useState([
    { serviceId: 'srv-1', serviceName: 'Electrical Wiring & Short Circuit Fix', basePrice: 499, estimatedDuration: '1 hr' },
    { serviceId: 'srv-2', serviceName: 'Fan Installation & Rewinding', basePrice: 350, estimatedDuration: '45 mins' },
    { serviceId: 'srv-3', serviceName: 'Switch & Socket Repair', basePrice: 200, estimatedDuration: '30 mins' }
  ]);
  useEffect(() => {
    providerService.getProfile().then(data => {
      if (data) {
        setProfile({
          shopName: data.shopName || '',
          ownerName: data.providerName || '',
          address: data.shopAddress || '',
          city: data.city || 'Tirunelveli',
          serviceArea: data.serviceArea || 'Tirunelveli (25 km radius)',
          specialization: Array.isArray(data.specialization) ? data.specialization.join(', ') : (data.specialization || ''),
          experience: data.experience || 5,
          workingHours: data.workingHours || '08:30 AM - 08:30 PM',
          availability: data.availabilityStatus || 'AVAILABLE',
          rating: data.rating || 4.85,
          reviewCount: data.reviewCount || 0,
          licenseNo: data.providerId || 'TN-TNV-2026',
          gstin: '33AABCU9603R1ZM',
          phone: data.phone || data.phoneNumber || '+91 98421 23456',
          email: data.email || 'workshop@localserve.in',
          latitude: data.latitude || 8.7180,
          longitude: data.longitude || 77.7490,
          tagline: `${Array.isArray(data.specialization) && data.specialization.length ? data.specialization[0] : 'Certified Service'} Workshop`,
          servicesOffered: Array.isArray(data.servicesOffered) ? data.servicesOffered.map(s => s.name || s) : ['General Repair']
        });
        if (Array.isArray(data.servicesOffered) && data.servicesOffered.length > 0 && typeof data.servicesOffered[0] === 'object') {
          setShopServices(data.servicesOffered.map((s, idx) => ({
            serviceId: s._id || s.serviceId || `srv-${idx}`,
            serviceName: s.name || s.serviceName || String(s),
            basePrice: s.price || s.basePrice || 499,
            estimatedDuration: s.duration || s.estimatedDuration || '1 hr'
          })));
        }
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        shopName: profile.shopName,
        providerName: profile.ownerName,
        shopAddress: profile.address,
        city: profile.city,
        serviceArea: profile.serviceArea,
        specialization: profile.specialization,
        experience: Number(profile.experience),
        workingHours: profile.workingHours,
        availabilityStatus: profile.availability,
        latitude: Number(profile.latitude),
        longitude: Number(profile.longitude),
        phone: profile.phone
      };
      await providerService.updateProfile(payload);
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error('Failed to save workshop profile to MongoDB:', err);
    }
  };

  const handleGeocodeAddress = async () => {
    if (!profile.address && !profile.city) return;
    try {
      const queryStr = `${profile.address}, ${profile.city}, Tamil Nadu, India`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}`);
      const results = await res.json();
      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        setProfile(prev => ({ ...prev, latitude: lat, longitude: lon }));
      }
    } catch (e) {
      console.warn('Geocoding resolution fallback:', e);
    }
  };

  const handleAddServiceTag = (e) => {
    e.preventDefault();
    if (!newServiceTag.trim()) return;
    if (!profile.servicesOffered.includes(newServiceTag.trim())) {
      setProfile({
        ...profile,
        servicesOffered: [...profile.servicesOffered, newServiceTag.trim()]
      });
    }
    setNewServiceTag('');
  };

  const handleRemoveServiceTag = (tag) => {
    setProfile({
      ...profile,
      servicesOffered: profile.servicesOffered.filter(s => s !== tag)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Workshop Business Profile
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Public commercial storefront visible to customers across the LocalServe marketplace.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={16} /> Save Changes
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Edit3 size={16} /> Edit Shop Profile
            </Button>
          )}
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
          <Check size={18} /> Workshop commercial details saved and synchronized across the marketplace!
        </div>
      )}

      {/* Main Shop Overview Card */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '30px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '22px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px', marginBottom: '24px' }}>
          {/* Strictly Commercial Storefront Icon - NO personal photo */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
          }}>
            <Building2 size={42} />
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {profile.shopName}
              </h2>
              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Verified Commercial Partner
              </span>
              <StatusBadge status={profile.availability} />
            </div>

            <p style={{ margin: '0 0 10px 0', color: 'var(--primary-700)', fontWeight: 600, fontSize: '0.92rem' }}>
              {profile.tagline}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span><strong>Owner / Registered Contractor:</strong> {profile.ownerName}</span>
              <span>•</span>
              <span><strong>License:</strong> {profile.licenseNo}</span>
              <span>•</span>
              <span><strong>GSTIN:</strong> {profile.gstin}</span>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-muted)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--primary-700)', lineHeight: 1 }}>
              {profile.rating}
            </div>
            <RatingStars rating={profile.rating} size={15} />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {profile.reviewCount} Verified Reviews
            </div>
          </div>
        </div>

        {/* 12 Mandatory Data Points Grid */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
          Commercial Registration & Workshop Specifications
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>1. Business / Shop Name *</label>
              <input
                type="text"
                required
                value={profile.shopName}
                onChange={e => setProfile({ ...profile, shopName: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>2. Owner / Provider Name *</label>
              <input
                type="text"
                required
                value={profile.ownerName}
                onChange={e => setProfile({ ...profile, ownerName: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>3. City *</label>
              <input
                type="text"
                required
                value={profile.city}
                onChange={e => setProfile({ ...profile, city: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>4. Service Area / Radius *</label>
              <input
                type="text"
                required
                value={profile.serviceArea}
                onChange={e => setProfile({ ...profile, serviceArea: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>5. Trade Specialization *</label>
              <input
                type="text"
                required
                value={profile.specialization}
                onChange={e => setProfile({ ...profile, specialization: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>6. Commercial Experience *</label>
              <input
                type="text"
                required
                value={profile.experience}
                onChange={e => setProfile({ ...profile, experience: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>7. Working Hours *</label>
              <input
                type="text"
                required
                value={profile.workingHours}
                onChange={e => setProfile({ ...profile, workingHours: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>8. Operational Availability *</label>
              <select
                value={profile.availability}
                onChange={e => setProfile({ ...profile, availability: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              >
                <option value="Available">Available (Open & Dispatching)</option>
                <option value="Busy">Busy (Limited Slots)</option>
                <option value="Offline">Offline / Closed</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>9. Business Address *</label>
              <textarea
                rows={2}
                required
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>10. Shop Latitude (°N)</label>
              <input
                type="number"
                step="any"
                required
                value={profile.latitude || 8.7180}
                onChange={e => setProfile({ ...profile, latitude: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>11. Shop Longitude (°E)</label>
              <input
                type="number"
                step="any"
                required
                value={profile.longitude || 77.7490}
                onChange={e => setProfile({ ...profile, longitude: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              <Button type="button" variant="outline" onClick={handleGeocodeAddress} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={16} /> Resolve Coordinates from Address (Map Geocoder)
              </Button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Workshop Profile to Database</Button>
              </div>
            </div>
          </form>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>BUSINESS / SHOP NAME</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.shopName}</div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>OWNER / PROVIDER NAME</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.ownerName}</div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>CITY</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.city}</div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>SERVICE AREA & RADIUS</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.serviceArea}</div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>SPECIALIZATION</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.specialization}</div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>COMMERCIAL EXPERIENCE</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.experience}</div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>WORKING HOURS</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.workingHours}</div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>AVAILABILITY STATUS</span>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge status={profile.availability} />
              </div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>GPS SHOP COORDINATES</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-700)', marginTop: '2px' }}>
                {profile.latitude ? `${profile.latitude.toFixed(4)}°N, ${profile.longitude ? profile.longitude.toFixed(4) : 0}°E` : 'Not Set'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-muted)', padding: '14px 18px', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>BUSINESS PHYSICAL ADDRESS</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{profile.address}</div>
            </div>
          </div>
        )}
      </div>

      {/* Services Offered Section (Relationship: One Shop -> Multiple Services) */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              Services Offered ({profile.servicesOffered.length})
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Direct workshop services linked to {profile.shopName}.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/provider/services')}>
            <Wrench size={14} /> Open Service Catalog Manager
          </Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {profile.servicesOffered.map((tag, idx) => (
            <span
              key={idx}
              style={{
                background: 'var(--primary-50)',
                color: 'var(--primary-800)',
                border: '1px solid var(--primary-200)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tag}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleRemoveServiceTag(tag)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontWeight: 800 }}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>

        {isEditing && (
          <form onSubmit={handleAddServiceTag} style={{ display: 'flex', gap: '10px', maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="Add another service offering tag..."
              value={newServiceTag}
              onChange={e => setNewServiceTag(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.86rem' }}
            />
            <Button variant="secondary" size="sm" type="submit">
              <Plus size={14} /> Add Tag
            </Button>
          </form>
        )}

        {/* Live linked services cards */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Active Catalog Items Linked ({shopServices.length}):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '10px' }}>
            {shopServices.slice(0, 4).map(s => (
              <div key={s.serviceId} style={{ background: 'var(--bg-muted)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.serviceName}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>₹{s.basePrice} · {s.estimatedDuration}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating & Reviews Section */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              Customer Reviews & Reputation ({profile.reviewCount})
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Verified customer feedback and workshop star ratings.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/provider/reviews')}>
            <MessageSquare size={14} /> View All Reviews & Replies
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {shopReviews.map(r => (
            <div
              key={r.reviewId}
              style={{
                background: 'var(--bg-muted)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{r.customerName}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '10px' }}>{r.date}</span>
                </div>
                <RatingStars rating={r.rating} size={15} />
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                "{r.comment}"
              </p>
              {r.providerReply && (
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-800)', background: 'var(--primary-50)', padding: '6px 12px', borderRadius: '4px', borderLeft: '3px solid var(--primary-600)' }}>
                  <strong>Workshop Reply:</strong> {r.providerReply}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopProfilePage;

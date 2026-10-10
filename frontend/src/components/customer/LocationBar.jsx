import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Search, CheckCircle2, AlertCircle, Loader2, Bookmark, Info } from 'lucide-react';
import { Button } from '../common/Button';
import { locationService } from '../../services/locationService';

export const LocationBar = ({ onLocationChange, currentLocationLabel, selectedCity = 'all' }) => {
  const [addressInput, setAddressInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cityWarning, setCityWarning] = useState(null);
  const [activeLocation, setActiveLocation] = useState(currentLocationLabel || 'Central Tirunelveli');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [lastCoords, setLastCoords] = useState(null);

  useEffect(() => {
    const list = locationService.getSavedAddresses();
    setSavedAddresses(list);
  }, []);

  useEffect(() => {
    // Validate city mismatch
    const val = locationService.validateCityMatch(activeLocation, selectedCity);
    setCityWarning(val.warning);
  }, [activeLocation, selectedCity]);

  const handleUseGPS = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const pos = await locationService.getCurrentPosition();
      const label = pos.label || `GPS (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`;
      setActiveLocation(label);
      setLastCoords({ lat: pos.lat, lng: pos.lng, label });
      setShowSaveBtn(true);
      if (onLocationChange) {
        onLocationChange({ lat: pos.lat, lng: pos.lng, label });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not acquire GPS position.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeocodeSearch = async (e) => {
    if (e) e.preventDefault();
    if (!addressInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const coords = await locationService.geocodeAddress(addressInput);
      const label = coords.label || addressInput;
      setActiveLocation(label);
      setLastCoords({ lat: coords.lat, lng: coords.lng, label });
      setShowSaveBtn(true);
      if (onLocationChange) {
        onLocationChange({ lat: coords.lat, lng: coords.lng, label });
      }
    } catch (err) {
      setErrorMsg('Could not find latitude/longitude for this address. Please try area name or pincode.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSaved = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const found = savedAddresses.find(a => a.id === selectedId);
    if (found) {
      setActiveLocation(found.label);
      setAddressInput(found.label);
      if (onLocationChange) {
        onLocationChange({ lat: found.lat, lng: found.lng, label: found.label });
      }
    }
  };

  const handleSaveCurrentAddress = () => {
    if (!lastCoords) return;
    const updated = locationService.saveAddress({
      name: addressInput ? `Address: ${addressInput.slice(0, 15)}` : 'Saved Location',
      label: lastCoords.label,
      lat: lastCoords.lat,
      lng: lastCoords.lng
    });
    setSavedAddresses(updated);
    setShowSaveBtn(false);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      border: '1px solid var(--primary-200)',
      borderRadius: 'var(--radius-xl)',
      padding: '18px 22px',
      marginBottom: '24px',
      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--primary-600)',
            color: '#fff',
            borderRadius: 'var(--radius-full)',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
              Find Nearby Service Providers
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--primary-800)', margin: 0 }}>
              Enter your home address or use GPS to calculate exact distance to certified workshops.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Saved Addresses Picker */}
          {savedAddresses.length > 0 && (
            <select
              onChange={handleSelectSaved}
              defaultValue=""
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary-300)',
                background: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--primary-900)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>📌 Select Saved Address...</option>
              {savedAddresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.name}: {addr.label.length > 30 ? addr.label.slice(0, 30) + '...' : addr.label}
                </option>
              ))}
            </select>
          )}

          {/* GPS Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUseGPS}
            disabled={loading}
            style={{ background: 'var(--primary-600)', color: '#ffffff', border: 'none' }}
          >
            {loading ? <Loader2 size={15} className="spin" /> : <Navigation size={15} />}
            Use My Current Location
          </Button>
        </div>
      </div>

      {/* Manual Address Input Form */}
      <form onSubmit={handleGeocodeSearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Type your home address, street name, area (e.g. Vannarpettai, High Ground, 627002)..."
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-300)',
              fontSize: '0.92rem',
              outline: 'none',
              background: '#ffffff',
              color: 'var(--text-primary)'
            }}
          />
          <MapPin size={17} color="var(--primary-600)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <Button type="submit" variant="primary" size="sm" disabled={loading || !addressInput.trim()} icon={Search}>
          Locate Home Address
        </Button>
      </form>

      {/* Active Location Chip & Warnings */}
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            border: '1px solid var(--primary-200)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--primary-900)'
          }}>
            <CheckCircle2 size={14} color="var(--primary-600)" />
            <span>Active Location Anchor: <strong>{activeLocation}</strong></span>
          </div>

          {showSaveBtn && (
            <button
              onClick={handleSaveCurrentAddress}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary-700)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Bookmark size={14} /> Save Address
            </button>
          )}
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* City Mismatch Validation Notice */}
      {cityWarning && (
        <div style={{
          marginTop: '10px',
          background: '#fffbe8',
          border: '1px solid #fde047',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: '#854d0e',
          fontWeight: 600
        }}>
          <Info size={15} color="#ca8a04" style={{ flexShrink: 0 }} />
          <span>{cityWarning}</span>
        </div>
      )}
    </div>
  );
};

export default LocationBar;

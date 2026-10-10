/**
 * Location & Geocoding Service
 * 
 * Provides:
 * - Browser Geolocation API integration (GPS coords)
 * - OpenStreetMap Nominatim Geocoding (Address to Lat/Lng)
 * - Reverse Geocoding (Lat/Lng to Address Label)
 * - Customer Saved Addresses management (localStorage backed)
 * - Dynamic City Validation & Mismatch Detection
 * - Haversine Distance Formula calculation
 * - Pre-configured Tamil Nadu & Tirunelveli benchmark coordinates
 */

const SAVED_ADDRESSES_KEY = 'localserve_customer_saved_addresses';

// Benchmark Tamil Nadu Area Coordinates for instant, zero-latency local geocoding
const KNOWN_AREA_COORDINATES = {
  'vannarpettai': { lat: 8.7215, lng: 77.7420, label: 'Vannarpettai, Tirunelveli', city: 'Tirunelveli' },
  'palayamkottai': { lat: 8.7180, lng: 77.7490, label: 'Palayamkottai, Tirunelveli', city: 'Tirunelveli' },
  'murugankurichi': { lat: 8.7150, lng: 77.7380, label: 'Murugankurichi, Tirunelveli', city: 'Tirunelveli' },
  'junction': { lat: 8.7280, lng: 77.7290, label: 'Tirunelveli Junction', city: 'Tirunelveli' },
  'high ground': { lat: 8.7120, lng: 77.7550, label: 'High Ground, Palayamkottai', city: 'Tirunelveli' },
  'tirunelveli town': { lat: 8.7310, lng: 77.7120, label: 'Tirunelveli Town', city: 'Tirunelveli' },
  'perumalpuram': { lat: 8.7090, lng: 77.7410, label: 'Perumalpuram, Tirunelveli', city: 'Tirunelveli' },
  'tirunelveli': { lat: 8.7139, lng: 77.7567, label: 'Central Tirunelveli', city: 'Tirunelveli' },
  'madurai': { lat: 9.9252, lng: 78.1198, label: 'Madurai Central', city: 'Madurai' },
  'chennai': { lat: 13.0827, lng: 80.2707, label: 'Chennai Central', city: 'Chennai' },
  'coimbatore': { lat: 11.0168, lng: 76.9558, label: 'Coimbatore Junction', city: 'Coimbatore' },
};

/**
 * Calculate Haversine distance in kilometers between two geo-coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

export const locationService = {
  /**
   * Request customer's current GPS location via browser Geolocation API
   */
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation API is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let label = `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          
          try {
            const rev = await locationService.reverseGeocode(lat, lng);
            if (rev && rev.label) label = rev.label;
          } catch {
            // Keep default GPS label
          }

          resolve({
            lat,
            lng,
            accuracy: position.coords.accuracy,
            label
          });
        },
        (error) => {
          let message = 'Unable to retrieve location.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'GPS permission was denied. You can manually enter your address below.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            message = 'Location request timed out.';
          }
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  },

  /**
   * Geocode typed address / area / street / pincode into Lat/Lng coordinates
   */
  async geocodeAddress(queryAddress) {
    if (!queryAddress || !queryAddress.trim()) {
      return KNOWN_AREA_COORDINATES['tirunelveli'];
    }

    const clean = queryAddress.toLowerCase().trim();

    // Check local dictionary for instant benchmark lookup
    for (const [key, coords] of Object.entries(KNOWN_AREA_COORDINATES)) {
      if (clean.includes(key)) {
        return coords;
      }
    }

    // Call OpenStreetMap Nominatim API for full address geocoding
    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        queryAddress + ', Tamil Nadu, India'
      )}&limit=1`;
      const response = await fetch(searchUrl, {
        headers: { 'Accept-Language': 'en' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            label: data[0].display_name
          };
        }
      }
    } catch {
      // Network error or API failure fallback
    }

    // Default fallback to central Tirunelveli
    return KNOWN_AREA_COORDINATES['tirunelveli'];
  },

  /**
   * Reverse Geocode Lat/Lng back to human-readable address label
   */
  async reverseGeocode(lat, lng) {
    if (lat == null || lng == null) return null;

    // Check benchmark dictionary
    for (const coords of Object.values(KNOWN_AREA_COORDINATES)) {
      const dist = calculateHaversineDistance(lat, lng, coords.lat, coords.lng);
      if (dist !== null && dist < 1.0) {
        return coords;
      }
    }

    try {
      const searchUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const response = await fetch(searchUrl, {
        headers: { 'Accept-Language': 'en' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          return {
            lat,
            lng,
            label: data.display_name
          };
        }
      }
    } catch {
      // Fallback
    }

    return { lat, lng, label: `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})` };
  },

  /**
   * Get Customer's Saved Addresses from localStorage
   */
  getSavedAddresses() {
    try {
      const saved = localStorage.getItem(SAVED_ADDRESSES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      { id: 'addr-1', name: 'Home Address', label: 'Vannarpettai, Tirunelveli', lat: 8.7215, lng: 77.7420 },
      { id: 'addr-2', name: 'Office / Shop', label: 'High Ground, Palayamkottai', lat: 8.7120, lng: 77.7550 }
    ];
  },

  /**
   * Save new address to Customer's saved address book
   */
  saveAddress(newAddr) {
    try {
      const existing = this.getSavedAddresses();
      const item = {
        id: `addr-${Date.now()}`,
        name: newAddr.name || 'Saved Address',
        label: newAddr.label,
        lat: newAddr.lat,
        lng: newAddr.lng
      };
      const updated = [item, ...existing.filter(a => a.label !== newAddr.label)];
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  /**
   * Validate if customer address matches target selected city filter
   */
  validateCityMatch(addressLabel, selectedCity) {
    if (!addressLabel || !selectedCity || selectedCity === 'all') {
      return { match: true, warning: null };
    }

    const addrClean = addressLabel.toLowerCase();
    const cityClean = selectedCity.toLowerCase();

    if (!addrClean.includes(cityClean)) {
      return {
        match: false,
        warning: `Notice: Your active address (${addressLabel}) appears to be outside of ${selectedCity}. Showing available nearby providers serving ${selectedCity}.`
      };
    }

    return { match: true, warning: null };
  },

  calculateDistance: calculateHaversineDistance
};

export default locationService;

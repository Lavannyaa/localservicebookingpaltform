import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Layers, Globe2, ShieldCheck, Check } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

/**
 * OpenStreetMap Location Viewer Component
 * Standardized on official OpenStreetMap centroid: https://www.openstreetmap.org/#map=4/21.84/82.79
 */
export const OpenStreetMapViewer = ({
  centerLocation = 'Tirunelveli, Tamil Nadu',
  nearbyCount = 4,
  initialView = 'local', // 'local' or 'national'
  height = '360px',
  showControls = true,
  showShopList = true
}) => {
  const [activeView, setActiveView] = useState(initialView);
  const [selectedPin, setSelectedPin] = useState(null);

  // Workshop GPS locations
  const workshops = [
    {
      id: 'PRV-TNV-001',
      name: 'FrostTech AC & Electrical Solutions',
      address: '45 North Car St, Vannarpettai',
      lat: 8.7215,
      lng: 77.7423,
      distance: '2.1 km',
      specialty: 'AC & Refrigeration',
      color: '#7c3aed'
    },
    {
      id: 'PRV-TNV-002',
      name: 'Kumar Electricals & Rewinding Works',
      address: '124 South Bypass Rd, Palayamkottai',
      lat: 8.7180,
      lng: 77.7490,
      distance: '2.8 km',
      specialty: 'Motors & Wiring',
      color: '#2563eb'
    },
    {
      id: 'PRV-TNV-003',
      name: 'SpeedFix Automobile & Bike Works',
      address: '88 Trivandrum Rd, Murugankurichi',
      lat: 8.7150,
      lng: 77.7380,
      distance: '1.9 km',
      specialty: 'Emergency Vehicle Repair',
      color: '#d97706'
    },
    {
      id: 'PRV-TNV-004',
      name: 'Apex Plumbing & Water Systems',
      address: '12 S.N. High Rd, Junction',
      lat: 8.7280,
      lng: 77.7290,
      distance: '3.4 km',
      specialty: 'Plumbing & Water Tanks',
      color: '#059669'
    }
  ];

  // Map URLs
  const nationalEmbedUrl =
    'https://www.openstreetmap.org/export/embed.html?bbox=68.17,6.75,97.40,35.50&layer=mapnik&marker=21.84,82.79';
  const localEmbedUrl =
    'https://www.openstreetmap.org/export/embed.html?bbox=77.69,8.69,77.78,8.75&layer=mapnik&marker=8.7215,77.7423';

  const nationalOsmUrl = 'https://www.openstreetmap.org/#map=4/21.84/82.79';
  const localOsmUrl = 'https://www.openstreetmap.org/#map=14/8.7215/77.7423';

  return (
    <Card
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid #e9d5ff',
        background: '#ffffff',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#f3e8ff',
                color: 'var(--primary-700)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontWeight: 700
              }}
            >
              <Compass size={13} color="var(--primary-600)" />
              OPENSTREETMAP LOCATION RADAR
            </span>
            <span
              style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              LIVE GPS
            </span>
          </div>

          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#1e1b4b',
              marginTop: '6px',
              marginBottom: '2px'
            }}
          >
            {activeView === 'local'
              ? `Verified Workshops in ${centerLocation}`
              : 'Pan-India Commercial Workshop Coverage'}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            {activeView === 'local'
              ? `${nearbyCount} certified repair workshops mapped with active dispatch perimeters.`
              : 'Interactive map powered by OpenStreetMap (#map=4/21.84/82.79).'}
          </p>
        </div>

        {/* View Switchers & OpenStreetMap External Link */}
        {showControls && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                background: '#f5f3ff',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #ddd6fe'
              }}
            >
              <button
                onClick={() => setActiveView('local')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeView === 'local' ? 'var(--primary-600)' : 'transparent',
                  color: activeView === 'local' ? '#ffffff' : 'var(--primary-700)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapPin size={13} />
                <span>Local Hub (Tirunelveli)</span>
              </button>

              <button
                onClick={() => setActiveView('national')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeView === 'national' ? 'var(--primary-600)' : 'transparent',
                  color: activeView === 'national' ? '#ffffff' : 'var(--primary-700)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Globe2 size={13} />
                <span>India Overview (#map=4/21.84/82.79)</span>
              </button>
            </div>

            <a
              href={activeView === 'national' ? nationalOsmUrl : localOsmUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: '1.5px solid var(--primary-300)',
                color: 'var(--primary-700)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <span>Open in OpenStreetMap</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>

      {/* Embedded OpenStreetMap Iframe Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: height,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1.5px solid #e9d5ff',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <iframe
          title="OpenStreetMap Location"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={activeView === 'local' ? localEmbedUrl : nationalEmbedUrl}
          style={{ border: 0, display: 'block' }}
        />

        {/* Floating Coordinates Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #ddd6fe',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <Navigation size={12} color="var(--primary-600)" />
          <span>
            {activeView === 'local'
              ? 'Tirunelveli Hub: 8.7215° N, 77.7423° E'
              : 'Centroid India: 21.84° N, 82.79° E (Zoom 4)'}
          </span>
        </div>
      </div>

      {/* Workshop Location Quick Cards */}
      {showShopList && (
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#4b5563',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Mapped Workshop Locations in Perimeter:
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '10px'
            }}
          >
            {workshops.map((w) => {
              const isSelected = selectedPin === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedPin(w.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? '#f5f3ff' : '#fafafa',
                    border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: w.color,
                          display: 'inline-block'
                        }}
                      />
                      <span>{w.name.split(' ')[0]}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: 'var(--primary-600)',
                        background: '#ede9fe',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {w.distance}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '4px' }}>
                    {w.address}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#059669',
                      marginTop: '3px'
                    }}
                  >
                    📍 {w.lat}° N, {w.lng}° E · {w.specialty}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default OpenStreetMapViewer;

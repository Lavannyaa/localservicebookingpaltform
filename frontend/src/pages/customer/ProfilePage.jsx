import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks';
import { User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(user?.email || 'customer@localserve.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address || 'Flat 402, Green Valley Apartments, Vannarpettai');
  const [city, setCity] = useState(user?.city || 'Tirunelveli');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <Breadcrumb items={[{ label: 'Profile' }]} />

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Customer Profile & Address Book
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
              Manage your default service delivery locations and direct technician contact numbers.
            </p>
          </div>

          <Card style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>
                {name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{name}</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  Service Passport: {user?.passportNumber || 'PASSPORT-TNV-2026-081'}
                </span>
              </div>
            </div>

            {saved && (
              <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
                <CheckCircle size={18} /> Profile details saved successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Full Name" icon={User} required value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email Address" icon={Mail} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Mobile Phone Number" icon={Phone} required value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Default Delivery Address" icon={MapPin} required value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input label="Operational City" required value={city} onChange={(e) => setCity(e.target.value)} />

              <Button type="submit" size="md" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>
      </div>
  );
};

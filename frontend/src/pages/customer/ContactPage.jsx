import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  CheckCircle2, Send
} from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container" style={{ maxWidth: '740px' }}>
          <Breadcrumb items={[{ label: 'Contact Us' }]} />

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Contact LocalServe
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Have questions or want to register your commercial workshop? We'd love to hear from you.
            </p>
          </div>

          <Card style={{ padding: '28px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="var(--success-text)" style={{ margin: '0 auto 14px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Inquiry Submitted!</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Our operations officer will contact you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input label="Your Name" required placeholder="Full name" />
                <Input label="Email Address" type="email" required placeholder="email@example.com" />
                <Input label="Subject / Topic" required placeholder="Workshop onboarding, corporate inquiry, etc." />
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Message</label>
                  <textarea rows={4} required placeholder="How can we assist you?" style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <Button type="submit" size="md" style={{ alignSelf: 'flex-start' }}>Send Inquiry</Button>
              </form>
            )}
          </Card>
        </div>
      </div>
  );
};

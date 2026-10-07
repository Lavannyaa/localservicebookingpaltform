import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Phone, Mail, ChevronDown, CheckCircle2 } from 'lucide-react';

export const HelpSupportPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "How are LocalServe service providers vetted?", a: "Every provider is a registered business/commercial workshop with verifiable trade licenses and a physical store. We strictly exclude unvetted freelancers." },
    { q: "What is the Service Passport?", a: "The Service Passport is your appliance's digital maintenance logbook that records all repairs, technician readings, parts replaced, and warranty dates for transparent resale value." },
    { q: "Can I reschedule or cancel a booking?", a: "Yes, you can cancel or reschedule bookings in My Bookings anytime prior to technician dispatch with zero penalty." },
    { q: "How are prices calculated?", a: "Prices are fixed upfront rates based on realistic Indian commercial standards. You only pay the standardized base rate plus standard insurance fee." }
  ];

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <Breadcrumb items={[{ label: 'Help & Support' }]} />

          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              How Can We Help You Today?
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
              24/7 dedicated helpline and customer support desk for all commercial service bookings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' }}>
            <Card style={{ textAlign: 'center', padding: '26px' }}>
              <Phone size={32} color="var(--primary-600)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>Toll Free Helpline</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '12px' }}>Available 24x7 for urgent repair dispatches</p>
              <a href="tel:18004259988" style={{ color: 'var(--primary-700)', fontWeight: 800, fontSize: '1.15rem' }}>1800-425-9988</a>
            </Card>

            <Card style={{ textAlign: 'center', padding: '26px' }}>
              <Mail size={32} color="var(--primary-600)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>Email Support</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '12px' }}>Response within 2 hours guaranteed</p>
              <a href="mailto:support@localserve.com" style={{ color: 'var(--primary-700)', fontWeight: 800, fontSize: '1.05rem' }}>support@localserve.com</a>
            </Card>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '18px' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((f, idx) => (
              <Card key={idx} style={{ cursor: 'pointer', padding: '16px 20px' }} onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h5 style={{ fontSize: '0.96rem', fontWeight: 700 }}>{f.q}</h5>
                  <ChevronDown size={18} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>
                {openFaq === idx && (
                  <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                    {f.a}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
  );
};

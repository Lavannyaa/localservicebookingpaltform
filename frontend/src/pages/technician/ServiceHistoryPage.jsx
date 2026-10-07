import React, { useState } from 'react';
import { RatingStars } from '../../components/common/RatingStars';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  History, Calendar, CheckCircle2, ShieldCheck, Wrench, FileText,
  Printer, User, Building2, MapPin, Award
} from 'lucide-react';

export const ServiceHistoryPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const completedJobs = [
    {
      id: 'BK-998',
      bookingNumber: 'LS-2026-0998',
      service: 'AC Comprehensive Gas Charging (R32)',
      category: 'AC & Appliances',
      workshop: 'FrostTech AC Solutions',
      customer: 'K. Balaji',
      phone: '+91 98421 77112',
      address: '24 South Bazaar, Palayamkottai, Tirunelveli',
      date: '2026-09-20',
      rating: 5,
      review: 'Murugan did a very thorough suction check and cooling was restored within an hour. Excellent technician.',
      fee: '₹1,499',
      workPerformed: 'Leak detection performed on copper flare nut joints. Replaced flare nut and vacuumed line to 500 microns. Recharged 650g R32 refrigerant.',
      beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      afterPhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
      warranty: '30-Day Work Warranty Active'
    },
    {
      id: 'BK-980',
      bookingNumber: 'LS-2026-0980',
      service: 'Inverter Circuit Board Relay Replacement',
      category: 'Electrical',
      workshop: 'Kumar Electricals',
      customer: 'S. Meenakshi',
      phone: '+91 94431 33201',
      address: '48 West Car Street, Tirunelveli Town',
      date: '2026-09-15',
      rating: 5,
      review: 'Quick diagnostic, genuine OEM relay installed with 30-day warranty stamped on my passport.',
      fee: '₹899',
      workPerformed: 'Desoldered burnt relay on inverter logic board. Installed Panasonic 12V 30A DC relay. Full load battery test verified.',
      beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      afterPhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
      warranty: '30-Day Work Warranty Active'
    },
    {
      id: 'BK-965',
      bookingNumber: 'LS-2026-0965',
      service: 'Split AC Deep Foam Cleaning & Descaling',
      category: 'AC & Appliances',
      workshop: 'FrostTech AC Solutions',
      customer: 'V. Sundaram',
      phone: '+91 98401 55219',
      address: '15 North High Ground, Tirunelveli Junction',
      date: '2026-09-10',
      rating: 4.8,
      review: 'Courteous technician. Left the living room clean with zero water spills. Very professional.',
      fee: '₹799',
      workPerformed: 'Complete chemical jet wash on indoor cross-flow fan and cooling coil. Drain tray descaled.',
      beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      afterPhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
      warranty: '30-Day Work Warranty Active'
    }
  ];

  const handleOpenCertificate = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Technician Completed Service History
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Historical record of successfully executed work orders by S. Murugan with customer testimonials and digital completion passports.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {completedJobs.map(job => (
          <div
            key={job.id}
            style={{
              background: 'var(--bg-surface)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{job.service}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {job.bookingNumber}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Workshop: <strong>{job.workshop}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Client: <strong>{job.customer}</strong> · {job.address} · Serviced on {job.date}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <RatingStars rating={job.rating} size={15} />
                <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary-700)', marginTop: '2px' }}>
                  {job.fee}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '8px 0 16px 0', fontStyle: 'italic', background: 'var(--bg-muted)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              "{job.review}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '14px', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem' }}>
              <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={16} /> Certified Quality Sign-off (OTP Verified)
              </span>

              <Button variant="outline" size="sm" onClick={() => handleOpenCertificate(job)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> View Service Completion Passport
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* DIGITAL COMPLETION REPORT MODAL */}
      {showModal && selectedJob && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Service Completion Report: ${selectedJob.bookingNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%)',
              color: '#fff',
              padding: '20px 24px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#e9d5ff', fontWeight: 700 }}>LOCALSERVE DIGITAL SERVICE PASSPORT</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', color: '#fff' }}>{selectedJob.service}</h3>
                <span style={{ fontSize: '0.82rem', color: '#f3e8ff' }}>Client: {selectedJob.customer} · Date: {selectedJob.date}</span>
              </div>
              <span className="badge badge-success">{selectedJob.warranty}</span>
            </div>

            {/* Before & After Proof Photos */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 800 }}>Before & After Photographic Proof</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-muted)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--danger)', display: 'block', marginBottom: '4px' }}>BEFORE SERVICE</span>
                  <img src={selectedJob.beforePhoto} alt="Before" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px' }} />
                </div>
                <div style={{ background: 'var(--bg-muted)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', display: 'block', marginBottom: '4px' }}>AFTER SERVICE (RESTORED)</span>
                  <img src={selectedJob.afterPhoto} alt="After" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px' }} />
                </div>
              </div>
            </div>

            {/* Technical Diagnostics */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <strong>Work Performed Summary:</strong>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>{selectedJob.workPerformed}</p>
            </div>

            {/* Signatures & Certification */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>TECHNICIAN CERTIFICATION</span>
                <strong>S. Murugan (Lic: TN-HVAC-4410)</strong>
                <div style={{ fontSize: '0.74rem', color: '#10b981' }}>✓ Digitally Verified & Stamped</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>ATTACHED WORKSHOP</span>
                <strong>{selectedJob.workshop}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Commercial Service Depot</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={15} /> Print / Export PDF
              </Button>
              <Button variant="primary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ServiceHistoryPage;

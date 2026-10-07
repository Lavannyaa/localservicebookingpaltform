import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { RatingStars } from '../../components/common/RatingStars';
import { Button } from '../../components/common/Button';
import { Star, ShieldCheck, Trash2 } from 'lucide-react';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    reviewService.getReviews().then(setReviews);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Moderate and remove this review from public display?")) {
      setReviews(prev => prev.filter(r => r.reviewId !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Review Moderation & Trust Desk
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Moderate customer reviews and verified workshop replies to uphold platform integrity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map(r => (
          <div key={r.reviewId} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{r.customerName}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '10px' }}>reviewed {r.serviceName} ({r.date})</span>
              </div>
              <RatingStars rating={r.rating} size={16} />
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '8px 0 14px 0' }}>
              "{r.comment}"
            </p>

            {r.providerReply && (
              <div style={{ background: 'var(--primary-50)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '12px' }}>
                <strong>Workshop Reply:</strong> {r.providerReply}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <Button variant="danger" size="sm" onClick={() => handleDelete(r.reviewId)}>
                <Trash2 size={14} /> Remove Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewsPage;

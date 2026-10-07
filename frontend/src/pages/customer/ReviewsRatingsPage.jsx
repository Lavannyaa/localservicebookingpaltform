import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { RatingStars } from '../../components/common/RatingStars';
import { reviewService } from '../../services/reviewService';
import { User, MessageSquare } from 'lucide-react';

export const ReviewsRatingsPage = () => {
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    reviewService.getReviews().then(setReviewsList);
  }, []);

  return (
    <div style={{ flex: 1, padding: '32px 0', background: 'var(--bg-app)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <Breadcrumb items={[{ label: 'Reviews & Ratings' }]} />

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Customer Reviews & Ratings ({reviewsList.length})
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
              Real customer feedback submitted by verified customers on completed home repairs.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {reviewsList.map((r) => (
              <Card key={r.reviewId} style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.08rem', fontWeight: 800 }}>{r.serviceName}</h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Workshop: <strong>{r.providerName}</strong> · Customer: {r.customerName} ({r.date})
                    </span>
                  </div>
                  <RatingStars rating={r.rating} size={16} />
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                  "{r.comment}"
                </p>

                {r.providerReply && (
                  <div style={{
                    background: 'var(--primary-50)',
                    borderLeft: '3px solid var(--primary-600)',
                    padding: '12px 14px',
                    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    fontSize: '0.86rem'
                  }}>
                    <strong style={{ color: 'var(--primary-800)', display: 'block', marginBottom: '2px' }}>
                      Provider Workshop Response:
                    </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.providerReply}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
  );
};

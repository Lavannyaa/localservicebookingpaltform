import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { RatingStars } from '../../components/common/RatingStars';
import { Button } from '../../components/common/Button';
import { Star, MessageSquare, Check, ShieldCheck } from 'lucide-react';

export const ProviderReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [openReplyBox, setOpenReplyBox] = useState({});

  useEffect(() => {
    reviewService.getReviews().then(setReviews);
  }, []);

  const handleSendReply = (reviewId) => {
    const text = replyText[reviewId];
    if (!text || !text.trim()) return;

    reviewService.replyToReview(reviewId, text).then(updated => {
      setReviews(prev => prev.map(r => r.reviewId === reviewId ? updated : r));
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      setOpenReplyBox(prev => ({ ...prev, [reviewId]: false }));
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Customer Reviews & Reputation
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real feedback from customers serviced by Kumar Electricals workshops and technicians.
        </p>
      </div>

      {/* Overall Score Banner */}
      <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', paddingRight: '28px', borderRight: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--primary-700)', lineHeight: 1 }}>4.88</div>
          <RatingStars rating={4.9} size={18} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Based on 128 Reviews</div>
        </div>

        <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
            <span style={{ width: '50px' }}>5 Star</span>
            <div style={{ flex: 1, height: '8px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', background: 'var(--primary-600)' }} />
            </div>
            <span>92%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
            <span style={{ width: '50px' }}>4 Star</span>
            <div style={{ flex: 1, height: '8px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '7%', height: '100%', background: 'var(--primary-600)' }} />
            </div>
            <span>7%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
            <span style={{ width: '50px' }}>3 Star</span>
            <div style={{ flex: 1, height: '8px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '1%', height: '100%', background: 'var(--primary-600)' }} />
            </div>
            <span>1%</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map(r => (
          <div key={r.reviewId} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{r.customerName}</span>
                  <span style={{ fontSize: '0.74rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                    <ShieldCheck size={14} /> Verified Booking
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.date}</div>
              </div>
              <RatingStars rating={r.rating} size={16} />
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              "{r.comment}"
            </p>

            {/* Provider Reply Display */}
            {r.providerReply && (
              <div style={{ background: 'var(--primary-50)', borderLeft: '3px solid var(--primary-600)', padding: '12px 16px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '4px' }}>
                  Workshop Response (Kumar Electricals):
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-800)' }}>{r.providerReply}</div>
              </div>
            )}

            {/* Reply Actions */}
            {!r.providerReply && (
              <div>
                {!openReplyBox[r.reviewId] ? (
                  <Button variant="secondary" size="sm" onClick={() => setOpenReplyBox(prev => ({ ...prev, [r.reviewId]: true }))}>
                    <MessageSquare size={14} /> Post Public Workshop Reply
                  </Button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea
                      rows={2}
                      placeholder="Write your professional thank you or clarification reply..."
                      value={replyText[r.reviewId] || ''}
                      onChange={e => setReplyText({ ...replyText, [r.reviewId]: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="secondary" size="sm" onClick={() => setOpenReplyBox(prev => ({ ...prev, [r.reviewId]: false }))}>Cancel</Button>
                      <Button variant="primary" size="sm" onClick={() => handleSendReply(r.reviewId)}>Publish Reply</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderReviewsPage;

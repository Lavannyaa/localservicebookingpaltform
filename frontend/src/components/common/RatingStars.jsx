import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 5,
  reviewCount = null,
  size = 15,
  interactive = false,
  onRatingChange
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          color="#f59e0b"
          fill={star <= Math.round(rating) ? '#f59e0b' : 'none'}
          style={{ cursor: interactive ? 'pointer' : 'inherit' }}
        />
      ))}
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: '4px' }}>
        {Number(rating).toFixed(1)}
      </span>
      {reviewCount !== null && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
